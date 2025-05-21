"use client";
import TransactionForm from "@/components/transactions/create/TransactionForm";

export default function CreateTransactionPage() {
  return <TransactionForm />;
}

// "use client";
// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { CalendarIcon, ChevronRight, Loader2 } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import {
//   DeliveryMethod,
//   TransactionRole,
//   TransactionType,
// } from "@/types/transaction";
// import { PaymentCurrency } from "@/types/payment";
// import PageRouter from "@/components/PageRouter";
// import { useAuthStore } from "@/store/auth-store";
// import { User } from "@/types/user";
// import {  useMutation, useQuery } from "@apollo/client";
// import { CREATE_TRANSACTION } from "@/graphql/mutations/transaction";
// import { showErrorToast, showSuccessToast } from "@/components/Toast";
// import Link from "next/link";
// import { useTransactionStore } from "@/store/transaction-store";
// import { SEARCH_USER } from "@/graphql/queries/user";

// export default function CreateTransactionPage() {
//   const user = useAuthStore((state) => state.user) as User;
//   const [step, setStep] = useState<number>(1);
//   const [date, setDate] = useState<Date>();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     type: TransactionType.SERVICE,
//     amount: "",
//     currency: PaymentCurrency.NGN,
//     counterpartyIdentifier: "",
//     deliveryMethod: DeliveryMethod.DIGITAL,
//     termsAccepted: false,
//     role: TransactionRole.BUYER, // default role
//   });
//   const [counterParty, setCounterParty] = useState<Partial<User> | null>(null);
//   const [findUserModal, setFindUserModal] = useState<boolean>(false);
//   const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
//   const { transaction, setTransaction } = useTransactionStore();

//   const {
//     data,
//     loading: searchingUser,
//     error,
//   } = useQuery<{ searchUser: Partial<User> }>(SEARCH_USER, {
//     variables: { input: formData.counterpartyIdentifier },
//     nextFetchPolicy: "cache-first",
//     skip: !formData.counterpartyIdentifier,
//     onCompleted: (data) => {
//       if (data?.searchUser) {
//         setCounterParty(data.searchUser);
//       }
//     },
//   });

//   const [createTransaction, {loading: creatingTransaction}] = useMutation(CREATE_TRANSACTION, {
//     onCompleted: (data) => {
//       setTransaction(data?.createTransaction);
//       setTransactionSuccess(true);
//       showSuccessToast("Transaction created successfully!");
//     },
//     onError: (error) => {
//       showErrorToast(
//         error.message || "Failed to create transaction. Please try again."
//       );
//     },
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: checked }));
//   };

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   const parsedAmount = parseFloat(formData.amount || "0") || 0;
//   const rawFee = parsedAmount ? parsedAmount * 0.015 : 0;
//   const escrowFee = Math.round(rawFee * 100) / 100;
//   const totalAmount = parsedAmount + escrowFee;

//   const handleCreateTransaction = () => {
//     // Prepare transaction data
//     const transactionData = {
//       title: formData.title,
//       description: formData.description,
//       type: formData.type,
//       amount: parsedAmount,
//       paymentCurrency: formData.currency,
//       deliveryMethod: formData.deliveryMethod,
//       expectedDeliveryDate: date,
//       buyerId:
//         formData.role === TransactionRole.BUYER
//           ? (user?.id as string)
//           : (counterParty?.id as string),
//       sellerId:
//         formData.role === TransactionRole.SELLER
//           ? (user?.id as string)
//           : (counterParty?.id as string),
//     };

//     createTransaction({
//       variables: { input: transactionData },
//     });
//   };

//   // Validate form data
//   const validateStep1 = () => {
//     return formData.title && formData.description && formData.amount && date;
//   };

//   const validateStep2 = () => {
//     return formData.counterpartyIdentifier && formData.termsAccepted;
//   };

//   if (transactionSuccess) {
//     <div>
//       <p>
//         Transaction successful!
//         {transaction?.title}
//         {transaction?.description}
//         <Link href={`/dashboard/transactions/${transaction?.id as string}`}>
//           <Button>View transaction</Button>
//         </Link>
//       </p>
//     </div>;
//   }

//   return (
//     <div className=" space-y-6">
//       <div className="space-y-3">
//         <PageRouter
//           parentLabel="Back to Transactions"
//           parentPath="/dashboard/transactions"
//         />
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">
//             Create Transaction
//           </h2>
//           <p className="text-muted-foreground">
//             Set up a new escrow transaction in a few steps
//           </p>
//         </div>
//       </div>

//       {/* Progress Steps */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <div
//             className={`h-8 w-8 rounded-full flex items-center justify-center ${
//               step >= 1
//                 ? "bg-primary text-primary-foreground"
//                 : "bg-muted text-muted-foreground"
//             }`}
//           >
//             1
//           </div>
//           <span className={step >= 1 ? "font-medium" : "text-muted-foreground"}>
//             Details
//           </span>
//         </div>
//         <div className="h-0.5 flex-1 bg-muted mx-2" />
//         <div className="flex items-center space-x-2">
//           <div
//             className={`h-8 w-8 rounded-full flex items-center justify-center ${
//               step >= 2
//                 ? "bg-primary text-primary-foreground"
//                 : "bg-muted text-muted-foreground"
//             }`}
//           >
//             2
//           </div>
//           <span className={step >= 2 ? "font-medium" : "text-muted-foreground"}>
//             Counterparty
//           </span>
//         </div>
//         <div className="h-0.5 flex-1 bg-muted mx-2" />
//         <div className="flex items-center space-x-2">
//           <div
//             className={`h-8 w-8 rounded-full flex items-center justify-center ${
//               step >= 3
//                 ? "bg-primary text-primary-foreground"
//                 : "bg-muted text-muted-foreground"
//             }`}
//           >
//             3
//           </div>
//           <span className={step >= 3 ? "font-medium" : "text-muted-foreground"}>
//             Confirm
//           </span>
//         </div>
//       </div>

//       {/* Step 1: Transaction Details */}
//       {step === 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Transaction Details</CardTitle>
//             <CardDescription>
//               Provide the basic details of your transaction
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-10">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 name="title"
//                 placeholder="e.g. Website Development"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 placeholder="Description for what this transaction entails"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={4}
//                 required
//               />
//             </div>
//             {/* Role Selection */}
//             <div className="space-y-2">
//               <Label>Are you the Buyer or Seller?</Label>
//               <RadioGroup
//                 value={formData.role}
//                 onValueChange={(value) => handleSelectChange("role", value)}
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value={TransactionRole.BUYER} id="buyer" />
//                   <Label htmlFor="buyer">Buyer</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value={TransactionRole.SELLER} id="seller" />
//                   <Label htmlFor="seller">Seller</Label>
//                 </div>
//               </RadioGroup>
//             </div>

//             <div className="space-y-2">
//               <Label>Transaction Type</Label>
//               <RadioGroup
//                 defaultValue={formData.type}
//                 onValueChange={(value) => handleSelectChange("type", value)}
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem
//                     value={TransactionType.SERVICE}
//                     id="service"
//                   />
//                   <Label htmlFor="service">Service</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem
//                     value={TransactionType.DIGITAL}
//                     id="digital"
//                   />
//                   <Label htmlFor="digital">Digital Product</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem
//                     value={TransactionType.PHYSICAL}
//                     id="physical"
//                   />
//                   <Label htmlFor="physical">Physical Product</Label>
//                 </div>
//               </RadioGroup>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="amount">
//                 Amount (₦){" "}
//                 <span className="text-gray-400">
//                   (Amount both party has agreed upon)
//                 </span>{" "}
//               </Label>
//               <Input
//                 id="amount"
//                 name="amount"
//                 type="number"
//                 placeholder="Enter amount"
//                 value={formData.amount}
//                 onChange={handleInputChange}
//                 required
//               />

//               <div>Escrow fee: {escrowFee} </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Expected Delivery Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-start text-left font-normal",
//                       !date && "text-muted-foreground"
//                     )}
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {date ? format(date, "PPP") : <span>Select a date</span>}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar
//                     mode="single"
//                     selected={date}
//                     onSelect={setDate}
//                     initialFocus
//                     disabled={(d: Date) => d < new Date()}
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-end">
//             <Button onClick={nextStep} disabled={!validateStep1()}>
//               Next <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Step 2: Counterparty Details */}
//       {step === 2 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Counterparty Details</CardTitle>
//             <CardDescription>
//               Provide details about the other party in this transaction
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-10">
//             <div className="space-y-2">
//               <Label htmlFor="counterpartyEmail">
//                 Email/Phone of{" "}
//                 {formData.role === TransactionRole.BUYER ? "Buyer" : "Seller"}{" "}
//               </Label>
//               <Input
//                 id="counterpartyEmail"
//                 name="counterpartyEmail"
//                 type="email"
//                 placeholder="Enter email address or phone number"
//                 value={formData.counterpartyIdentifier}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Delivery Method</Label>
//               <Select
//                 value={formData.deliveryMethod}
//                 onValueChange={(value) =>
//                   handleSelectChange("deliveryMethod", value)
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select delivery method" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={DeliveryMethod.DIGITAL}>
//                     Digital
//                   </SelectItem>
//                   <SelectItem value={DeliveryMethod.IN_PERSON}>
//                     In Person
//                   </SelectItem>
//                   <SelectItem value={DeliveryMethod.SHIPPING}>
//                     Shipping
//                   </SelectItem>
//                   <SelectItem value={DeliveryMethod.COURIER}>
//                     Courier
//                   </SelectItem>
//                   <SelectItem value={DeliveryMethod.OTHER}>Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="termsAccepted"
//                   name="termsAccepted"
//                   checked={formData.termsAccepted}
//                   onChange={handleCheckboxChange}
//                   className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                 />
//                 <Label htmlFor="termsAccepted" className="text-sm">
//                   I agree to the{" "}
//                   <a
//                     href="/terms-of-service"
//                     className="text-primary hover:underline"
//                     target="_blank"
//                   >
//                     Terms and Conditions
//                   </a>
//                 </Label>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-between">
//             <Button variant="outline" onClick={prevStep}>
//               Back
//             </Button>
//             <Button onClick={nextStep} disabled={!validateStep2()}>
//               Next <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Step 3: Review & Confirm */}
//       {step === 3 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Review & Confirm</CardTitle>
//             <CardDescription>
//               Review your transaction details before confirming
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-10">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Transaction Title
//                 </h4>
//                 <p>{formData.title}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Transaction Type
//                 </h4>
//                 <p>{formData.type}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Amount
//                 </h4>
//                 <p>₦{parsedAmount.toLocaleString()}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Expected Delivery Date
//                 </h4>
//                 <p>{date ? format(date, "PPP") : "Not specified"}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Counterparty Email
//                 </h4>
//                 <p>{formData.counterpartyIdentifier}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Delivery Method
//                 </h4>
//                 <p>{formData.deliveryMethod}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Your Role
//                 </h4>
//                 <p className="capitalize">{formData.role}</p>
//               </div>
//             </div>

//             <div className="border-t pt-4">
//               <h4 className="text-sm font-medium mb-2">Fee Breakdown</h4>
//               <div className="space-y-1">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     Transaction Amount
//                   </span>
//                   <span>₦{parsedAmount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     Escrow Fee{" "}
//                     {formData.role === TransactionRole.BUYER
//                       ? "(1.5%)"
//                       : "(0%)"}
//                   </span>
//                   <span>
//                     ₦
//                     {escrowFee.toLocaleString(undefined, {
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//                 <div className="flex justify-between font-medium">
//                   <span>Total Amount</span>
//                   <span>
//                     ₦
//                     {totalAmount.toLocaleString(undefined, {
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-between">
//             <Button variant="outline" onClick={prevStep}>
//               Back
//             </Button>
//             <Button onClick={handleCreateTransaction} disabled={creatingTransaction}>
//               {creatingTransaction ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Create Transaction"
//               )}
//             </Button>
//           </CardFooter>
//         </Card>
//       )}
//     </div>
//   );
// }
