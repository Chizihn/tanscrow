import { gql } from "@apollo/client";

export const CREATE_WALLET = gql`
  mutation CreateWallet($input: CreateWalletInput!) {
    createWallet(input: $input) {
      id
      userId
      currency
      balance
      escrowBalance
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const FUND_WALLET = gql`
  mutation FundWallet($input: FundWalletInput!) {
    fundWallet(input: $input) {
      id
      amount
      status
      reference
    }
  }
`;
