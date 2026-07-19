import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const ProtectedShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Query to get alerts for showing high risk badge in sidebar
  const { data: alerts = [] } = useQuery({
    queryKey: ["alertsCount"],
    queryFn: () => api.getAlerts(),
    enabled: !!user,
    refetchInterval: 30000, // Sync every 30s
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E6E2DE] border-t-[#5A5A40]" />
          <span className="text-sm font-medium text-[#7A7169]">Retrieving RetailPulse session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, storing current location to return back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const highRiskCount = alerts.length;

  return (
    <div className="flex min-h-screen bg-[#F8F7F4] text-[#4A443F]">
      {/* Sidebar - Desktop and Mobile wrapper */}
      <Sidebar highRiskCount={highRiskCount} />

      {/* Main app body */}
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
        <TopBar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
