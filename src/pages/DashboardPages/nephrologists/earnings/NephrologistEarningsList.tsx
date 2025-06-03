import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import { useSearchParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/_archives/ui/table";
import DatePicker from "@/components/_archives/form/date-picker";
import { useState, useEffect } from "react";
import { Modal } from "@/components/_archives/ui/modal";

interface Disbursement {
  id: string;
  disbursementNumber: string;
  disbursementDate: string;
  amount: number;
  numberOfTreatments: number;
  totalPatients: number;
  status: "Disbursed" | "Pending";
  treatments: Treatment[];
  patients: Patient[];
}

interface Treatment {
  id: string;
  patientName: string;
  date: string;
  amount: number;
}

interface Patient {
  id: string;
  name: string;
  treatmentDate: string;
}

type ModalType = "treatments" | "patients";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  treatments?: Treatment[];
  patients?: Patient[];
  type: ModalType;
}

const dummyData: Disbursement[] = Array.from({ length: 50 }, (_, index) => ({
  id: (index + 1).toString(),
  disbursementNumber: `DISB-${(40000 + index).toString().padStart(5, "0")}`,
  disbursementDate: new Date(2024, 0, 1 + index).toISOString().split("T")[0],
  amount: Math.round(Math.random() * 50000 + 20000),
  numberOfTreatments: Math.floor(Math.random() * 10 + 5),
  totalPatients: Math.floor(Math.random() * 40 + 20),
  status: Math.random() > 0.3 ? "Disbursed" : "Pending",
  treatments: Array.from(
    { length: Math.floor(Math.random() * 5 + 5) },
    (_, i) => ({
      id: `treatment-${index}-${i + 1}`,
      patientName: `${
        [
          "John Smith",
          "Maria Garcia",
          "James Johnson",
          "Patricia Brown",
          "Michael Davis",
          "Sarah Wilson",
          "Robert Taylor",
          "Jennifer Martinez",
          "William Anderson",
          "Elizabeth Thomas",
        ][Math.floor(Math.random() * 10)]
      }`,
      date: new Date(
        2024,
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      amount: Math.round(Math.random() * 5000 + 1000),
    })
  ),
  patients: Array.from(
    { length: Math.floor(Math.random() * 5 + 5) },
    (_, i) => ({
      id: `patient-${index}-${i + 1}`,
      name: `${
        [
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
        ][Math.floor(Math.random() * 10)]
      }`,
      treatmentDate: new Date(
        2024,
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
    })
  ),
}));

const DetailsModal = ({
  isOpen,
  onClose,
  treatments,
  patients,
  type,
}: ModalProps) => {
  const handleViewTreatment = (id: string) => {
    // Implement view treatment logic here
    console.log(`Viewing treatment ${id}`);
  };

  const renderTableHeaders = () => {
    return (
      <TableRow>
        <TableCell
          isHeader
          className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400"
        >
          Patient Name
        </TableCell>
        <TableCell
          isHeader
          className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400"
        >
          Treatment Date
        </TableCell>
        <TableCell
          isHeader
          className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400"
        >
          Treatment Link
        </TableCell>
      </TableRow>
    );
  };

  const renderTableRows = () => {
    const data = type === "treatments" ? treatments : patients;

    if (!data || data.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={3}
            className="px-6 py-4 text-center text-gray-500"
          >
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return data.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200">
          {type === "treatments"
            ? (item as Treatment).patientName
            : (item as Patient).name}
        </TableCell>
        <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200">
          {new Date(
            type === "treatments"
              ? (item as Treatment).date
              : (item as Patient).treatmentDate
          ).toLocaleDateString()}
        </TableCell>
        <TableCell className="px-6 py-4">
          <button
            onClick={() => handleViewTreatment(item.id)}
            className="px-4 py-2 text-sm font-medium text-white rounded-md bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            View Treatment
          </button>
        </TableCell>
      </TableRow>
    ));
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
            {type === "treatments" ? "Treatment Details" : "Patient Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">Close</span>×
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                {renderTableHeaders()}
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
                {renderTableRows()}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default function NephrologistEarningsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [disbursements, setDisbursements] = useState<Disbursement[]>(dummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState<any>({ from: "", to: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTreatments, setSelectedTreatments] = useState<Treatment[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<Patient[]>([]);
  const [modalType, setModalType] = useState<"treatments" | "patients">(
    "treatments"
  );

  // Function to get full month name
  const getFullMonthName = (shortMonth: string) => {
    const months: { [key: string]: string } = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
    };
    return months[shortMonth] || shortMonth;
  };

  // Function to remove a filter
  const removeFilter = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(key);
    setSearchParams(newSearchParams);

    // Reset corresponding state
    switch (key) {
      case "month":
        setSelectedMonth("");
        break;
      case "status":
        setSelectedStatus("");
        break;
      case "search":
        setSearchTerm("");
        break;
      case "dateFrom":
      case "dateTo":
        setDateRange((prev: any) => ({
          ...prev,
          [key === "dateFrom" ? "from" : "to"]: "",
        }));
        break;
    }
  };

  const getCategoryTagStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "disbursed":
        return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
      case "pending":
        return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  // Filter handlers
  useEffect(() => {
    let filtered = [...dummyData];

    if (searchTerm) {
      filtered = filtered.filter((d) =>
        d.disbursementNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter((d) => {
        const month = new Date(d.disbursementDate).toLocaleString("default", {
          month: "short",
        });
        return month === selectedMonth;
      });
    }

    // Get status from URL params instead of state
    const statusParam = searchParams.get("status");
    if (statusParam) {
      filtered = filtered.filter(
        (d) => d.status.toLowerCase() === statusParam.toLowerCase()
      );
    }

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(
        (d) =>
          d.disbursementDate >= dateRange.from &&
          d.disbursementDate <= dateRange.to
      );
    }

    setDisbursements(filtered);
  }, [searchTerm, selectedMonth, dateRange, searchParams]); // Add searchParams to dependencies

  const handleTreatmentClick = (disbursement: Disbursement) => {
    setSelectedTreatments(disbursement.treatments);
    setModalType("treatments");
    setIsModalOpen(true);
  };

  const handlePatientClick = (disbursement: Disbursement) => {
    setSelectedPatients(disbursement.patients);
    setModalType("patients");
    setIsModalOpen(true);
  };

  // Update the status select handler
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newSearchParams = new URLSearchParams(searchParams);

    if (value) {
      newSearchParams.set("status", value);
    } else {
      newSearchParams.delete("status");
    }

    setSearchParams(newSearchParams);
    setSelectedStatus(value);
  };

  // Update the month select handler
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newSearchParams = new URLSearchParams(searchParams);

    if (value) {
      newSearchParams.set("month", value);
    } else {
      newSearchParams.delete("month");
    }

    setSearchParams(newSearchParams);
    setSelectedMonth(value);
  };

  return (
    <div>
      <PageMeta title="Earnings List" />
      <PageBreadcrumb pageTitle="Earnings List" />

      {/* Active Filters */}
      {searchParams.size > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {searchParams.get("category") && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium capitalize ${getCategoryTagStyles(
                  searchParams.get("category") || ""
                )}`}
              >
                {searchParams.get("category")}
                <button
                  onClick={() => removeFilter("category")}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-opacity-20"
                >
                  <span className="sr-only">Remove filter</span>×
                </button>
              </span>
            )}
            {searchParams.get("month") && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 capitalize">
                {getFullMonthName(searchParams.get("month") || "")}
                <button
                  onClick={() => removeFilter("month")}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                >
                  <span className="sr-only">Remove filter</span>×
                </button>
              </span>
            )}
            {searchParams.get("status") && (
              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-400">
                Status: {searchParams.get("status")}
                <button
                  onClick={() => removeFilter("status")}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-green-200"
                >
                  <span className="sr-only">Remove filter</span>×
                </button>
              </span>
            )}
            {searchParams.get("search") && (
              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                Search: {searchParams.get("search")}
                <button
                  onClick={() => removeFilter("search")}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-purple-200"
                >
                  <span className="sr-only">Remove filter</span>×
                </button>
              </span>
            )}
            {(searchParams.get("dateFrom") || searchParams.get("dateTo")) && (
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-sm font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                Date Range: {searchParams.get("dateFrom")} -{" "}
                {searchParams.get("dateTo")}
                <button
                  onClick={() => {
                    removeFilter("dateFrom");
                    removeFilter("dateTo");
                  }}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-orange-200"
                >
                  <span className="sr-only">Remove filter</span>×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search disbursement #"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-500 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Month Dropdown */}
        <div>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-500 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            value={searchParams.get("month") || ""}
            onChange={handleMonthChange}
          >
            <option value="">Select Month</option>
            {[
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
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-500 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            value={searchParams.get("status") || ""}
            onChange={handleStatusChange}
          >
            <option value="">Select Status</option>
            <option value="Disbursed">Disbursed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex gap-2">
          <DatePicker
            id="date-from"
            placeholder="From"
            onChange={(dates) =>
              setDateRange((prev: any) => ({ ...prev, from: dates[0] }))
            }
          />
          <DatePicker
            id="date-to"
            placeholder="To"
            onChange={(dates) =>
              setDateRange((prev: any) => ({ ...prev, to: dates[0] }))
            }
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Disbursement #
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-right dark:text-gray-400"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  # of Treatments
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Total Patients
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
              {disbursements.map((disbursement) => (
                <TableRow
                  key={disbursement.id}
                  className="border-b border-gray-200 last:border-0 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                    {disbursement.disbursementNumber}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                    {new Date(
                      disbursement.disbursementDate
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 text-right dark:text-gray-200">
                    ₱{disbursement.amount.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className="px-6 py-4 text-brand-500 text-center dark:text-brand-400 cursor-pointer hover:text-brand-600 dark:hover:text-brand-500"
                    onClick={() => handleTreatmentClick(disbursement)}
                  >
                    {disbursement.numberOfTreatments}
                  </TableCell>
                  <TableCell
                    className="px-6 py-4 text-brand-500 text-center dark:text-brand-400 cursor-pointer hover:text-brand-600 dark:hover:text-brand-500"
                    onClick={() => handlePatientClick(disbursement)}
                  >
                    {disbursement.totalPatients}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        searchParams.get("category") === "disbursed"
                          ? "bg-success-50 text-success-700"
                          : "bg-warning-50 text-warning-700"
                      }`}
                    >
                      {searchParams.get("category")}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <button className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600">
                      View 2307 Document
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        treatments={modalType === "treatments" ? selectedTreatments : undefined}
        patients={modalType === "patients" ? selectedPatients : undefined}
        type={modalType}
      />
    </div>
  );
}
