import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import PageMeta from "@/components/_archives/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "@/components/auth/SignInForm";

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const toastShown = useRef(false);

  useEffect(() => {
    if (
      searchParams.get("auth_status") === "unauthenticated" &&
      !toastShown.current
    ) {
      toast.warning("Unauthorized access, please sign-in");
      toastShown.current = true;
    }
  }, [searchParams]);

  return (
    <>
      <PageMeta title="Sign In" />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
