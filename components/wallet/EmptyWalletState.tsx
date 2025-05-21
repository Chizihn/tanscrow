"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Wallet as WalletIcon, CreditCard, TrendingUp } from "lucide-react";

interface EmptyWalletStateProps {
  onCreateWallet: () => void;
  isLoading: boolean;
}

export default function EmptyWalletState({
  onCreateWallet,
  isLoading,
}: EmptyWalletStateProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
          <p className="text-muted-foreground">
            Manage your funds and transactions
          </p>
        </div>
      </div>

      {/* Create Wallet CTA */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="text-center pb-0">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <WalletIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Create Your Wallet</h3>
          </CardHeader>

          <CardContent className="text-center pt-4 pb-0">
            <p className="text-muted-foreground max-w-md mx-auto">
              You don&apos;t have a wallet yet. Create one to manage your funds,
              make deposits, and handle transactions securely.
            </p>
          </CardContent>

          <CardFooter className="flex justify-center pb-6 pt-6">
            <Button
              size="lg"
              onClick={onCreateWallet}
              disabled={isLoading}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  Creating...
                </>
              ) : (
                "Create Wallet"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Wallet Features */}
      <div className="grid md:grid-cols-3 gap-4 pt-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mb-3 flex items-center justify-center">
              <WalletIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Secure Funds</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep your money secure in our digital wallet with
              industry-standard encryption and protection.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mb-3 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Escrow Services</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Safely transact with our escrow service that protects both buyers
              and sellers during transactions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mb-3 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Transaction History</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track all your financial activities with detailed transaction
              records and statements.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// "use client";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Wallet as WalletIcon } from "lucide-react";

// interface EmptyWalletStateProps {
//   onCreateWallet: () => void;
//   isLoading: boolean;
// }

// export default function EmptyWalletState({
//   onCreateWallet,
//   isLoading,
// }: EmptyWalletStateProps) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[400px]">
//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader className="text-center pb-0">
//           <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//             <WalletIcon className="h-8 w-8 text-primary" />
//           </div>
//           <h3 className="text-2xl font-bold">Create Your Wallet</h3>
//         </CardHeader>

//         <CardContent className="text-center pt-4 pb-6">
//           <p className="text-muted-foreground">
//             You don&apos;t have a wallet yet. Create one to manage your funds,
//             make deposits, and handle transactions securely.
//           </p>
//         </CardContent>

//         <CardFooter className="flex justify-center pb-6">
//           <Button
//             size="lg"
//             onClick={onCreateWallet}
//             disabled={isLoading}
//             className="min-w-[200px]"
//           >
//             {isLoading ? "Creating..." : "Create Wallet"}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
