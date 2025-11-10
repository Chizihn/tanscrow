import { gql } from "@apollo/client";

export const USER_REVIEWS_GIVEN = gql`
  query UserReviewsGiven {
    userReviewsGiven {
      id
      rating
      comment
      reviewer {
        id
        firstName
        lastName
        profileImageUrl
      }
      seller {
        id
        firstName
        lastName
        profileImageUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const USER_REVIEWS_RECEIVED = gql`
  query UserReviewsReceived {
    userReviewsReceived {
      id
      rating
      comment
      reviewer {
        id
        firstName
        lastName
        profileImageUrl
      }
      seller {
        id
        firstName
        lastName
        profileImageUrl
      }
      createdAt
      updatedAt
    }
  }
`;
