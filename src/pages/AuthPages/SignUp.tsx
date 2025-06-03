import PageMeta from "@/components/_archives/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta title="Account Creation" />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
