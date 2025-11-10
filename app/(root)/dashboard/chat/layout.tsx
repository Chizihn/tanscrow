// app/chat/layout.tsx
"use client";

import { ChatList } from "@/components/chat/ChatList";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-80 border-r bg-background flex flex-col">
        <ChatList />
      </aside>

      {/* Right Chat Area */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
