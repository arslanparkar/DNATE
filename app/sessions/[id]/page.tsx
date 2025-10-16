'use client';

import { useEffect, useState, Fragment } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

// Define interfaces for our data structure
interface Score {
  clarity: number;
  confidence: number;
  relevance: number;
  accuracy: number;
  professionalism: number;
  overall: number;
}

interface Analysis {
  scores: Score;
  strengths: string[];
  improvements: string[];
  summary: string;
}

interface Recording {
  s3Key: string;
  duration: number;
  questionIndex: number;
  transcription: string;
  analysis: Analysis;
}

interface SessionDetails {
  sessionId: string;
  personaName: string;
  questions: { question: string }[];
  recordings: Recording[];
  createdAt: string;
}

// A small progress bar component for displaying scores
const ScoreProgress = ({ value }: { value: number }) => (
    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
        <div className="h-2 bg-primary rounded-full" style={{ width: `${value * 10}%` }}></div>
    </div>
);


export default function SessionDetailPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<SessionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: sessionId } = params;

  useEffect(() => {
    if (!sessionId) return;
    const fetchSessionDetails = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (!res.ok) throw new Error('Failed to load session details');
        const data = await res.json();
        setSession(data.session);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessionDetails();
  }, [sessionId]);

  const renderScore = (label: string, score: number) => (
    <div key={label} className="grid grid-cols-3 items-center gap-2">
      <span className="text-sm text-muted-foreground col-span-1">{label}</span>
      <div className="col-span-2 flex items-center gap-2">
        <ScoreProgress value={score} />
        <span className="font-semibold text-sm w-8 text-right">{score.toFixed(1)}</span>
      </div>
    </div>
  );
  
  if (isLoading) {
    return (
      <AppLayout>
        <Skeleton className="h-10 w-1/2 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !session) {
    return (
      <AppLayout>
        <Card className="text-center max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Session</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4">{error || 'Session not found.'}</p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Session Review</h1>
        <p className="text-lg text-muted-foreground">
          Practice with {session.personaName} on {new Date(session.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-0">
        {(session.recordings || []).map((rec, index) => (
          <AccordionItem value={`item-${index}`} key={rec.s3Key || index} className="border rounded-lg">
            <AccordionTrigger className="p-4 text-left">
              <span className="font-semibold">Question {rec.questionIndex + 1}:</span>&nbsp;
              <span className="text-muted-foreground font-normal">
                {session.questions[rec.questionIndex].question.slice(0, 100)}...
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-4 border-t">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-4">
                   <Card>
                      <CardHeader><CardTitle>Your Response</CardTitle></CardHeader>
                      <CardContent>
                         <div className="bg-black aspect-video rounded-md flex items-center justify-center text-white">
                            Video Player Placeholder
                         </div>
                      </CardContent>
                   </Card>
                   <Card>
                      <CardHeader><CardTitle>Transcription</CardTitle></CardHeader>
                      <CardContent>
                         <p className="text-sm text-muted-foreground italic">"{rec.transcription}"</p>
                      </CardContent>
                   </Card>
                </div>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>AI Performance Analysis</CardTitle>
                    <div className="flex items-center gap-2 pt-2">
                        <Badge variant="secondary">Overall Score</Badge>
                        <span className="text-2xl font-bold">{rec.analysis.scores.overall.toFixed(1)} / 10</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                        <h4 className="font-semibold mb-2 text-sm">Score Breakdown</h4>
                        <div className="space-y-2">
                           {Object.entries(rec.analysis.scores).filter(([key]) => key !== 'overall').map(([key, value]) => renderScore(key.charAt(0).toUpperCase() + key.slice(1), value))}
                        </div>
                     </div>
                     <Separator />
                     <div>
                        <h4 className="font-semibold mb-2 text-sm">Strengths</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-green-700 dark:text-green-400">
                           {rec.analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                     </div>
                     <Separator />
                     <div>
                        <h4 className="font-semibold mb-2 text-sm">Areas for Improvement</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-yellow-700 dark:text-yellow-400">
                           {rec.analysis.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                        </ul>
                     </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
         {(!session.recordings || session.recordings.length === 0) && (
            <p className="text-center text-muted-foreground py-8">No recordings found for this session.</p>
        )}
      </Accordion>
    </AppLayout>
  );
}