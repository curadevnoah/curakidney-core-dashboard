import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/_archives/ui/table";
import { Modal } from "@/components/_archives/ui/modal";
import { useState } from "react";
import { useSearchParams } from "react-router";

interface Treatment {
  id: string;
  patientName: string;
  totalTreatments: number;
  lastTreatment: string;
  treatments: TreatmentDetail[];
}

interface TreatmentDetail {
  id: string;
  patientName: string;
  date: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  treatments: TreatmentDetail[];
}

// Treatment History Modal Component
const TreatmentHistoryModal = ({ isOpen, onClose, treatments }: ModalProps) => {
  const handleViewTreatment = (id: string) => {
    console.log(`Viewing treatment ${id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl mx-auto h-[80vh] my-[10vh]"
    >
      <div className="flex flex-col h-full bg-white rounded-xl dark:bg-gray-900">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Treatment History
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">Close</span>×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Patient Name
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Treatment Date
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Treatment Link
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatments.map((treatment) => (
                <TableRow
                  key={treatment.id}
                  className="border-b border-gray-200 last:border-0 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4 text-gray-800 text-start dark:text-gray-200">
                    {treatment.patientName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-start dark:text-gray-200">
                    {new Date(treatment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <button
                      onClick={() => handleViewTreatment(treatment.id)}
                      className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
                    >
                      View Treatment
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Modal>
  );
};

// Helper function to get full month name
const getFullMonthName = (month: string): string => {
  const date = new Date(`${month} 1, 2024`);
  return date.toLocaleString("default", { month: "long" });
};

// Generate dummy treatment details
const generateDummyTreatmentDetails = (
  patientName: string
): TreatmentDetail[] => {
  return Array.from(
    { length: Math.floor(Math.random() * 8) + 3 },
    (_, index) => ({
      id: `treatment-detail-${index + 1}`,
      patientName,
      date: new Date(
        2024,
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 28) + 1
      ).toISOString(),
    })
  );
};

// Modified dummy data generator
const generateDummyData = (): Treatment[] => {
  const patientNames = [
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
  ];

  return patientNames.map((name, index) => ({
    id: `treatment-${index + 1}`,
    patientName: name,
    totalTreatments: Math.floor(Math.random() * 20) + 1,
    lastTreatment: new Date(
      2024,
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 28) + 1
    ).toISOString(),
    treatments: generateDummyTreatmentDetails(name),
  }));
};

export default function TreatmentsSummaryList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [treatments] = useState<Treatment[]>(generateDummyData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTreatments, setSelectedTreatments] = useState<
    TreatmentDetail[]
  >([]);

  const removeMonthFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("month");
    setSearchParams(newSearchParams);
  };

  const handleTreatmentsClick = (treatment: Treatment) => {
    setSelectedTreatments(treatment.treatments);
    setIsModalOpen(true);
  };

  const commonCellClasses = {
    left: "px-6 py-4 text-left",
    center: "px-6 py-4 text-center",
  };

  return (
    <div>
      <PageMeta title="Treatments Summary List" />
      <PageBreadcrumb pageTitle="Treatments Summary List" />

      {searchParams.get("month") && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 capitalize">
              {getFullMonthName(searchParams.get("month") || "")}
              <button
                onClick={removeMonthFilter}
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
              >
                <span className="sr-only">Remove filter</span>×
              </button>
            </span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className={`${commonCellClasses.left} whitespace-nowrap font-medium text-gray-500 dark:text-gray-400`}
                >
                  Patient Name
                </TableCell>
                <TableCell
                  isHeader
                  className={`${commonCellClasses.center} whitespace-nowrap font-medium text-gray-500 dark:text-gray-400`}
                >
                  Total Treatments
                </TableCell>
                <TableCell
                  isHeader
                  className={`${commonCellClasses.left} whitespace-nowrap font-medium text-gray-500 dark:text-gray-400`}
                >
                  Last Treatment
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
              {treatments.map((treatment) => (
                <TableRow
                  key={treatment.id}
                  className="border-b border-gray-200 last:border-0 dark:border-gray-800"
                >
                  <TableCell
                    className={`${commonCellClasses.left} text-gray-800 dark:text-gray-200`}
                  >
                    {treatment.patientName}
                  </TableCell>
                  <TableCell
                    onClick={() => handleTreatmentsClick(treatment)}
                    className={`${commonCellClasses.center} text-brand-500 dark:text-brand-400 cursor-pointer hover:text-brand-600 dark:hover:text-brand-500`}
                  >
                    {treatment.totalTreatments}
                  </TableCell>
                  <TableCell
                    className={`${commonCellClasses.left} text-gray-800 dark:text-gray-200`}
                  >
                    {new Date(treatment.lastTreatment).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TreatmentHistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        treatments={selectedTreatments}
      />
    </div>
  );
}
