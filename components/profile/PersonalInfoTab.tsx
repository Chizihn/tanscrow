// src/app/profile/components/PersonalInfoTab.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE, UPDATE_PROFILE_IMG } from "@/graphql/mutations/user";
import { ME } from "@/graphql/queries/user";
import { generateS3Key, validateImage, uploadToS3 } from "@/lib/s3-upload";
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
import { Camera, Edit, User as UserIcon, Loader2 } from "lucide-react";
import { User } from "@/types/user";
import { showErrorToast, showSuccessToast } from "../Toast";
import { handleApolloError } from "@/utils/error";

interface PersonalInfoTabProps {
  user: User;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  });
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: ME }],
    onCompleted: () => {
      showSuccessToast("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      showErrorToast(error.message);
    },
  });

  const [updateProfileImage] = useMutation(UPDATE_PROFILE_IMG, {
    refetchQueries: [{ query: ME }],
    onCompleted: () => {
      showSuccessToast("Profile image updated successfully");
      setUploadingImage(false);
    },
    onError: (error) => {
      const message = handleApolloError(error);
      showErrorToast(message);
      setUploadingImage(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      variables: {
        input: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Validate the image
      validateImage(file);

      // Generate S3 key and upload
      const s3Key = generateS3Key(file.name);
      const imageUrl = await uploadToS3(file, s3Key);

      // Update profile with new image URL
      await updateProfileImage({
        variables: {
          profileImageUrl: imageUrl,
        },
      });
    } catch (error) {
      showErrorToast((error as Error).message || "Failed to upload image");
      console.error(error);
      setUploadingImage(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label
                htmlFor="profileImage"
                className={`absolute bottom-0 right-0 rounded-full w-8 h-8 bg-secondary flex items-center justify-center cursor-pointer transition-opacity ${
                  uploadingImage ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {uploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
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
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-4">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
