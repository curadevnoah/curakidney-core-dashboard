import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Modal } from "@/components/_archives/ui/modal";
import { FileText, TestTube, Stethoscope } from "lucide-react";
import DatePicker from "@/components/_archives/form/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/_archives/ui/table";

interface PatientData {
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  bloodPressure: string;
  lastUpdated: string;
}

interface VitalSigns {
  systolicBP: number;
  diastolicBP: number;
  heartRate: string;
  respRate: number;
  o2Sat: number;
  temperature: number;
  preWeight: number;
  weightGain: number;
}

const NORMAL_RANGES = {
  systolicBP: "90-120 mmHg",
  diastolicBP: "60-80 mmHg",
  heartRate: "60-100 bpm",
  respRate: "12-20 /min",
  o2Sat: "95-100%",
  temperature: "36.5-37.5°C",
  weightGain: "<4% of dry weight",

  // Lab metrics normal ranges
  hemoglobin: "12-16 g/dL",
  platelet: "150-450 K/µL",
  sodium: "135-145 mEq/L",
  potassium: "3.5-5.0 mEq/L",
  URR: "65-75%", // Adding URR normal range
  creatinine: "0.7-1.3 mg/dL",
  ionizedCalcium: "1.16-1.32 mmol/L",
  albumin: "3.5-5.0 g/dL",
  phosphorus: "2.5-4.5 mg/dL",
  wbcCount: "4.0-11.0 x10^9/L",
  iPTH: "10-90 pg/mL",
};

const LAB_METRICS = [
  {
    title: "Hemoglobin",
    value: 10.5,
    normalRange: "12-16",
    suffix: "g/dL",
    status: "high",
  },
  {
    title: "Platelet",
    value: 180,
    normalRange: "150-450",
    suffix: "K/µL",
    status: "normal",
  },
  {
    title: "Sodium",
    value: 138,
    normalRange: "135-145",
    suffix: "mEq/L",
    status: "normal",
  },
  {
    title: "Potassium",
    value: 4.5,
    normalRange: "3.5-5.0",
    suffix: "mEq/L",
    status: "normal",
  },
  {
    title: "URR",
    value: 66.7,
    normalRange: "65-75",
    suffix: "%",
    status: "normal",
  },
  {
    title: "Creatinine",
    value: 7.5,
    normalRange: "0.7-1.2",
    suffix: "mg/dL",
    status: "high",
  },
  {
    title: "Ionized Calcium",
    value: 1.2,
    normalRange: "1.1-1.3",
    suffix: "mmol/L",
    status: "normal",
  },
  {
    title: "Albumin",
    value: 3.8,
    normalRange: "3.5-5.0",
    suffix: "g/dL",
    status: "normal",
  },
  {
    title: "Phosphorus",
    value: 3.5,
    normalRange: "2.5-4.5",
    suffix: "mg/dL",
    status: "normal",
  },
];

const LABS = [
  {
    title: "Monthly Labs",
    items: [
      { label: "Hemoglobin", value: "10.5", status: "high" },
      { label: "Platelet", value: "180", status: "normal" },
      { label: "Sodium", value: "138", status: "normal" },
      { label: "Potassium", value: "4.5", status: "normal" },
      { label: "Creatinine", value: "7.5", status: "high" },
      { label: "Ionized Calcium", value: "1.2", status: "normal" },
      { label: "Albumin", value: "3.8", status: "normal" },
      { label: "Phosphorus", value: "3.5", status: "normal" },
      { label: "WBC Count", value: "7.5", status: "normal" },
    ],
  },
  {
    title: "Semi-annual Labs",
    items: [
      { label: "PTH", value: "300", status: "high" },
      { label: "HBsAg", value: "Negative", status: "normal" },
      { label: "Anti-HCV", value: "Negative", status: "normal" },
      { label: "Anti-HBs", value: "Positive", status: "normal" },
    ],
  },
];

const getMonthGroups = () => {
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const lastMonth = new Date(now.setMonth(now.getMonth() - 1)).toLocaleString(
    "default",
    { month: "long" }
  );
  const twoMonthsAgo = new Date(
    now.setMonth(now.getMonth() - 1)
  ).toLocaleString("default", { month: "long" });

  return [
    { title: currentMonth, subtitle: "(Current)" },
    { title: lastMonth, subtitle: "(Last Month)" },
    { title: twoMonthsAgo, subtitle: "(2 Months Ago)" },
  ];
};

const STANDING_DIALYSIS_ORDERS = [
  { label: "Dialyzer", value: "F180NR" },
  { label: "Blood Flow Rate", value: "350 mL/min" },
  { label: "Dialysate Flow", value: "500 mL/min" },
  { label: "Treatment Time", value: "4 hours" },
  { label: "Anticoagulation Type", value: "UFH" },
  { label: "Anticoagulation Loading", value: "1,000 units" },
  { label: "Anticoagulation Maintenance", value: "750 units/hr" },
];

const STANDING_MEDICATION_ORDERS = [
  {
    generic: "Epoetin alfa",
    brandName: "Eprex",
    dose: "4,000 units",
    preparation: "Prefilled syringe",
    frequency: "Per session",
    duration: "Ongoing",
  },
  {
    generic: "Iron sucrose",
    brandName: "Venofer",
    dose: "100 mg",
    preparation: "Ampule",
    frequency: "Weekly",
    duration: "3 months",
  },
  {
    generic: "Calcitriol",
    brandName: "Rocaltrol",
    dose: "2 mcg",
    preparation: "Tablet",
    frequency: "Per session",
    duration: "Ongoing",
  },
  {
    generic: "Calcium carbonate",
    brandName: "Caltrate",
    dose: "600 mg",
    preparation: "Tablet",
    frequency: "Per session",
    duration: "Ongoing",
  },
  {
    generic: "Levocarnitine",
    brandName: "Carnitor",
    dose: "1,000 mg",
    preparation: "Solution",
    frequency: "Per session",
    duration: "Ongoing",
  },
  {
    generic: "Iron sucrose",
    brandName: "Venofer",
    dose: "100 mg",
    preparation: "Ampule",
    frequency: "Monthly",
    duration: "6 months",
  },
];

const WEIGHT_METRICS = {
  dryWeight: 67,
  preWeight: 70,
  postWeight: 68,
};

const UF_METRICS = {
  targetUF: 3,
  actualUF: 2,
  averageUFRate: 0.5,
};

export default function PatientHealthProfile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    // Get initial tab from URL or default to "Patient Health"
    return searchParams.get("tab") || "Patient Health";
  });
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Vital Signs",
    "Latest Laboratory Result",
  ]);
  const [isTrendModalOpen, setIsTrendModalOpen] = useState(false);

  // Add patientData object
  const patientData: PatientData = {
    name: "John Smith",
    age: 45,
    gender: "Male",
    diagnosis: "Chronic Kidney Disease",
    bloodPressure: "130/85",
    lastUpdated: "2024-01-20",
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tabs = [
    "Patient Health",
    "Instructions History",
    "Medical History",
    "Treatments",
    "Prescriptions",
    "Laboratory Reports",
  ];

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab: tab });
  };

  // Sync URL with tab state when URL changes externally
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, tabs]);

  const healthSections = [
    "Vital Signs",
    "Latest Laboratory Result",
    "Weight & UF Metrics",
    "Standing Instructions",
    "Medical Documents",
  ];

  const preDialysisVitals: VitalSigns = {
    systolicBP: 130,
    diastolicBP: 85,
    heartRate: "72bpm",
    respRate: 18,
    o2Sat: 97,
    temperature: 36.6,
    preWeight: 65,
    weightGain: 3,
  };

  const postDialysisVitals: VitalSigns = {
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: "77bpm",
    respRate: 19,
    o2Sat: 97,
    temperature: 36.7,
    preWeight: 63,
    weightGain: 2,
  };

  const getMetricSeverity = (value: number | string, range?: string | null) => {
    // Handle non-numeric values (like "Positive" or "Negative")
    if (typeof value === "string" || !range) {
      return { color: "#52c41a" }; // Default to green for non-numeric values
    }

    // Parse range values
    const [min, max] = range.split("-").map((v) => parseFloat(v));

    if (value >= min && value <= max) {
      return { color: "#52c41a" }; // Green for normal
    }

    // Any value outside the range gets a red indicator
    return { color: "#f5222d" }; // Red for out of range
  };

  interface StatisticWithIndicatorProps {
    title: string;
    value: number | string;
    normalRange?: string | null;
    suffix?: string;
    className?: string;
    isBP?: boolean;
    diastolicValue?: number;
  }

  const StatisticWithIndicator: React.FC<StatisticWithIndicatorProps> = ({
    title,
    value,
    normalRange,
    suffix,
    className,
    isBP = false,
    diastolicValue,
  }) => {
    const { color } = normalRange
      ? getMetricSeverity(
          isBP ? Number(value.toString().split("/")[0]) : value,
          normalRange
        )
      : { color: "" };

    const displayValue = isBP
      ? `${value}/${diastolicValue}`
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

    return (
      <div
        className={`p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-800 ${className}`}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {title}
              </span>
              {normalRange && (
                <span className="ml-2" style={{ color }}>
                  ●
                </span>
              )}
            </div>
            {normalRange && (
              <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                {normalRange}
              </span>
            )}
          </div>
          <div className="flex items-baseline">
            <span className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {displayValue}
            </span>
            {suffix && (
              <span className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {suffix}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleTrendView = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent section toggle
    setIsTrendModalOpen(true);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <PageMeta title="PatientHealthProfile" />
      <PageBreadcrumb pageTitle="Patient Health Profile" />

      <div className="min-h-screen rounded-xl sm:rounded-2xl border border-gray-200 bg-white px-3 sm:px-5 py-4 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* Tabs - Scrollable on mobile */}
        <div className="mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-4 sm:space-x-8 min-w-max pb-2 sm:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pb-2 sm:pb-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-brand-500 text-brand-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Info Section */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-xl sm:text-2xl text-white">
                {patientData.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {patientData.name}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:space-x-4 text-xs sm:text-sm text-gray-500">
                <span>
                  {patientData.age} years old • {patientData.gender}
                </span>
              </div>
              <div className="mt-1 sm:mt-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  Diagnosis
                </span>
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {patientData.diagnosis}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="mb-8 flex items-center space-x-2 text-gray-600">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>No complications from past session(s)</span>
        </div>

        {/* Main Content Area with border top */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          {/* Tab Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {activeTab}
          </h3>

          {activeTab === "Patient Health" && (
            <div className="space-y-4">
              {healthSections.map((section) => (
                <div
                  key={section}
                  className="rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {section}
                      </span>
                      <div className="flex items-center gap-4">
                        {section === "Latest Laboratory Result" && (
                          <button
                            className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                            onClick={handleTrendView}
                          >
                            See last 3 months trend
                          </button>
                        )}
                      </div>
                    </div>
                  </button>
                  {expandedSections.includes(section) && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                      {section === "Vital Signs" ? (
                        <div className="space-y-6">
                          {/* Pre-dialysis Vitals */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                              Pre-dialysis Vitals
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <StatisticWithIndicator
                                title="Blood Pressure"
                                value={preDialysisVitals.systolicBP}
                                diastolicValue={preDialysisVitals.diastolicBP}
                                normalRange={NORMAL_RANGES.systolicBP}
                                suffix="mmHg"
                                isBP={true}
                              />
                              <StatisticWithIndicator
                                title="Heart Rate"
                                value={preDialysisVitals.heartRate}
                                normalRange={NORMAL_RANGES.heartRate}
                              />
                              <StatisticWithIndicator
                                title="Respiratory Rate"
                                value={preDialysisVitals.respRate}
                                normalRange={NORMAL_RANGES.respRate}
                                suffix="/min"
                              />
                              <StatisticWithIndicator
                                title="O2 Saturation"
                                value={preDialysisVitals.o2Sat}
                                normalRange={NORMAL_RANGES.o2Sat}
                                suffix="%"
                              />
                              <StatisticWithIndicator
                                title="Temperature"
                                value={preDialysisVitals.temperature}
                                normalRange={NORMAL_RANGES.temperature}
                                suffix="°C"
                              />
                            </div>
                          </div>

                          {/* Post-dialysis Vitals */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                              Post-dialysis Vitals
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <StatisticWithIndicator
                                title="Blood Pressure"
                                value={postDialysisVitals.systolicBP}
                                diastolicValue={postDialysisVitals.diastolicBP}
                                normalRange={NORMAL_RANGES.systolicBP}
                                suffix="mmHg"
                                isBP={true}
                              />
                              <StatisticWithIndicator
                                title="Heart Rate"
                                value={postDialysisVitals.heartRate}
                                normalRange={NORMAL_RANGES.heartRate}
                              />
                              <StatisticWithIndicator
                                title="Respiratory Rate"
                                value={postDialysisVitals.respRate}
                                normalRange={NORMAL_RANGES.respRate}
                                suffix="/min"
                              />
                              <StatisticWithIndicator
                                title="O2 Saturation"
                                value={postDialysisVitals.o2Sat}
                                normalRange={NORMAL_RANGES.o2Sat}
                                suffix="%"
                              />
                              <StatisticWithIndicator
                                title="Temperature"
                                value={postDialysisVitals.temperature}
                                normalRange={NORMAL_RANGES.temperature}
                                suffix="°C"
                              />
                            </div>
                          </div>
                        </div>
                      ) : section === "Latest Laboratory Result" ? (
                        <div className="space-y-6">
                          {LABS.map((labGroup, groupIndex) => (
                            <div key={groupIndex}>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                                {labGroup.title}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {labGroup.items.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="p-4 rounded-lg border border-gray-100 dark:border-gray-800"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {item.label}
                                      </span>
                                      <span
                                        className={`w-2 h-2 rounded-full ${
                                          item.status === "normal"
                                            ? "bg-green-500"
                                            : item.status === "high"
                                            ? "bg-red-500"
                                            : "bg-yellow-500"
                                        }`}
                                      />
                                    </div>
                                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                      {item.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : section === "Weight & UF Metrics" ? (
                        <div className="space-y-6">
                          {/* Weight Metrics */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                              Weight Metrics
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <StatisticWithIndicator
                                title="Dry Weight"
                                value={WEIGHT_METRICS.dryWeight}
                                suffix="kg"
                              />
                              <StatisticWithIndicator
                                title="Pre-dialysis Weight"
                                value={WEIGHT_METRICS.preWeight}
                                suffix="kg"
                              />
                              <StatisticWithIndicator
                                title="Post-dialysis Weight"
                                value={WEIGHT_METRICS.postWeight}
                                suffix="kg"
                              />
                            </div>
                          </div>

                          {/* UF Metrics */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                              UF Metrics
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <StatisticWithIndicator
                                title="Target UF"
                                value={UF_METRICS.targetUF}
                                suffix="L"
                              />
                              <StatisticWithIndicator
                                title="Actual UF"
                                value={UF_METRICS.actualUF}
                                suffix="L"
                              />
                              <StatisticWithIndicator
                                title="Average UF Rate"
                                value={UF_METRICS.averageUFRate}
                                suffix="L/hr"
                              />
                            </div>
                          </div>
                        </div>
                      ) : section === "Standing Instructions" ? (
                        <div className="space-y-6">
                          {/* Standing Dialysis Orders */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                              Standing Dialysis Orders
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {STANDING_DIALYSIS_ORDERS.map(
                                (instruction, index) => (
                                  <StatisticWithIndicator
                                    key={index}
                                    title={instruction.label}
                                    value={instruction.value}
                                    className="w-full"
                                  />
                                )
                              )}
                            </div>
                          </div>

                          {/* Standing Medication Orders */}
                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                              Standing Medication Orders
                            </h4>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableCell
                                      isHeader
                                      className="whitespace-nowrap px-4 py-2 font-medium text-gray-500 text-left dark:text-gray-400"
                                    >
                                      Generic
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="whitespace-nowrap px-4 py-2 font-medium text-gray-500 text-left dark:text-gray-400"
                                    >
                                      Brand Name
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="whitespace-nowrap px-4 py-2 font-medium text-gray-500 text-left dark:text-gray-400"
                                    >
                                      Dose
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="whitespace-nowrap px-4 py-2 font-medium text-gray-500 text-left dark:text-gray-400"
                                    >
                                      Preparation
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="whitespace-nowrap px-4 py-2 font-medium text-gray-500 text-left dark:text-gray-400"
                                    >
                                      Frequency
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="whitespace-nowrap px-4 py-2 font-medium text-gray-500 text-left dark:text-gray-400"
                                    >
                                      Duration
                                    </TableCell>
                                  </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
                                  {STANDING_MEDICATION_ORDERS.map(
                                    (med, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                          {med.generic}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                          {med.brandName}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                          {med.dose}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                          {med.preparation}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                          {med.frequency}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                          {med.duration}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      ) : section === "Medical Documents" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                          <button
                            onClick={() => alert("Feature not available yet")}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                          >
                            <Stethoscope className="h-5 w-5" />
                            Latest Treatment Sheet
                          </button>

                          <button
                            onClick={() => alert("Feature not available yet")}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                          >
                            <TestTube className="h-5 w-5" />
                            Latest Laboratory Report
                          </button>

                          <button
                            onClick={() => alert("Feature not available yet")}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                          >
                            <FileText className="h-5 w-5" />
                            Latest Prescription
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {activeTab === "Instructions History" && <InstructionsHistory />}
          {activeTab === "Medications History" && <MedicationsHistory />}
          {activeTab === "Treatments" && <Treatments />}
          {activeTab === "Prescriptions" && <Prescriptions />}
          {activeTab === "Laboratory Reports" && <LaboratoryReports />}
        </div>
      </div>
      <Modal
        isOpen={isTrendModalOpen}
        onClose={() => setIsTrendModalOpen(false)}
        className="max-w-[95%] sm:max-w-6xl mx-auto h-[90vh] sm:h-[80vh] my-[5vh] sm:my-[10vh]"
      >
        <div className="flex flex-col h-full bg-white rounded-xl dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
              Laboratory Result Trend - Last 3 Months
            </h3>
            <button
              onClick={() => setIsTrendModalOpen(false)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Close</span>×
            </button>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-8">
              {getMonthGroups().map((month, monthIndex) => (
                <div key={monthIndex} className="space-y-4">
                  <div className="flex items-baseline">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {month.title}
                    </h4>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {month.subtitle}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {LAB_METRICS.map((metric, index) => (
                      <StatisticWithIndicator
                        key={index}
                        title={metric.title}
                        value={metric.value} // You'll need to update this with actual historical data
                        normalRange={metric.normalRange}
                        suffix={metric.suffix}
                        className="w-full"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isCurrentUser: boolean;
}

interface Conversations {
  [key: number]: Message[];
}

interface Instruction {
  id: number;
  name: string;
  center: string;
  message: string;
  time: string;
  isAcknowledged: boolean;
  patient: {
    id: string;
    name: string;
  };
}

const InstructionsHistory = () => {
  const [selectedConversation, setSelectedConversation] = useState<number>(1);

  const instructions: Instruction[] = [
    {
      id: 1,
      name: "Nurse Maria Santos",
      center: "CuraKidney - Feliz",
      message:
        "Pre-dialysis BP: 140/90, weight: 65.2kg. Patient reported mild headache.",
      time: "2m",
      isAcknowledged: true,
      patient: {
        id: "P001",
        name: "John Smith",
      },
    },
    {
      id: 2,
      name: "Nurse James Rodriguez",
      center: "CuraKidney - Feliz",
      message:
        "Mid-dialysis check: BP stable at 130/85, no complaints from patient",
      time: "20m",
      isAcknowledged: false,
      patient: {
        id: "P002",
        name: "Maria Garcia",
      },
    },
    {
      id: 3,
      name: "Nurse Christine Lee",
      center: "CuraKidney - Feliz",
      message:
        "Post-dialysis: BP 125/80, weight: 63.1kg. Schedule completed successfully",
      time: "27m",
      isAcknowledged: false,
      patient: {
        id: "P001",
        name: "John Smith",
      },
    },
    {
      id: 4,
      name: "Dr. Anna Martinez",
      center: "CuraKidney - Feliz",
      message:
        "Please monitor fluid intake. Next assessment scheduled for Friday.",
      time: "40m",
      isAcknowledged: true,
      patient: {
        id: "P003",
        name: "Robert Wilson",
      },
    },
  ];

  const conversations: Conversations = {
    1: [
      {
        id: 1,
        sender: "Nurse Maria Santos",
        message:
          "Pre-dialysis BP: 140/90, weight: 65.2kg. Patient reported mild headache.",
        time: "09:30 AM",
        isCurrentUser: false,
      },
      {
        id: 2,
        sender: "Dr. Smith",
        message:
          "Noted. Administer prescribed pain medication if headache persists. Monitor BP closely.",
        time: "09:32 AM",
        isCurrentUser: true,
      },
      {
        id: 3,
        sender: "Nurse Maria Santos",
        message: "Administered 500mg acetaminophen. Will continue monitoring.",
        time: "09:35 AM",
        isCurrentUser: false,
      },
      {
        id: 4,
        sender: "Nurse Maria Santos",
        message:
          "Update: BP now 135/85, headache has subsided. Patient comfortable.",
        time: "10:00 AM",
        isCurrentUser: false,
      },
    ],
    2: [
      {
        id: 1,
        sender: "Nurse James Rodriguez",
        message:
          "Mid-dialysis check: BP stable at 130/85, no complaints from patient",
        time: "11:00 AM",
        isCurrentUser: false,
      },
    ],
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col p-4">
      <div className="grid h-full grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left sidebar - Instructions List */}
        <div className="lg:col-span-4 h-full">
          <div className="flex flex-col h-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="flex-1 overflow-y-auto">
              {instructions.map((instruction) => (
                <button
                  key={instruction.id}
                  onClick={() => setSelectedConversation(instruction.id)}
                  className={`w-full p-4 text-left transition flex items-start gap-3
                    ${
                      selectedConversation === instruction.id
                        ? "bg-brand-50 dark:bg-brand-500/10 border-l-4 border-l-brand-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <div className="w-8 h-8 bg-brand-100 dark:bg-brand-500/20 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400">
                    {instruction.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {instruction.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {instruction.time}
                        </span>
                        {instruction.isAcknowledged && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 rounded">
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {instruction.center}
                    </p>
                    <p className="text-sm text-brand-600 dark:text-brand-400">
                      Patient: {instruction.patient.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {instruction.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Conversation */}
        <div className="lg:col-span-8 h-full">
          <div className="flex flex-col h-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            {/* Conversation header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conversation
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversations[selectedConversation]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.isCurrentUser
                        ? "bg-brand-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800"
                    } rounded-lg px-4 py-2`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="font-medium text-sm">
                        {message.sender}
                      </span>
                      <span className="text-xs opacity-75">{message.time}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MedicationsHistory = () => {
  const [activeTab, setActiveTab] = useState("Vascular Access History");

  const vascularAccessHistory = [
    {
      date: "2024-01-19",
      type: "AV Fistula",
      site: "Left Forearm",
      surgeon: "Dr. Robert Chen",
      complications: "None",
      status: "ACTIVE",
    },
    {
      date: "2023-08-22",
      type: "Central Venous Catheter",
      site: "Right Internal Jugular",
      surgeon: "Dr. Sarah Williams",
      complications: "Minor Infection",
      status: "INACTIVE",
    },
    {
      date: "2023-03-10",
      type: "AV Graft",
      site: "Right Upper Arm",
      surgeon: "Dr. Michael Brown",
      complications: "Thrombosis",
      status: "FAILED",
    },
  ];

  const hospitalizationHistory = [
    {
      date: "2023-12-15",
      admissionReason: "Severe Hypertension",
      hospital: "City General Hospital",
      duration: "3 days",
      outcome: "Recovered",
      status: "COMPLETED",
    },
    {
      date: "2023-09-05",
      admissionReason: "Access Site Infection",
      hospital: "Memorial Medical Center",
      duration: "5 days",
      outcome: "Recovered with antibiotics",
      status: "COMPLETED",
    },
  ];

  const vaccinationHistory = [
    {
      date: "2024-01-10",
      vaccine: "Influenza",
      manufacturer: "Pfizer",
      batchNo: "IF2024001",
      nextDue: "2025-01-10",
      status: "COMPLETED",
    },
    {
      date: "2023-06-15",
      vaccine: "Pneumococcal",
      manufacturer: "Moderna",
      batchNo: "PN2023145",
      nextDue: "2028-06-15",
      status: "COMPLETED",
    },
    {
      date: "2023-03-20",
      vaccine: "Hepatitis B",
      manufacturer: "GSK",
      batchNo: "HB2023078",
      nextDue: "2024-03-20",
      status: "DUE SOON",
    },
  ];

  const renderVascularAccessTable = () => (
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Date
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Type
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Site
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Surgeon
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Complications
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {vascularAccessHistory.map((record, index) => (
          <tr key={index} className="border-b border-gray-200 last:border-0">
            <td className="py-4 text-sm text-gray-900">{record.date}</td>
            <td className="py-4 text-sm text-gray-900">{record.type}</td>
            <td className="py-4 text-sm text-gray-900">{record.site}</td>
            <td className="py-4 text-sm text-gray-900">{record.surgeon}</td>
            <td className="py-4 text-sm text-gray-900">
              {record.complications}
            </td>
            <td className="py-4 text-sm">
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  record.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : record.status === "INACTIVE"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {record.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderHospitalizationTable = () => (
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Date
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Admission Reason
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Hospital
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Duration
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Outcome
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {hospitalizationHistory.map((record, index) => (
          <tr key={index} className="border-b border-gray-200 last:border-0">
            <td className="py-4 text-sm text-gray-900">{record.date}</td>
            <td className="py-4 text-sm text-gray-900">
              {record.admissionReason}
            </td>
            <td className="py-4 text-sm text-gray-900">{record.hospital}</td>
            <td className="py-4 text-sm text-gray-900">{record.duration}</td>
            <td className="py-4 text-sm text-gray-900">{record.outcome}</td>
            <td className="py-4 text-sm">
              <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800">
                {record.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderVaccinationTable = () => (
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Date
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Vaccine
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Manufacturer
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Batch No
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Next Due
          </th>
          <th className="py-3 text-left text-sm font-medium text-gray-500">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {vaccinationHistory.map((record, index) => (
          <tr key={index} className="border-b border-gray-200 last:border-0">
            <td className="py-4 text-sm text-gray-900">{record.date}</td>
            <td className="py-4 text-sm text-gray-900">{record.vaccine}</td>
            <td className="py-4 text-sm text-gray-900">
              {record.manufacturer}
            </td>
            <td className="py-4 text-sm text-gray-900">{record.batchNo}</td>
            <td className="py-4 text-sm text-gray-900">{record.nextDue}</td>
            <td className="py-4 text-sm">
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  record.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {record.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex space-x-8">
            {[
              "Vascular Access History",
              "Hospitalization History",
              "Vaccination History",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-brand-500 text-brand-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          {activeTab === "Vascular Access History" &&
            renderVascularAccessTable()}
          {activeTab === "Hospitalization History" &&
            renderHospitalizationTable()}
          {activeTab === "Vaccination History" && renderVaccinationTable()}
        </div>
      </div>
    </div>
  );
};

const Treatments = () => {
  const [, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  return (
    <div className="p-4">
      {/* Date Filter */}
      <div className="mb-4">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          Filter by date:
        </span>
        <div className="flex gap-2">
          <div className="w-36">
            <DatePicker
              id="treatment-date-from"
              placeholder="From"
              onChange={(dates) =>
                setDateRange((prev) => ({ ...prev, from: dates[0] || null }))
              }
            />
          </div>
          <div className="w-36">
            <DatePicker
              id="treatment-date-to"
              placeholder="To"
              onChange={(dates) =>
                setDateRange((prev) => ({ ...prev, to: dates[0] || null }))
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Treatment Date
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Treatment Sheet
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Dummy data - replace with actual data */}
            {[...Array(5)].map((_, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-0"
              >
                <td className="py-4 text-sm text-gray-900">
                  {new Date(2024, 0, index + 1).toLocaleDateString()}
                </td>
                <td className="py-4 text-sm">
                  <button
                    onClick={() =>
                      console.log(`View treatment sheet ${index + 1}`)
                    }
                    className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
                  >
                    View Treatment Sheet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Prescriptions = () => {
  // Dummy data for prescriptions
  const prescriptions = [
    {
      id: 1,
      prescriptionDate: "2024-01-15",
      genericName: "Epoetin alfa",
      brandName: "Eprex",
      dosage: "4000 IU",
      form: "Injection",
      frequency: "3x weekly",
      duration: "1 month",
      status: "Active",
      prescribedBy: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      prescriptionDate: "2024-01-15",
      genericName: "Sevelamer",
      brandName: "Renagel",
      dosage: "800 mg",
      form: "Tablet",
      frequency: "3x daily with meals",
      duration: "1 month",
      status: "Active",
      prescribedBy: "Dr. Sarah Johnson",
    },
    {
      id: 3,
      prescriptionDate: "2024-01-15",
      genericName: "Calcitriol",
      brandName: "Rocaltrol",
      dosage: "0.25 mcg",
      form: "Capsule",
      frequency: "1x daily",
      duration: "1 month",
      status: "Active",
      prescribedBy: "Dr. Sarah Johnson",
    },
    {
      id: 4,
      prescriptionDate: "2023-12-15",
      genericName: "Iron Sucrose",
      brandName: "Venofer",
      dosage: "100 mg",
      form: "Injection",
      frequency: "Weekly",
      duration: "1 month",
      status: "Completed",
      prescribedBy: "Dr. Sarah Johnson",
    },
  ];

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Generic Name
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Brand Name
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Dosage
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Form
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Frequency
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Duration
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Prescribed By
              </th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr
                key={prescription.id}
                className="border-b border-gray-200 last:border-0"
              >
                <td className="py-4 text-sm text-gray-900">
                  {new Date(prescription.prescriptionDate).toLocaleDateString()}
                </td>
                <td className="py-4 text-sm text-gray-900">
                  {prescription.genericName}
                </td>
                <td className="py-4 text-sm text-gray-900">
                  {prescription.brandName}
                </td>
                <td className="py-4 text-sm text-gray-900">
                  {prescription.dosage}
                </td>
                <td className="py-4 text-sm text-gray-900">
                  {prescription.form}
                </td>
                <td className="py-4 text-sm text-gray-900">
                  {prescription.frequency}
                </td>
                <td className="py-4 text-sm text-gray-900">
                  {prescription.duration}
                </td>
                <td className="py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      prescription.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {prescription.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-gray-900">
                  {prescription.prescribedBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LaboratoryReports = () => {
  const labReports = [
    {
      id: 1,
      date: "2024-01-15",
      category: "Monthly Labs",
      tests: "Complete Blood Count, Comprehensive Metabolic Panel",
      orderedBy: "Dr. Sarah Johnson",
      status: "Completed",
      reportFile: "lab_report_20240115.pdf",
    },
    {
      id: 2,
      date: "2024-01-15",
      category: "Quarterly Labs",
      tests: "PTH, Vitamin D, HbA1c",
      orderedBy: "Dr. Sarah Johnson",
      status: "Completed",
      reportFile: "quarterly_labs_Q1_2024.pdf",
    },
    {
      id: 3,
      date: "2024-01-01",
      category: "Monthly Labs",
      tests: "Complete Blood Count, Basic Metabolic Panel",
      orderedBy: "Dr. Michael Chen",
      status: "Completed",
      reportFile: "lab_report_20240101.pdf",
    },
    {
      id: 4,
      date: "2023-12-15",
      category: "Annual Labs",
      tests: "Hepatitis Panel, HIV, TB Test",
      orderedBy: "Dr. Sarah Johnson",
      status: "Completed",
      reportFile: "annual_labs_2023.pdf",
    },
    {
      id: 5,
      date: "2023-12-01",
      category: "Monthly Labs",
      tests: "Complete Blood Count, Comprehensive Metabolic Panel",
      orderedBy: "Dr. Sarah Johnson",
      status: "Completed",
      reportFile: "lab_report_20231201.pdf",
    },
  ];

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Category
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Tests
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Ordered By
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Report
              </th>
            </tr>
          </thead>
          <tbody>
            {labReports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-gray-200 last:border-0"
              >
                <td className="py-4 text-sm text-gray-900">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="py-4 text-sm text-gray-900">
                  {report.category}
                </td>
                <td className="py-4 text-sm text-gray-900">{report.tests}</td>
                <td className="py-4 text-sm text-gray-900">
                  {report.orderedBy}
                </td>
                <td className="py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      report.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="py-4 text-sm">
                  <button
                    onClick={() =>
                      console.log(`View report ${report.reportFile}`)
                    }
                    className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
