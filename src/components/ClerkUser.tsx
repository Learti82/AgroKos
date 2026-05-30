"use client";

import { UserButton } from "@clerk/nextjs";
import { hasClerk } from "@/lib/config";

// Clerk's account menu — only rendered when Clerk is configured.
export function ClerkUser() {
  if (!hasClerk) return null;
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{ elements: { avatarBox: "h-8 w-8" } }}
    />
  );
}
