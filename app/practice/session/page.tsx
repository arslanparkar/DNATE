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
import { Loader2, AlertCircle } from 'lucide-react';

// Define the structure of a Persona object from your backend
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch the list of personas from your backend
  useEffect(() => {
    console.log('Attempting to fetch personas...');
    const fetchPersonas = async () => {
      try {
        const res = await fetch('/api/personas');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch personas');
        }
        const data = await res.json();
        console.log('Fetched data:', data); // DEBUG: See what the API returns

        if (data && Array.isArray(data.personas)) {
          setPersonas(data.personas);
          console.log('Personas state updated:', data.personas);
        } else {
          throw new Error('API response did not contain a personas array.');
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        console.error('Error fetching personas:', errorMessage);
        setError(errorMessage);
        toast({
          title: 'Error Loading Personas',
          description: errorMessage,
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

  // Loading State UI
  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
            <Skeleton className="h-12 w-1/3" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Practice Mode</h1>
          <p className="text-lg text-muted-foreground">Choose a persona and configure your practice session.</p>
        </div>

        <div>
            <h2 className="text-2xl font-semibold mb-4">1. Select a Persona</h2>
            {error ? (
                 <Card className="text-center p-8 bg-destructive/10 border-destructive">
                     <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
                     <CardTitle className="mt-4 text-destructive">Could Not Load Personas</CardTitle>
                     <CardDescription className="mt-2">{error}</CardDescription>
                 </Card>
            ) : personas.length > 0 ? (
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
                        <p className="text-sm text-muted-foreground">Practice real-world scenarios with {persona.name}.</p>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">No personas are available at the moment.</p>
            )}
        </div>

        <div>
            <h2 className="text-2xl font-semibold mb-4">2. Configure Session</h2>
            <Card>
            <CardHeader>
                <CardTitle>Session Settings</CardTitle>
                <CardDescription>Adjust the difficulty and length of your session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                <Label className="block text-sm font-medium mb-2">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
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
                    min={1} max={10} step={1}
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
        </div>
      </div>
    </AppLayout>
  );
}