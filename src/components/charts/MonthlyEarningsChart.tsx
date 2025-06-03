import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router";

interface MonthlyEarningsChartProps {
  disbursedEarnings: number;
  pendingEarnings: number;
}

export default function MonthlyEarningsChart({
  disbursedEarnings,
  pendingEarnings,
}: MonthlyEarningsChartProps) {
  const navigate = useNavigate();

  // Generate last 6 months including current month
  const getLast6Months = () => {
    const months = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(monthNames[d.getMonth()]);
    }

    return months;
  };

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
      background: "transparent",
      events: {
        dataPointSelection: (_, __, config) => {
          const monthIndex = config.dataPointIndex;
          const seriesIndex = config.seriesIndex;
          const month = getLast6Months()[monthIndex];
          const category = seriesIndex === 0 ? "disbursed" : "pending";

          navigate(
            `/nephrologist/earnings?month=${month}&category=${category}`
          );
        },
      },
    },
    colors: ["#12B76A", "#FFB547"], // Green for disbursed, Yellow for pending
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "60%",
        horizontal: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: "#E2E8F0",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 20,
        bottom: 0,
        left: 20,
      },
    },
    xaxis: {
      categories: getLast6Months(),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 25000,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
        formatter: (value) => `₱${value.toLocaleString()}`,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `₱${value.toLocaleString()}`,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#A3AED0",
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
  };

  const series = [
    {
      name: "Disbursed Earnings",
      // Modify this to show progression leading to current total
      data: [
        disbursedEarnings * 0.7,
        disbursedEarnings * 0.8,
        disbursedEarnings * 0.85,
        disbursedEarnings * 0.9,
        disbursedEarnings * 0.95,
        disbursedEarnings,
      ],
    },
    {
      name: "Pending Earnings",
      // Modify this to show progression leading to current total
      data: [
        pendingEarnings * 0.6,
        pendingEarnings * 0.7,
        pendingEarnings * 0.8,
        pendingEarnings * 0.9,
        pendingEarnings * 0.95,
        pendingEarnings,
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Earnings
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Overview of monthly earnings
            </p>
          </div>
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
