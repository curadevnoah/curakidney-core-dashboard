import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "./../_archives/form/Label";
import Input from "./../_archives/form/input/InputField";
import Checkbox from "./../_archives/form/input/Checkbox";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<
    "nephrologist" | "staff" | "patient"
  >("staff");

  const getButtonClass = (option: "nephrologist" | "staff" | "patient") =>
    selectedAccountType === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 transform scale-100"
      : "text-gray-500 dark:text-gray-400 transform scale-95 hover:scale-100";

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
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
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>

          <div className="mb-6">
            <Label>Account Type</Label>
            <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 mt-2">
              <button
                onClick={() => setSelectedAccountType("staff")}
                className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white transition-all duration-200 ease-in-out ${getButtonClass(
                  "staff"
                )}`}
              >
                Staff
              </button>

              <button
                onClick={() => setSelectedAccountType("patient")}
                className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white transition-all duration-200 ease-in-out ${getButtonClass(
                  "patient"
                )}`}
              >
                Patient
              </button>
              <button
                onClick={() => setSelectedAccountType("nephrologist")}
                className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white transition-all duration-200 ease-in-out ${getButtonClass(
                  "nephrologist"
                )}`}
              >
                Nephrologist
              </button>
            </div>
          </div>

          <div className="transition-all duration-200 ease-in-out">
            <form>
              <div className="space-y-5">
                {selectedAccountType === "nephrologist" ? (
                  <>
                    {/* <!-- Last Name --> */}
                    <div>
                      <Label>
                        Last Name<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="lname"
                        name="lname"
                        placeholder="Enter your last name"
                      />
                    </div>
                    {/* <!-- PRC License Number --> */}
                    <div>
                      <Label>
                        PRC License Number
                        <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="prcLicense"
                        name="prcLicense"
                        placeholder="Enter your PRC license number"
                      />
                    </div>
                    {/* <!-- TIN Number --> */}
                    <div>
                      <Label>
                        TIN Number<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="tin"
                        name="tin"
                        placeholder="Enter your TIN number"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* <!-- First Name --> */}
                      <div className="sm:col-span-1">
                        <Label>
                          First Name<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="fname"
                          name="fname"
                          placeholder="Enter your first name"
                        />
                      </div>
                      {/* <!-- Last Name --> */}
                      <div className="sm:col-span-1">
                        <Label>
                          Last Name<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="lname"
                          name="lname"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    {/* <!-- Email --> */}
                    <div>
                      <Label>
                        Email<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                      />
                    </div>
                    {/* <!-- Password --> */}
                    <div>
                      <Label>
                        Password<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
