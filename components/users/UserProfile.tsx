"use client";

import { useQuery } from "@apollo/client";
import { GET_USER } from "@/graphql/queries/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface UserProfileProps {
  id: string;
}

export default function UserProfile({ id }: UserProfileProps) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error loading user: {error.message}</div>;
  if (!data?.user) return <div>User not found</div>;

  const { user } = data;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/users" className="inline-flex items-center mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Link>
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback>
                {user.firstName?.[0]}
                {user.lastName?.[1]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">User Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                {user.phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{user.phoneNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Recent Activity</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No recent activity</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Transaction History</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No transaction history</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
