import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { ToastContainer } from "react-toastify";
import { ScrollToTop } from "@/components/_archives/common/ScrollToTop";
import { useAuthStore } from "@/store";
import Blank from "@/pages/_archives/Blank";
import AppLayout from "@/layout/AppLayout";

// System
import NotFound from "@/pages/_archives/OtherPage/NotFound";
import PrivacyNotice from "@/pages/DashboardPages/system/consent/PrivacyNotice";
import DataPolicy from "@/pages/DashboardPages/system/consent/DataPolicy";

// Shared
import MyAccount from "./pages/MyAccount";

// Auth
import SignIn from "@/pages/AuthPages/SignIn";
import SignUp from "@/pages/AuthPages/SignUp";
import VerifyOTP from "@/pages/AuthPages/VerifyOTP";
import NephrologistPreAccountCreate from "@/pages/AuthPages/NephrologistPreAccountCreate";

// Dashboard (Nephrologist)
import NephrologistDashboardOverview from "@/pages/DashboardPages/nephrologists/NephrologistDashboardOverview";
import NephrologistEarningsList from "@/pages/DashboardPages/nephrologists/earnings/NephrologistEarningsList";
import NephrologistNotificationsAndAlerts from "@/pages/DashboardPages/nephrologists/NephrologistNotificationsAndAlerts";
import ActivePatients from "@/pages/DashboardPages/shared/patients/ActivePatientsList";
import TreatmentsSummaryList from "@/pages/DashboardPages/nephrologists/treatments/TreatmentsSummaryList";

// Dashboard (Staff)
import StaffDashboardOverview from "@/pages/DashboardPages/staff/StaffDashboardOverview";
import StaffNotificationsAndAlerts from "@/pages/DashboardPages/staff/StaffNotificationsAndAlerts";
import EnrolledDoctorsList from "@/pages/DashboardPages/staff/doctors/EnrolledDoctorsList";
import PatientTreatmentsList from "@/pages/DashboardPages/staff/patient-treatments/PatientTreatmentsList";

// Shared
import SharedPatientsMasterList from "@/pages/DashboardPages/shared/patients/PatientsMasterList";
import SharedPatientProfile from "@/pages/DashboardPages/shared/patients/profile/PatientHealthProfile";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin?auth_status=unauthenticated" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <ToastContainer
          theme="colored"
          position="top-center"
          style={{ zIndex: 100000 }} // Increased z-index
        />

        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/blank" element={<Blank />} />
            <Route path="/my-account" element={<MyAccount />} />

            <Route
              index
              path="/nephrologist/dashboard"
              element={<NephrologistDashboardOverview />}
            />
            <Route
              path="/nephrologist/earnings"
              element={<NephrologistEarningsList />}
            />
            <Route
              path="/nephrologist/active-patients"
              element={<ActivePatients />}
            />
            <Route
              path="/nephrologist/patients-master-list"
              element={<SharedPatientsMasterList />}
            />
            <Route
              path="/nephrologist/patient-profile/:patientId"
              element={<SharedPatientProfile />}
            />
            <Route
              path="/nephrologist/treatments-summary"
              element={<TreatmentsSummaryList />}
            />
            <Route
              path="/nephrologist/notifications-and-alerts"
              element={<NephrologistNotificationsAndAlerts />}
            />

            <Route
              index
              path="/staff/dashboard"
              element={<StaffDashboardOverview />}
            />
            <Route
              path="/staff/notifications-and-alerts"
              element={<StaffNotificationsAndAlerts />}
            />
            <Route
              path="/staff/enrolled-doctors"
              element={<EnrolledDoctorsList />}
            />
            <Route
              path="/staff/patient-treatments"
              element={<PatientTreatmentsList />}
            />
            <Route
              path="/staff/patients-master-list"
              element={<SharedPatientsMasterList />}
            />
            <Route
              path="/staff/patient-profile/:patientId"
              element={<SharedPatientProfile />}
            />
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/create-account/verify-details"
            element={<NephrologistPreAccountCreate />}
          />

          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/system/consent/privacy-notice"
            element={<PrivacyNotice />}
          />
          <Route path="/system/consent/data-policy" element={<DataPolicy />} />
        </Routes>
      </Router>
    </>
  );
}
