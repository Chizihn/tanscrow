"use client";

import Image from "next/image"; // Import Next.js Image component
import { showErrorToast } from "@/components/Toast";
import { DEFAULT_USER_IMG } from "@/constants";
import { MARK_MESSAGES_AS_READ, SEND_MESSAGE } from "@/graphql/mutations/chat";
import { GET_CHAT } from "@/graphql/queries/chat";
import { MESSAGE_UPDATES, USER_TYPING } from "@/graphql/subscription/chat";
import { useAuthStore } from "@/store/auth-store";
import { Chat, Message } from "@/types/chat";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { MessageItem } from "@/components/chat/MessageItem";
import { MessageInput } from "@/components/chat/MessageInput";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

// Define interfaces for type safety
// interface MessageItemProps {
//   message: Message;
//   isCurrentUser: boolean;
//   showAvatar: boolean;
//   isLastInGroup: boolean;
// }

interface ChatItem {
  type: "date" | "message";
  id: string;
  date?: string;
  message?: Message;
  isCurrentUser?: boolean;
  showAvatar?: boolean;
  isLastInGroup?: boolean;
}

// Utility to group messages by date
const groupMessagesByDate = (messages: Message[]): ChatItem[] => {
  if (!messages?.length) return [];

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const items: ChatItem[] = [];
  let lastDate = "";
  // let lastSenderId = "";

  sortedMessages.forEach((message, index) => {
    const messageDate = new Date(message.createdAt);
    const dateString = messageDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Add date divider if date changes
    if (dateString !== lastDate) {
      items.push({ type: "date", id: `date-${dateString}`, date: dateString });
      lastDate = dateString;
      // lastSenderId = "";
    }

    const isCurrentUser = message.sender.id === useAuthStore.getState().user?.id;
    const nextMessage = sortedMessages[index + 1];
    const showAvatar =
      !isCurrentUser &&
      (!nextMessage ||
        nextMessage.sender.id !== message.sender.id ||
        new Date(nextMessage.createdAt).getTime() - messageDate.getTime() > 60000);
    const isLastInGroup =
      !nextMessage ||
      nextMessage.sender.id !== message.sender.id ||
      new Date(nextMessage.createdAt).getTime() - messageDate.getTime() > 60000;

    items.push({
      type: "message",
      id: message.id,
      message,
      isCurrentUser,
      showAvatar,
      isLastInGroup,
    });
  });

  return items;
};

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const flatListRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  // Fetch chat data
  const { data, loading, error, refetch } = useQuery<{ chat: Chat }>(GET_CHAT, {
    variables: { chatId: id },
    fetchPolicy: "cache-and-network",
  });

  // Send message mutation
  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessageText("");
      refetch();
      setTimeout(() => {
        flatListRef.current?.scrollTo({
          top: flatListRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    },
    onError: (error) => {
      showErrorToast(error.message);
      console.error("Send message error:", error);
    },
  });

  const [markAsRead] = useMutation(MARK_MESSAGES_AS_READ);

  // Subscribe to message updates
  useSubscription(MESSAGE_UPDATES, {
    variables: { chatId: id },
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.messageUpdates) {
        refetch();
        const newMessage = subscriptionData.data.messageUpdates.message;
        if (newMessage.sender.id !== user?.id) {
          markAsRead({ variables: { messageId: newMessage.id } });
        }
      }
    },
  });

  // Subscribe to typing updates
  useSubscription(USER_TYPING, {
    variables: { chatId: id },
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.userTyping) {
        const typingData = subscriptionData.data.userTyping;
        if (typingData.user.id !== user?.id) {
          setOtherUserTyping(typingData.isTyping);
        }
      }
    },
  });

  // Process messages for display
  const chatItems = useMemo(() => groupMessagesByDate(data?.chat?.messages || []), [data?.chat?.messages]);

  // Handle loading and error states
  if (loading) return <LoadingState message="Loading chat..." />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (!data?.chat) return <ErrorState message="Chat not found" />;

  const otherUser = data.chat.participants.find((p) => p?.id !== user?.id);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <Image
          src={otherUser?.profileImageUrl || DEFAULT_USER_IMG}
          alt={`${otherUser?.firstName || "User"}'s profile`}
          width={40}
          height={40}
          className="rounded-full mr-3"
          priority={false}
          unoptimized={otherUser?.profileImageUrl?.startsWith("data:")} // Handle base64 images
        />
        <div>
          <h2 className="text-lg font-medium">
            {otherUser ? `${otherUser.firstName} ${otherUser.lastName}`.trim() : "Unknown User"}
          </h2>
          {otherUserTyping && <p className="text-sm text-gray-500">is typing...</p>}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4" ref={flatListRef}>
        <div className="space-y-4">
          {chatItems.map((item) =>
            item.type === "date" ? (
              <div key={item.id} className="text-center text-gray-500 text-sm">
                {item.date}
              </div>
            ) : (
              <MessageItem
                key={item.id}
                message={item.message!}
                isCurrentUser={item.isCurrentUser!}
                showAvatar={item.showAvatar!}
                isLastInGroup={item.isLastInGroup!}
              />
            )
          )}
        </div>
      </div>

      {/* Message input */}
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        onSend={() => {
          if (messageText.trim()) {
            sendMessage({
              variables: { chatId: id, message: messageText },
            });
          }
        }}
        isSending={sendingMessage}
      />
    </div>
  );
}