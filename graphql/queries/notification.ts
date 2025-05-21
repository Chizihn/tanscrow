import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query Notifications {
    notifications {
      id
      title
      message
      type
      isRead
      relatedEntityId
      relatedEntityType
      createdAt
      updatedAt
    }
  }
`;
