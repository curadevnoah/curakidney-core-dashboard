import React from "react";
import GridShape from "@/components/_archives/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "@/components/_archives/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        <div className="flex justify-center mb-8 lg:hidden">
          <Link to="/">
            <img
              width={200}
              height={48}
              src="/images/curakidney-logo-transparent.png"
              alt="Logo"
              className="mb-2"
            />
          </Link>
        </div>

        {children}

        {/* Desktop Right Section */}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={300}
                  height={72}
                  src="/images/curakidney-logo-transparent.png"
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                CuraKidney Web Dashboard
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
