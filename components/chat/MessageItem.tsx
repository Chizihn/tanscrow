"use client"

import { Message } from "@/types/chat";
import { DEFAULT_USER_IMG } from "@/constants";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  isLastInGroup: boolean;
}

export function MessageItem({ message, isCurrentUser, showAvatar, isLastInGroup }: MessageItemProps) {
  const sender = message.sender;
  const isRead = message.isRead;

  return (
    <div
      className={`flex items-end ${isCurrentUser ? "justify-end" : "justify-start"} w-full`}
    >
      {showAvatar && (
        <div className="flex-shrink-0">
          <img
            src={sender?.profileImageUrl || DEFAULT_USER_IMG}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
      <div
        className={`flex flex-col max-w-[70%] ${
          isCurrentUser
            ? "items-end"
            : "items-start"
        }`}
      >
        <div
          className={`flex items-center ${
            isCurrentUser ? "justify-end" : "justify-start"
          }`}
        >
          {isLastInGroup && !isCurrentUser && (
            <span className="text-xs text-gray-500 mr-2">
              {sender?.firstName || "User"}
            </span>
          )}
          <div
            className={`flex items-center ${
              isCurrentUser
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-900"
            } rounded-lg px-3 py-2 max-w-[70%]`}
          >
            <p className="break-words">{message.content}</p>
          </div>
        </div>
        <p
          className={`text-xs ${
            isCurrentUser ? "text-blue-300" : "text-gray-400"
          } mt-1`}
        >
          {new Date(message.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {!isCurrentUser && !isRead && (
            <span className="ml-2">•</span>
          )}
        </p>
      </div>
    </div>
  );
}
