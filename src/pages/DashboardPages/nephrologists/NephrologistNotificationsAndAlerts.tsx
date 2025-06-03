import { useState } from "react";
import PageBreadcrumb from "@/components/_archives/common/PageBreadCrumb";
import PageMeta from "@/components/_archives/common/PageMeta";
import { Modal } from "@/components/_archives/ui/modal";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: string;
  category: "patient_instructions" | "complications";
  patientName: string;
}

interface ComplicationDetails {
  patient: string;
  date: string;
  type: string;
  description: string;
  actionsTaken: string;
  nurseNotes: string;
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export default function NotificationsAndAlerts() {
  const [activeTab, setActiveTab] = useState<
    "patient_instructions" | "complications"
  >("patient_instructions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplication, setSelectedComplication] =
    useState<ComplicationDetails | null>(null);

  const notifications: Notification[] = [
    {
      id: "1",
      title: "Patient Instruction Reply",
      message:
        "Nurse Williams from Clinic Center A: First reading taken: 140/90 mmHg. Patient is stable and responding well to treatment.",
      type: "info",
      timestamp: "2023-04-07T15:00:00",
      category: "patient_instructions",
      patientName: "John Doe",
    },
    {
      id: "2",
      title: "Patient Instruction Reply",
      message:
        "Nurse Williams from Clinic Center A: First reading taken: 140/90 mmHg. Patient is stable and responding well to treatment.",
      type: "info",
      timestamp: "2023-04-05T10:30:00",
      category: "patient_instructions",
      patientName: "John Doe",
    },
    {
      id: "3",
      title: "Patient Instruction Reply",
      message:
        "Nurse Williams from Clinic Center A: First reading taken: 140/90 mmHg. Patient is stable and responding well to treatment.",
      type: "info",
      timestamp: "2023-04-05T10:30:00",
      category: "patient_instructions",
      patientName: "John Doe",
    },
    {
      id: "4",
      title: "Urgent: Patient Complication",
      message: "Patient John Doe reported severe headache post-dialysis",
      type: "error",
      timestamp: "2024-01-20T09:15:00",
      category: "complications",
      patientName: "John Doe",
    },
  ];

  // Calculate notification counts per category
  const notificationCounts = {
    patient_instructions: notifications.filter(
      (n) => n.category === "patient_instructions"
    ).length,
    complications: notifications.filter((n) => n.category === "complications")
      .length,
  };

  const filteredNotifications = notifications.filter(
    (notification) => notification.category === activeTab
  );

  const handleOpenThread = (notificationId: string) => {
    console.log(`Opening thread for notification ${notificationId}`);
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedComplication({
      patient: notification.patientName,
      date: new Date(notification.timestamp).toLocaleDateString(),
      type: "Hypotension",
      description: "Patient experienced low blood pressure during dialysis",
      actionsTaken: "Reduced UF rate, administered saline",
      nurseNotes: "Patient stabilized after interventions",
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <PageMeta title="Notifications & Alerts" />
      <PageBreadcrumb pageTitle="Notifications & Alerts" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              className={`pb-4 text-sm font-medium flex items-center gap-2 ${
                activeTab === "patient_instructions"
                  ? "border-b-2 border-brand-500 text-brand-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("patient_instructions")}
            >
              Patient Instructions
              {notificationCounts.patient_instructions > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {notificationCounts.patient_instructions}
                </span>
              )}
            </button>
            <button
              className={`pb-4 text-sm font-medium flex items-center gap-2 ${
                activeTab === "complications"
                  ? "border-b-2 border-brand-500 text-brand-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("complications")}
            >
              Complications
              {notificationCounts.complications > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {notificationCounts.complications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${
                notification.category === "complications"
                  ? "border-warning-200 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">
                    {formatDate(notification.timestamp)}
                  </span>
                </div>
                {notification.category === "complications" ? (
                  <button
                    onClick={() => handleViewDetails(notification)}
                    className="rounded-md bg-warning-600 px-3 py-1 text-sm text-white hover:bg-warning-700"
                  >
                    <span className="sm:hidden">View</span>
                    <span className="hidden sm:inline">View Details</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenThread(notification.id)}
                    className="rounded-md bg-teal-500 px-3 py-1 text-sm text-white hover:bg-teal-600"
                  >
                    <span className="sm:hidden">View</span>
                    <span className="hidden sm:inline">Open Thread</span>
                  </button>
                )}
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Patient:</p>
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {notification.patientName}
                </span>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No notifications in this category
            </div>
          )}
        </div>
      </div>

      {/* Complication Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-md mx-auto my-8"
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Complication Details
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>×
            </button>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="py-3 grid grid-cols-3">
              <span className="text-gray-500">Patient</span>
              <span className="col-span-2 text-gray-900 dark:text-white">
                {selectedComplication?.patient}
              </span>
            </div>
            <div className="py-3 grid grid-cols-3">
              <span className="text-gray-500">Date</span>
              <span className="col-span-2 text-gray-900 dark:text-white">
                {selectedComplication?.date}
              </span>
            </div>
            <div className="py-3 grid grid-cols-3">
              <span className="text-gray-500">Type</span>
              <span className="col-span-2 text-gray-900 dark:text-white">
                {selectedComplication?.type}
              </span>
            </div>
            <div className="py-3 grid grid-cols-3">
              <span className="text-gray-500">Description</span>
              <span className="col-span-2 text-gray-900 dark:text-white">
                {selectedComplication?.description}
              </span>
            </div>
            <div className="py-3 grid grid-cols-3">
              <span className="text-gray-500">Actions Taken</span>
              <span className="col-span-2 text-gray-900 dark:text-white">
                {selectedComplication?.actionsTaken}
              </span>
            </div>
            <div className="py-3 grid grid-cols-3">
              <span className="text-gray-500">Nurse Notes</span>
              <span className="col-span-2 text-gray-900 dark:text-white">
                {selectedComplication?.nurseNotes}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
