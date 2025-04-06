from flask import Flask, request, jsonify
import cv2
import concurrent.futures
import os
import json
import numpy as np
import tempfile
import uuid
from PIL import Image, ImageDraw, ImageFont, ImageColor
import base64
import io
from google import genai
from google.genai import types
from flask_cors import CORS
import whisper
import torch
from itertools import cycle
from googletrans import Translator

translator = Translator()

# Replace the single API key with a list of keys
API_KEYS = os.getenv("API_KEYS", "").split(",")
if not API_KEYS or API_KEYS[0] == "":
    raise ValueError("No API keys provided. Set the API_KEYS environment variable.")

# Set up cycling through the keys
api_cycle = cycle(API_KEYS)
app = Flask(__name__)
CORS(app)
# Configuration

MODEL_ID = "gemini-2.0-flash"  # Use appropriate Gemini model

# Create temporary directories for storage
TEMP_DIR = tempfile.mkdtemp()
FRAMES_DIR = os.path.join(TEMP_DIR, "frames")
AUDIO_DIR = os.path.join(TEMP_DIR, "audio")
os.makedirs(FRAMES_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

# Load Whisper model for audio transcription
WHISPER_MODEL = "base"  # Options: tiny, base, small, medium, large
whisper_model = whisper.load_model(WHISPER_MODEL)

# Configure safety settings for Gemini
safety_settings = [
    types.SafetySetting(
        category="HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold="BLOCK_ONLY_HIGH",
    ),
]

# System instruction for crime classification with Gemini
crime_classification_prompt = """
Analyze this image and classify it into one of the following crime categories:
- abuse: Physical or emotional mistreatment
- arson: Deliberately setting fire to property  
- assault: Violent physical attack
- burglary: Breaking into buildings to steal
- explosion: Sudden violent release of energy
- fighting: Physical altercation between people
- normal: No suspicious activity present
- road_accident: Vehicle collisions
- shooting: Discharge of firearms
- shoplifting: Stealing from stores
- stealing: Taking property without permission
- vandalism: Deliberate property destruction

Return a JSON with exactly these fields:
{
  "category": "crime_category_from_list",
  "confidence": 0.85,
  "description": "One concise description of what's happening in the image."
}
"""

def extract_frames(video_path, interval_seconds=2):
    """Extract frames from video at the specified interval."""
    frames = []
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Calculate frame interval
    frame_interval = int(fps * interval_seconds)
    if frame_interval <= 0:
        frame_interval = 1
    
    for frame_idx in range(0, total_frames, frame_interval):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            break
            
        # Convert to PIL Image
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb_frame)
        frames.append((frame_idx, pil_img))
    
    cap.release()
    return frames



def extract_audio(video_path, session_id):
    """Extract audio from video file using ffmpeg."""
    audio_path = os.path.join(AUDIO_DIR, f"{session_id}_audio.wav")
    
    try:
        import subprocess
        # Extract audio at 16kHz mono for optimal whisper performance
        subprocess.run([
            'ffmpeg', '-i', video_path, '-vn', '-acodec', 'pcm_s16le',
            '-ar', '16000', '-ac', '1', audio_path
        ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        return audio_path
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return None

def clean_json_response(text):
    """Extract JSON from text response."""
    try:
        # First check if response is None
        if text is None:
            print("Received None response from API")
            return {"category": "unknown", "confidence": 0, "description": "Empty API response"}
            
        # Try to find JSON content
        if "json" in text:
            json_text = text.split("json")[1].split("```")[0].strip()
        elif "{" in text and "}" in text:
            start_idx = text.find("{")
            end_idx = text.rfind("}") + 1
            json_text = text[start_idx:end_idx]
        else:
            json_text = text
            
        # Parse and validate JSON
        return json.loads(json_text)
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        print(f"Original text: {text}")
        return {"category": "unknown", "confidence": 0, "description": f"Failed to parse response: {str(e)}"}

def analyze_frame(frame_data, session_id):
    """Analyze a single frame for crime detection using Gemini."""
    frame_idx, image = frame_data
    api_key = next(api_cycle)
    client = genai.Client(api_key=api_key)
    
    try:
        # Resize image to reasonable size for the model
        img_copy = image.copy()
        img_copy.thumbnail((800, 800), Image.Resampling.LANCZOS)
        
        # Call Gemini API to analyze the image
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=[crime_classification_prompt, img_copy],
            config=types.GenerateContentConfig(
                temperature=0.2,
                safety_settings=safety_settings,
            )
        )
        
        # Check if response has text content
        if not hasattr(response, 'text') or not response.text:
            print(f"Warning: Empty response for frame {frame_idx}")
            result = {"category": "unknown", "confidence": 0, "description": "Empty API response"}
        else:
            # Parse JSON response
            result = clean_json_response(response.text)
        
        # Save processed frame
        frame_path = os.path.join(FRAMES_DIR, f"{session_id}_{frame_idx}.jpg")
        
        # Draw classification label on image
        draw = ImageDraw.Draw(img_copy)
        
        # Try to load a font
        try:
            font = ImageFont.truetype("Arial.ttf", 20)
        except:
            font = ImageFont.load_default()
            
        # Add classification text to image
        category = result.get("category", "unknown")
        confidence = result.get("confidence", 0)
        
        # Create a dark banner at the top
        draw.rectangle([(0, 0), (img_copy.width, 40)], fill="black")
        
        # Color based on severity (red for crimes, green for normal)
        text_color = "green" if category == "normal" else "red"
        draw.text((10, 10), f"{category.upper()} - {confidence:.2f}", fill=text_color, font=font)
        
        # Save image
        img_copy.save(frame_path)
        
        # Convert to base64 for API response
        buffered = io.BytesIO()
        img_copy.save(buffered, format="JPEG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Return analysis results
        return {
            "frame_idx": frame_idx,
            "image_data": img_base64,
            "classification": result
        }
        
    except Exception as e:
        print(f"Error analyzing frame {frame_idx}: {e}")
        return {
            "frame_idx": frame_idx,
            "error": str(e),
            "classification": {"category": "error", "confidence": 0, "description": str(e)}
        }

def transcribe_with_whisper(audio_path):
    """Transcribe audio using Whisper and translate if needed."""
    try:
        # Transcribe audio
        result = whisper_model.transcribe(audio_path)
        
        # Get detected language
        detected_language = result.get("language", "unknown")
        
        # Get transcription
        transcription = result.get("text", "")
        
        # Check if English translation is needed
        translated_text = transcription
        needs_translation = detected_language != "en" and detected_language != "unknown"
        
        if needs_translation:
            # Use Whisper's built-in translation capability
            translation_result = whisper_model.transcribe(audio_path, task="translate")
            translated_text = translation_result.get("text", transcription)
            
        return {
            "detected_language": detected_language,
            "transcription": transcription,
            "translated_text": translated_text if needs_translation else transcription,
            "needs_translation": needs_translation
        }
        
    except Exception as e:
        print(f"Error in transcription: {e}")
        return {
            "error": str(e),
            "transcription": "",
            "translated_text": "",
            "detected_language": "unknown"
        }

def analyze_content(text, crime_categories):
    """Use Gemini to analyze transcribed text."""
    if not text or len(text) < 10:
        return {
            "crime_indication": "unknown",
            "confidence": 0,
            "summary": "Insufficient audio content for analysis"
        }
        
    try:
        api_key = next(api_cycle)
        client = genai.Client(api_key=api_key)
        #client = genai.Client(api_key=API_KEY)
        
        prompt = f"""
        Based on this transcribed audio, analyze if there are indications of criminal activity.
        
        Transcript: "{text}"
        
        Consider these crime categories: {', '.join(crime_categories)}
        
        Return a JSON with these fields:
        {{
          "crime_indication": "most_likely_crime_category_or_normal",
          "confidence": 0.0-1.0,
          "summary": "Brief summary of what's happening in the audio"
        }}
        """
        
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                safety_settings=safety_settings,
            )
        )
        
        return clean_json_response(response.text)
        
    except Exception as e:
        print(f"Error analyzing audio content: {e}")
        return {
            "crime_indication": "unknown",
            "confidence": 0,
            "summary": f"Error in analysis: {str(e)}"
        }

def generate_event_summary(frame_classifications, audio_analysis=None):
    """Generate an overall summary of the event using Gemini."""
    try:
        API_KEY = next(api_cycle)
        client = genai.Client(api_key=API_KEY)
        
        # Collect frame descriptions
        descriptions = [fc.get("classification", {}).get("description", "") 
                      for fc in frame_classifications 
                      if "classification" in fc and "description" in fc.get("classification", {})]
        
        # Get unique descriptions (remove duplicates)
        unique_descriptions = list(set(descriptions))
        
        # Count categories
        categories = {}
        for fc in frame_classifications:
            if "classification" in fc:
                cat = fc["classification"].get("category", "unknown")
                categories[cat] = categories.get(cat, 0) + 1
        
        # Find dominant category
        dominant_category = max(categories.items(), key=lambda x: x[1])[0] if categories else "unknown"
        
        # Calculate overall confidence
        confidence_sum = 0
        confidence_count = 0
        for fc in frame_classifications:
            if "classification" in fc and fc["classification"].get("category") == dominant_category:
                confidence_sum += fc["classification"].get("confidence", 0)
                confidence_count += 1
        
        overall_confidence = confidence_sum / confidence_count if confidence_count > 0 else 0
        
        # Create prompt for summary generation
        prompt = f"""
        Based on these observations from video frames: {unique_descriptions[:5]}
        
        {'And this audio transcript: ' + audio_analysis.get('translated_text', '') if audio_analysis else ''}
        
        Generate a concise summary of the event. The dominant classification is: {dominant_category}
        
        Return a JSON with exactly these fields:
        {{
          "event_type": "{dominant_category}",
          "confidence": {overall_confidence:.2f},
          "summary": "Concise paragraph that summarizes what's happening"
        }}
        """
        
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                safety_settings=safety_settings,
            )
        )
        
        result = clean_json_response(response.text)
        
        # Make sure confidence value is numeric
        if isinstance(result.get("confidence"), str):
            try:
                result["confidence"] = float(result["confidence"])
            except:
                result["confidence"] = overall_confidence
                
        return result
        
    except Exception as e:
        print(f"Error generating summary: {e}")
        return {
            "event_type": dominant_category if 'dominant_category' in locals() else "unknown",
            "confidence": overall_confidence if 'overall_confidence' in locals() else 0,
            "summary": f"Error generating summary: {str(e)}"
        }

def analyze_text_input(text):
    """Analyze text-only input for crime indications."""
    try:
        API_KEY = next(api_cycle)
        client = genai.Client(api_key=API_KEY)
        
        crime_categories = [
            "abuse", "arson", "assault", "burglary", "explosion",
            "fighting", "normal", "road_accident", "shooting", 
            "shoplifting", "stealing", "vandalism"
        ]
        
        prompt = f"""
        Analyze this text to determine if it describes a crime scene or incident.
        
        Text: "{text}"
        
        Consider these categories: {', '.join(crime_categories)}
        
        Return a JSON with exactly these fields:
        {{
          "category": "most_appropriate_category",
          "confidence": 0.0-1.0,
          "description": "Concise explanation of what the text suggests is happening"
        }}
        """
        
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                safety_settings=safety_settings,
            )
        )
        
        return clean_json_response(response.text)
        
    except Exception as e:
        print(f"Error analyzing text: {e}")
        return {
            "category": "unknown",
            "confidence": 0,
            "description": f"Error in analysis: {str(e)}"
        }

@app.route('/analyze', methods=['POST'])
def analyze_content_endpoint():
    """Endpoint for analyzing video, audio, and text content with standardized output format."""
    try:
        session_id = str(uuid.uuid4())
        
        # Initialize standardized response structure
        results = {
            "session_id": session_id,
            "events": [],          # List of detected events
            "confidence": {},      # Confidence scores by input type
            "detailed_summary": {},# Detailed analysis by input type
            "framewise_images": [],# Will contain frame data if video present
            "eng_audio": "",       # Will contain English transcription if audio present
            "org_text": ""         # Will contain original text if text present
        }
        
        # VIDEO PROCESSING
        if 'video' in request.files:
            video_file = request.files['video']
            interval_seconds = int(request.form.get('interval', '2'))
            max_workers = min(int(request.form.get('workers', '2')), 4)
            
            video_path = os.path.join(TEMP_DIR, f"{session_id}_video.mp4")
            video_file.save(video_path)
            
            frames = extract_frames(video_path, interval_seconds)
            
            # Process frames (same logic as before)
            frame_results = []
            if len(frames) <= 5:
                for frame in frames:
                    frame_results.append(analyze_frame(frame, session_id))
            else:
                batch_size = 2
                frame_batches = [frames[i:i+batch_size] for i in range(0, len(frames), batch_size)]
                
                with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
                    futures = []
                    for batch in frame_batches:
                        future = executor.submit(lambda b: [analyze_frame(frame, session_id) for frame in b], batch)
                        futures.append(future)
                        import time
                        time.sleep(0.5)
                    
                    for future in concurrent.futures.as_completed(futures):
                        frame_results.extend(future.result())
            
            # Sort results by frame index
            frame_results.sort(key=lambda x: x.get("frame_idx", 0))
            
            # Filter out invalid frames
            valid_frames = [
                frame for frame in frame_results 
                if (frame.get("classification", {}).get("category") not in ["unknown", "error"] 
                    and frame.get("classification", {}).get("confidence", 0) > 0.3)
            ]
            
            if len(valid_frames) < 2 and len(frame_results) > 2:
                valid_frames = frame_results
                results["warning"] = f"Low confidence in analysis: only {len(valid_frames)} valid frames detected"
            
            # Store framewise images data in standardized output
            results["framewise_images"] = frame_results
            
            if not valid_frames:
                results["events"].append("unknown")
                results["confidence"]["video"] = 0
                results["detailed_summary"]["video"] = "Video analysis failed: no valid frames detected"
            else:
                # Classification logic (same as before)
                classifications = {}
                for frame in valid_frames:
                    category = frame.get("classification", {}).get("category", "unknown")
                    if category != "unknown" and category != "normal":
                        confidence = frame.get("classification", {}).get("confidence", 0)
                        if category in classifications:
                            classifications[category].append(confidence)
                        else:
                            classifications[category] = [confidence]
                
                consistent_detections = {
                    category: confidences 
                    for category, confidences in classifications.items() 
                    if len(confidences) >= max(2, len(valid_frames) // 4)
                }
                
                category_confidence = {}
                for category, confidences in consistent_detections.items():
                    category_confidence[category] = sum(confidences) / len(confidences)
                
                detected_crimes = list(category_confidence.keys())
                
                if detected_crimes:
                    confidence_score = round(sum(category_confidence.values()) / len(category_confidence), 2)
                else:
                    normal_count = sum(1 for frame in valid_frames 
                                    if frame.get("classification", {}).get("category") == "normal")
                    if normal_count > len(valid_frames) // 2:
                        detected_crimes = ["normal"]
                        normal_confidences = [
                            frame.get("classification", {}).get("confidence", 0) 
                            for frame in valid_frames 
                            if frame.get("classification", {}).get("category") == "normal"
                        ]
                        confidence_score = round(sum(normal_confidences) / len(normal_confidences), 2)
                    else:
                        detected_crimes = ["unknown"]
                        confidence_score = 0
                
                # Create summary
                if detected_crimes and detected_crimes[0] != "unknown":
                    crimes_with_confidence = [
                        f"{crime} ({category_confidence.get(crime, 0):.2f})" 
                        for crime in detected_crimes if crime != "normal"
                    ]
                    
                    if crimes_with_confidence:
                        video_summary = f"Detected potential crimes: {', '.join(crimes_with_confidence)} with overall confidence {confidence_score:.2f}."
                    else:
                        video_summary = f"No significant crimes detected. Overall confidence: {confidence_score:.2f}."
                else:
                    video_summary = "Analysis inconclusive. Consider adjusting frame interval or video quality."
                
                # Update results in standardized format
                results["events"].extend(detected_crimes)
                results["confidence"]["video"] = confidence_score
                results["detailed_summary"]["video"] = video_summary

        # AUDIO PROCESSING
        if 'audio' in request.files:
            audio_file = request.files['audio']
            audio_path = os.path.join(AUDIO_DIR, f"{session_id}_audio.wav")
            audio_file.save(audio_path)

            audio_analysis = transcribe_with_whisper(audio_path)
            content_analysis = analyze_content(audio_analysis.get("translated_text", ""), [
                "abuse", "arson", "assault", "burglary", "explosion",
                "fighting", "normal", "road_accident", "shooting", 
                "shoplifting", "stealing", "vandalism"
            ])
            
            # Store English transcription in standardized format
            results["eng_audio"] = audio_analysis.get("translated_text", "")
            
            # Update standardized results
            results["events"].append(content_analysis.get("crime_indication", "unknown"))
            results["confidence"]["audio"] = content_analysis.get("confidence", 0)
            results["detailed_summary"]["audio"] = content_analysis.get("summary", "")

        # TEXT PROCESSING
        if 'text' in request.form:
            text = request.form['text']
            text_analysis = analyze_text_input(text)
            
            # Store original text in standardized format
            results["org_text"] = text
            
            # Update standardized results
            results["events"].append(text_analysis.get("category", "unknown"))
            results["confidence"]["text"] = text_analysis.get("confidence", 0)
            results["detailed_summary"]["text"] = text_analysis.get("description", "")

        # Handle empty case
        if not any(key in request.files or key in request.form for key in ['video', 'audio', 'text']):
            return jsonify({"error": "No valid input provided. Please upload video, audio, or provide text."}), 400

        # Clean up events list - remove duplicates and unknowns if other events exist
        valid_events = [et for et in results["events"] if et and et != "unknown"]
        if valid_events:
            results["events"] = list(set(valid_events))
        else:
            results["events"] = ["unknown"]

        return jsonify(results)

    except Exception as e:
        import traceback
        print(f"Error in analyze_content_endpoint: {e}")
        print(traceback.format_exc())
        return jsonify({"error": str(e), "stacktrace": traceback.format_exc()}), 500
    
if __name__ == '_main_':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)