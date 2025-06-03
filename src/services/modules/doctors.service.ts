import { toast } from "react-toastify";
import { $baseApi } from "../api.service";

interface Doctor {
  PRCNumber: string;
  PhysicianName: string;
  Email: string;
  ContactNumber: string;
  ProfessionalTaxReceipt: string | null;
  PhilHealthAccreditationNumber: string;
  S2LicenseNumber: string | null;
  TIN: string;
}

export const useDoctorsService = () => {
  const getDoctors = async (): Promise<Doctor[]> => {
    return await $baseApi
      .get<Doctor[]>("/doctors")
      .then((response) => response.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          throw new Error("Unauthorized access");
        }
        throw error;
      });
  };

  const sendWelcomeEmail = async (email: string) => {
    toast.info("Processing ...");
    return await $baseApi
      .post("/auth/nephrologist/welcome-email", { email })
      .then(() => {
        toast.dismiss();
        toast.success("Welcome email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending welcome email:", error);
        toast.error("Failed to send welcome email");
        throw error;
      });
  };

  return { getDoctors, sendWelcomeEmail };
};
