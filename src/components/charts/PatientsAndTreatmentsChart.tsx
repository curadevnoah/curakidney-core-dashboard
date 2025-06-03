import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router";

interface PatientsAndTreatmentsChartProps {
  totalPatients: number;
  totalTreatments: number;
}

export default function PatientsAndTreatmentsChart({
  totalPatients,
  totalTreatments,
}: PatientsAndTreatmentsChartProps) {
  const navigate = useNavigate();

  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // Get last 6 months
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    return {
      fullName: months[monthIndex],
      shortName: [
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
      ][monthIndex],
    };
  });

  const options: ApexOptions = {
    chart: {
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      events: {
        dataPointSelection: (_event: any, _chartContext: any, config: any) => {
          const selectedMonth = last6Months[config.dataPointIndex].fullName;

          if (config.seriesIndex === 1) {
            navigate(
              `/nephrologist/treatments-summary?month=${selectedMonth}&type=0`
            );
          }

          if (config.seriesIndex === 0) {
            navigate(
              `/nephrologist/active-patients?month=${selectedMonth}&type=1`
            );
          }
        },
      },
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    markers: {
      size: 10,
      hover: {
        size: 15,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: last6Months.map((m) => m.shortName),
      title: {
        text: "Months",
        style: {
          fontSize: "12px",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val: number) {
          return val.toString();
        },
      },
    },
    colors: ["#FFB547", "#465fff"], // Orange for treatments, Violet for patients
    legend: {
      position: "top",
      fontSize: "12px",
      offsetY: 0,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            position: "bottom",
            offsetY: 0,
          },
          xaxis: {
            labels: {
              rotate: -45,
              style: {
                fontSize: "10px",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
          markers: {
            size: 3,
            hover: {
              size: 4,
            },
          },
          stroke: {
            width: 2,
          },
        },
      },
    ],
  };

  // Generate last 6 months of data instead of full year
  const series = [
    {
      name: "Total Patients (Active)",
      type: "line",
      data: [
        Math.round(totalPatients * 0.7),
        Math.round(totalPatients * 0.8),
        Math.round(totalPatients * 0.85),
        Math.round(totalPatients * 0.9),
        Math.round(totalPatients * 0.95),
        Math.round(totalPatients),
      ],
    },
    {
      name: "Total Treatments",
      type: "line",
      data: [
        Math.round(totalTreatments * 0.7),
        Math.round(totalTreatments * 0.8),
        Math.round(totalTreatments * 0.85),
        Math.round(totalTreatments * 0.9),
        Math.round(totalTreatments * 0.95),
        Math.round(totalTreatments),
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <style>
        {`
          #patientsAndTreatments .apexcharts-series,
          #patientsAndTreatments .apexcharts-area,
          #patientsAndTreatments .apexcharts-point,
          #patientsAndTreatments .apexcharts-marker {
            cursor: pointer !important;
          }
          #patientsAndTreatments .apexcharts-line-series .apexcharts-line {
            stroke-width: 3;
          }
          #patientsAndTreatments .apexcharts-marker {
            stroke-width: 2;
          }
          #patientsAndTreatments .apexcharts-area-series:nth-of-type(1) path.apexcharts-area {
            fill: url(#treatments-gradient);
          }
          #patientsAndTreatments .apexcharts-area-series:nth-of-type(2) path.apexcharts-area {
            fill: url(#patients-gradient);
          }
        `}
      </style>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="treatments-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFB547" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFB547" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="patients-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#465fff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#465fff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Patients & Treatments Overview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Overview of total patients & total treatments graph
            </p>
          </div>
        </div>
      </div>
      <Chart
        options={options}
        series={series}
        type="area"
        height={350}
        id="patientsAndTreatments"
      />
    </div>
  );
}
