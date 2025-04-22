
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { reportService } from '@/services/api';

interface VoiceReportingButtonProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const VoiceReportingButton: React.FC<VoiceReportingButtonProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
        audioChunksRef.current = [];
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly to report the incident. Click Stop when finished.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check your device settings.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording complete",
        description: "Your voice report has been recorded.",
      });
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {!isRecording ? (
        <Button 
          onClick={startRecording} 
          className="bg-emergency-500 hover:bg-emergency-600 text-white"
          disabled={isProcessing}
        >
          <Mic className="mr-2 h-4 w-4" />
          Record Voice Report
        </Button>
      ) : (
        <Button 
          onClick={stopRecording} 
          variant="destructive"
        >
          <Square className="mr-2 h-4 w-4" />
          Stop Recording
        </Button>
      )}
      
      {isProcessing && (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </Button>
      )}
    </div>
  );
};

export default VoiceReportingButton;
