import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Mic, Video, AlertTriangle, X, Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Evidence {
  id: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
}

const QuickReportForm: React.FC = () => {
  const [reportType, setReportType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType) {
      toast.error("Please select an incident type");
      return;
    }
    
    if (!description && evidences.length === 0) {
      toast.error("Please provide either a description or evidence");
      return;
    }
    
    toast.success("Quick report submitted successfully!");
    // Reset form
    setReportType('');
    setDescription('');
    setEvidences([]);
  };

  // Camera functions
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleTakePhoto = async () => {
    setShowCameraPreview(true);
    await initializeCamera();
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      setEvidences(prev => [...prev, {
        id: Date.now().toString(),
        type: 'photo',
        url: dataUrl
      }]);
      
      setShowCameraPreview(false);
      stopCameraStream();
      toast.success('Photo captured!');
    }
  };

  // Video functions
  const handleVideoRecording = async () => {
    setShowVideoPreview(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const startVideoRecording = () => {
    if (cameraStream) {
      const mediaRecorder = new MediaRecorder(cameraStream);
      mediaRecorderRef.current = mediaRecorder;
      mediaChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(mediaChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        setEvidences(prev => [...prev, {
          id: Date.now().toString(),
          type: 'video',
          url: videoUrl
        }]);
        
        setShowVideoPreview(false);
        stopCameraStream();
        toast.success('Video recorded successfully!');
      };

      mediaRecorder.start();
      setIsVideoRecording(true);
      toast.success('Recording started...');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isVideoRecording) {
      mediaRecorderRef.current.stop();
      setIsVideoRecording(false);
    }
  };

  // Audio recording functions
  const handleAudioRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.info("Audio recording stopped");
      }
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(mediaChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setEvidences(prev => [...prev, {
          id: Date.now().toString(),
          type: 'audio',
          url: audioUrl
        }]);
        
        stream.getTracks().forEach(track => track.stop());
        toast.success('Audio recorded successfully!');
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started... Press again to stop.");
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const removeEvidence = (id: string) => {
    setEvidences(prev => prev.filter(evidence => evidence.id !== id));
  };

  // Cleanup
  React.useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const reportTypes = [
    { id: 'theft', label: 'Theft' },
    { id: 'accident', label: 'Accident' },
    { id: 'suspicious', label: 'Suspicious' },
    { id: 'harassment', label: 'Harassment' },
    { id: 'violence', label: 'Violence' },
    { id: 'vandalism', label: 'Vandalism' },
    { id: 'fire', label: 'Fire' },
    { id: 'medical', label: 'Medical Emergency' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Incident Type */}
      <div>
        <h3 className="text-sm font-medium mb-2">Incident Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {reportTypes.map((type) => (
            <Button
              key={type.id}
              type="button"
              variant={reportType === type.id ? "default" : "outline"}
              className={`text-xs ${reportType === type.id ? "bg-raksha-primary" : ""}`}
              onClick={() => setReportType(type.id)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Description */}
      <div>
        <h3 className="text-sm font-medium mb-2">Description</h3>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe the incident..."
          rows={2}
        />
      </div>
      
      {/* Evidence */}
      <div>
        <h3 className="text-sm font-medium mb-2">Add Evidence</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            type="button" 
            variant="outline" 
            className="h-14 flex flex-col items-center justify-center"
            onClick={handleTakePhoto}
          >
            <Camera size={18} />
            <span className="text-xs mt-1">Photo</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className={`h-14 flex flex-col items-center justify-center ${isRecording ? 'border-raksha-primary text-raksha-primary' : ''}`}
            onClick={handleAudioRecording}
          >
            <Mic size={18} className={isRecording ? "animate-pulse text-raksha-primary" : ""} />
            <span className="text-xs mt-1">{isRecording ? "Stop" : "Voice"}</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="h-14 flex flex-col items-center justify-center"
            onClick={handleVideoRecording}
          >
            <Video size={18} />
            <span className="text-xs mt-1">Video</span>
          </Button>
        </div>

        {/* Evidence Preview Grid */}
        {evidences.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {evidences.map((evidence) => (
              <div key={evidence.id} className="relative border rounded-lg overflow-hidden">
                {evidence.type === 'photo' && (
                  <img 
                    src={evidence.url} 
                    alt="Evidence" 
                    className="w-full h-32 object-cover"
                  />
                )}
                {evidence.type === 'video' && (
                  <video 
                    src={evidence.url} 
                    className="w-full h-32 object-cover" 
                    controls
                  />
                )}
                {evidence.type === 'audio' && (
                  <div className="h-32 flex items-center justify-center bg-gray-50">
                    <audio 
                      src={evidence.url} 
                      className="w-full px-4" 
                      controls 
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeEvidence(evidence.id)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Camera Preview Dialog */}
      <Dialog open={showCameraPreview} onOpenChange={(open) => {
        if (!open) {
          stopCameraStream();
        }
        setShowCameraPreview(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button
                type="button"
                onClick={capturePhoto}
                className="bg-raksha-primary"
              >
                Capture Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Preview Dialog */}
      <Dialog open={showVideoPreview} onOpenChange={(open) => {
        if (!open) {
          stopCameraStream();
          if (isVideoRecording) {
            stopVideoRecording();
          }
        }
        setShowVideoPreview(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              {!isVideoRecording ? (
                <Button
                  type="button"
                  onClick={startVideoRecording}
                  className="bg-raksha-primary"
                >
                  Start Recording
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={stopVideoRecording}
                  variant="destructive"
                >
                  Stop Recording
                </Button>
              )}
            </div>
            {isVideoRecording && (
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  Recording...
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-raksha-primary hover:bg-raksha-primary/90"
      >
        <AlertTriangle size={16} className="mr-2" />
        Submit Quick Report
      </Button>
    </form>
  );
};

export default QuickReportForm;
