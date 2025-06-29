import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query Users {
    users {
      users {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        accountType
        verified
        createdAt
        updatedAt
        addressId
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_USER = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      phoneNumber
      profileImageUrl
      verified
      createdAt
      updatedAt

      reviewsReceived {
        id
        rating
        comment
        reviewer {
          id
          firstName
          lastName
          profileImageUrl
        }

        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ADMIN_DASHBOARD_STATS = gql`
  query GetAdminDashboardStats {
    getAdminDashboardStats {
      totalUsers
      totalTransactions
      activeDisputes
      totalTransactionVolume
    }
  }
`;

export const TRANSACTION_REPORT = gql`
  query TransactionReport($dateRange: ReportDateRangeInput!) {
    transactionReport(dateRange: $dateRange) {
      totalTransactions
      totalAmount
      totalEscrowFees
      completedTransactions
      canceledTransactions
      disputedTransactions
      averageTransactionAmount
      statusBreakdown {
        status
        count
      }
    }
  }
`;

export const GET_PAYMENT_DETAILS = gql`
  query Query($reference: String!) {
    getPaymentDetails(reference: $reference)
  }
`;

export const GET_DISPUTE_REPORT = gql`
  query DisputeReport($dateRange: ReportDateRangeInput!) {
    disputeReport(dateRange: $dateRange) {
      totalDisputes
      resolvedDisputes
      pendingDisputes
      averageResolutionTime
      disputeRate
    }
  }
`;

export const GET_FILTERED_DISPUTES = gql`
  query GetFilteredDisputes($filter: DisputeFilterInput!) {
    getFilteredDisputes(filter: $filter) {
      id
      status
      reason
    }
  }
`;

export const GET_DISPUTE = gql`
  query Dispute($disputeId: String!) {
    dispute(id: $disputeId) {
      id
      transaction {
        id
        transactionCode
        seller {
          id
          email
          firstName
          lastName
          phoneNumber
          profileImageUrl
          accountType
          verified
        }
        buyer {
          id
          email
          firstName
          lastName
          phoneNumber
          profileImageUrl
          accountType
          verified
        }
        title
        description
        paymentCurrency
        amount
        escrowFee
        totalAmount
        paymentReference
        status
        escrowStatus
        deliveryMethod
        trackingInfo
        expectedDeliveryDate
        actualDeliveryDate
        isPaid
        type
        createdAt
        updatedAt
        completedAt
        canceledAt
        refundedAt
      }
      initiator {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        accountType
        verified
      }
      moderator {
        id
        firstName
        email
        lastName
        profileImageUrl
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

export const GET_FILTERED_TRANSACTIONS = gql`
  query GetFilteredTransactions($filter: TransactionFilterInput!) {
    getFilteredTransactions(filter: $filter) {
      id
      transactionCode
      seller {
        id
        lastName
        firstName
        email
      }
      buyer {
        id
        lastName
        firstName
        email
      }
      title
      description
      paymentCurrency
      amount
      escrowFee
      totalAmount
      paymentReference
      status
      escrowStatus
      deliveryMethod
      trackingInfo
      expectedDeliveryDate
      actualDeliveryDate
      isPaid
      type
      createdAt
      updatedAt
      completedAt
      canceledAt
      refundedAt
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query Transactions {
    transactions {
      id
      transactionCode
      buyer {
        id
      }
      seller {
        id
        firstName
        lastName
      }
      title
      description
      paymentCurrency
      amount
      escrowFee
      totalAmount
      paymentReference
      status
      escrowStatus
      deliveryMethod
      trackingInfo
      expectedDeliveryDate
      actualDeliveryDate
      isPaid
      type
      createdAt
      updatedAt
      completedAt
      canceledAt
      refundedAt
    }
  }
`;

export const RELEASE_ESCROW = gql`
  mutation ReleaseEscrow($input: ReleaseEscrowInput!) {
    releaseEscrow(input: $input) {
      id
      transactionCode

      amount
      escrowFee
      totalAmount
      paymentReference
      status
      escrowStatus
      deliveryMethod
      trackingInfo
      expectedDeliveryDate
      actualDeliveryDate
      isPaid
      type
      createdAt
      updatedAt
      completedAt
      canceledAt
      refundedAt
    }
  }
`;

export const RESOLVE_DISPURE = gql`
  mutation ResolveDispute($input: DisputeManagementInput!) {
    resolveDispute(input: $input)
  }
`;

export const UPDATE_USER_MANAGEMENT = gql`
  mutation UpdateUserManagement($input: UserManagementInput!) {
    updateUserManagement(input: $input) {
      id
      email
      firstName
      lastName
      phoneNumber
      profileImageUrl
      accountType
      verified
      createdAt
      updatedAt
    }
  }
`;

export const REVIEW_VERIFICATION_DOCUMENTS = gql`
  mutation ReviewVerificationDocument(
    $input: ReviewVerificationDocumentInput!
  ) {
    reviewVerificationDocument(input: $input) {
      id
      userId
      documentType
      documentNumber
      documentUrl
      verificationStatus
      submittedAt
      verifiedAt
      rejectionReason
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SYSTEM_CONFIG = gql`
  mutation UpdateSystemConfig($input: SystemConfigInput!) {
    updateSystemConfig(input: $input) {
      id
      key
      value
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_SYSTEMN_CONFIGS = gql`
  query GetSystemConfigs {
    getSystemConfigs {
      id
      key
      value
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($take: Int, $skip: Int, $filter: AuditLogFilter) {
    getAuditLogs(take: $take, skip: $skip, filter: $filter) {
      items {
        id
        entityType
        action
        category
        details
        ipAddress
        userAgent
        createdAt
      }
      total
      hasMore
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query Notifications {
    notifications {
      id
      title
      message
      type
      isRead
      relatedEntityType
      createdAt
    }
  }
`;

export const GET_FILTERED_WITHDRAWALS = gql`
  query GetFilteredWithdrawals($filter: WithdrawalFilterInput!) {
    getFilteredWithdrawals(filter: $filter) {
      id
      amount
      currency
      type
      reference
      status
      description
      balanceBefore
      balanceAfter
      createdAt
      updatedAt
      wallet {
        id
        userId
        currency
        balance
        escrowBalance
        isActive
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
          email
          phoneNumber
          profileImageUrl
        }
      }
    }
  }
`;

export const CONFIRM_WITHDRAWAL = gql`
  mutation ConfirmWithdrawal($confirmWithdrawalId: ID!) {
    confirmWithdrawal(id: $confirmWithdrawalId) {
      id
      userId
      bankName
      accountNumber
      accountName
      bankCode
      amount
      currency
      reference
      status
      failureReason
      createdAt
      updatedAt
    }
  }
`;
