export interface NotificationPreferences {
  // id: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  disabledTypes: NotificationType[];
  createdAt?: Date;
  updatedAt?: Date;
  // user: User;
}

export enum NotificationType {
  TRANSACTION = "TRANSACTION",
  DISPUTE = "DISPUTE",
  VERIFICATION = "VERIFICATION",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
}
