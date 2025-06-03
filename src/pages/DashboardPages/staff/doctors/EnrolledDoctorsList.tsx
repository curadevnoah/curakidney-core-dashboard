import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/_archives/ui/table";
import { useDoctorsService } from "@/services/modules/doctors.service";

interface Doctor {
  PRCNumber: string;
  PhysicianName: string;
  Email: string;
  ContactNumber: string;
  ProfessionalTaxReceipt: string | null;
  PhilHealthAccreditationNumber: string;
  S2LicenseNumber: string | null;
  TIN: string;
  status?: DoctorStatus;
}

type DoctorStatus =
  | "Pending"
  | "Email Sent"
  | "Details Verified"
  | "Credentials Created"
  | "Account Active";

interface SearchFilters {
  PRCNumber: string;
  PhysicianName: string;
  Email: string;
}

export default function EnrolledDoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    PRCNumber: "",
    PhysicianName: "",
    Email: "",
  });
  const { getDoctors, sendWelcomeEmail } = useDoctorsService();

  const filterDoctors = useCallback(() => {
    const filtered = doctors.filter((doctor: Doctor) => {
      const prcMatch =
        doctor.PRCNumber?.toLowerCase().includes(
          searchFilters.PRCNumber.toLowerCase()
        ) ?? false;

      const searchName = searchFilters.PhysicianName.toLowerCase().trim();
      const doctorName = doctor.PhysicianName?.toLowerCase().trim() ?? "";

      let nameMatch = true;
      if (searchName !== "") {
        nameMatch = doctorName.includes(searchName);
      }

      const searchEmail = searchFilters.Email.toLowerCase().trim();
      const doctorEmail = doctor.Email?.toLowerCase().trim() ?? "";

      let emailMatch = true;
      if (searchEmail !== "") {
        emailMatch = doctorEmail.includes(searchEmail);
      }

      return prcMatch && nameMatch && emailMatch;
    });
    setFilteredDoctors(filtered);
  }, [doctors, searchFilters]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [filterDoctors]);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (column: keyof SearchFilters, value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      PRCNumber: "",
      PhysicianName: "",
      Email: "",
    });
  };

  const handleSendCredentials = (PRCNumber: string) => {
    const doctor = doctors.find((d: Doctor) => d.PRCNumber === PRCNumber);
    if (!doctor?.Email) return;

    sendWelcomeEmail(doctor.Email).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });
  };

  // Add status badges helper function
  const getStatusBadge = (status: DoctorStatus = "Pending") => {
    const statusClasses: Record<DoctorStatus, string> = {
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400",
      "Email Sent":
        "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
      "Details Verified":
        "bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-400",
      "Credentials Created":
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-400",
      "Account Active":
        "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400",
    };

    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <PageMeta title="Enrolled Doctors List" />
      <PageBreadcrumb pageTitle="Enrolled Doctors List" />

      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          onClick={clearFilters}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Clear Filters
        </button>
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
                  <div className="flex flex-col gap-2">
                    <span>PRC Number</span>
                    <input
                      type="text"
                      value={searchFilters.PRCNumber}
                      onChange={(e) =>
                        handleSearchChange("PRCNumber", e.target.value)
                      }
                      placeholder="Search PRC"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  <div className="flex flex-col gap-2">
                    <span>Name</span>
                    <input
                      type="text"
                      value={searchFilters.PhysicianName}
                      onChange={(e) =>
                        handleSearchChange("PhysicianName", e.target.value)
                      }
                      placeholder="Search name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  <div className="flex flex-col gap-2">
                    <span>Email</span>
                    <input
                      type="text"
                      value={searchFilters.Email}
                      onChange={(e) =>
                        handleSearchChange("Email", e.target.value)
                      }
                      placeholder="Search email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left dark:text-gray-400"
                >
                  Status
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
                  <TableCell colSpan={5} className="px-6 py-4 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-4 text-center">
                    No doctors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors.map((doctor) => (
                  <TableRow
                    key={doctor.PRCNumber}
                    className="border-b border-gray-200 last:border-0 dark:border-gray-800"
                  >
                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      {doctor.PRCNumber}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      {doctor.PhysicianName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      {doctor.Email}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 text-left dark:text-gray-200">
                      {getStatusBadge(doctor.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSendCredentials(doctor.PRCNumber)}
                        className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
                      >
                        Send Account Credentials
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
