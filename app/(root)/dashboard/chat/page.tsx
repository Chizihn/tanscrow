"use client";

import EmptyChatState from "@/components/chat/EmptyChatState";



export default function ChatsPage() {

  return (

    <div className="h-full flex items-center justify-center">

        <EmptyChatState title="Select a chat" message="Select a chat from the list to view the conversation." />

    </div>

  );

}
