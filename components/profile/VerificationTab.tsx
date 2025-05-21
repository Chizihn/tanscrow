"use client";
import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, FileText, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/types/user";
import {
  DocumentType,
  VerificationStatus,
  VerificationDocument,
} from "@/types/verification";
import { ApolloError, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { uploadDocument } from "@/lib/cloudinary";

interface VerificationTabProps {
  user: User;
  loading: boolean;
  error?: ApolloError;
}

export function VerificationTab({
  user,
  loading,
  error,
}: VerificationTabProps) {
  const { setUser } = useAuthStore();
  const [uploadLoading, setUploadLoading] = useState<DocumentType | null>(null);

  const [submitDocument] = useMutation(SUBMIT_VERIFICATION_DOCUMENT, {
    onCompleted: (data) => {
      setUser({
        ...user,
        verificationDocuments: [
          ...(user.verificationDocuments || []),
          data?.submitVerificationDocument,
        ].filter((doc): doc is VerificationDocument => doc !== undefined),
      });
      toast.success("Document submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit document");
    },
  });

  const handleFileUpload = async (
    file: File,
    documentNumber: string,
    documentType: DocumentType
  ) => {
    try {
      if (!documentNumber.trim()) {
        throw new Error("Please enter a document number");
      }

      setUploadLoading(documentType);

      // First upload to Cloudinary
      const uploadResult = await uploadDocument(file);

      if (!uploadResult?.secure_url) {
        throw new Error("Failed to get upload URL");
      }

      // Then submit the document data to our API
      await submitDocument({
        variables: {
          input: {
            documentType,
            documentNumber,
            documentUrl: uploadResult.secure_url,
          },
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload document"
      );
    } finally {
      setUploadLoading(null);
    }
  };

  // Safely access verification documents
  const verificationDocuments = user?.verificationDocuments || [];

  // Check if a document of a specific type exists
  const hasDocumentType = (type: DocumentType) => {
    return verificationDocuments.some((doc) => doc.documentType === type);
  };

  // Format date safely
  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.log("Invalid date", error);
      return "Invalid date";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>
          Verify your identity to unlock all features of the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <LoadingState />}

        {error && <ErrorState />}

        {!loading && !error && (
          <>
            <VerificationItem
              title="ID Verification"
              description="Upload a government-issued ID card"
              isVerified={hasDocumentType(DocumentType.NATIONAL_ID)}
              documentType={DocumentType.NATIONAL_ID}
              isLoading={uploadLoading === DocumentType.NATIONAL_ID}
              onFileSelected={handleFileUpload}
            />

            <VerificationItem
              title="Address Verification"
              description="Upload a utility bill or bank statement"
              isVerified={hasDocumentType(DocumentType.UTILITY_BILL)}
              documentType={DocumentType.UTILITY_BILL}
              isLoading={uploadLoading === DocumentType.UTILITY_BILL}
              onFileSelected={handleFileUpload}
            />

            {verificationDocuments.length > 0 && (
              <SubmittedDocuments
                documents={verificationDocuments}
                formatDate={formatDate}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center p-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading verification data...</span>
    </div>
  );
}

function ErrorState() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load verification documents. Please try again later.
      </AlertDescription>
    </Alert>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SUBMIT_VERIFICATION_DOCUMENT } from "@/graphql/mutations/verification";

const documentUploadSchema = z.object({
  documentType: z.nativeEnum(DocumentType),
  documentNumber: z.string().min(1, "Document number is required"),
});

type DocumentUploadForm = z.infer<typeof documentUploadSchema>;

interface VerificationItemProps {
  title: string;
  description: string;
  isVerified: boolean;
  documentType: DocumentType;
  isLoading: boolean;
  onFileSelected: (
    file: File,
    documentNumber: string,
    documentType: DocumentType
  ) => Promise<void>;
}

function VerificationItem({
  title,
  description,
  isVerified,
  documentType: initialDocumentType,
  isLoading,
  onFileSelected,
}: VerificationItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<DocumentUploadForm>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      documentType: initialDocumentType,
      documentNumber: "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const values = form.getValues();
      await onFileSelected(file, values.documentNumber, values.documentType);
      setIsDialogOpen(false);
      form.reset();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-muted">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div>
        {isVerified ? (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="h-3 w-3" /> Verified
          </Badge>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Verification Document</DialogTitle>
                <DialogDescription>
                  Please select the document type and enter the document number
                  before uploading.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a document type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(DocumentType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter document number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    className="w-full"
                    onClick={async () => {
                      const result = await form.trigger();
                      if (result) {
                        fileInputRef.current?.click();
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Select File"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

interface SubmittedDocumentsProps {
  documents: VerificationDocument[];
  formatDate: (date: string | Date) => string;
}

function SubmittedDocuments({
  documents,
  formatDate,
}: SubmittedDocumentsProps) {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-3">Submitted Documents</h4>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <p className="font-medium">{doc.documentType}</p>
              <p className="text-xs text-muted-foreground">
                Submitted on {formatDate(doc.submittedAt)}
              </p>
            </div>
            <Badge
              variant={
                doc.verificationStatus === VerificationStatus.APPROVED
                  ? "success"
                  : doc.verificationStatus === VerificationStatus.REJECTED
                  ? "destructive"
                  : "secondary"
              }
            >
              {doc.verificationStatus}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
