import { SignIn } from "@clerk/nextjs";
import { AuthCard } from "@/components/AuthCard";
import { Logo } from "@/components/ui/Logo";
import { hasClerk } from "@/lib/config";

export default function SignInPage() {
  if (!hasClerk) return <AuthCard mode="sign-in" />;
  return (
    <div className="grid min-h-screen place-items-center bg-brand-cream px-4 py-10">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <SignIn appearance={{ variables: { colorPrimary: "#2D6A4F" } }} />
      </div>
    </div>
  );
}
