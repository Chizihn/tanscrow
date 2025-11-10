import { gql } from "@apollo/client";

export const CHAT_UPDATES = gql`
  subscription ChatUpdates {
    chatUpdates {
      chat {
        id
      }
    }
  }
`;

export const MESSAGE_UPDATES = gql`
  subscription MessageUpdates($chatId: String!) {
    messageUpdates(chatId: $chatId) {
      message {
        id

        sender {
          id
          firstName
          email
          profileImageUrl
          lastName
        }
        content
        attachments {
          id
          url
          fileType
          fileName
        }
        createdAt
      }
      type
      recipient {
        id
        firstName
        email
        profileImageUrl
        lastName
      }
    }
  }
`;

export const USER_TYPING = gql`
  subscription UserTyping($chatId: String!) {
    userTyping(chatId: $chatId) {
      chatId
      user {
        id
        firstName
        email
        profileImageUrl
        lastName
      }
      isTyping
    }
  }
`;
