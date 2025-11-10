import { User } from "./user";

export interface Review {
  readonly id: string;
  rating: number;
  comment: string;
  readonly createdAt: Date;
  updatedAt: Date;
  reviewer: Partial<User>;
  seller: Partial<User>;
}
export interface ReviewsState {
  reviewsGiven: Review[];
  reviewsReceived: Review[];
}

export interface ReviewInput {
  rating: number;
  comment: string;
  sellerId: string;
}
