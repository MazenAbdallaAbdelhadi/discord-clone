"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

export default function Social() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');
  
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        variant="outline"
        size="lg"
        className="w-full gap-1"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
}
