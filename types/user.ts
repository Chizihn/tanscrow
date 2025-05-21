import { Provider } from "./provider";
import { VerificationDocument } from "./verification";
import { Wallet } from "./wallet";

export interface User {
  readonly id?: string;
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  accountType: AccountType;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  address?: Address;
  wallet?: Wallet;
  providers: Provider[];
  verificationDocuments?: VerificationDocument[];
  // sellerProfile:
  // buyerProfile:
}

export enum AccountType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}
