import AppLayout from '@/components/AppLayout'; // Import the layout
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveBar } from '@nivo/bar' // Assuming you might use a chart library

export default function AnalyticsPage() {
  return (
    <AppLayout> {/* Use the layout component */}
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and identify areas for improvement over time.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Avg. Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">8.5</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg. Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">-1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg. Clarity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">8.8</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sessions This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">+12</div>
              <p className="text-xs text-muted-foreground">+110% from last month</p>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Overall scores from your last 7 sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a chart */}
            <div className="h-[300px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p>Chart coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}