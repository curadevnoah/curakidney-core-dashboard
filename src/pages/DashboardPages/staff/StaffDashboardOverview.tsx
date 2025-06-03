import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import { Users, UserCog, Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";
import { useDoctorsService } from "@/services/modules/doctors.service";
import CountUp from "react-countup";

function MetricsCards({
  metrics,
}: {
  metrics: {
    totalPatients: number;
    totalDoctors: number;
    totalTreatments: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Patients Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Patients
            </p>
            <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              <CountUp
                end={metrics.totalPatients}
                duration={2.5}
                separator=","
              />
            </h4>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Total Doctors Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Doctors
            </p>
            <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              <CountUp
                end={metrics.totalDoctors}
                duration={2.5}
                separator=","
              />
            </h4>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
            <UserCog className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Total Treatments Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Treatments
            </p>
            <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              <CountUp
                end={metrics.totalTreatments}
                duration={2.5}
                separator=","
              />
            </h4>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-500/10">
            <Stethoscope className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboardOverview() {
  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalTreatments: 0,
  });

  const { getDoctors } = useDoctorsService();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctors = await getDoctors();
        setMetrics((prev) => ({
          ...prev,
          totalDoctors: doctors.length,
        }));
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [getDoctors]);

  return (
    <div>
      <PageMeta title="Staff Dashboard Overview" />
      <PageBreadcrumb pageTitle="Staff Dashboard Overview" />

      <div className="flex flex-col items-center text-center gap-4 mb-6 sm:text-left sm:flex-row sm:items-center sm:justify-between">
        <h2 className="sm:text-xl font-medium text-gray-500 dark:text-white">
          Welcome back, Staff Admin
        </h2>
      </div>

      <MetricsCards metrics={metrics} />
    </div>
  );
}
