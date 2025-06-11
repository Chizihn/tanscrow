import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'User Profile',
  description: 'View user profile details',
};

interface User {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  accountType: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  address: {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
  } | null;
  reviews: {
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: {
      firstName: string;
      lastName: string;
    };
  }[];
}

const mockUser: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890',
  profileImageUrl: 'https://avatar.example.com/john',
  accountType: 'USER',
  createdAt: '2025-06-01T10:00:00Z',
  updatedAt: '2025-06-05T09:00:00Z',
  verified: true,
  address: {
    id: '123e4567-e89b-12d3-a456-426614174001',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
  },
  reviews: [
    {
      rating: 5,
      comment: 'Great seller! Fast delivery and excellent communication.',
      createdAt: '2025-06-04T14:00:00Z',
      reviewer: {
        firstName: 'Sarah',
        lastName: 'Smith',
      },
    },
    {
      rating: 4,
      comment: 'Good experience overall.',
      createdAt: '2025-06-03T10:00:00Z',
      reviewer: {
        firstName: 'Michael',
        lastName: 'Johnson',
      },
    },
  ],
};

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-4">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={mockUser.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {mockUser.firstName.charAt(0)}{mockUser.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {mockUser.firstName} {mockUser.lastName}
                      </h2>
                      <p className="text-muted-foreground">
                        {mockUser.email}
                      </p>
                      <p className="text-muted-foreground">
                        {mockUser.phoneNumber}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mockUser.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {mockUser.verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Account Type:</span>
                      <p className="text-lg">{mockUser.accountType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Member Since:</span>
                      <p className="text-lg">{new Date(mockUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Last Updated:</span>
                      <p className="text-lg">{new Date(mockUser.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {mockUser.address && (
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{mockUser.address.street}</p>
                  <p>{mockUser.address.city}, {mockUser.address.state}</p>
                  <p>{mockUser.address.country}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <h2 className="text-lg font-semibold">User Reviews</h2>
          {mockUser.reviews.map((review, index) => (
            <Card key={index}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {review.reviewer.firstName} {review.reviewer.lastName}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-${
                            i < review.rating ? 'yellow-500' : 'gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {review.comment && (
                  <p className="mt-2 text-muted-foreground">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="transactions">Transactions</TabsContent>
        <TabsContent value="settings">Settings</TabsContent>
      </Tabs>
    </div>
  );
}
