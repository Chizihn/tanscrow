// "use client";

// import React from "react";
// import { Download, File, FileText } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const DocumentsList = ({ documents }) => {
//   const getFileIcon = (fileType) => {
//     if (fileType.includes("image")) {
//       return <File className="h-10 w-10 text-blue-500" />;
//     } else if (fileType.includes("pdf")) {
//       return <FileText className="h-10 w-10 text-red-500" />;
//     } else {
//       return <File className="h-10 w-10 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {documents.map((doc) => (
//         <div key={doc.id} className="flex items-center justify-between border rounded-md p-3">
//           <div className="flex items-center space-x-3">
//             {getFileIcon(doc.fileType)}
//             <div>
//               <p className="font-medium">{doc.fileName}</p>
//               <p className="text-sm text-muted-foreground">
//                 Uploaded by {doc.uploadedBy.firstName} {doc.uploadedBy.lastName} • {new Date(doc.uploadedAt).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//           <Button variant="outline" size="sm">
//             <Download className="h-4 w-4 mr-2" />
//             Download
//           </Button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DocumentsList;
