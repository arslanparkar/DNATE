'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import AppLayout from '@/components/AppLayout'; // Import the layout

interface Session {
  sessionId: string;
  personaName: string;
  status: string;
  createdAt: string;
  questions: any[];
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/sessions');
        if (!res.ok) {
          throw new Error('Failed to fetch recent sessions');
        }
        const data = await res.json();
        const recentSessions = data.sessions
          .sort((a: Session, b: Session) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        setSessions(recentSessions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <AppLayout> {/* Use the layout component */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-muted-foreground">Here's a quick overview of your progress.</p>
        </div>
        <Button asChild>
          <Link href="/practice">Start New Practice</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Placeholder for stats cards */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Average across all sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">8.5/10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sessions Completed</CardTitle>
            <CardDescription>Your total practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Confidence</CardTitle>
            <CardDescription>Self-rated confidence</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">92%</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
           <p className="text-red-500">{error}</p>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.sessionId}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Practice with {session.personaName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.questions.length} questions - {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                     <Link href={`/sessions/${session.sessionId}`}>
                        <ArrowRight className="h-4 w-4" />
                     </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>You haven't completed any sessions yet.</p>
        )}
      </div>
    </AppLayout>
  );
}