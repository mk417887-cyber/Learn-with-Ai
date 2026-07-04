import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';


const RegisterPage = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.register(username, email, password);

      toast.success('Registration is successful , Please login');
      navigate('/login');

    } catch (error) {
      setError(error.message || 'Failed to Register , please try again');
      toast.error(error.message || 'Failed to Register , please try again');

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">

      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30" />

      <div className="relative w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50  p-10 ">
          {/* Header */}
          <div className="text-center  mb-10">
            <div className="inline-flex items-center justify-center  w-14 h-14 rounded-2xl  bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25  mb-6">
              <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              Sign up for your AI-powered journey
            </p>
          </div>

          {/* Form */}
          <div className="">
            {/* Username Field */}
            <div className="">
              <label className="">
                Username
              </label>
              <div className="">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "username" ? "text-emerald-500" : "text-gray-400"
                    }`}
                >
                  <User className="" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Email
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-emerald-500" : "text-gray-400"
                    }`}>
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full  h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500 text-sm font-medium transition-all  duration-200 "
                  placeholder="you@example.com"
                />

              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="  block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Password
              </label>

              <div className="relative w-full">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 transition-colors duration-200 
                                 ${focusedField === "password" ? "text-emerald-500" : "text-slate-400"
                    }`}
                >
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-2.5 text-2xl bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-all duration-200 "
                  placeholder="********"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="">
                <p className="">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className=""
            >
              <span className="">
                {loading ? (
                  <>
                    <div className="" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      className=""
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </span>
              <div className='' />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/60">
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Subtle footer text */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>

        );
}


export default RegisterPage;
