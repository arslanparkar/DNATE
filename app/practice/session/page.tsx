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
import VideoRecorder from '@/components/VideoRecorder'; // Import the new component

interface Question {
  question: string;
  category: string;
  difficulty: string;
  timeLimit: number;
}

interface SessionData {
  sessionId: string;
  personaName: string;
  questions: Question[];
}

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
      setError('No session ID provided.');
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
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        toast({
          title: 'Error',
          description: 'Could not load the practice session.',
          variant: 'destructive',
        });
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
    if (!recordedBlob || !session) return;
    
    setIsSubmitting(true);
    try {
      // 1. Get pre-signed URL from our backend
      const uploadUrlRes = await fetch('/api/recording/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId }),
      });
      if (!uploadUrlRes.ok) throw new Error('Could not get upload URL.');
      const { uploadUrl, key } = await uploadUrlRes.json();
      
      // 2. Upload the video blob directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: recordedBlob,
        headers: { 'Content-Type': 'video/webm' },
      });
      if (!uploadRes.ok) throw new Error('Failed to upload video to S3.');
      
      // 3. Tell our backend to process the file from S3
      const processRes = await fetch('/api/recording/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          s3Key: key,
          duration: 0, // Placeholder, can be improved
          questionIndex: currentQuestionIndex,
        }),
      });
      if (!processRes.ok) throw new Error('Failed to process video.');

      const analysisData = await processRes.json();
      console.log('Analysis complete:', analysisData);

      toast({
        title: 'Response Submitted!',
        description: 'Your analysis will be available in the session summary.',
      });

      // Move to the next question or end the session
      handleNextQuestion();
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setRecordedBlob(null); // Reset blob for next question
    }
  };

  const handleNextQuestion = () => {
    if (session && currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      toast({
        title: 'Practice Complete!',
        description: 'Redirecting to your session summary.',
      });
      router.push(`/sessions/${sessionId}`);
    }
  };
  
  if (isLoading) { /* ... same loading state as before ... */ }
  if (error || !session) { /* ... same error state as before ... */ }

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

// Wrap the component in Suspense as it uses useSearchParams
export default function PracticeSessionPage() {
  return (
    <Suspense fallback={<AppLayout><div className="text-center">Loading Session...</div></AppLayout>}>
      <PracticeSession />
    </Suspense>
  );
}