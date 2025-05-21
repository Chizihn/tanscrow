// src/app/profile/components/PersonalInfoTab.tsx
"use client";
import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, Edit, User as UserIcon } from "lucide-react";
import { User } from "@/types/user";

interface PersonalInfoTabProps {
  user: User;
}

export function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {user?.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <UserIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {user?.firstName || "User"} {user?.lastName || ""}
            </h3>
            <p className="text-sm text-muted-foreground">
              {user?.email || "No email provided"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user?.verified ? "success" : "outline"}>
                {user?.verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={user?.firstName || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={user?.lastName || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={user?.email || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" value={user?.phoneNumber || ""} readOnly />
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-medium mb-4">Address Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" value={user?.address?.street || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={user?.address?.city || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={user?.address?.state || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={user?.address?.postalCode || ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={user?.address?.country || ""}
                readOnly
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
