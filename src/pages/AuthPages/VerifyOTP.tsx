import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import PageMeta from "@/components/_archives/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import { useAuthService } from "@/services/modules/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { verifyOTP } = useAuthService();
  const { user } = useAuthStore();

  // Redirect if not authenticated or not a nephrologist
  if (!user || user.role !== "nephrologist") {
    navigate("/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyOTP(otp);
    } catch (error) {
      toast.error("OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Verify OTP" />
      <AuthLayout>
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2">
          <div className="flex flex-col lg:justify-center flex-1 w-full max-w-md mx-auto pt-10 lg:pt-0">
            <div className="mb-8">
              <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Two-Factor Authentication
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Please enter the 6-digit code sent to your email
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="otp"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white/90"
                >
                  OTP Code
                </label>
                <input
                  type="text"
                  id="otp"
                  maxLength={6}
                  className="w-full px-4 py-2.5 text-gray-800 border rounded-lg dark:text-white/90 dark:bg-gray-800 dark:border-gray-700"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
