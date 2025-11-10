import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
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
