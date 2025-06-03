import { useState } from "react";
import { useAuthStore } from "@/store";
import PageMeta from "@/components/_archives/common/PageMeta";
import Button from "@/components/_archives/ui/button/Button";
import Input from "@/components/_archives/form/input/InputField";
import Label from "@/components/_archives/form/Label";

type TabType = "Account Information" | "Security" | "Danger Zone";

export default function MyAccount() {
  const [activeTab, setActiveTab] = useState<TabType>("Account Information");
  const { user } = useAuthStore();

  const handleDeleteAccount = () => {
    // Add confirmation modal and deletion logic here
    console.log("Delete account");
  };

  const renderAccountInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <Label>First Name</Label>
          <Input type="text" value={user?.firstName || ""} disabled />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input type="text" value={user?.lastName || ""} disabled />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={user?.email || ""} disabled />
        </div>
        <div>
          <Label>Role</Label>
          <Input type="text" value={user?.role || ""} disabled />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Change Password
        </h3>
        <div className="grid grid-cols-1 gap-6 max-w-md">
          <div>
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" />
          </div>
          <div>
            <Button size="sm">Update Password</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDangerZone = () => (
    <div className="space-y-6">
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:border-red-800/50 dark:bg-red-900/20">
        <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-500">
          Delete Account
        </h3>
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button size="sm" variant="danger" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <PageMeta title="My Account" />
      <div className="min-h-screen rounded-xl sm:rounded-2xl border border-gray-200 bg-white px-3 sm:px-5 py-4 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          My Account
        </h2>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            {["Account Information", "Security", "Danger Zone"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
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

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "Account Information" && renderAccountInformation()}
          {activeTab === "Security" && renderSecurity()}
          {activeTab === "Danger Zone" && renderDangerZone()}
        </div>
      </div>
    </>
  );
}
