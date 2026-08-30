import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SEEDED_VENDORS, SEEDED_CUSTOMERS } from '../../lib/supabase';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Store,
  User,
  Scissors,
  ShoppingBag,
  Wrench,
  Cake
} from 'lucide-react';

const VENDOR_ICONS = [
  <Scissors className="w-5 h-5 text-[#ff5600]" />,
  <ShoppingBag className="w-5 h-5 text-[#ff5600]" />,
  <Wrench className="w-5 h-5 text-[#ff5600]" />,
  <Cake className="w-5 h-5 text-[#ff5600]" />,
];

export const LoginPage: React.FC = () => {
  const { signInWithOtp, verifyOtp, loginAsVendor, loginAsCustomer, vendorList } = useAuth();

  const [loginType, setLoginType] = useState<'customer' | 'vendor'>('customer');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Send Email OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { error } = await signInWithOtp(email.trim());
      if (error) {
        setErrorMessage(error.message || 'Failed to send OTP code. Please try again.');
      } else {
        setSuccessMessage(`OTP code sent via Resend SMTP to ${email}`);
        setStep('otp');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await verifyOtp(email.trim(), otpToken.trim());
      if (error) {
        setErrorMessage(error.message || 'Invalid or expired OTP code.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomerLogin = (customer: typeof SEEDED_CUSTOMERS[0]) => {
    loginAsCustomer(customer);
  };

  const currentVendors = vendorList.length > 0 ? vendorList : SEEDED_VENDORS;

  return (
    <div className="min-h-screen bg-[#f5f1ec] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-[#d3cec6] rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#ff5600] mx-auto flex items-center justify-center font-black text-white text-xl shadow-md">
            ic
          </div>
          <h2 className="text-xl font-bold text-[#111111] tracking-wide flex items-center justify-center gap-2">
            via-P.A.A.R. <span className="text-[10px] bg-[#ff5600]/10 text-[#ff5600] px-2 py-0.5 rounded-full border border-[#ff5600]/30 font-semibold">Fin AI Engine</span>
          </h2>
          <p className="text-xs text-[#626260]">
            Two-Way Chat & Fin AI Order Parser
          </p>
        </div>

        {/* 🟢 TOP CHOICE TABS: CUSTOMER LOGIN vs VENDOR LOGIN */}
        <div className="flex bg-[#faf8f5] p-1 rounded-xl border border-[#d3cec6]">
          <button
            onClick={() => {
              setLoginType('customer');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              loginType === 'customer'
                ? 'bg-[#ff5600] text-white shadow-md'
                : 'text-[#626260] hover:text-[#111111]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>🛍️ Login as Customer</span>
          </button>

          <button
            onClick={() => {
              setLoginType('vendor');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              loginType === 'vendor'
                ? 'bg-[#ff5600] text-white shadow-md'
                : 'text-[#626260] hover:text-[#111111]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>🏪 Login as Vendor</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 🛍️ CUSTOMER EMAIL OTP & DEMO CUSTOMER CARDS FLOW */}
        {loginType === 'customer' && (
          <div className="space-y-4">
            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#626260] uppercase tracking-wider mb-2">
                    Customer Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#626260] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-[#faf8f5] border border-[#d3cec6] text-xs text-[#111111] placeholder-[#8696a0] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#ff5600]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-[#ff5600] hover:bg-[#e04b00] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#626260] uppercase tracking-wider mb-2">
                    Enter Verification Code
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#626260] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      placeholder="Enter code sent to email"
                      className="w-full bg-[#faf8f5] border border-[#d3cec6] text-xs text-[#111111] placeholder-[#8696a0] rounded-xl pl-10 pr-4 py-3 font-mono tracking-widest focus:outline-none focus:border-[#ff5600]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !otpToken.trim()}
                  className="w-full bg-[#ff5600] hover:bg-[#e04b00] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-center text-xs text-[#626260] hover:text-[#111111] pt-2 font-medium cursor-pointer"
                >
                  ← Back to Email Input
                </button>
              </form>
            )}

            {/* Quick Demo Customer Profiles */}
            <div className="pt-2 border-t border-[#d3cec6]">
              <div className="text-[10px] font-bold text-[#626260] uppercase tracking-wider mb-2 text-center">
                Or Login Directly as Demo Customer:
              </div>
              <div className="space-y-2">
                {SEEDED_CUSTOMERS.slice(0, 3).map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => handleDemoCustomerLogin(cust)}
                    className="w-full bg-[#faf8f5] hover:bg-[#f5f1ec] border border-[#d3cec6] hover:border-[#ff5600] p-2.5 px-3 rounded-xl text-left transition-all flex items-center justify-between group shadow-sm cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#ff5600]/10 text-[#ff5600] font-bold flex items-center justify-center text-xs shrink-0">
                        {cust.full_name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-[#111111] group-hover:text-[#ff5600] truncate">
                          {cust.full_name}
                        </div>
                        <div className="text-[10px] text-[#626260] truncate">{cust.email}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#626260] group-hover:text-[#ff5600] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🏪 VENDOR DIRECT LOGIN SELECTION (4 STORE CARDS) */}
        {loginType === 'vendor' && (
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Select Store Profile to Login
              </h3>
              <p className="text-[11px] text-[#626260] mt-0.5">
                Click any of the 4 verified vendor business accounts:
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {currentVendors.map((vendor, idx) => (
                <button
                  key={vendor.id}
                  onClick={() => loginAsVendor(vendor)}
                  className="w-full bg-[#faf8f5] hover:bg-[#f5f1ec] border border-[#d3cec6] hover:border-[#ff5600] p-3.5 rounded-xl text-left transition-all flex items-center gap-3.5 group shadow-sm cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-[#d3cec6] group-hover:border-[#ff5600] flex items-center justify-center shrink-0 shadow-sm">
                    {VENDOR_ICONS[idx % VENDOR_ICONS.length]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-[#111111] group-hover:text-[#ff5600] truncate">
                      {vendor.store_name || vendor.full_name}
                    </div>
                    <div className="text-[11px] text-[#626260] truncate mt-0.5">
                      {vendor.phone} • {vendor.email}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#626260] group-hover:text-[#ff5600] shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
