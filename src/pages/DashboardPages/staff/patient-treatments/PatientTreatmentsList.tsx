import { useEffect, useState, useMemo, useCallback } from "react";
import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/_archives/ui/table";
import { usePatientTreatmentsService } from "@/services";
import { toast } from "react-toastify";
import DatePicker from "@/components/_archives/form/date-picker";

interface PatientTreatment {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName: string;
  treatmentType: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  notes: string;
  amount: number;
  paymentStatus: "PENDING" | "PAID";
}

export default function PatientTreatmentsList() {
  const [treatments, setTreatments] = useState<PatientTreatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // New state for tracking update API call
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [paidTreatmentIds, setPaidTreatmentIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("paidTreatmentIds");
    return saved ? JSON.parse(saved) : [];
  });

  // Filter states
  const [doctorNameFilter, setDoctorNameFilter] = useState("");
  const [patientNameFilter, setPatientNameFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: string | null;
    to: string | null;
  }>({
    from: null,
    to: null,
  });

  // Add state for date range selection mode
  const [isDateRangeSelectionMode, setIsDateRangeSelectionMode] =
    useState(false);

  const { getPatientTreatments, updatePaymentStatus } =
    usePatientTreatmentsService();

  // Update localStorage whenever paidTreatmentIds changes
  useEffect(() => {
    localStorage.setItem("paidTreatmentIds", JSON.stringify(paidTreatmentIds));
  }, [paidTreatmentIds]);

  useEffect(() => {
    fetchPatientTreatments();
  }, []);

  const fetchPatientTreatments = async () => {
    try {
      const data = await getPatientTreatments();
      setTreatments(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = () => {
    const selectableIds = treatments
      .filter((t) => !isTreatmentPaid(t.id))
      .map((t) => t.id);

    if (selectedIds.length === selectableIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableIds);
    }
  };

  const toggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  const handleMarkAsPaid = async () => {
    if (
      !confirm("Do you confirm to proceed to set these treatments as PAID?")
    ) {
      return;
    }

    setIsUpdating(true);
    try {
      await updatePaymentStatus(selectedIds);

      setPaidTreatmentIds((prev) => [...prev, ...selectedIds]);
      setSelectedIds([]);
      toast.success(
        "Payment status has been updated, notification sent to doctor"
      );
    } catch (error) {
      console.error("Failed to update payment status:", error);
      toast.error("Failed to update payment status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkSingleAsPaid = async (treatmentId: number) => {
    if (!confirm("Do you confirm to mark this treatment as PAID?")) {
      return;
    }

    setIsUpdating(true);
    try {
      await updatePaymentStatus([treatmentId]);
      setPaidTreatmentIds((prev) => [...prev, treatmentId]);
      toast.success(
        "Payment status has been updated, notification sent to doctor"
      );
    } catch (error) {
      console.error("Failed to update payment status:", error);
      toast.error("Failed to update payment status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsUnpaid = async (treatmentId: number) => {
    if (!confirm("Do you confirm to mark this treatment as UNPAID?")) {
      return;
    }

    setIsUpdating(true);
    try {
      // Remove from paidTreatmentIds
      setPaidTreatmentIds((prev) => prev.filter((id) => id !== treatmentId));
      toast.success("Payment status has been updated to UNPAID");
    } catch (error) {
      console.error("Failed to update payment status:", error);
      toast.error("Failed to update payment status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isTreatmentPaid = useCallback(
    (treatmentId: number) => {
      return paidTreatmentIds.includes(treatmentId);
    },
    [paidTreatmentIds]
  );

  // Function to select all treatments within the date range
  const selectTreatmentsByDateRange = () => {
    if (!dateRange.from && !dateRange.to) {
      toast.warning("Please set a date range first");
      return;
    }

    const treatmentsInRange = treatments.filter((treatment) => {
      if (!treatment.startDate) return false;
      if (isTreatmentPaid(treatment.id)) return false;

      const treatmentDate = new Date(treatment.startDate);

      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        if (treatmentDate < fromDate) return false;
      }

      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (treatmentDate > toDate) return false;
      }

      return true;
    });

    const treatmentIds = treatmentsInRange.map((t) => t.id);
    setSelectedIds(treatmentIds);

    if (treatmentIds.length === 0) {
      toast.info("No unpaid treatments found in the selected date range");
    } else {
      toast.success(
        `Selected ${treatmentIds.length} treatments in the date range`
      );
    }
  };

  // Filter treatments based on filter criteria
  const filteredTreatments = useMemo(() => {
    return treatments.filter((treatment) => {
      // Doctor name filter
      if (
        doctorNameFilter &&
        !treatment.doctorName
          .toLowerCase()
          .includes(doctorNameFilter.toLowerCase())
      ) {
        return false;
      }

      // Patient name filter (assuming "John Doe" for all patients in this example)
      if (
        patientNameFilter &&
        !"John Doe".toLowerCase().includes(patientNameFilter.toLowerCase())
      ) {
        return false;
      }

      // Payment status filter
      if (paymentStatusFilter) {
        const isPaid = isTreatmentPaid(treatment.id);
        if (
          (paymentStatusFilter === "PAID" && !isPaid) ||
          (paymentStatusFilter === "PENDING" && isPaid)
        ) {
          return false;
        }
      }

      // Date range filter
      if (dateRange.from && treatment.startDate) {
        const treatmentDate = new Date(treatment.startDate);
        const fromDate = new Date(dateRange.from);
        if (treatmentDate < fromDate) {
          return false;
        }
      }

      if (dateRange.to && treatment.startDate) {
        const treatmentDate = new Date(treatment.startDate);
        const toDate = new Date(dateRange.to);
        // Set time to end of day for inclusive filtering
        toDate.setHours(23, 59, 59, 999);
        if (treatmentDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [
    treatments,
    doctorNameFilter,
    patientNameFilter,
    paymentStatusFilter,
    dateRange,
    isTreatmentPaid,
  ]);

  return (
    <div>
      <PageMeta title="Patient Treatments List" />
      <PageBreadcrumb pageTitle="Patient Treatments" />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Filters */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Doctor Name Filter */}
            <div>
              <input
                type="text"
                placeholder="Filter by doctor name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                value={doctorNameFilter}
                onChange={(e) => setDoctorNameFilter(e.target.value)}
              />
            </div>

            {/* Patient Name Filter */}
            <div>
              <input
                type="text"
                placeholder="Filter by patient name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                value={patientNameFilter}
                onChange={(e) => setPatientNameFilter(e.target.value)}
              />
            </div>

            {/* Payment Status Filter */}
            <div>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <option value="">All Payment Statuses</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <DatePicker
                    id="date-from"
                    placeholder="From"
                    onChange={(dates) => {
                      if (dates && dates.length > 0) {
                        setDateRange((prev) => ({
                          ...prev,
                          from: dates[0].toISOString().split("T")[0],
                        }));
                      }
                    }}
                  />
                </div>
                <div className="w-1/2">
                  <DatePicker
                    id="date-to"
                    placeholder="To"
                    onChange={(dates) => {
                      if (dates && dates.length > 0) {
                        setDateRange((prev) => ({
                          ...prev,
                          to: dates[0].toISOString().split("T")[0],
                        }));
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={isDateRangeSelectionMode}
                    onChange={(e) =>
                      setIsDateRangeSelectionMode(e.target.checked)
                    }
                    className="rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                  Date range selection mode
                </label>
                {isDateRangeSelectionMode && (
                  <button
                    onClick={selectTreatmentsByDateRange}
                    className="rounded-md bg-brand-500 px-2 py-1 text-xs font-medium text-white hover:bg-brand-600"
                  >
                    Select by date
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS BAR */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/20">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDateRangeSelectionMode && dateRange.from && dateRange.to
                ? `Selected ${selectedIds.length} treatments from ${new Date(
                    dateRange.from
                  ).toLocaleDateString()} to ${new Date(
                    dateRange.to
                  ).toLocaleDateString()}`
                : `Selected ${selectedIds.length} treatments`}
            </span>
            <button
              onClick={handleMarkAsPaid}
              disabled={isUpdating}
              className="rounded-lg border border-teal-500 px-4 py-2 text-sm font-semibold text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Mark selected treatments as paid"
              )}
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={
                      treatments.length > 0 &&
                      selectedIds.length ===
                        treatments.filter((t) => !isTreatmentPaid(t.id)).length
                    }
                    onChange={toggleSelectAll}
                    disabled={isLoading || isUpdating}
                  />
                </TableCell>

                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Doctor Name
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Patient Name
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Treatment Date
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Payment Status
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-center dark:text-gray-400"
                >
                  Mark as Paid
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-right dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-gray-500">
                        Loading treatments...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTreatments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-4 text-center">
                    No treatments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTreatments.map((treatment) => (
                  <TableRow
                    key={treatment.id}
                    className="border-b border-gray-200 last:border-0 dark:border-gray-800"
                  >
                    <TableCell className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected(treatment.id)}
                        onChange={() => toggleSelectOne(treatment.id)}
                        disabled={isTreatmentPaid(treatment.id) || isUpdating}
                      />
                    </TableCell>

                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      {treatment.id}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      {treatment.doctorName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      John Doe
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      {treatment.startDate
                        ? new Date(treatment.startDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      {isTreatmentPaid(treatment.id) ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-400">
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-sm font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                          PENDING
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {!isTreatmentPaid(treatment.id) ? (
                        <button
                          onClick={() => handleMarkSingleAsPaid(treatment.id)}
                          disabled={isUpdating}
                          className="rounded-lg bg-success-500 px-4 py-2 text-xs font-medium text-white hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? "Processing..." : "Mark as Paid"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsUnpaid(treatment.id)}
                          disabled={isUpdating}
                          className="rounded-lg border border-red-500 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? "Processing..." : "Mark as Unpaid"}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="flex flex-row justify-end gap-x-3 px-6 py-4">
                      <button className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600">
                        View treatment sheet
                      </button>
                      <button className="rounded-lg bg-success-500 px-4 py-2 text-xs font-medium text-white hover:bg-success-600 hidden">
                        Mark payment as PAID
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
