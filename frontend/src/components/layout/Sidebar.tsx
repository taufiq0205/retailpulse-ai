import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Database,
  UploadCloud,
  TrendingUp,
  PackageCheck,
  AlertTriangle,
  Cpu,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navigation = [
  { name: "Dashboard", to: "/", icon: LayoutDashboard },
  { name: "Products", to: "/products", icon: ShoppingBag },
  { name: "Inventory", to: "/inventory", icon: Database },
  { name: "Upload", to: "/sales/upload", icon: UploadCloud },
  { name: "Forecasts", to: "/forecasts", icon: TrendingUp },
  { name: "Recommendations", to: "/recommendations", icon: PackageCheck },
  { name: "Alerts", to: "/alerts", icon: AlertTriangle, badge: true },
  { name: "Model", to: "/model-performance", icon: Cpu },
  { name: "Settings", to: "/settings", icon: Settings },
];

export const Sidebar: React.FC<{ highRiskCount?: number }> = ({ highRiskCount = 0 }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-[#E6E2DE] text-[#4A443F] min-h-screen flex-shrink-0">
        <div className="flex items-center h-16 px-6 border-b border-[#E6E2DE] gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A5A40] font-bold text-white">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-lg text-[#2C2926]">RetailPulse AI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-150 relative font-medium",
                    isActive
                      ? "bg-[#F1EFEC] text-[#5A5A40] font-semibold"
                      : "text-[#7A7169] hover:bg-[#FAF9F7] hover:text-[#2C2926]"
                  )
                }
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.badge && highRiskCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold leading-none text-red-600 bg-red-100 rounded-full">
                    {highRiskCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E6E2DE] text-[11px] text-[#A69F98] uppercase tracking-widest font-bold">
          Store Manager Mode
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6E2DE] text-[#4A443F] flex justify-around items-center h-16 px-1 shadow-md">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-colors relative",
                  isActive ? "text-[#5A5A40] font-bold" : "text-[#7A7169] hover:text-[#2C2926]"
                )
              }
              title={item.name}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && highRiskCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center text-[8px] font-bold text-red-600 bg-red-100 rounded-full scale-75" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-medium max-w-[65px] truncate">
                {item.name === "Recommendations" ? "Reorders" : item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
