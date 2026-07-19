import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedShell } from "./components/layout/ProtectedShell";

// Page imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import InventoryPage from "./pages/Inventory";
import Upload from "./pages/Upload";
import Forecasts from "./pages/Forecasts";
import Recommendations from "./pages/Recommendations";
import Alerts from "./pages/Alerts";
import ModelPerformance from "./pages/ModelPerformance";
import Settings from "./pages/Settings";

// Instantiate TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent redundant requests on window focus
      retry: 1, // Fail fast on errors
      staleTime: 5000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Core Dashboard Pages */}
            <Route
              path="/"
              element={
                <ProtectedShell>
                  <Dashboard />
                </ProtectedShell>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedShell>
                  <Products />
                </ProtectedShell>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedShell>
                  <InventoryPage />
                </ProtectedShell>
              }
            />
            <Route
              path="/sales/upload"
              element={
                <ProtectedShell>
                  <Upload />
                </ProtectedShell>
              }
            />
            <Route
              path="/forecasts"
              element={
                <ProtectedShell>
                  <Forecasts />
                </ProtectedShell>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedShell>
                  <Recommendations />
                </ProtectedShell>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedShell>
                  <Alerts />
                </ProtectedShell>
              }
            />
            <Route
              path="/model-performance"
              element={
                <ProtectedShell>
                  <ModelPerformance />
                </ProtectedShell>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedShell>
                  <Settings />
                </ProtectedShell>
              }
            />

            {/* Wildcard Route Safeguard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
