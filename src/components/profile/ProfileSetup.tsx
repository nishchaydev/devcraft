import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { LocationMapPicker } from './LocationMapPicker';
import { DeliveryLocation, UserRole } from '../../types/app';
import { User, Phone, Store, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const ProfileSetup: React.FC = () => {
  const { user, refreshProfile } = useAuth();

  const [role, setRole] = useState<UserRole>('customer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and phone number');
      return;
    }

    if (role === 'owner' && !storeName.trim()) {
      setErrorMsg('Please enter your store name');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload = {
      id: user.id,
      email: user.email || '',
      full_name: fullName.trim(),
      phone: phone.trim(),
      role,
      store_name: role === 'owner' ? storeName.trim() : null,
      delivery_location: role === 'customer' ? deliveryLocation : null,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      await refreshProfile();
    } catch (err: any) {
      console.error('Profile creation error:', err);
      setErrorMsg(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#111111] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white border border-[#d3cec6] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#111111] flex items-center justify-center font-bold text-white text-xl tracking-tighter shadow-sm">
            ic
          </div>
          <h2 className="text-2xl font-semibold text-[#111111] tracking-tight">Complete Your Profile</h2>
          <p className="text-xs text-[#626260]">
            Step 2: Choose your role and set up your details to access DevCraft
          </p>
        </div>

        {errorMsg && (
          <div className="bg-[#eb5757]/10 border border-[#eb5757]/30 text-[#eb5757] px-4 py-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role Selection Switcher */}
          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#faf8f5] border border-[#d3cec6] rounded-xl">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'customer'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'owner'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Store Owner / Vendor</span>
              </button>
            </div>
          </div>

          {/* Email (Read-Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Email Address (Verified)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-[#faf8f5] border border-[#d3cec6] rounded-xl px-4 py-2.5 text-xs text-[#7b7b78] cursor-not-allowed"
            />
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7b7b78] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full bg-[#faf8f5] border border-[#d3cec6] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#7b7b78] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#7b7b78] absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full bg-[#faf8f5] border border-[#d3cec6] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#7b7b78] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* Owner Specific: Store Name */}
          {role === 'owner' && (
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Store / Shop Name *
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-[#7b7b78] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Meena Tailors & Fabrics"
                  required
                  className="w-full bg-[#faf8f5] border border-[#d3cec6] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#7b7b78] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          )}

          {/* Customer Specific: Pin-Drop Location Map */}
          {role === 'customer' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Delivery Location (Drop Map Pin) (Optional)
              </label>
              <LocationMapPicker
                onLocationSelect={(loc) => setDeliveryLocation(loc)}
                initialLocation={deliveryLocation}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Setup & Enter Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
