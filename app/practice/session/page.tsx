'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, ArrowRight } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import VideoRecorder from '@/components/VideoRecorder';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// --- Interfaces ---
interface Score {
  clarity: number;
  confidence: number;
  relevance: number;
  accuracy: number;
  professionalism: number;
  overall: number;
}
interface Analysis { scores: Score; strengths: string[]; improvements: string[]; summary: string; }
interface Question { question: string; category: string; difficulty: string; }
interface SessionData { sessionId: string; personaName: string; questions: Question[]; }

// --- Small Helper Components ---
const ScoreProgress = ({ value }: { value: number }) => (
    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
        <div className="h-2 bg-primary rounded-full" style={{ width: `${value * 10}%` }}></div>
    </div>
);

const renderScore = (label: string, score: number) => (
    <div key={label} className="grid grid-cols-3 items-center gap-2">
      <span className="text-sm text-muted-foreground col-span-1">{label}</span>
      <div className="col-span-2 flex items-center gap-2">
        <ScoreProgress value={score} />
        <span className="font-semibold text-sm w-8 text-right">{score.toFixed(1)}</span>
      </div>
    </div>
);

// --- Main Page Logic ---
function PracticeSession() {
  const router = useRouter();
  const { toast } = useToast();
  const sessionId = useSearchParams().get('sessionId');

  const [session, setSession] = useState<SessionData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Analysis | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID. Please start a new practice.');
      setIsLoading(false);
      return;
    }
    fetch(`/api/sessions/${sessionId}`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to load session')))
      .then(data => setSession(data.session))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordedBlob || !session) return;
    
    setIsSubmitting(true);
    try {
      const { uploadUrl, key } = await fetch('/api/recording/upload-url', {
        method: 'POST', body: JSON.stringify({ sessionId }), headers: { 'Content-Type': 'application/json' }
      }).then(res => res.ok ? res.json() : Promise.reject(new Error('Could not get upload URL')));

      await fetch(uploadUrl, { method: 'PUT', body: recordedBlob, headers: { 'Content-Type': 'video/webm' } })
        .then(res => res.ok ? res : Promise.reject(new Error('Failed to upload video')));
      
      toast({ title: 'Upload Complete!', description: 'Analyzing your response...' });
      const processResponse = await fetch('/api/recording/process', {
        method: 'POST', body: JSON.stringify({ sessionId, s3Key: key, duration: 0, questionIndex: currentQuestionIndex }), headers: { 'Content-Type': 'application/json' }
      }).then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to process video')));

      setAnalysisResult(processResponse.analysis);
    } catch (err) {
      toast({ title: 'Submission Failed', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setAnalysisResult(null);
    setRecordedBlob(null);
    if (session && currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      toast({ title: 'Practice Complete!', description: 'Redirecting to your session summary.' });
      router.push(`/sessions/${sessionId}`);
    }
  };

  if (isLoading) return <AppLayout><div className="text-center p-8">Loading Session...</div></AppLayout>;
  if (error || !session) return <AppLayout><div className="text-center p-8 text-red-500">{error}</div></AppLayout>;

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {session.questions.length}</p>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Practice with {session.personaName}</CardTitle>
            <CardDescription>Category: {currentQuestion.category} | Difficulty: {currentQuestion.difficulty}</CardDescription>
          </CardHeader>
          <CardContent><p className="text-lg font-semibold">{currentQuestion.question}</p></CardContent>
        </Card>

        {!analysisResult ? (
          <form id="submit-form" onSubmit={handleSubmit}>
            <VideoRecorder
              key={currentQuestionIndex} // Force re-mount to reset camera for each question
              onRecordingComplete={setRecordedBlob}
              isSubmitting={isSubmitting}
            />
          </form>
        ) : (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>AI Performance Analysis</CardTitle>
                <div className="flex items-center gap-2 pt-2">
                    <Badge variant="secondary">Overall Score</Badge>
                    <span className="text-2xl font-bold">{analysisResult.scores.overall.toFixed(1)} / 10</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <h4 className="font-semibold mb-2 text-sm">Score Breakdown</h4>
                    <div className="space-y-2">
                       {Object.entries(analysisResult.scores).filter(([key]) => key !== 'overall').map(([key, value]) => renderScore(key.charAt(0).toUpperCase() + key.slice(1), value))}
                    </div>
                 </div>
                 <Separator />
                 <div>
                    <h4 className="font-semibold mb-2 text-sm">Strengths</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-green-700 dark:text-green-400">
                       {analysisResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
                 <Separator />
                 <div>
                    <h4 className="font-semibold mb-2 text-sm">Areas for Improvement</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-yellow-700 dark:text-yellow-400">
                       {analysisResult.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                    </ul>
                 </div>
              </CardContent>
            </Card>
            <div className="flex justify-end mt-4">
                <Button onClick={handleNext}>
                  {currentQuestionIndex === session.questions.length - 1 ? 'Finish Session' : 'Next Question'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Wrapper for Suspense
export default function PracticeSessionPage() {
  return (
    <Suspense>
      <PracticeSession />
    </Suspense>
  );
}