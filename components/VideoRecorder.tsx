'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Mic, StopCircle, Redo, Send, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Card, CardContent, CardFooter } from './ui/card';

type RecordingState = 'idle' | 'recording' | 'recorded' | 'error';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isSubmitting: boolean;
}

export default function VideoRecorder({ onRecordingComplete, isSubmitting }: VideoRecorderProps) {
  const [state, setState] = useState<RecordingState>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const cleanupStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    cleanupStream(); // Clean up any existing stream first
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Error accessing media devices.', err);
      toast({
        title: 'Camera & Mic Error',
        description: 'Could not access your camera or microphone. Please check browser permissions and try again.',
        variant: 'destructive',
      });
      setState('error');
    }
  }, [toast, cleanupStream]);

  useEffect(() => {
    startCamera();
    return cleanupStream; // Ensure cleanup on unmount
  }, [startCamera, cleanupStream]);

  const handleStartRecording = () => {
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        onRecordingComplete(blob);
        setState('recorded');
        cleanupStream(); // Stop the camera feed after recording
      };

      mediaRecorderRef.current.start();
      setState('recording');
    } else {
        toast({ title: "Camera not ready", description: "Please wait for the camera to start.", variant: "destructive" });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRecordAgain = () => {
    recordedChunksRef.current = [];
    setState('idle');
    startCamera();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="bg-black rounded-md overflow-hidden aspect-video relative flex items-center justify-center">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
           {state === 'recording' && (
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              REC
            </div>
          )}
           {state === 'recorded' && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white font-semibold">Recording complete. Ready to submit.</p>
             </div>
           )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 p-4">
        {state === 'idle' && (
          <Button onClick={handleStartRecording} disabled={isSubmitting || !stream}>
            <Mic className="mr-2 h-4 w-4" /> Start Recording
          </Button>
        )}
        {state === 'recording' && (
          <Button onClick={handleStopRecording} variant="destructive">
            <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        )}
        {state === 'recorded' && (
          <>
            <Button onClick={handleRecordAgain} variant="outline" disabled={isSubmitting}>
              <Redo className="mr-2 h-4 w-4" /> Record Again
            </Button>
            <Button type="submit" form="submit-form" disabled={isSubmitting}>
              {isSubmitting ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                 <Send className="mr-2 h-4 w-4" />
              )}
               {isSubmitting ? 'Submitting...' : 'Submit & Continue'}
            </Button>
          </>
        )}
        {state === 'error' && (
            <p className="text-red-500 text-sm">Camera access denied. Please enable it in browser settings.</p>
        )}
      </CardFooter>
    </Card>
  );
}