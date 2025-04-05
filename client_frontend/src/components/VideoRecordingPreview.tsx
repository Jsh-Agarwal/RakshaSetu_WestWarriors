import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Video, Square, X } from 'lucide-react';

interface VideoRecordingPreviewProps {
  onRecordingComplete: (videoUrl: string) => void;
  onClose: () => void;
}

const VideoRecordingPreview: React.FC<VideoRecordingPreviewProps> = ({ onRecordingComplete, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const startRecording = () => {
    if (stream) {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        onRecordingComplete(videoUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  React.useEffect(() => {
    startCamera();
    return () => cleanup();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Record Video</h3>
          <Button variant="ghost" size="icon" onClick={cleanup}>
            <X size={20} />
          </Button>
        </div>
        
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {isRecording && (
            <div className="absolute top-4 right-4">
              <div className="animate-pulse flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                Recording
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-center space-x-4">
          {!isRecording ? (
            <Button onClick={startRecording} className="bg-raksha-primary">
              <Video size={18} className="mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive">
              <Square size={18} className="mr-2" />
              Stop Recording
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRecordingPreview;