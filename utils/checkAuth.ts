import { AuthState } from "@/store/auth-store";
import { NextRequest } from "next/server";

export function checkAuth(req: NextRequest) {
  let authState: AuthState | undefined;
  try {
    const authStorage = req.cookies?.get("tanscrow-auth")?.value;
    console.log("Raw auth value:", authStorage);
    if (authStorage) {
      const decodedAuth = decodeURIComponent(authStorage);
      console.log("Decoded auth cookie:", decodedAuth);
      authState = JSON.parse(decodedAuth)?.state;
      console.log("Parsed authState:", authState);
      return authState;
    }
  } catch (error) {
    console.warn("Invalid auth cookie format:", error);
  }
  return undefined;
}
