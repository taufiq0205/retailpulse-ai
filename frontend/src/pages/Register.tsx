import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            store_name: storeName || "My Retail Store",
            role: "store_manager",
          },
        },
      });

      if (authErr) {
        setError(authErr.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-800">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-500/20 text-xl">
            RP
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
            Create your Store Account
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            RetailPulse AI Demand Forecaster Registration
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Registration successful! Redirecting to RetailPulse dashboard...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Store / Business Name"
              type="text"
              required
              placeholder="e.g. Kedai Runcit Mas Jaya"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />

            <Input
              label="Manager Email Address"
              type="email"
              required
              placeholder="e.g. manager@masjaya.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={loading}
              disabled={loading || success}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register Account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-600 hover:text-emerald-500 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
