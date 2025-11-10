
"use client";

import { useQuery } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import { GET_MYCHATS } from "@/graphql/queries/chat";
import { Chat, Chats } from "@/types/chat";
import { useAuthStore } from "@/store/auth-store";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { ChatListItem } from "@/components/chat/ChatListItem";
import EmptyChatState from "@/components/chat/EmptyChatState";

export function ChatList() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const params = useParams();

  const { data, loading, error, refetch } = useQuery<{ myChats: Chats }>(
    GET_MYCHATS,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  if (data?.myChats.length === 0) {
    return <EmptyChatState />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {data?.myChats.map((chat: Chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            currentUserId={user?.id || ""}
            isSelected={params.id === chat.id}
            onClick={() => handleChatClick(chat.id)}
          />
        ))}
      </div>
    </div>
  );
}
