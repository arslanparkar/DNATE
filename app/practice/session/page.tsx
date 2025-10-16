'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/components/AppLayout';
import { Loader2 } from 'lucide-react';

// Define the structure of a Persona object
interface Persona {
  personaId: string;
  name: string;
  title: string;
  specialty: string;
}

export default function PracticeSetupPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch the list of personas from your backend when the page loads
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await fetch('/api/personas');
        if (!res.ok) throw new Error('Failed to fetch personas');
        const data = await res.json();
        setPersonas(data.personas);
      } catch (error) {
        toast({
          title: 'Error Loading Personas',
          description: error instanceof Error ? error.message : 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPersonas();
  }, [toast]);

  // Handle starting a new session
  const handleStartSession = async () => {
    if (!selectedPersona) {
      toast({
        title: 'Selection Required',
        description: 'Please select a persona to practice with.',
        variant: 'destructive',
      });
      return;
    }
    setIsStarting(true);
    try {
      const res = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              personaId: selectedPersona,
              difficulty,
              questionCount,
          }),
      });
      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to start session');
      }
      const data = await res.json();
      // Redirect to the session page with the new session's ID
      router.push(`/practice/session?sessionId=${data.session.sessionId}`);
    } catch (error) {
        toast({
            title: 'Error Starting Session',
            description: error instanceof Error ? error.message : 'Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsStarting(false);
    }
  };
  
  const PageContent = () => (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Practice Mode</h1>
        <p className="text-lg text-muted-foreground">Choose a persona and configure your practice session.</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">1. Select a Persona</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona) => (
          <Card
            key={persona.personaId}
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedPersona === persona.personaId ? 'ring-2 ring-primary shadow-lg' : 'ring-1 ring-border'}`}
            onClick={() => setSelectedPersona(persona.personaId)}
          >
            <CardHeader>
              <CardTitle>{persona.name}</CardTitle>
              <CardDescription>{persona.title} - {persona.specialty}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Select this persona to start practicing real-world scenarios.</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Configure Session</h2>
      <Card>
        <CardHeader>
          <CardTitle>Session Settings</CardTitle>
          <CardDescription>Adjust the difficulty and length of your session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="block text-sm font-medium mb-2">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Number of Questions: {questionCount}</Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[questionCount]}
              onValueChange={(value) => setQuestionCount(value[0])}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartSession} disabled={isStarting || !selectedPersona} size="lg">
            {isStarting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isStarting ? 'Starting Session...' : 'Start Practice Session'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );

  return (
    <AppLayout>
      {isLoading ? (
        <div>
          <Skeleton className="h-12 w-1/4 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-8" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        </div>
      ) : (
        <PageContent />
      )}
    </AppLayout>
  );
}