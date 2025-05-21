import { gql } from "@apollo/client";

export const GET_DISPUTES = gql`
  query Disputes {
    disputes {
      id
      status
      reason
      description
      resolution
      createdAt
      updatedAt
    }
  }
`;
export const GET_DISPUTE = gql`
  query Dispute($disputeId: String!) {
    dispute(id: $disputeId) {
      id
      transaction {
        id
        title
      }
      initiator {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        verified
        createdAt
        updatedAt
      }
      moderator {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        verified
        createdAt
        updatedAt
      }
      status
      reason
      description
      resolution
      evidence {
        id
        evidenceType
        evidenceUrl
        description
        submittedBy
        createdAt
      }
      createdAt
      updatedAt
      resolvedAt
    }
  }
`;
