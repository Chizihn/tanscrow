"use client";

import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { DEFAULT_USER_IMG } from "@/constants";

interface MessageInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export function MessageInput({
  messageText,
  setMessageText,
  onSend,
  isSending,
}: MessageInputProps) {
  const user = useAuthStore((state) => state.user);

  const handleSend = () => {
    if (messageText.trim()) {
      onSend();
    }
  };

  return (
    <div className="flex items-center p-4 border-t border-gray-200">
      <div className="flex-shrink-0">
        <Image
          src={user?.profileImageUrl || DEFAULT_USER_IMG}
          alt={`${user?.firstName || "User"} ${user?.lastName || ""}`.trim()}
          width={32}
          height={32}
          className="rounded-full"
          priority={false}
          unoptimized={user?.profileImageUrl?.startsWith("data:")} // Handle base64 images
        />
      </div>
      <div className="flex-1 ml-3">
        <div className="relative">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSending}
          />
          {isSending && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleSend}
        disabled={isSending || !messageText.trim()}
        className={`ml-3 px-4 py-2 rounded-lg ${
          isSending || !messageText.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Send
      </button>
    </div>
  );
}