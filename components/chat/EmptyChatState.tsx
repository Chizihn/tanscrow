import React from 'react';
import { MessageCircle } from 'lucide-react';

interface EmptyChatStateProps {
  title?: string;
  message?: string;
}

const EmptyChatState: React.FC<EmptyChatStateProps> = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <MessageCircle size={64} className="mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title || "No Chats Yet"}</h2>
      <p>{message || "You can start a new conversation with other users on the platform."}</p>
    </div>
  );
};

export default EmptyChatState;
