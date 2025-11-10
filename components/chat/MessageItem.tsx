
"use client";

import { useState } from "react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Simple tooltip component since the UI one is missing
const Tooltip = ({ 
  children, 
  content,
  side = "top" 
}: { 
  children: React.ReactNode; 
  content: string; 
  side?: "top" | "right" | "bottom" | "left" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div 
          className={`absolute z-10 px-2 py-1 text-xs text-white bg-gray-800 rounded-md whitespace-nowrap ${
            side === "top" ? "bottom-full mb-1" : 
            side === "right" ? "left-full ml-1" :
            side === "left" ? "right-full mr-1" : "top-full mt-1"
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

interface MessageItemProps {
  message: Message & {
    readBy?: Array<{ readAt: string }>;
  };
  isCurrentUser: boolean;
}

export function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  const sender = message.sender;
  const timestamp = new Date(message.createdAt);
  const formattedTime = format(timestamp, 'h:mm a');
  
  const showDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  return (
    <div className={cn("w-full")}>
      {/* Date separator */}
      <div className="flex items-center justify-center my-4">
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {showDate(timestamp)}
        </div>
      </div>
      
      <div
        className={cn(
          "flex items-start gap-3 group",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {!isCurrentUser && (
          <Tooltip 
            content={`${sender?.firstName || ''} ${sender?.lastName || ''}`.trim()}
            side="right"
          >
            <Avatar className="h-8 w-8 mt-1 cursor-pointer">
              <AvatarImage src={sender?.profileImageUrl} />
              <AvatarFallback>
                {sender?.firstName?.[0]}{sender?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </Tooltip>
        )}
        
        <div
          className={cn(
            "flex flex-col max-w-[80%] sm:max-w-[65%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[45%]",
            isCurrentUser ? "items-end" : "items-start"
          )}
        >
          {!isCurrentUser && (
            <p className="text-xs text-muted-foreground mb-1 px-1">
              {sender?.firstName} {sender?.lastName}
            </p>
          )}
          
          <Tooltip content={formattedTime} side={isCurrentUser ? "left" : "right"}>
            <div
              className={cn(
                "rounded-2xl px-4 py-2 text-sm leading-relaxed break-words cursor-default",
                isCurrentUser
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-card border rounded-bl-none"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </Tooltip>
          
          {message.readBy && message.readBy.length > 0 && isCurrentUser && (
            <div className="flex items-center justify-end mt-1 space-x-1">
              <span className="text-xs text-muted-foreground">
                Read {format(new Date(message.readBy[0].readAt), 'h:mm a')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

