from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import concurrent.futures
import time
from itertools import cycle
from PIL import Image, ImageDraw, ImageFont, ImageColor
import io
import os
import json
import numpy as np
import tempfile
import uuid
from google import genai
from google.genai import types
import base64
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Your API keys
load_dotenv()
API_KEY = os.getenv("API_KEY")

# Define the model
MODEL_ID = "gemini-2.0-flash"

# Configure safety settings
safety_settings = [
    types.SafetySetting(
        category="HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold="BLOCK_ONLY_HIGH",
    ),
]

# System instructions for bounding box detection
bounding_box_system_instructions = """
    Return bounding boxes as a JSON array with labels. Never return masks or code fencing. Limit to 25 objects.
    If an object is present multiple times, name them according to their unique characteristic (colors, size, position, unique characteristics, etc..).
"""

# System instructions for crime classification
crime_classification_system_instructions = """
    Analyze the image and classify it into one of the following categories:
    - abuse: Physical or emotional mistreatment of people or animals
    - arrest: Police officers detaining or apprehending individuals
    - arson: Deliberately setting fire to property
    - assault: Violent physical attack on a person
    - burglary: Breaking into a building to steal
    - explosion: Sudden violent release of energy
    - fighting: Physical altercation between two or more people
    - normal: No suspicious or criminal activity present
    - road accident: Collisions or incidents involving vehicles on roads
    - shooting: Discharge of firearms
    - shoplifting: Stealing merchandise from retail stores
    - stealing: Taking someone else's property without permission
    - vandalism: Deliberate destruction of property
    
    Return a JSON object with:
    1. "category": most likely crime category from the list above
    2. "confidence": confidence score (0-1)
    3. "description": brief explanation of what's visible in the image (2-3 sentences)
    
    Format example:
    {"category": "normal", "confidence": 0.95, "description": "People walking peacefully in a park. No suspicious activity."}
"""

# Create a temporary directory to store uploaded videos and processed images
UPLOAD_FOLDER = tempfile.mkdtemp()
PROCESSED_FOLDER = os.path.join(UPLOAD_FOLDER, "processed")
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

def parse_json(json_output):
    """Parse JSON output from the model response."""
    # Parsing out the markdown fencing
    lines = json_output.splitlines()
    for i, line in enumerate(lines):
        if line == "```json":
            json_output = "\n".join(lines[i+1:])  # Remove everything before "```json"
            json_output = json_output.split("```")[0]  # Remove everything after the closing "```"
            break  # Exit the loop once "```json" is found
    
    # Handle case where there's no markdown code block
    if "```" not in json_output and "{" in json_output:
        # Try to extract just the JSON object
        start_idx = json_output.find("{")
        end_idx = json_output.rfind("}") + 1
        if start_idx >= 0 and end_idx > start_idx:
            json_output = json_output[start_idx:end_idx]
    
    return json_output

def plot_bounding_boxes(im, bounding_boxes):
    """Plot bounding boxes on an image with labels."""
    img = im.copy()
    width, height = img.size
    
    # Create a drawing object
    draw = ImageDraw.Draw(img)

    # Define colors
    colors = [
        'red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 
        'brown', 'gray', 'beige', 'turquoise', 'cyan', 'magenta', 
        'lime', 'navy', 'maroon', 'teal', 'olive', 'coral', 'lavender', 
        'violet', 'gold', 'silver'
    ] + [colorname for (colorname, colorcode) in ImageColor.colormap.items()]

    # Parse the bounding boxes
    bounding_boxes = parse_json(bounding_boxes)
    
    # Try to load a font
    try:
        font = ImageFont.truetype("NotoSansCJK-Regular.ttc", size=20)  # Increased font size for clarity
    except IOError:
        try:
            font = ImageFont.truetype("Arial.ttf", size=20)  # Increased font size for clarity
        except IOError:
            font = ImageFont.load_default()

    # Iterate over the bounding boxes
    try:
        for i, bounding_box in enumerate(json.loads(bounding_boxes)):
            # Select a color from the list
            color = colors[i % len(colors)]

            # Convert normalized coordinates to absolute coordinates
            abs_y1 = int(bounding_box["box_2d"][0]/1000 * height)
            abs_x1 = int(bounding_box["box_2d"][1]/1000 * width)
            abs_y2 = int(bounding_box["box_2d"][2]/1000 * height)
            abs_x2 = int(bounding_box["box_2d"][3]/1000 * width)

            if abs_x1 > abs_x2:
                abs_x1, abs_x2 = abs_x2, abs_x1

            if abs_y1 > abs_y2:
                abs_y1, abs_y2 = abs_y2, abs_y1

            # Draw the bounding box
            draw.rectangle(
                ((abs_x1, abs_y1), (abs_x2, abs_y2)), outline=color, width=4
            )

            # Draw the text
            if "label" in bounding_box:
                draw.text((abs_x1 + 8, abs_y1 + 6), bounding_box["label"], fill=color, font=font)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        # Return the original image if there's an error
        return im
    except Exception as e:
        print(f"Error drawing bounding boxes: {e}")
        # Return the original image if there's an error
        return im

    return img

def classify_crime(image, session_id, frame_num):
    """Classify the image for crime detection using Gemini."""
    api_key = API_KEY
    try:
        client = genai.Client(api_key=api_key)
        prompt = "Analyze this image and classify it according to the crime categories."

        # Resize image if needed
        image_copy = image.copy()
        image_copy.thumbnail([640, 640], Image.Resampling.LANCZOS)

        # Generate content with Gemini
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=[prompt, image_copy],
            config=types.GenerateContentConfig(
                system_instruction=crime_classification_system_instructions,
                temperature=0.2,
                safety_settings=safety_settings,
            )
        )

        # Parse the JSON response
        classification_result = parse_json(response.text)
        
        try:
            classification_data = json.loads(classification_result)
            
            # Draw classification result on the image
            draw = ImageDraw.Draw(image_copy)
            
            # Try to load a font
            try:
                font = ImageFont.truetype("NotoSansCJK-Regular.ttc", size=24)
            except IOError:
                try:
                    font = ImageFont.truetype("Arial.ttf", size=24)
                except IOError:
                    font = ImageFont.load_default()
            
            # Get category and confidence
            category = classification_data.get("category", "unknown")
            confidence = classification_data.get("confidence", 0)
            
            # Determine color based on category (red for crimes, green for normal)
            text_color = "red" if category != "normal" else "green"
            
            # Draw classification text
            draw.rectangle(((0, 0), (image_copy.width, 60)), fill="black")
            draw.text((10, 10), f"Category: {category.upper()}", fill=text_color, font=font)
            draw.text((10, 35), f"Confidence: {confidence:.2f}", fill="white", font=font)
            
            # Save the classified image
            output_path = os.path.join(PROCESSED_FOLDER, f"{session_id}_classified_{frame_num}.jpg")
            image_copy.save(output_path)
            
            # Convert the image to base64 for sending to frontend
            buffered = io.BytesIO()
            image_copy.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            return {
                "frame_num": frame_num,
                "classification": classification_data,
                "image_path": output_path,
                "image_data": img_str
            }
        except json.JSONDecodeError as e:
            print(f"Error decoding classification JSON: {e}")
            return {
                "frame_num": frame_num,
                "classification": {"category": "error", "confidence": 0, "description": f"Error parsing result: {str(e)}"},
                "error": f"JSON parse error: {str(e)}"
            }
            
    except Exception as e:
        print(f"Error classifying frame {frame_num}: {str(e)}")
        return {
            "frame_num": frame_num,
            "classification": {"category": "error", "confidence": 0, "description": f"Error: {str(e)}"},
            "error": str(e)
        }

def extract_frames(video_path, interval_seconds=2):
    """Extract frames from a video at specified intervals."""
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    frame_interval = fps * interval_seconds  # Extract frames every X seconds
    frames = []

    for frame_num in range(0, total_frames, frame_interval):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()
        if not ret:
            break
        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        frames.append((frame_num, image))

    cap.release()
    return frames

def process_frame(frame_data, session_id, process_type="bounding_box"):
    """Process a single frame with the Gemini model."""
    frame_num, image = frame_data
    
    if process_type == "crime_classification":
        return classify_crime(image, session_id, frame_num)
    else:  # Default to bounding box detection
        api_key = API_KEY
        try:
            client = genai.Client(api_key=api_key)
            prompt = "Detect the 2D bounding boxes (with 'label' as description')"

            # Resize image if needed
            image_copy = image.copy()
            image_copy.thumbnail([640, 640], Image.Resampling.LANCZOS)

            # Generate content with Gemini
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=[prompt, image_copy],
                config=types.GenerateContentConfig(
                    system_instruction=bounding_box_system_instructions,
                    temperature=0.5,
                    safety_settings=safety_settings,
                )
            )

            # Process the image with bounding boxes
            processed_image = plot_bounding_boxes(image_copy, response.text)
            
            # Save the processed image
            output_path = os.path.join(PROCESSED_FOLDER, f"{session_id}_frame_{frame_num}.jpg")
            processed_image.save(output_path)
            
            # Convert the image to base64 for sending to frontend
            buffered = io.BytesIO()
            processed_image.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            return {
                "frame_num": frame_num,
                "image_path": output_path,
                "image_data": img_str
            }
        except Exception as e:
            print(f"Error processing frame {frame_num}: {str(e)}")
            return {
                "frame_num": frame_num,
                "error": str(e)
            }

def save_blob_to_video(blob_data):
    """Save blob data to a temporary video file."""
    # Create a unique filename
    video_filename = f"{uuid.uuid4()}.mp4"
    video_path = os.path.join(UPLOAD_FOLDER, video_filename)
    
    # Write the blob data to the file
    with open(video_path, 'wb') as f:
        f.write(blob_data)
    
    return video_path


@app.route('/classify-video', methods=['POST'])
def classify_video():
    """Endpoint to classify a video for crime detection."""
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400
        
        video_file = request.files['video']
        
        # Get processing parameters
        interval_seconds = int(request.form.get('interval', 2))
        max_workers = int(request.form.get('workers', 5))
        
        # Create a session ID for this processing job
        session_id = str(uuid.uuid4())
        
        # Save the video file
        video_path = os.path.join(UPLOAD_FOLDER, f"{session_id}.mp4")
        video_file.save(video_path)
        
        # Extract frames
        frames = extract_frames(video_path, interval_seconds)
        
        if not frames:
            return jsonify({"error": "Could not extract any frames from the video"}), 400
        
        # Process frames in parallel
        processed_frames = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_frame = {
                executor.submit(process_frame, frame_data, session_id, "crime_classification"): frame_data 
                for frame_data in frames
            }
            
            for future in concurrent.futures.as_completed(future_to_frame):
                frame_result = future.result()
                processed_frames.append(frame_result)
        
        # Sort frames by frame number
        processed_frames.sort(key=lambda x: x["frame_num"])
        
        # Determine overall classification
        category_counts = {}
        for frame in processed_frames:
            if "classification" in frame:
                category = frame["classification"].get("category", "unknown")
                category_counts[category] = category_counts.get(category, 0) + 1
        
        # Find the most common category
        most_common_category = max(category_counts.items(), key=lambda x: x[1]) if category_counts else ("unknown", 0)
        
        # Calculate average confidence for the most common category
        avg_confidence = 0
        count = 0
        descriptions = []
        for frame in processed_frames:
            if "classification" in frame and frame["classification"].get("category") == most_common_category[0]:
                avg_confidence += frame["classification"].get("confidence", 0)
                count += 1
                if "description" in frame["classification"] and frame["classification"]["description"] not in descriptions:
                    descriptions.append(frame["classification"]["description"])
        
        if count > 0:
            avg_confidence /= count
        
        # Create overall result
        overall_result = {
            "category": most_common_category[0],
            "confidence": avg_confidence,
            "frame_count": len(processed_frames),
            "category_distribution": category_counts,
            "descriptions": descriptions[:3]  # Include up to 3 unique descriptions
        }
        
        # Return the processed frames information
        return jsonify({
            "session_id": session_id,
            "num_frames": len(processed_frames),
            "frames": processed_frames,
            "overall_classification": overall_result
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Install Noto fonts for Japanese characters if needed
    try:
        import subprocess
        subprocess.run(["apt-get", "install", "-y", "fonts-noto-cjk"], check=True)
    except:
        print("Warning: Could not install Noto fonts. Text rendering might be affected.")
    
    port = int(os.environ.get('PORT', 6001))
    app.run(host='0.0.0.0', port=port, debug=False)