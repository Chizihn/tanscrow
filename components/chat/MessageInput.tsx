"use client"

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { DEFAULT_USER_IMG } from "@/constants";

interface MessageInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
  isTyping: boolean;
}

export function MessageInput({ onSend, isSending, isTyping }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const user = useAuthStore((state) => state.user);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="flex items-center p-4 border-t border-gray-200">
      <div className="flex-shrink-0">
        <img
          src={user?.profileImageUrl || DEFAULT_USER_IMG}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
      <div className="flex-1 ml-3">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        disabled={isSending || !message.trim()}
        className={`ml-3 px-4 py-2 rounded-lg ${
          isSending || !message.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Send
      </button>
    </div>
  );
}
