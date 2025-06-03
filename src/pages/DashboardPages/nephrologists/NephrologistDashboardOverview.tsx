import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import DatePicker from "@/components/_archives/form/date-picker";
import PatientsAndTreatmentsChart from "@/components/charts/PatientsAndTreatmentsChart";
import MonthlyEarningsChart from "@/components/charts/MonthlyEarningsChart";
import DisbursementOverviewChart from "@/components/charts/DisbursementOverviewChart";
import { useState, useEffect } from "react";

function DateFilter() {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  return (
    <div className="flex justify-end gap-3">
      <div className="w-36">
        <DatePicker
          id="date-from"
          placeholder="From"
          defaultDate={sixMonthsAgo}
          dateFormat="Y-m"
          onChange={(dates) => {
            console.log("From date:", dates);
          }}
        />
      </div>
      <div className="w-36">
        <DatePicker
          id="date-to"
          placeholder="To"
          defaultDate={today}
          dateFormat="Y-m"
          onChange={(dates) => {
            console.log("To date:", dates);
          }}
        />
      </div>
    </div>
  );
}

function MetricsCards({
  metrics,
}: {
  metrics: {
    disbursedEarnings: number;
    pendingEarnings: number;
    totalPatients: number;
    totalTreatments: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Disbursed Earnings Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Disbursed Earnings
            </p>
            <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              ₱{metrics.disbursedEarnings.toLocaleString()}.00
            </h4>
          </div>
        </div>
      </div>

      {/* Pending Earnings Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pending Earnings
            </p>
            <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              ₱{metrics.pendingEarnings.toLocaleString()}.00
            </h4>
          </div>
        </div>
      </div>

      {/* Total Patients Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Patients
            </p>
            <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {metrics.totalPatients}
            </h4>
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
              {metrics.totalTreatments}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NephrologistDashboardOverview() {
  const [metrics] = useState({
    disbursedEarnings: 0,
    pendingEarnings: 0,
    totalPatients: 0,
    totalTreatments: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.getDashboardData();
        // setMetrics(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <PageMeta title="Nephrologist Dashboard Overview" />
      <PageBreadcrumb pageTitle="Nephrologist Dashboard Overview" />

      <div className="flex flex-col items-center text-center gap-4 mb-6 sm:text-left sm:flex-row sm:items-center sm:justify-between">
        <h2 className="sm:text-xl font-medium text-gray-500 dark:text-white">
          Welcome back, John Doe
        </h2>
        <DateFilter />
      </div>

      <MetricsCards metrics={metrics} />

      <div className="grid grid-cols-1 gap-6 mt-6 xl:grid-cols-2">
        <MonthlyEarningsChart
          disbursedEarnings={metrics.disbursedEarnings}
          pendingEarnings={metrics.pendingEarnings}
        />
        <DisbursementOverviewChart
          disbursedEarnings={metrics.disbursedEarnings}
          pendingEarnings={metrics.pendingEarnings}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 xl:grid-cols-1">
        <PatientsAndTreatmentsChart
          totalPatients={metrics.totalPatients}
          totalTreatments={metrics.totalTreatments}
        />
      </div>
    </div>
  );
}
