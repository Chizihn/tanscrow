# Tanscrow User Frontend

This is the user-facing frontend for the Tanscrow escrow platform. It allows buyers and sellers to register, manage transactions, handle disputes, complete KYC, and manage their wallet in a secure, user-friendly interface.

## Features

- User registration and login (access/refresh tokens, auto-refresh)
- Profile management (update info, change password, manage KYC docs)
- Wallet: fund, withdraw, view history
- Transaction management: create, track, review, dispute
- Dispute resolution and support
- Notifications and activity history
- Mobile responsive and accessible UI
- Onboarding, tooltips, and help modals
- Polished empty/loading/error states

## Project Structure

- `app/` - Main Next.js app directory
- `components/` - UI and feature components
- `lib/` - API and utility libraries
- `styles/` - Global and component styles

## Environment Variables

Create a `.env.local` file in the frontend root:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/graphql
# Add any other required variables
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set environment variables:**
   - See above for `.env.local` example
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Usage Notes

- **Authentication:**
  - Uses access/refresh tokens, auto-refreshes tokens securely
- **Wallet/Withdrawal:**
  - Bank account name must match your government name (enforced)
- **KYC/Verification:**
  - Upload and manage verification documents
- **Transactions:**
  - Create, fund, release, dispute, and review transactions
- **Notifications:**
  - Real-time updates for key actions

## How to Test / Demo

1. **Start the backend API** (see backend README)
2. **Register as a new user** and complete onboarding
3. **Test wallet funding, withdrawal, and KYC flows**
4. **Create and manage transactions** (as buyer/seller)
5. **Trigger and resolve disputes**
6. **Check notifications and activity history**

---

For backend API details, see the backend/README.md and API docs.
