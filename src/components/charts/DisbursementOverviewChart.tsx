import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface DisbursementOverviewChartProps {
  disbursedEarnings: number;
  pendingEarnings: number;
}

export default function DisbursementOverviewChart({
  disbursedEarnings,
  pendingEarnings,
}: DisbursementOverviewChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
    },
    colors: ["#12B76A", "#FFB547"], // Green for disbursed, Yellow for pending
    labels: ["Disbursed Amount", "Pending Disbursement"],
    legend: {
      position: "bottom",
      labels: {
        colors: "#A3AED0",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (_, opts) {
        const value = opts.w.globals.seriesTotals[opts.seriesIndex];
        return `₱ ${value.toLocaleString()}`;
      },
      style: {
        fontSize: "14px",
        fontFamily: "inherit",
        fontWeight: "normal",
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `₱${value.toLocaleString()}`,
      },
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "0%",
        },
      },
    },
  };

  const series = [disbursedEarnings, pendingEarnings];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Disbursement Overview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total earnings distribution
            </p>
          </div>
        </div>
      </div>
      <Chart options={options} series={series} type="pie" height={350} />
    </div>
  );
}
