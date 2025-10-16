"use client";

import React, { useRef, useState, ChangeEvent } from "react";
import { Download, File, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { ADD_TRANSACTION_DOCUMENT } from "@/graphql/mutations/transaction";
import { uploadToS3, generateDocumentS3Key, validateDocument } from "@/lib/s3-upload";
import { useAuthStore } from "@/store/auth-store";
import { Document as TDocument } from "@/types/transaction";
import { User } from "@/types/user";

interface DocumentsListProps {
  documents: TDocument[];
  transaction: {
    id: string;
    seller: {
      id: string;
    };
  };
  refetch?: () => void;
}

const DocumentsList = ({ documents, transaction, refetch }: DocumentsListProps) => {
  const user = useAuthStore((state) => state.user);
  const isSeller = user && transaction.seller.id === user.id;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addDocument] = useMutation(ADD_TRANSACTION_DOCUMENT);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) {
      return <File className="h-10 w-10 text-blue-500" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-10 w-10 text-red-500" />;
    }
    return <File className="h-10 w-10 text-gray-500" />;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      validateDocument(file);
      setUploading(true);
      const s3Key = generateDocumentS3Key(file.name);
      const url = await uploadToS3(file, s3Key);
      
      await addDocument({
        variables: {
          transactionId: transaction.id,
          url,
          fileName: file.name,
          fileType: file.type,
          description: "Proof of delivery",
        },
      });
      
      if (refetch) refetch();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {isSeller && (
        <div className="mb-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Proof of Delivery"}
          </Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      )}
      {documents && documents.length > 0 ? (
        documents.map((doc: TDocument) => (
          <div key={doc.id} className="flex items-center justify-between border rounded-md p-3">
            <div className="flex items-center space-x-3">
              {getFileIcon(doc.fileType)}
              <div>
                <p className="font-medium">{doc.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  Uploaded by {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName} • {new Date(doc.uploadedAt).toLocaleDateString()}
                  {doc.description ? ` • ${doc.description}` : ""}
                </p>
              </div>
            </div>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </a>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <File className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No documents uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;