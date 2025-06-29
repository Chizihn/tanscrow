"use client"

import { Chat } from "@/types/chat";
import { useRouter } from "next/navigation";
import { DEFAULT_USER_IMG } from "@/constants";

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
  onClick: () => void;
}

export function ChatListItem({ chat, currentUserId, onClick }: ChatListItemProps) {
  const lastMessage = chat.lastMessage || chat.messages?.[0];
  const otherUser = chat.participants?.find(
    (participant) => participant?.id !== currentUserId
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex-shrink-0">
        <img
          src={otherUser?.profileImageUrl || DEFAULT_USER_IMG}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-900">
            {(otherUser?.firstName || "") + " " + (otherUser?.lastName || "")}
          </h3>
          {lastMessage && (
            <p className="text-xs text-gray-500">
              {formatTime(lastMessage.createdAt || new Date())}
            </p>
          )}
        </div>
        {lastMessage && (
          <p className="mt-1 text-sm text-gray-700">
            {lastMessage.content}
          </p>
        )}
      </div>
    </div>
  );
}
