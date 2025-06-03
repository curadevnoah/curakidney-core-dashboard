import { $baseApi } from "../api.service";

interface PatientTreatment {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName: string;
  treatmentType: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  notes: string;
  amount: number;
  paymentStatus: "PENDING" | "PAID";
}

export const usePatientTreatmentsService = () => {
  const getPatientTreatments = async (): Promise<PatientTreatment[]> => {
    return await $baseApi
      .get<PatientTreatment[]>("/patient-treatments")
      .then((response) => response.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          throw new Error("Unauthorized access");
        }
        throw error;
      });
  };

  const updatePaymentStatus = async (treatmentIds: number[]): Promise<void> => {
    return await $baseApi
      .post("/patient-treatments/send-payment-status-update", { treatmentIds })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          throw new Error("Unauthorized access");
        }
        throw error;
      });
  };

  return { getPatientTreatments, updatePaymentStatus };
};
