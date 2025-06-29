"use client"

import { showErrorToast } from "@/components/Toast";
import { DEFAULT_USER_IMG } from "@/constants";
import { MARK_MESSAGES_AS_READ, SEND_MESSAGE } from "@/graphql/mutations/chat";
import { GET_CHAT } from "@/graphql/queries/chat";
import { MESSAGE_UPDATES, USER_TYPING } from "@/graphql/subscription/chat";
import { useAuthStore } from "@/store/auth-store";
import { Chat, Message } from "@/types/chat";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageItem } from "@/components/chat/MessageItem";
import { MessageInput } from "@/components/chat/MessageInput";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  isLastInGroup: boolean;
}

interface ChatItem {
  type: 'date' | 'message';
  id: string;
  date?: string;
  message?: Message;
  isCurrentUser?: boolean;
  showAvatar?: boolean;
  isLastInGroup?: boolean;
}

// Group messages by date and user
const groupMessages = (messages: Message[]) => {
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = new Date(message.createdAt).toLocaleDateString("en-US");
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  return groupedMessages;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<HTMLDivElement | null>(null);
  const [messageText, setMessageText] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState<boolean>(false);

  const { data, loading, error, refetch } = useQuery<{ chat: Chat }>(GET_CHAT, {
    variables: { chatId: id },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessageText("");
      refetch();
      // Scroll to bottom after sending message
      setTimeout(() => {
        flatListRef.current?.scrollTo({
          top: flatListRef.current?.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
      console.error("Send message error:", error);
    },
  });

  const [markAsRead] = useMutation(MARK_MESSAGES_AS_READ);

  // Subscribe to new messages
  useSubscription(MESSAGE_UPDATES, {
    variables: { chatId: id },
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.messageUpdates) {
        refetch();
        // Mark message as read if it's not from current user
        const newMessage = subscriptionData.data.messageUpdates.message;
        if (newMessage.sender.id !== user?.id) {
          markAsRead({ variables: { messageId: newMessage.id } });
        }
      }
    },
  });

  // Subscribe to typing indicators
  useSubscription(USER_TYPING, {
    variables: { chatId: id },
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.userTyping) {
        const typingData = subscriptionData.data.userTyping;
        if (typingData.user.id !== user?.id) {
          setOtherUserTyping(typingData.isTyping);
        }
      }
    },
  });

  // Process messages with date dividers and grouping logic
  const processedChatItems = useMemo<ChatItem[]>(() => {
    if (!data?.chat?.messages) return [];

    const messages = [...data.chat.messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const items: ChatItem[] = [];
    let lastDate = "";
    let lastSenderId = "";

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt);
      const dateString = messageDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Add date divider if date changed
      if (dateString !== lastDate) {
        items.push({
          type: "date",
          id: `date-${dateString}`,
          date: dateString,
        });
        lastDate = dateString;
        lastSenderId = ""; // Reset sender grouping on new date
      }

      const isCurrentUser = message.sender.id === user?.id;
      const nextMessage = messages[index + 1];
      const prevMessage = messages[index - 1];

      // Determine if this message should show avatar and if it's the last in a group
      const showAvatar =
        !isCurrentUser &&
        (!nextMessage ||
          nextMessage.sender.id !== message.sender.id ||
          new Date(nextMessage.createdAt).getTime() - messageDate.getTime() >
            60000); // 1 minute gap

      const isLastInGroup =
        !nextMessage ||
        nextMessage.sender.id !== message.sender.id ||
        new Date(nextMessage.createdAt).getTime() - messageDate.getTime() >
          60000; // 1 minute gap

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
  }, [data?.chat?.messages, user?.id]);

  if (loading) {
    return <LoadingState message="Loading chat..." />;
  }

  if (error) {
    showErrorToast(error.message);
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  if (!data?.chat) {
    return <ErrorState message="Chat not found" />;
  }

  const otherUser = data.chat.participants.find(
    (participant) => participant?.id !== user?.id
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b border-gray-200">
        <img
          src={otherUser?.profileImageUrl || DEFAULT_USER_IMG}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-lg font-medium">
            {(otherUser?.firstName || "") + " " + (otherUser?.lastName || "")}
          </h2>
          {otherUserTyping && (
            <p className="text-sm text-gray-500">is typing...</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={flatListRef}>
        <div className="space-y-4">
          {processedChatItems.map((item) => {
            if (item.type === "date") {
              return (
                <div
                  key={item.id}
                  className="text-center text-gray-500 text-sm"
                >
                  {item.date}
                </div>
              );
            }
            return (
              <MessageItem
                key={item.id}
                message={item.message!}
                isCurrentUser={item.isCurrentUser!}
                showAvatar={item.showAvatar!}
                isLastInGroup={item.isLastInGroup!}
              />
            );
          })}
        </div>
      </div>

      <MessageInput
        onSend={() => {
          sendMessage({
            variables: {
              chatId: id,
              message: messageText,
            },
          });
        }}
        isSending={sendingMessage}
        isTyping={otherUserTyping}
      />
    </div>
  );
}
