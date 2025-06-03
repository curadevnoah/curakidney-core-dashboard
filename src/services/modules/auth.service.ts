import { toast } from "react-toastify";
import { $baseApi } from "./../api.service";
import { useAuthStore } from "@/store/auth.store";
import { UserRoles } from "@/types/user-roles.type";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: {
      id: number;
      name: string;
    };
  };
}

interface VerifyCredentialsRequest {
  last_name: string;
  prc_license_number: string;
  tin_number: string;
}

interface VerifyCredentialsResponse {
  is_verified: boolean;
}

interface RegisterNephrologistRequest {
  name: string;
  prcLicenseNumber: string;
  tinNumber: string;
  email: string;
  password: string;
}

export const useAuthService = () => {
  const { setAuthData } = useAuthStore();

  const verifyDoctorCredentials = async (
    credentials: VerifyCredentialsRequest
  ): Promise<VerifyCredentialsResponse> => {
    return $baseApi
      .post<VerifyCredentialsResponse>(
        "/auth/nephrologist/verify-credentials",
        credentials
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || "Failed to verify credentials";
        toast.error(message);
        throw error;
      });
  };

  const signinUser = async (
    credentials: LoginCredentials,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return $baseApi
      .post<LoginResponse>("/auth/login", credentials)
      .then((response) => {
        const { access_token, user } = response.data;
        const token_expires_at = new Date(
          JSON.parse(atob(access_token.split(".")[1])).exp * 1000
        ).toISOString();

        setAuthData({
          token: access_token,
          token_expires_at,
          user: {
            id: user.id.toString(),
            email: user.email,
            firstName: user.name,
            role: user.role.name,
          },
          account_enabled: true,
          session: response.data.refresh_token,
        });

        setTimeout(() => {
          if (user.role.name === UserRoles.NEPHROLOGIST) {
            toast.info("Authenticated, please verify OTP...");
            window.location.href = "/verify-otp";
          }

          if (user.role.name === UserRoles.STAFF) {
            window.location.href = "/staff/dashboard";
          }
        }, 2500);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response?.status === 401) {
          toast.error("Invalid credentials provided, try again");
        }
      });
  };

  const verifyOTP = async (otp: string) => {
    if (otp.length === 6 && !isNaN(Number(otp))) {
      toast.success("OTP verified successfully!");
      setTimeout(() => {
        window.location.href = "/nephrologist/dashboard";
      }, 1500);
      return true;
    }
    toast.error("Invalid OTP");
    return false;
  };

  const signoutUser = () => {
    useAuthStore.getState().clearAuth();
  };

  const registerNephrologist = async (
    data: RegisterNephrologistRequest
  ): Promise<void> => {
    return $baseApi
      .post("/auth/nephrologist/register", data)
      .then((response) => {
        if (response.status !== 201) {
          throw new Error("Registration failed");
        }
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || "Failed to create account";
        toast.error(message);
        throw error;
      });
  };

  return {
    signinUser,
    signoutUser,
    verifyOTP,
    verifyDoctorCredentials,
    registerNephrologist,
  };
};
