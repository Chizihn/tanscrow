// "use client";

// import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DEFAULT_USER_IMG } from "@/constants";

// const MessagesList = ({ messages, currentUserId }) => {
//   return (
//     <div className="space-y-4">
//       {messages.map((message) => {
//         const isCurrentUser = message.senderId === currentUserId;

//         return (
//           <div
//             key={message.id}
//             className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
//           >
//             <div className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
//               <Avatar className="h-8 w-8">
//                 <AvatarImage
//                   src={message.sender.profileImage || DEFAULT_USER_IMG}
//                   alt={message.sender.firstName}
//                 />
//                 <AvatarFallback>
//                   {message.sender.firstName[0]}{message.sender.lastName[0]}
//                 </AvatarFallback>
//               </Avatar>

//               <div
//                 className={`rounded-lg p-3 ${
//                   isCurrentUser
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-muted'
//                 }`}
//               >
//                 <p>{message.content}</p>
//                 <p className="text-xs mt-1 opacity-70">
//                   {new Date(message.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default MessagesList;
