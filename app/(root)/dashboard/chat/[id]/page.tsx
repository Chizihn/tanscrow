// app/chat/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { showErrorToast } from "@/components/Toast";
import { DEFAULT_USER_IMG } from "@/constants";
import { MARK_MESSAGES_AS_READ, SEND_MESSAGE } from "@/graphql/mutations/chat";
import { GET_CHAT } from "@/graphql/queries/chat";
import { MESSAGE_UPDATES, USER_TYPING } from "@/graphql/subscription/chat";
import { useAuthStore } from "@/store/auth-store";
import { Chat } from "@/types/chat";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { MessageItem } from "@/components/chat/MessageItem";
import { MessageInput } from "@/components/chat/MessageInput";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserPresence } from "@/hooks/useUserPresence";

export default function ChatPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ chat: Chat }>(GET_CHAT, {
    variables: { chatId: id },
    fetchPolicy: "cache-and-network",
  });

  const otherUser = data?.chat?.participants?.find((p) => p?.id !== user?.id);
  const otherUserId = otherUser?.id;
  const { presence, loading: presenceLoading } = useUserPresence(otherUserId);

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessageText("");
      refetch();
    },
    onError: (err) => {
      showErrorToast(err.message);
    },
  });

  const [markAsRead] = useMutation(MARK_MESSAGES_AS_READ);

  useSubscription(MESSAGE_UPDATES, {
    variables: { chatId: id },
    onData: ({ data: subData }) => {
      if (subData?.data?.messageUpdates) {
        refetch();
        const newMsg = subData.data.messageUpdates.message;
        if (newMsg.sender.id !== user?.id) {
          markAsRead({ variables: { messageId: newMsg.id } });
        }
      }
    },
  });

  useSubscription(USER_TYPING, {
    variables: { chatId: id },
    onData: ({ data: subData }) => {
      if (subData?.data?.userTyping) {
        const { user: typingUser, isTyping } = subData.data.userTyping;
        if (typingUser.id !== user?.id) {
          setOtherUserTyping(isTyping);
        }
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.chat?.messages, otherUserTyping]);

  if (loading || presenceLoading)
    return <LoadingState message="Loading chat..." className="h-full" />;
  if (error)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (!data?.chat) return <ErrorState message="Chat not found" />;

  const lastSeenDate = presence.lastSeen ? new Date(presence.lastSeen) : null;

  return (
    <>
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={otherUser?.profileImageUrl || DEFAULT_USER_IMG}
                  />
                  <AvatarFallback>
                    {otherUser?.firstName?.[0]}
                    {otherUser?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold">
                      {otherUser
                        ? `${otherUser.firstName} ${otherUser.lastName}`.trim()
                        : "Unknown User"}
                    </h2>
                    {presence.isOnline && (
                      <Badge variant="success" className="h-4 px-1.5 text-xs">
                        Online
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {presence.isOnline
                      ? "Active now"
                      : lastSeenDate
                      ? `Last seen ${format(
                          lastSeenDate,
                          "MMM d, yyyy h:mm a"
                        )}`
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-4 space-y-4 pb-20">
          {data.chat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
              <p>No messages yet. Say hi!</p>
            </div>
          ) : (
            <>
              {(() => {
                let lastDate = "";
                return data.chat.messages.map((message) => {
                  const msgDate = new Date(
                    message.createdAt
                  ).toLocaleDateString();
                  const showDate = msgDate !== lastDate;
                  if (showDate) lastDate = msgDate;

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center text-muted-foreground text-sm my-4">
                          {format(
                            new Date(message.createdAt),
                            "EEEE, MMMM d, yyyy"
                          )}
                        </div>
                      )}
                      <MessageItem
                        message={message}
                        isCurrentUser={message.sender.id === user?.id}
                      />
                    </div>
                  );
                });
              })()}
            </>
          )}

          {otherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground animate-pulse">
                {otherUser?.firstName} is typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* FIXED INPUT — ALWAYS VISIBLE */}
      <div className="fixed inset-x-0 bottom-0 bg-background border-t">
        <div className="container mx-auto max-w-4xl p-4">
          <MessageInput
            value={messageText}
            onChange={setMessageText}
            onSend={(txt) => {
              if (txt.trim()) {
                sendMessage({
                  variables: { chatId: id, content: txt, attachmentIds: [] },
                });
              }
            }}
            disabled={sendingMessage}
            placeholder="Type a message..."
          />
        </div>
      </div>
    </>
  );
}
