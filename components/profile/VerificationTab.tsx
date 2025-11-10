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
import { AlertCircle, Check, FileText, Loader2, Upload, X } from "lucide-react";
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { MY_VERIFICATION_DOCUMENTS } from "@/graphql/queries/verification";

const documentUploadSchema = z.object({
  documentType: z.nativeEnum(DocumentType),
  documentNumber: z.string().min(1, "Document number is required"),
});

type DocumentUploadForm = z.infer<typeof documentUploadSchema>;

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
      const newDoc = data?.submitVerificationDocument;
      if (newDoc) {
        setUser({
          ...user,
          verificationDocuments: [
            ...(user.verificationDocuments || []),
            newDoc,
          ],
        });
      }
      toast.success("Document submitted successfully!");
      setUploadLoading(null);
    },
    refetchQueries: [{ query: MY_VERIFICATION_DOCUMENTS }],

    onError: (error) => {
      toast.error(error.message || "Failed to submit document");
      setUploadLoading(null);
    },
  });

  const handleSubmit = async (
    documentNumber: string,
    documentType: DocumentType
  ) => {
    setUploadLoading(documentType);

    try {
      await submitDocument({
        variables: {
          input: {
            documentType,
            documentNumber,
            // documentUrl intentionally omitted
          },
        },
      });
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const verificationDocuments = user?.verificationDocuments || [];
  const hasDocumentType = (type: DocumentType) =>
    verificationDocuments.some((doc) => doc.documentType === type);

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>
          Verify your identity to unlock all features. You control when to
          submit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading && <LoadingState />}
        {error && <ErrorState />}

        {!loading && !error && (
          <>
            <VerificationItem
              title="ID Verification"
              description="Government-issued ID (National ID, Driver's License, etc.)"
              isVerified={hasDocumentType(DocumentType.NATIONAL_ID)}
              documentType={DocumentType.NATIONAL_ID}
              isLoading={uploadLoading === DocumentType.NATIONAL_ID}
              onSubmit={handleSubmit}
            />

            <VerificationItem
              title="Address Verification"
              description="Recent utility bill, bank statement, or residence proof"
              isVerified={hasDocumentType(DocumentType.UTILITY_BILL)}
              documentType={DocumentType.UTILITY_BILL}
              isLoading={uploadLoading === DocumentType.UTILITY_BILL}
              onSubmit={handleSubmit}
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
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-3 text-muted-foreground">
        Loading verification data...
      </span>
    </div>
  );
}

function ErrorState() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load verification documents. Please refresh or try again
        later.
      </AlertDescription>
    </Alert>
  );
}

interface VerificationItemProps {
  title: string;
  description: string;
  isVerified: boolean;
  documentType: DocumentType;
  isLoading: boolean;
  onSubmit: (
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
  onSubmit,
}: VerificationItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DocumentUploadForm>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      documentType: initialDocumentType,
      documentNumber: "",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitClick = async () => {
    const isValid = await form.trigger();
    if (!isValid || !selectedFile) {
      if (!selectedFile) {
        toast.error("Please select a file");
      }
      return;
    }

    const values = form.getValues();
    await onSubmit(values.documentNumber, values.documentType);
    setIsDialogOpen(false);
    form.reset();
    setSelectedFile(null);
  };

  return (
    <div className="flex items-center justify-between p-5 border rounded-xl hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-muted">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-base">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div>
        {isVerified ? (
          <Badge variant="success" className="text-sm px-3 py-1">
            <Check className="h-3.5 w-3.5 mr-1" /> Verified
          </Badge>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit {title}</DialogTitle>
                <DialogDescription>
                  Double-check your details before submitting. You can change
                  anything before clicking &quot;Submit&quot;.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form className="space-y-5">
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
                              <SelectValue />
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
                          <Input placeholder="e.g., A12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormLabel>File</FormLabel>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                    />

                    {!selectedFile ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium truncate max-w-[200px]">
                            {selectedFile.name}
                          </span>
                          <span className="text-muted-foreground">
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={removeFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </Form>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitClick}
                  disabled={isLoading || !selectedFile}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Document"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

function SubmittedDocuments({
  documents,
  formatDate,
}: {
  documents: VerificationDocument[];
  formatDate: (date: string | Date) => string;
}) {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Submitted Documents</h3>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-5 border rounded-xl bg-muted/20"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {doc.documentType.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Submitted on {formatDate(doc.submittedAt)}
                </p>
              </div>
            </div>
            <Badge
              variant={
                doc.verificationStatus === VerificationStatus.APPROVED
                  ? "success"
                  : doc.verificationStatus === VerificationStatus.REJECTED
                  ? "destructive"
                  : "secondary"
              }
              className="text-sm"
            >
              {doc.verificationStatus}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
