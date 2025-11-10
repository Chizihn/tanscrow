"use client";

import { Chat } from "@/types/chat";
import { DEFAULT_USER_IMG } from "@/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatListItem({
  chat,
  currentUserId,
  isSelected,
  onClick,
}: ChatListItemProps) {
  const lastMessage = chat.lastMessage || chat.messages?.[0];
  const otherUser = chat.participants?.find(
    (participant) => participant?.id !== currentUserId
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center p-3  cursor-pointer",
        isSelected && "bg-primary"
      )}
    >
      <div className="flex-shrink-0">
        <Image
          src={otherUser?.profileImageUrl || DEFAULT_USER_IMG}
          alt={`${otherUser?.firstName || "User"} ${
            otherUser?.lastName || ""
          }`.trim()}
          width={40}
          height={40}
          className="rounded-full"
          priority={false}
          unoptimized={otherUser?.profileImageUrl?.startsWith("data:")} // Handle base64 images
        />
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium ">
            {(otherUser?.firstName || "") + " " + (otherUser?.lastName || "")}
          </h3>
          {lastMessage && (
            <p className="text-xs text-gray-500">
              {new Date(lastMessage.createdAt as Date).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          )}
        </div>
        {lastMessage && (
          <p className="mt-1 text-sm text-gray-700 truncate">
            {lastMessage.content}
          </p>
        )}
      </div>
    </div>
  );
}
