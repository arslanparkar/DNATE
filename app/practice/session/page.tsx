'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import VideoRecorder from '@/components/VideoRecorder';

// Interfaces
interface Question {
  question: string;
  category: string;
  difficulty: string;
}

interface SessionData {
  sessionId: string;
  personaName: string;
  questions: Question[];
}

// The main component logic
function PracticeSession() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [session, setSession] = useState<SessionData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided. Please start a new practice session.');
      setIsLoading(false);
      return;
    }

    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (!res.ok) throw new Error('Failed to load session data.');
        const data = await res.json();
        setSession(data.session);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, toast]);
  
  const handleRecordingComplete = (blob: Blob) => {
    setRecordedBlob(blob);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordedBlob || !session) {
        toast({ title: 'No Recording Found', description: 'Please record your response before submitting.', variant: 'destructive' });
        return;
    }
    
    setIsSubmitting(true);
    try {
      // Step 1: Get pre-signed URL from our backend
      const uploadUrlRes = await fetch('/api/recording/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId }),
      });
      if (!uploadUrlRes.ok) throw new Error('Could not get upload URL.');
      const { uploadUrl, key } = await uploadUrlRes.json();
      
      // Step 2: Upload the video blob directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: recordedBlob,
        headers: { 'Content-Type': 'video/webm' },
      });
      if (!uploadRes.ok) throw new Error('Failed to upload video.');
      
      // Step 3: Tell our backend to process the file from S3
      toast({ title: 'Upload Complete!', description: 'Analyzing your response... This may take a moment.' });
      const processRes = await fetch('/api/recording/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          s3Key: key,
          duration: 0,
          questionIndex: currentQuestionIndex,
        }),
      });
      if (!processRes.ok) throw new Error('Failed to process your response.');
      
      toast({ title: 'Analysis Complete!', description: 'Moving to the next question.' });
      handleNextQuestion();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({ title: 'Submission Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
      setRecordedBlob(null);
    }
  };

  const handleNextQuestion = () => {
    if (session && currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      toast({ title: 'Practice Complete!', description: 'Redirecting to your session summary.' });
      router.push(`/sessions/${sessionId}`);
    }
  };
  
  // Loading and Error states
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !session) {
    return (
      <AppLayout>
        <Card className="max-w-lg mx-auto text-center">
          <CardHeader><CardTitle className="text-red-500">Error</CardTitle></CardHeader>
          <CardContent>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4">{error}</p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {session.questions.length}</p>
          <Progress value={progress} className="w-full" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Practice with {session.personaName}</CardTitle>
            <CardDescription>Category: {currentQuestion.category} | Difficulty: {currentQuestion.difficulty}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{currentQuestion.question}</p>
          </CardContent>
        </Card>

        <form id="submit-form" onSubmit={handleSubmit}>
          <VideoRecorder
            onRecordingComplete={handleRecordingComplete}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </AppLayout>
  );
}

// Wrapper component to handle Suspense
export default function PracticeSessionPage() {
  return (
    <Suspense fallback={<AppLayout><div className="text-center p-8">Loading Session...</div></AppLayout>}>
      <PracticeSession />
    </Suspense>
  );
}