import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useSearchParams, useNavigate } from "react-router";
import { ChevronLeftIcon } from "@/icons";
import Label from "./../_archives/form/Label";
import Input from "./../_archives/form/input/InputField";
import Checkbox from "./../_archives/form/input/Checkbox";
import { useAuthService } from "@/services/modules/auth.service";

type FormCondition =
  | "verified"
  | "failed"
  | "used"
  | "details-incorrect"
  | "success"
  | null;

export default function NephrologistVerifyForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formCondition, setFormCondition] = useState<FormCondition>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [formData, setFormData] = useState({
    lastName: "",
    prcLicense: "",
    tinNumber: "",
    email: searchParams.get("email") || "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const { verifyDoctorCredentials, registerNephrologist } = useAuthService();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAccount = async () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!consentAgreed) {
      toast.error("You must agree to the Terms of Use and Privacy Policy");
      return;
    }

    setIsLoading(true);
    try {
      await registerNephrologist({
        name: formData.lastName,
        prcLicenseNumber: formData.prcLicense,
        tinNumber: formData.tinNumber,
        email: formData.email,
        password: formData.password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      // Error handling is now done in the service
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2">
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-success-50 dark:bg-success-900/20">
              <svg
                className="w-10 h-10 text-success-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
              Hooray doctor, you've successfully created your account
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Redirecting to sign-in page...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = async () => {
    if (!formData.lastName || !formData.prcLicense || !formData.tinNumber) {
      toast.error("Fields required");
      return;
    }

    setIsLoading(true);
    setFormCondition(null);
    setShowBanner(true);
    try {
      const response = await verifyDoctorCredentials({
        last_name: formData.lastName,
        prc_license_number: formData.prcLicense,
        tin_number: formData.tinNumber,
      });

      if (response.is_verified) {
        setFormCondition("verified");
        setShowAdditionalFields(true);
      } else {
        setFormCondition("failed");
      }
    } catch (error) {
      setFormCondition("failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getBannerContent = () => {
    switch (formCondition) {
      case "verified":
        return {
          className: "bg-green-500/10 border border-green-500",
          text: "Hooray! Last name, PRC License Number, and TIN Number are all verified!",
        };
      case "failed":
        return {
          className: "bg-error-500/10 border border-error-500",
          text: "Verification failed, provided details are incorrect.",
        };
      case "used":
        return {
          className: "bg-warning-500/10 border border-warning-500",
          text: "Verification failed, provided details are already used.",
        };
      case "details-incorrect":
        return {
          className: "bg-warning-500/10 border border-warning-500",
          text: "Provided details appear to be incorrect. Please check and try again.",
        };
      default:
        return null;
    }
  };

  const banner = getBannerContent();

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to sign in
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Welcome to CuraKidney!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please provide the requested details below to verify and confirm
              creation of your account.
            </p>
          </div>

          <div className="transition-all duration-200 ease-in-out">
            <form>
              <div className="space-y-5">
                {banner && showBanner && (
                  <div
                    className={`${banner.className} rounded-xl p-3 relative`}
                  >
                    <button
                      type="button"
                      onClick={() => setShowBanner(false)}
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <svg
                        className="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <p className="text-sm text-gray-800 dark:text-gray-200 pr-6">
                      {banner.text}
                    </p>
                  </div>
                )}
                <div>
                  <Label>
                    Last Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <Label>
                    PRC License Number
                    <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="prcLicense"
                    name="prcLicense"
                    value={formData.prcLicense}
                    onChange={handleInputChange}
                    placeholder="Enter your PRC license number"
                  />
                </div>

                <div>
                  <Label>
                    TIN Number<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="tinNumber"
                    name="tinNumber"
                    value={formData.tinNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your TIN number"
                  />
                </div>

                {showAdditionalFields && (
                  <>
                    <div>
                      <Label>
                        E-mail (pre-filled)
                        <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your e-mail"
                        disabled={true} // Add this to make it read-only
                      />
                    </div>

                    <div>
                      <Label>
                        Password<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter desired password"
                      />
                    </div>

                    <div>
                      <Label>
                        Re-type Password
                        <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-enter desired password"
                      />
                    </div>

                    {/* Consent Agreement Section */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          className="w-5 h-5"
                          checked={consentAgreed}
                          onChange={setConsentAgreed}
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          By registering you agree to our{" "}
                          <Link
                            to="/system/content/data-policy"
                            className="text-brand-500 hover:underline"
                          >
                            Data Retention Policy
                          </Link>
                          and our{" "}
                          <Link
                            to="/system/content/privacy-notice"
                            className="text-brand-500 hover:underline"
                          >
                            Privacy Notice
                          </Link>
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <button
                    type="button"
                    onClick={
                      showAdditionalFields ? handleCreateAccount : handleVerify
                    }
                    disabled={
                      isLoading || (showAdditionalFields && !consentAgreed)
                    }
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
                  >
                    {isLoading
                      ? showAdditionalFields
                        ? "Creating Account..."
                        : "Verifying..."
                      : showAdditionalFields
                      ? "Create Account"
                      : "Verify Details"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
