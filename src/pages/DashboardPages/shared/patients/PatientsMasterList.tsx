import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/_archives/ui/table";
import { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store";

interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female";
  diagnosis: string;
  totalSessions: number;
  firstSession: string;
  lastSession: string;
  frequency: string;
}

interface PatientStats {
  referred: number;
  active: number;
}

// Dummy data generator
const generateDummyData = (): Patient[] => {
  const diagnoses = [
    "Chronic Kidney Disease (CKD)",
    "End-Stage Renal Disease (ESRD)",
    "Diabetic Nephropathy",
    "Glomerulonephritis",
    "Polycystic Kidney Disease",
  ];

  const frequencies = [
    "3x a week",
    "2x a week",
    "Weekly",
    "Bi-weekly",
    "Monthly",
  ];

  const patients: Patient[] = [
    "Emma Wilson",
    "Oliver Brown",
    "Sophia Lee",
    "Lucas Garcia",
    "Ava Martinez",
    "Ethan Johnson",
    "Isabella Smith",
    "Mason Davis",
    "Mia Anderson",
    "Noah Taylor",
  ].map((name, index) => {
    const firstSessionDate = new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    const lastSessionDate = new Date(
      2024,
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 28) + 1
    );

    return {
      id: `patient-${index + 1}`,
      fullName: name,
      age: Math.floor(Math.random() * 50) + 20,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      totalSessions: Math.floor(Math.random() * 100) + 1,
      firstSession: firstSessionDate.toISOString(),
      lastSession: lastSessionDate.toISOString(),
      frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
    };
  });

  return patients;
};

// Generate random patient statistics
const generatePatientStats = (): PatientStats => {
  const active = Math.floor(Math.random() * 150) + 100; // 100-250 active patients
  const referred = Math.floor(Math.random() * 50) + 30; // 30-80 referred patients
  return { active, referred };
};

export default function PatientsMasterList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [patients] = useState<Patient[]>(generateDummyData());
  const [searchTerm, setSearchTerm] = useState("");
  const [patientStats] = useState<PatientStats>(generatePatientStats());

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const handleViewProfile = (patientId: string) => {
    const baseRoute = user?.role === "nephrologist" ? "nephrologist" : "staff";
    navigate(`/${baseRoute}/patient-profile/${patientId}`);
  };

  // Pie chart options
  const pieChartOptions: ApexOptions = {
    chart: {
      type: "pie",
      height: 200,
    },
    labels: ["Active Patients", "Referred Patients"],
    colors: ["#4ade80", "#f59e0b"],
    legend: {
      position: "bottom",
      fontSize: "14px",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return Math.round(val) + "%";
        },
      },
    },
  };

  const pieChartSeries = [
    (patientStats.active / (patientStats.active + patientStats.referred)) * 100,
    (patientStats.referred / (patientStats.active + patientStats.referred)) *
      100,
  ];

  return (
    <div>
      <PageMeta title="Patients Master List" />
      <PageBreadcrumb pageTitle="Patients Master List" />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {/* Search Input */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by patient name..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-500 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Patient Statistics Card */}
        <div className="w-full sm:w-80">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient Distribution
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total: {patientStats.active + patientStats.referred}
              </div>
            </div>
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
              height={200}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Age
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Gender
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Diagnosis
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Total Sessions
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  First Session
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Last Session
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Frequency
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="border-b border-gray-200 last:border-0 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                    {patient.fullName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-center dark:text-gray-200">
                    {patient.age}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-center dark:text-gray-200">
                    {patient.gender}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                    {patient.diagnosis}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-center dark:text-gray-200">
                    {patient.totalSessions}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                    {new Date(patient.firstSession).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                    {new Date(patient.lastSession).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-center dark:text-gray-200">
                    {patient.frequency}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleViewProfile(patient.id)}
                      className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
                    >
                      View Profile
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
