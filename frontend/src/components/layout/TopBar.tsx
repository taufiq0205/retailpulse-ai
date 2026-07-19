import React from "react";
import { LogOut, Store, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export const TopBar: React.FC = () => {
  const { user, storeName, signOut } = useAuth();

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "M";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E6E2DE] bg-white px-6">
      {/* Store context indicator */}
      <div className="flex items-center gap-3 text-[#4A443F]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1EFEC] text-[#5A5A40] border border-[#E6E2DE]">
          <Store className="h-4.5 w-4.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#A69F98] uppercase tracking-wider leading-none">
            Current Store
          </span>
          <span className="text-sm font-semibold text-[#2C2926] tracking-tight mt-0.5">
            {storeName}
          </span>
        </div>
      </div>

      {/* User profile action menu */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-[#E6E2DE]">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-sm font-medium text-[#2C2926] leading-none truncate max-w-[150px]">
              {user?.email?.split("@")[0] || "Ahmad Razali"}
            </span>
            <span className="text-xs text-[#A69F98] mt-1 leading-none">
              Store Manager
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E2DE] border-2 border-white shadow-sm font-bold text-[#5A5A40] select-none text-sm">
            {userInitial}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          title="Sign out"
          className="text-[#A69F98] hover:text-red-600 hover:bg-red-50/50 rounded-lg h-9 w-9"
          aria-label="Sign out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </Button>
      </div>
    </header>
  );
};
