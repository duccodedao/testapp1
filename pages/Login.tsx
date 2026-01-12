
import React, { useState } from 'react';
import { loginWithGoogle, isAdmin } from '../firebase';
import { ShieldCheck, LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      if (!isAdmin(user)) {
        setError("Access Denied: Your account does not have admin privileges.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Admin Console</h1>
          <p className="text-slate-500">Sign in to manage your portfolio content.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex gap-3 text-red-700 text-sm rounded-r-xl">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
          )}
          {loading ? 'Authenticating...' : 'Continue with Google'}
        </button>

        <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
          <a href="/" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            ← Back to Site
          </a>
          <span className="text-xs text-slate-300">Protected Area</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
