import AppLayout from '@/components/AppLayout'; // Import the layout
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Mastering MSL Conversations',
      description: 'A guide to effective communication with healthcare professionals.',
      link: '#',
    },
    {
      title: 'Understanding Clinical Data',
      description: 'Learn how to interpret and present complex trial data clearly.',
      link: '#',
    },
    {
      title: 'Top 10 Oncologist Questions',
      description: 'Prepare for the most common questions from leading oncologists.',
      link: '#',
    },
  ];

  return (
    <AppLayout> {/* Use the layout component */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">
          Sharpen your skills with these curated articles and guides.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{resource.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
               <Link href={resource.link} className="text-primary hover:underline">
                 Read more →
               </Link>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}