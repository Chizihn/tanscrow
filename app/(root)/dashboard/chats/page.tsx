"use client";

import ErrorState from "@/components/ErrorState";
import { GET_MYCHATS } from "@/graphql/queries/chat";
import { CHAT_UPDATES } from "@/graphql/subscription/chat";
import { useAuthStore } from "@/store/auth-store";
import { Chat, Chats } from "@/types/chat";
import { useQuery, useSubscription } from "@apollo/client";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import { showErrorToast } from "@/components/Toast";
import { ChatListItem } from "@/components/chat/ChatListItem";



export default function ChatsPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery<{ myChats: Chats }>(
    GET_MYCHATS,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  // Subscribe to chat updates
  useSubscription(CHAT_UPDATES, {
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.chatUpdates) {
        // Refetch chats when there are updates
        refetch();
      }
    },
  });

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/chats/${chatId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    showErrorToast(error.message);
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  if (!data?.myChats) {
    return <p className="text-center text-gray-500">No chats found</p>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {data.myChats.map((chat: Chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            currentUserId={user?.id || ""}
            onClick={() => handleChatClick(chat.id)}
          />
        ))}
      </div>
    </div>
  );
}
