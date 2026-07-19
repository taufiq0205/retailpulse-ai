import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LogIn, Key, AlertCircle } from "lucide-react";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        setError(authErr.message);
      } else {
        // Redirect to requested page or dashboard
        navigate(from, { replace: true });
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
            Sign in to RetailPulse AI
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Malaysian SME Inventory Demand Forecaster
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              required
              placeholder="e.g. mtaufiq456@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={loading}
              disabled={loading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-emerald-600 hover:text-emerald-500 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
