import PageMeta from "@/components/_archives/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import NephrologistVerifyForm from "@/components/auth/NephrologistVerifyForm";

export default function SignUp() {
  return (
    <>
      <PageMeta title="Nephrologist Account Creation" />
      <AuthLayout>
        <NephrologistVerifyForm />
      </AuthLayout>
    </>
  );
}
