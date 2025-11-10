"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onTypingChange,
  disabled = false,
  placeholder = "Type a message...",
  className,
}: MessageInputProps) {
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      onTypingChange?.(true);
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
      onTypingChange?.(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmedMessage = value.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      if (isTyping) {
        setIsTyping(false);
        onTypingChange?.(false);
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [value]);

  // Clean up typing indicator on unmount
  useEffect(() => {
    return () => {
      if (isTyping) {
        onTypingChange?.(false);
      }
    };
  }, [isTyping, onTypingChange]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-end rounded-lg border bg-background">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full resize-none border-0 bg-transparent p-3 pr-16 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
          style={{ minHeight: "44px", maxHeight: "150px" }}
        />
        <div className="absolute bottom-2 right-2 flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            disabled={disabled}
          >
            <span className="text-xs">Attach</span>
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 px-3"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
          >
            <span className="text-xs">Send</span>
          </Button>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
        {disabled && (
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="mr-1">🔄</span>
            Sending...
          </div>
        )}
      </div>
    </div>
  );
}
