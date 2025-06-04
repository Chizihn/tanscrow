// src/lib/s3-upload.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function getPresignedUploadUrl(key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

// For profile images
export function generateS3Key(fileName: string) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `profile-images/${timestamp}-${randomString}-${fileName}`;
}

// For documents
export function generateDocumentS3Key(fileName: string) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `documents/${timestamp}-${randomString}-${fileName}`;
}

// Validate image files
export function validateImage(file: File): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP and GIF images are allowed");
  }

  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  return true;
}

// Validate document files
export function validateDocument(file: File): boolean {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PDF, Word, Excel, and text files are allowed");
  }

  if (file.size > maxSize) {
    throw new Error("Document size must be less than 10MB");
  }

  return true;
}

// Upload any file to S3
export async function uploadToS3(file: File, s3Key: string): Promise<string> {
  try {
    const presignedUrl = await getPresignedUploadUrl(s3Key);

    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${s3Key}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
