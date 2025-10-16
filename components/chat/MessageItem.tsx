"use client";

import Image from "next/image";
import { Message } from "@/types/chat";
import { DEFAULT_USER_IMG } from "@/constants";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  isLastInGroup: boolean;
}

export function MessageItem({
  message,
  isCurrentUser,
  showAvatar,
  isLastInGroup,
}: MessageItemProps) {
  const sender = message.sender;
  const isRead = message.isRead ?? false;
  const attachments = message.attachments || [];

  return (
    <div
      className={`flex items-end ${
        isCurrentUser ? "justify-end" : "justify-start"
      } w-full mb-2`}
    >
      {showAvatar && (
        <div className="flex-shrink-0 relative w-8 h-8">
          <Image
            src={sender?.profileImageUrl || DEFAULT_USER_IMG}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </div>
      )}
      <div
        className={`flex flex-col max-w-[70%] ${
          isCurrentUser ? "items-end" : "items-start"
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
            className={`flex flex-col gap-1 ${
              isCurrentUser
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-900"
            } rounded-lg px-3 py-2 max-w-[70%]`}
          >
            {message.content && (
              <p className="break-words">{message.content}</p>
            )}
            {attachments.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-2">
                    {att.fileType?.startsWith("image/") ? (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-24 h-24 relative rounded border overflow-hidden"
                      >
                        <Image
                          src={att.url}
                          alt={att.fileName}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </a>
                    ) : (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        {att.fileName || "Download file"}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
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
          {!isCurrentUser && !isRead && <span className="ml-2">•</span>}
        </p>
      </div>
    </div>
  );
}
