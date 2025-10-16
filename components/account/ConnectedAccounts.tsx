"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, Phone, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type ProviderType = "EMAIL" | "PHONE" | "GOOGLE" | "FACEBOOK";

type Provider = {
  id: string;
  type: ProviderType;
  value: string;
  primary: boolean;
};

export function ConnectedAccounts({
  initialProviders,
}: {
  initialProviders: Provider[];
}) {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    provider?: Provider;
  }>({
    isOpen: false,
  });
  const [addDialog, setAddDialog] = useState<{
    isOpen: boolean;
    type: ProviderType | null;
  }>({
    isOpen: false,
    type: null,
  });
  const [newProvider, setNewProvider] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!deleteDialog.provider) return;

    setIsProcessing(true);
    try {
      // Handle delete provider mutation here
      console.log("Deleting provider:", deleteDialog.provider);

      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProviders(providers.filter((p) => p.id !== deleteDialog.provider?.id));

      toast.success(
        `The ${deleteDialog.provider.type.toLowerCase()} has been removed from your account.`,
        { className: "bg-green-500 text-white" }
      );
    } catch (error) {
      console.error("Delete provider error:", error);
      toast.error("Failed to remove provider. Please try again.", {
        className: "bg-red-600",
      });
    } finally {
      setIsProcessing(false);
      setDeleteDialog({ isOpen: false });
    }
  };

  const handleAdd = async () => {
    if (!addDialog.type || !newProvider) return;

    setIsProcessing(true);
    try {
      // TODO: Implement actual add provider mutation
      // const [addProvider] = useMutation(ADD_PROVIDER);
      // await addProvider({
      //   variables: {
      //     type: addDialog.type,
      //     value: newProvider,
      //   },
      // });

      // For now, simulate the API request until mutation is implemented
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newId = Math.random().toString(36).substring(2, 9);
      setProviders([
        ...providers,
        {
          id: newId,
          type: addDialog.type,
          value: newProvider,
          primary: providers.length === 0,
        },
      ]);

      toast.success(
        `The ${addDialog.type.toLowerCase()} has been added to your account.`
      );
    } catch (error) {
      console.error("Add provider error:", error);
      toast.error("Failed to add provider. Please try again.");
    } finally {
      setIsProcessing(false);
      setAddDialog({ isOpen: false, type: null });
      setNewProvider("");
    }
  };

  const setPrimaryProvider = async (provider: Provider) => {
    if (provider.primary) return;

    setIsProcessing(true);
    try {
      // TODO: Implement actual set primary provider mutation
      // const [setPrimaryProvider] = useMutation(SET_PRIMARY_PROVIDER);
      // await setPrimaryProvider({
      //   variables: {
      //     providerId: provider.id,
      //   },
      // });

      // For now, simulate the API request until mutation is implemented
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProviders(
        providers.map((p) => ({
          ...p,
          primary: p.id === provider.id,
        }))
      );

      toast.success(
        `The ${provider.type.toLowerCase()} is now your primary contact method.`
      );
    } catch (error) {
      console.error("Set primary provider error:", error);
      toast.error("Failed to update primary provider. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderProviderIcon = (type: ProviderType) => {
    switch (type) {
      case "EMAIL":
        return <Mail className="h-5 w-5" />;
      case "PHONE":
        return <Phone className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage the contact methods associated with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                    {renderProviderIcon(provider.type)}
                  </div>
                  <div>
                    <div className="font-medium">{provider.value}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      {provider.type}
                      {provider.primary && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ml-2">
                          Primary
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!provider.primary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrimaryProvider(provider)}
                      disabled={isProcessing}
                    >
                      Set as Primary
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => setDeleteDialog({ isOpen: true, provider })}
                    disabled={providers.length === 1 || isProcessing}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setAddDialog({ isOpen: true, type: "EMAIL" })}
              >
                <Plus className="h-4 w-4" />
                <Mail className="h-4 w-4" />
                Add Email
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setAddDialog({ isOpen: true, type: "PHONE" })}
              >
                <Plus className="h-4 w-4" />
                <Phone className="h-4 w-4" />
                Add Phone
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ isOpen: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the {deleteDialog.provider?.type.toLowerCase()}{" "}
              &quot;{deleteDialog.provider?.value}&quot; from your account.
              {deleteDialog.provider?.primary &&
                " You'll need to set a new primary contact method."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isProcessing}>
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isProcessing ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={addDialog.isOpen}
        onOpenChange={(open) =>
          !isProcessing &&
          setAddDialog({ isOpen: open, type: open ? addDialog.type : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {addDialog.type?.toLowerCase()}</DialogTitle>
            <DialogDescription>
              {addDialog.type === "EMAIL"
                ? "Add a new email address to your account"
                : "Add a new phone number to your account"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">
                  {addDialog.type === "EMAIL"
                    ? "Email Address"
                    : "Phone Number"}
                </Label>
                <Input
                  id="provider"
                  placeholder={
                    addDialog.type === "EMAIL"
                      ? "john.doe@example.com"
                      : "+1234567890"
                  }
                  type={addDialog.type === "EMAIL" ? "email" : "tel"}
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} disabled={isProcessing || !newProvider}>
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isProcessing ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
