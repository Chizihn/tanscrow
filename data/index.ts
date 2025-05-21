import { DisputeStatus } from "@/types/dispute";
import { TransactionStatus } from "@/types/transaction";

// Mock data - would be fetched from API in a real implementation
const user = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  id: "123",
};

const disputes = [
  {
    id: "1",
    transactionId: "1",
    transaction: {
      id: "1",
      title: "Website Development",
      transactionCode: "TRX-001",
      amount: 150000,
      status: TransactionStatus.DISPUTED,
    },
    initiatorId: "123",
    initiator: {
      id: "123",
      firstName: "John",
      lastName: "Doe",
    },
    status: DisputeStatus.OPENED,
    reason: "Delayed delivery",
    description:
      "The seller has not delivered the work as per the agreed timeline.",
    createdAt: new Date(2023, 5, 20),
    updatedAt: new Date(2023, 5, 20),
    evidence: [
      {
        id: "1",
        evidenceType: "Chat Screenshot",
        evidenceUrl: "/evidence/chat.jpg",
        submittedBy: "123",
      },
    ],
  },
  {
    id: "2",
    transactionId: "4",
    transaction: {
      id: "4",
      title: "Content Writing",
      transactionCode: "TRX-004",
      amount: 45000,
      status: TransactionStatus.DISPUTED,
    },
    initiatorId: "456",
    initiator: {
      id: "456",
      firstName: "Jane",
      lastName: "Smith",
    },
    status: DisputeStatus.IN_REVIEW,
    reason: "Quality issues",
    description:
      "The delivered content does not meet the agreed quality standards.",
    createdAt: new Date(2023, 5, 18),
    updatedAt: new Date(2023, 5, 19),
    evidence: [
      {
        id: "2",
        evidenceType: "Document",
        evidenceUrl: "/evidence/document.pdf",
        submittedBy: "456",
      },
    ],
  },
];

export { user, disputes };
