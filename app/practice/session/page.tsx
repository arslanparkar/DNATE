'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

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

  const handleNextQuestion = () => {
    if (session && currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of session
      toast({
        title: 'Practice Complete!',
        description: 'You have completed all the questions.',
      });
      router.push(`/sessions/${sessionId}`);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !session) {
    return (
      <AppLayout>
        <Card className="max-w-4xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Session</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4">{error || 'Could not find the requested session.'}</p>
            <Button onClick={() => router.push('/practice')} className="mt-4">
              Start a New Practice
            </Button>
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

        {/* Placeholder for Video Recording Component */}
        <Card className="mb-6">
           <CardHeader>
              <CardTitle>Your Response</CardTitle>
              <CardDescription>Record your answer. The recording will start automatically.</CardDescription>
           </CardHeader>
           <CardContent className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 h-64">
              <p className="text-muted-foreground">Video Recording Component Here</p>
           </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleNextQuestion} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit & Next Question'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

// Wrap the component in Suspense as it uses useSearchParams
export default function PracticeSessionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PracticeSession />
    </Suspense>
  );
}