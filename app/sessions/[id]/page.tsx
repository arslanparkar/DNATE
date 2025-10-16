'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  downloadUrl?: string; // Will be fetched on demand
}

interface SessionDetails {
  sessionId: string;
  personaName: string;
  questions: { question: string }[];
  recordings: Recording[];
  createdAt: string;
}

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
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <Progress value={score * 10} className="w-24 h-2" />
        <span className="font-semibold">{score.toFixed(1)}</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AppLayout>
        <Skeleton className="h-10 w-1/2 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !session) {
    return (
      <AppLayout>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Session Review</h1>
        <p className="text-muted-foreground">
          Practice with {session.personaName} on {new Date(session.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {session.recordings.map((rec, index) => (
          <AccordionItem value={`item-${index}`} key={rec.s3Key}>
            <AccordionTrigger>
                Question {rec.questionIndex + 1}: {session.questions[rec.questionIndex].question.slice(0, 80)}...
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side: Video and Transcription */}
                <div className="space-y-4">
                   <Card>
                      <CardHeader><CardTitle>Your Response</CardTitle></CardHeader>
                      <CardContent>
                         {/* Placeholder for video player */}
                         <div className="bg-black aspect-video rounded-md flex items-center justify-center">
                            <p className="text-white">Video Player for {rec.s3Key}</p>
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

                {/* Right side: AI Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Performance Analysis</CardTitle>
                    <div className="flex items-center gap-2 pt-2">
                        <Badge>Overall Score</Badge>
                        <span className="text-2xl font-bold">{rec.analysis.scores.overall.toFixed(1)} / 10</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                        <h4 className="font-semibold mb-2">Score Breakdown</h4>
                        <div className="space-y-2">
                           {renderScore('Clarity', rec.analysis.scores.clarity)}
                           {renderScore('Confidence', rec.analysis.scores.confidence)}
                           {renderScore('Relevance', rec.analysis.scores.relevance)}
                           {renderScore('Medical Accuracy', rec.analysis.scores.accuracy)}
                           {renderScore('Professionalism', rec.analysis.scores.professionalism)}
                        </div>
                     </div>
                     <div>
                        <h4 className="font-semibold mb-2">Strengths</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                           {rec.analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                     </div>
                     <div>
                        <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                           {rec.analysis.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                        </ul>
                     </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </AppLayout>
  );
}

// Simple Progress component to be used inside this file
const Progress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`h-2 bg-gray-200 rounded-full ${className}`}>
        <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);