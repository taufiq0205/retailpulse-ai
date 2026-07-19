import React from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { User, Store, Shield, LogOut, Info } from "lucide-react";

export const Settings: React.FC = () => {
  const { user, storeName, signOut } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">App Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account profile, store logistics contexts, and security presets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <User className="h-4 w-4 text-emerald-600" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Registered Email</span>
                  <p className="text-sm font-bold text-slate-700 mt-1 select-all">{user?.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Authorized Role</span>
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md inline-block mt-1">
                    Store Manager (MVP)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Card */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Store className="h-4 w-4 text-emerald-600" />
                Active Store Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg text-xs flex gap-1.5 leading-relaxed">
                <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-500">
                  The MVP is currently restricted to a <strong>single store workspace</strong> to maintain high forecasting accuracy. Multi-store toggles will be introduced in future enterprise rollouts.
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Store Name</span>
                <p className="text-sm font-black text-slate-800 mt-1">{storeName}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Location: Kuala Lumpur, Malaysia</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security / Admin Actions Card */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-600" />
                Session Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-xs text-slate-400 leading-relaxed text-left">
                Sign out of your active session on this device. This clears all local cache, in-memory catalogs, and session hashes securely.
              </p>
              <Button
                variant="danger"
                className="w-full flex items-center justify-center gap-1.5"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Settings;
