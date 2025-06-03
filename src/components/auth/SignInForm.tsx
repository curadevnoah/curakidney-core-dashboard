import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "./../_archives/form/Label";
import Input from "./../_archives/form/input/InputField";
import Checkbox from "./../_archives/form/input/Checkbox";
import Button from "./../_archives/ui/button/Button";
import { useAuthService } from "@/services/modules/auth.service";

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signinUser } = useAuthService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const rememberMeValue = watch("rememberMe");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      await signinUser(
        {
          email: data.email,
          password: data.password,
        },
        setIsLoading
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign in"
      );
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setValue("rememberMe", checked, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col lg:justify-center flex-1 w-full max-w-md mx-auto pt-10 lg:pt-0">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Provide your account credentials to access your CuraKidney
              dashboard
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-6">
                {error && <div className="text-sm text-error-500">{error}</div>}
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is required",
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="Enter your email"
                    error={errors.email ? true : false}
                    hint={errors.email?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Password is required",
                        },
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      error={errors.password ? true : false}
                      hint={errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMeValue}
                      onChange={handleCheckboxChange}
                      aria-label="Remember me"
                    />
                    <Label htmlFor="rememberMe" className="!mb-0">
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Keep me logged in
                      </span>
                    </Label>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 hidden"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
