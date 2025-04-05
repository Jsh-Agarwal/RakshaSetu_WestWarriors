import React, { useState, useRef } from 'react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, MapPin, Mic, Upload, Clock, AlertTriangle, Video, Share2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { api } from '@/services/api';

interface Evidence {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'file';
  url: string;
  thumbnail?: string;
}

const Report: React.FC = () => {
  const [reportType, setReportType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'audio' | 'video' | 'file' | null>(null);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  // References for media capture
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType) {
      toast.error("Please select an incident type");
      return;
    }
    
    if (!location) {
      toast.error("Location is required");
      return;
    }
    
    toast.success("Report submitted successfully!");
    // In a real app, this would send the data to a server
    
    // Reset form
    setReportType('');
    setLocation('');
    setDescription('');
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleGetLocation = () => {
    toast.info("Getting your current location...");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            toast.success("Location detected!");
          } catch (error) {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            toast.success("Location coordinates detected!");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Please enter it manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Function to initialize camera
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

  // Function to stop camera stream
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

  const handleAudioRecording = async () => {
    if (isRecording) {
      // Stop recording
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
        setMediaPreview(audioUrl);
        setMediaType('audio');
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started... Press again to stop.");
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      if (file.type.startsWith('video/')) {
        await api.uploadVideo(file);
        toast.success('Video uploaded successfully');
      } else if (file.type.startsWith('audio/')) {
        await api.uploadAudio(file);
        toast.success('Audio uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const handleTextSubmission = async (text: string) => {
    try {
      await api.uploadText(text);
      toast.success('Report text submitted successfully');
    } catch (error) {
      toast.error('Failed to submit report text');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith('image/') ? 'photo' : 
                      file.type.startsWith('video/') ? 'video' : 
                      file.type.startsWith('audio/') ? 'audio' : 'file';

      setEvidences(prev => [...prev, {
        id: Date.now().toString() + Math.random(),
        type: fileType,
        url: fileUrl
      }]);
    });

    toast.success(`${files.length} file(s) uploaded successfully!`);
  };

  const removeEvidence = (id: string) => {
    setEvidences(prev => prev.filter(evidence => evidence.id !== id));
  };

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          
          navigator.share({
            title: 'My Current Location',
            text: 'Check my current location on Google Maps',
            url: locationUrl
          })
            .then(() => toast.success("Location shared successfully!"))
            .catch((error) => {
              console.error('Error sharing location:', error);
              toast.error("Could not share location");
            });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error("Could not get your location");
        }
      );
    } else {
      // Fallback if Web Share API is not supported
      toast.info("Sharing not supported on this browser. You can copy your location manually.");
      handleGetLocation();
    }
  };
  
  const reportTypes = [
    { id: 'theft', label: 'Theft', icon: AlertTriangle },
    { id: 'accident', label: 'Accident', icon: AlertTriangle },
    { id: 'suspicious', label: 'Suspicious', icon: AlertTriangle },
    { id: 'harassment', label: 'Harassment', icon: AlertTriangle },
    { id: 'vandalism', label: 'Vandalism', icon: AlertTriangle },
    { id: 'other', label: 'Other', icon: AlertTriangle },
  ];

  // Clean up function
  React.useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="Report Incident" />
      
      <main className="flex-1 px-4 pb-20 pt-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mb-4 w-full flex justify-between">
              <span>View Recent Crime Notifications</span>
              <span className="bg-raksha-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Recent Notifications</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <Alert>
                <AlertDescription>
                  <p className="font-semibold">Investigation Update</p>
                  <p className="text-sm text-gray-600 mt-1">The theft reported at Central Market is under investigation. Case #RT45672</p>
                  <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertDescription>
                  <p className="font-semibold">Crime Trend Alert</p>
                  <p className="text-sm text-gray-600 mt-1">Increase in phone snatching incidents reported in Westside area. Stay vigilant.</p>
                  <p className="text-xs text-gray-400 mt-2">5 hours ago</p>
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertDescription>
                  <p className="font-semibold">Report Verified</p>
                  <p className="text-sm text-gray-600 mt-1">Your harassment report from yesterday has been verified. Thank you for your contribution.</p>
                  <p className="text-xs text-gray-400 mt-2">1 day ago</p>
                </AlertDescription>
              </Alert>
            </div>
          </SheetContent>
        </Sheet>

        <form onSubmit={handleSubmitReport} className="space-y-6">
          {/* Incident Type */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Incident Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <Button
                  key={type.id}
                  type="button"
                  variant={reportType === type.id ? "default" : "outline"}
                  className={`flex items-center justify-start h-12 px-4 ${
                    reportType === type.id 
                      ? "bg-raksha-primary hover:bg-raksha-primary/90" 
                      : "hover:bg-raksha-primary/10 hover:text-raksha-primary"
                  }`}
                  onClick={() => setReportType(type.id)}
                >
                  <type.icon size={18} className="mr-2" />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Location</h2>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter incident location"
                  className="pl-10"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleGetLocation}
                variant="secondary"
              >
                Get Current
              </Button>
            </div>
            <Button 
              type="button" 
              onClick={handleShareLocation}
              variant="outline" 
              className="mt-2 w-full"
            >
              <Share2 size={18} className="mr-2" />
              Share My Location
            </Button>
          </div>
          
          {/* Time */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">When did it happen?</h2>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="datetime-local"
                  placeholder="Select date and time"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Description</h2>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened..."
              rows={4}
            />
          </div>
          
          {/* Evidence */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Add Evidence</h2>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center"
                onClick={handleTakePhoto}
              >
                <Camera size={20} />
                <span className="text-xs mt-1">Photo</span>
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center"
                onClick={handleVideoRecording}
              >
                <Video size={20} />
                <span className="text-xs mt-1">Video</span>
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center"
                onClick={handleAudioRecording}
              >
                <Mic size={20} />
                <span className="text-xs mt-1">Voice</span>
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={20} />
                <span className="text-xs mt-1">Upload</span>
              </Button>
            </div>

            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*"
              multiple // Allow multiple file selection
            />

            {/* Evidence Preview Grid */}
            {evidences.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {evidences.map((evidence) => (
                  <div key={evidence.id} className="relative border rounded-lg overflow-hidden">
                    {evidence.type === 'photo' && (
                      <img 
                        src={evidence.url} 
                        alt="Evidence" 
                        className="w-full h-40 object-cover"
                      />
                    )}
                    {evidence.type === 'video' && (
                      <video 
                        src={evidence.url} 
                        className="w-full h-40 object-cover" 
                        controls
                      />
                    )}
                    {evidence.type === 'audio' && (
                      <audio 
                        src={evidence.url} 
                        className="w-full mt-2" 
                        controls 
                      />
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
          
          {/* Submit */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-raksha-primary hover:bg-raksha-primary/90"
              size="lg"
            >
              Submit Report
            </Button>
            <div className="text-center mt-3">
              <label className="inline-flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-raksha-primary focus:ring-raksha-primary" />
                <span className="ml-2 text-sm text-gray-600">Submit anonymously</span>
              </label>
            </div>
          </div>
        </form>

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
      </main>
    </div>
  );
};

export default Report;
