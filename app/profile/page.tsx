"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/navbar'; // Assuming you have a Navbar component

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // This assumes your auth context or a similar mechanism fetches the user
        // and you have an API route for it.
        const res = await fetch('/api/auth/me'); 
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not load your profile.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : user ? (
                  <>
                    <div className="flex items-center gap-6">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="h-24 w-24 rounded-full border-4 border-[#0077E6]"
                      />
                      <div>
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                        <p className="mt-2 text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} readOnly/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue={user.role || 'MSL'} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" defaultValue={user.company || 'DNATE Pharma'} />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-[#0077E6] hover:bg-[#0056b3]">Save Changes</Button>
                    </div>
                  </>
                ) : (
                  <p>Could not load user data.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs (Preferences, Security) remain the same */}
          
        </Tabs>
      </main>
    </div>
  )
}