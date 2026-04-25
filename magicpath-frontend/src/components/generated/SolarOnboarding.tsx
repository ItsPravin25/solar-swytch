import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Zap, Leaf, ArrowRight, Eye, EyeOff, Check, ChevronRight, Mail, Lock, User, Phone, Building2, MapPin, Briefcase, ChevronDown, Upload, FileText, Landmark, Hash, CreditCard, Navigation, Globe, PhoneCall, ShieldCheck, Loader2 } from 'lucide-react';
import { UserProfile } from './SolarSwytch';
import { authApi } from '../../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = 'login' | 'register';
type RegisterStep = 1 | 2 | 3 | 4;
interface OnboardingProps {
  onAuthenticated: (profile?: UserProfile) => void;
}
interface LoginForm {
  email: string;
  password: string;
  showPassword: boolean;
}
interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  businessType: string;
  businessTypeOther: string;
  role: string;
  companyName: string;
  gstNumber: string;
  logoFile: File | null;
  logoPreview: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  primaryContact: string;
  alternateContact: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const brandPoints = [{
  icon: <Zap size={16} />,
  en: 'Build solar quotes in minutes',
  mr: 'मिनिटांत सोलार कोटेशन तयार करा'
}, {
  icon: <Leaf size={16} />,
  en: 'Track ROI & savings instantly',
  mr: 'ROI आणि बचत त्वरित ट्रॅक करा'
}, {
  icon: <Building2 size={16} />,
  en: 'Professional PDF documents',
  mr: 'व्यावसायिक PDF दस्तऐवज'
}];
const registerStepLabels = [{
  label: 'Account',
  short: '1'
}, {
  label: 'Role',
  short: '2'
}, {
  label: 'Profile',
  short: '3'
}, {
  label: 'Security',
  short: '4'
}];
const BUSINESS_TYPES = [{
  value: 'installer',
  label: 'Solar Installer / EPC'
}, {
  value: 'dealer',
  label: 'Dealer / Distributor'
}, {
  value: 'consultant',
  label: 'Solar Consultant'
}, {
  value: 'other',
  label: 'Other'
}];
const ROLES = [{
  value: 'owner',
  label: 'Business Owner'
}, {
  value: 'sales',
  label: 'Sales Executive'
}];
const INDIAN_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];
const emptyLogin: LoginForm = {
  email: '',
  password: '',
  showPassword: false
};
const emptyRegister: RegisterForm = {
  fullName: '',
  email: '',
  phone: '',
  businessType: '',
  businessTypeOther: '',
  role: '',
  companyName: '',
  gstNumber: '',
  logoFile: null,
  logoPreview: '',
  address: '',
  state: '',
  city: '',
  pincode: '',
  primaryContact: '',
  alternateContact: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  password: '',
  confirmPassword: '',
  showPassword: false
};

// ─── Shared Input Style ───────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  backgroundColor: 'white',
  border: '1.5px solid #E2E8F0',
  color: '#0B1E3D'
};

// ─── Section Heading ──────────────────────────────────────────────────────────

const SectionHeading: React.FC<{
  icon: React.ReactNode;
  title: string;
}> = ({
  icon,
  title
}) => <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0">
    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{
    background: 'rgba(124,92,252,0.10)',
    color: '#7C5CFC'
  }}>
      {icon}
    </div>
    <span className="text-xs font-bold uppercase tracking-widest" style={{
    color: '#7C5CFC',
    letterSpacing: '0.08em'
  }}>
      {title}
    </span>
    <div className="flex-1 h-px" style={{
    backgroundColor: '#EDE9FE'
  }} />
  </div>;

// ─── Main Component ───────────────────────────────────────────────────────────

export const SolarOnboarding: React.FC<OnboardingProps> = ({
  onAuthenticated
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginForm, setLoginForm] = useState<LoginForm>(emptyLogin);
  const [registerForm, setRegisterForm] = useState<RegisterForm>(emptyRegister);
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please enter your email and password.');
      return;
    }
    setLoginError('');
    setLoading(true);
    try {
      const response = await authApi.login({
        email: loginForm.email,
        password: loginForm.password,
      });
      localStorage.setItem('token', response.token);
      onAuthenticated(undefined);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNext = async () => {
    if (registerStep < 4) {
      setRegisterStep(s => s + 1 as RegisterStep);
    } else {
      // Validate passwords match
      if (registerForm.password !== registerForm.confirmPassword) {
        setRegisterError('Passwords do not match');
        return;
      }
      if (registerForm.password.length < 8) {
        setRegisterError('Password must be at least 8 characters');
        return;
      }
      if (!registerForm.email || !registerForm.fullName) {
        setRegisterError('Please fill in required fields');
        return;
      }

      setLoading(true);
      setRegisterError('');
      try {
        const response = await authApi.register({
          email: registerForm.email,
          password: registerForm.password,
          fullName: registerForm.fullName,
          phone: registerForm.phone,
          companyName: registerForm.companyName,
        });
        localStorage.setItem('token', response.token);

        // Update profile with additional data (will be saved on backend later)
        const profile: UserProfile = {
          fullName: registerForm.fullName || 'Solar Owner',
          email: registerForm.email || 'admin@solarswytch.in',
          phone: registerForm.phone,
          businessType: registerForm.businessType === 'other' ? registerForm.businessTypeOther || 'Other' : registerForm.businessType,
          role: registerForm.role,
          companyName: registerForm.companyName || 'Solar Swytch Pvt. Ltd.',
          gstNumber: registerForm.gstNumber,
          logoPreview: registerForm.logoPreview,
          address: registerForm.address,
          state: registerForm.state,
          city: registerForm.city,
          pincode: registerForm.pincode,
          primaryContact: registerForm.primaryContact,
          alternateContact: registerForm.alternateContact,
          bankName: registerForm.bankName,
          accountNumber: registerForm.accountNumber,
          ifscCode: registerForm.ifscCode
        };
        onAuthenticated(profile);
      } catch (err) {
        setRegisterError(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };
  const handleRegisterBack = () => {
    if (registerStep > 1) setRegisterStep(s => s - 1 as RegisterStep);
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setRegisterForm(f => ({
        ...f,
        logoFile: file,
        logoPreview: ev.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };
  const totalSteps = 4;

  // ── Step 2 ────────────────────────────────────────────────────────────────

  const renderStep2 = () => <motion.div key="step2" initial={{
    opacity: 0,
    x: 16
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -16
  }} transition={{
    duration: 0.22
  }} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold mb-2" style={{
        color: '#374151'
      }}>Business Type</label>
        <div className="grid grid-cols-1 gap-2">
          {BUSINESS_TYPES.map(bt => {
          const isSelected = registerForm.businessType === bt.value;
          return <button key={bt.value} type="button" onClick={() => setRegisterForm(f => ({
            ...f,
            businessType: bt.value,
            businessTypeOther: bt.value !== 'other' ? '' : f.businessTypeOther
          }))} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all" style={{
            backgroundColor: isSelected ? 'rgba(124,92,252,0.08)' : 'white',
            border: `1.5px solid ${isSelected ? '#7C5CFC' : '#E2E8F0'}`,
            color: isSelected ? '#5B38E8' : '#374151'
          }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{
              border: `2px solid ${isSelected ? '#7C5CFC' : '#CBD5E1'}`,
              backgroundColor: isSelected ? '#7C5CFC' : 'transparent'
            }}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span>{bt.label}</span>
              </button>;
        })}
        </div>
        {registerForm.businessType === 'other' && <motion.div initial={{
        opacity: 0,
        y: -6
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mt-3">
            <label className="block text-xs font-semibold mb-1.5" style={{
          color: '#374151'
        }}>Please specify your business type</label>
            <input type="text" value={registerForm.businessTypeOther} onChange={e => setRegisterForm(f => ({
          ...f,
          businessTypeOther: e.target.value
        }))} placeholder="e.g. Solar Finance Advisor, Govt. Agency..." className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
          </motion.div>}
      </div>
      <div>
        <label className="block text-xs font-semibold mb-2" style={{
        color: '#374151'
      }}>Your Role</label>
        <div className="relative">
          <Briefcase size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{
          color: '#94A3B8',
          zIndex: 1
        }} />
          <select value={registerForm.role} onChange={e => setRegisterForm(f => ({
          ...f,
          role: e.target.value
        }))} className="w-full pl-11 pr-10 py-3 rounded-xl text-sm appearance-none outline-none" style={{
          ...inputBase,
          cursor: 'pointer'
        }}>
            <option value="" disabled>Select your role…</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{
          color: '#94A3B8'
        }} />
        </div>
      </div>
      {registerForm.businessType && registerForm.role && <motion.div initial={{
      opacity: 0,
      y: 6
    }} animate={{
      opacity: 1,
      y: 0
    }} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{
      background: 'rgba(124,92,252,0.07)',
      border: '1px solid rgba(124,92,252,0.18)'
    }}>
          <ShieldCheck size={15} style={{
        color: '#7C5CFC',
        flexShrink: 0
      }} />
          <p className="text-xs" style={{
        color: '#5B38E8'
      }}>
            <strong>Looks good!</strong>
            <span> Your role configuration is saved. Proceed to set up your company profile.</span>
          </p>
        </motion.div>}
    </motion.div>;

  // ── Step 3 ────────────────────────────────────────────────────────────────

  const renderStep3 = () => <motion.div key="step3" initial={{
    opacity: 0,
    x: 16
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -16
  }} transition={{
    duration: 0.22
  }}>
      <SectionHeading icon={<Building2 size={13} />} title="Company Info" />
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{
          color: '#374151'
        }}>Company Name</label>
          <div className="relative">
            <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
            color: '#94A3B8'
          }} />
            <input type="text" value={registerForm.companyName} onChange={e => setRegisterForm(f => ({
            ...f,
            companyName: e.target.value
          }))} placeholder="Solar Swytch Pvt. Ltd." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
          </div>
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-1.5" style={{
            color: '#374151'
          }}>GST Number</label>
            <div className="relative">
              <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
              color: '#94A3B8'
            }} />
              <input type="text" value={registerForm.gstNumber} onChange={e => setRegisterForm(f => ({
              ...f,
              gstNumber: e.target.value.toUpperCase()
            }))} placeholder="27ABCDE1234F1Z5" maxLength={15} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
            </div>
          </div>
          <div className="flex-shrink-0">
            <label className="block text-xs font-semibold mb-1.5" style={{
            color: '#374151'
          }}>Logo</label>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" aria-label="Upload company logo" />
            <button type="button" onClick={() => logoInputRef.current?.click()} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all" style={{
            backgroundColor: registerForm.logoPreview ? 'rgba(124,92,252,0.08)' : '#F8FAFC',
            border: `1.5px solid ${registerForm.logoPreview ? '#7C5CFC' : '#E2E8F0'}`,
            color: registerForm.logoPreview ? '#5B38E8' : '#64748B'
          }}>
              {registerForm.logoPreview ? <img src={registerForm.logoPreview} alt="Company logo preview" className="w-5 h-5 rounded object-cover" /> : <Upload size={13} />}
              <span>{registerForm.logoPreview ? 'Change' : 'Upload'}</span>
            </button>
          </div>
        </div>
      </div>

      <SectionHeading icon={<MapPin size={13} />} title="Location" />
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{
          color: '#374151'
        }}>Business Address</label>
          <div className="relative">
            <Navigation size={14} className="absolute left-3.5 top-3 pointer-events-none" style={{
            color: '#94A3B8'
          }} />
            <textarea value={registerForm.address} onChange={e => setRegisterForm(f => ({
            ...f,
            address: e.target.value
          }))} placeholder="Shop No. 12, Solar Complex, MG Road" rows={2} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputBase} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{
            color: '#374151'
          }}>State</label>
            <div className="relative">
              <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
              color: '#94A3B8',
              zIndex: 1
            }} />
              <select value={registerForm.state} onChange={e => setRegisterForm(f => ({
              ...f,
              state: e.target.value
            }))} className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm appearance-none outline-none" style={{
              ...inputBase,
              cursor: 'pointer'
            }}>
                <option value="" disabled>State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{
              color: '#94A3B8'
            }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{
            color: '#374151'
          }}>City</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
              color: '#94A3B8'
            }} />
              <input type="text" value={registerForm.city} onChange={e => setRegisterForm(f => ({
              ...f,
              city: e.target.value
            }))} placeholder="Pune" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
            </div>
          </div>
        </div>
        <div className="w-1/2 pr-1.5">
          <label className="block text-xs font-semibold mb-1.5" style={{
          color: '#374151'
        }}>Pincode</label>
          <input type="text" value={registerForm.pincode} onChange={e => setRegisterForm(f => ({
          ...f,
          pincode: e.target.value.replace(/\D/g, '').slice(0, 6)
        }))} placeholder="411001" maxLength={6} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
        </div>
      </div>

      <SectionHeading icon={<PhoneCall size={13} />} title="Contact" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{
          color: '#374151'
        }}>Primary Contact</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
            color: '#94A3B8'
          }} />
            <input type="tel" value={registerForm.primaryContact} onChange={e => setRegisterForm(f => ({
            ...f,
            primaryContact: e.target.value
          }))} placeholder="+91 98765 43210" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{
          color: '#374151'
        }}>Alternate Contact</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
            color: '#94A3B8'
          }} />
            <input type="tel" value={registerForm.alternateContact} onChange={e => setRegisterForm(f => ({
            ...f,
            alternateContact: e.target.value
          }))} placeholder="+91 80000 12345" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
          </div>
        </div>
      </div>

      <SectionHeading icon={<Landmark size={13} />} title="Bank Details" />
      <div className="space-y-3 pb-1">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{
          color: '#374151'
        }}>Bank Name</label>
          <div className="relative">
            <Landmark size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
            color: '#94A3B8'
          }} />
            <input type="text" value={registerForm.bankName} onChange={e => setRegisterForm(f => ({
            ...f,
            bankName: e.target.value
          }))} placeholder="HDFC Bank" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{
            color: '#374151'
          }}>Account Number</label>
            <div className="relative">
              <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
              color: '#94A3B8'
            }} />
              <input type="text" value={registerForm.accountNumber} onChange={e => setRegisterForm(f => ({
              ...f,
              accountNumber: e.target.value.replace(/\D/g, '')
            }))} placeholder="12345678901234" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{
            color: '#374151'
          }}>IFSC Code</label>
            <div className="relative">
              <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
              color: '#94A3B8'
            }} />
              <input type="text" value={registerForm.ifscCode} onChange={e => setRegisterForm(f => ({
              ...f,
              ifscCode: e.target.value.toUpperCase()
            }))} placeholder="HDFC0001234" maxLength={11} className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputBase} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>;

  // ── Step 4 ────────────────────────────────────────────────────────────────

  const renderStep4 = () => <motion.div key="step4" initial={{
    opacity: 0,
    x: 16
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -16
  }} transition={{
    duration: 0.22
  }} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-2" style={{
        color: '#374151'
      }}>Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{
          color: '#94A3B8'
        }} />
          <input type={registerForm.showPassword ? 'text' : 'password'} value={registerForm.password} onChange={e => setRegisterForm(f => ({
          ...f,
          password: e.target.value
        }))} placeholder="Create a strong password" className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none" style={inputBase} />
          <button type="button" onClick={() => setRegisterForm(f => ({
          ...f,
          showPassword: !f.showPassword
        }))} className="absolute right-4 top-1/2 -translate-y-1/2">
            {registerForm.showPassword ? <EyeOff size={15} style={{
            color: '#94A3B8'
          }} /> : <Eye size={15} style={{
            color: '#94A3B8'
          }} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-2" style={{
        color: '#374151'
      }}>Confirm Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{
          color: '#94A3B8'
        }} />
          <input type="password" value={registerForm.confirmPassword} onChange={e => setRegisterForm(f => ({
          ...f,
          confirmPassword: e.target.value
        }))} placeholder="Confirm your password" className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none" style={inputBase} />
        </div>
      </div>
      {registerForm.password && registerForm.confirmPassword && <motion.div initial={{
      opacity: 0,
      y: 4
    }} animate={{
      opacity: 1,
      y: 0
    }} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={registerForm.password === registerForm.confirmPassword ? {
      background: 'rgba(34,197,94,0.08)',
      border: '1px solid rgba(34,197,94,0.2)'
    } : {
      background: 'rgba(239,68,68,0.06)',
      border: '1px solid rgba(239,68,68,0.18)'
    }}>
          {registerForm.password === registerForm.confirmPassword ? <Check size={13} style={{
        color: '#22C55E',
        flexShrink: 0
      }} /> : <span className="text-xs" style={{
        color: '#EF4444',
        flexShrink: 0
      }}>✕</span>}
          <p className="text-xs" style={{
        color: registerForm.password === registerForm.confirmPassword ? '#15803D' : '#EF4444'
      }}>
            {registerForm.password === registerForm.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
          </p>
        </motion.div>}
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{
      background: 'rgba(34,197,94,0.08)',
      border: '1px solid rgba(34,197,94,0.2)'
    }}>
        <Check size={14} style={{
        color: '#22C55E',
        flexShrink: 0
      }} />
        <p className="text-xs" style={{
        color: '#64748B'
      }}>
          By registering you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </motion.div>;
  return <div className="min-h-screen w-full flex" style={{
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
  }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] min-h-screen p-12 relative overflow-hidden" style={{
      background: 'linear-gradient(145deg, #0B1E3D 0%, #0F2C55 40%, #133366 100%)'
    }}>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10" style={{
        background: 'radial-gradient(circle, #FFB800 0%, transparent 70%)'
      }} aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10" style={{
        background: 'radial-gradient(circle, #22C55E 0%, transparent 70%)'
      }} aria-hidden="true" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
          background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)'
        }}>
            <Sun size={20} color="white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg" style={{
            letterSpacing: '-0.02em'
          }}>Solar Swytch</p>
            <p className="text-xs" style={{
            color: 'rgba(255,255,255,0.45)'
          }}>Solar Business Platform</p>
          </div>
        </div>

        <div className="relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 24
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
            color: '#FFB800'
          }}>The Smart Solar CRM</p>
            <h1 className="text-4xl font-bold mb-3 leading-tight" style={{
            color: 'white',
            letterSpacing: '-0.03em'
          }}>
              Do not waste<br />Business time<br />building quotes
            </h1>
            <p className="text-sm mb-2" style={{
            color: 'rgba(255,255,255,0.5)',
            fontStyle: 'italic'
          }}>
              व्यवसायाचा वेळ कोटेशन बनवण्यात वाया घालवू नका
            </p>
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 16
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="mt-10 space-y-4">
            {brandPoints.map((pt, i) => <div key={pt.en} className="flex items-start gap-3">
                <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: 0.5 + i * 0.1,
              type: 'spring'
            }} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{
              background: 'rgba(255,184,0,0.15)',
              color: '#FFB800'
            }}>
                  {pt.icon}
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-white">{pt.en}</p>
                  <p className="text-xs" style={{
                color: 'rgba(255,255,255,0.4)'
              }}>{pt.mr}</p>
                </div>
              </div>)}
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.3)',
          color: '#4ADE80'
        }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Trusted by 500+ Solar Installers across Maharashtra</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-start justify-center min-h-screen p-6 lg:p-10 overflow-y-auto" style={{
      backgroundColor: '#F8FAFC'
    }}>
        <div className="w-full max-w-md py-4">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)'
          }}>
              <Sun size={16} color="white" />
            </div>
            <p className="font-bold text-lg" style={{
            color: '#0B1E3D'
          }}>Solar Swytch</p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl mb-8 w-fit" style={{
          backgroundColor: '#E2E8F0'
        }}>
            {(['login', 'register'] as AuthMode[]).map(m => <button key={m} onClick={() => {
            setMode(m);
            setRegisterStep(1);
          }} className="relative px-5 py-2 rounded-xl text-xs font-semibold capitalize transition-all" style={{
            color: mode === m ? '#0B1E3D' : '#64748B'
          }}>
                {mode === m && <motion.div layoutId="modeTab" className="absolute inset-0 rounded-xl bg-white" style={{
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30
            }} />}
                <span className="relative z-10">{m === 'login' ? 'Sign In' : 'Register'}</span>
              </button>)}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? <motion.div key="login" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} transition={{
            duration: 0.2
          }}>
                <h2 className="text-2xl font-bold mb-1" style={{
              color: '#0B1E3D',
              letterSpacing: '-0.03em'
            }}>Welcome back</h2>
                <p className="text-sm mb-8" style={{
              color: '#64748B'
            }}>Sign in to your Solar Swytch account</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{
                  color: '#374151'
                }}>Email Address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{
                    color: '#94A3B8'
                  }} />
                      <input type="email" value={loginForm.email} onChange={e => setLoginForm(f => ({
                    ...f,
                    email: e.target.value
                  }))} placeholder="you@company.com" className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all" style={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{
                  color: '#374151'
                }}>Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{
                    color: '#94A3B8'
                  }} />
                      <input type={loginForm.showPassword ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm(f => ({
                    ...f,
                    password: e.target.value
                  }))} placeholder="Enter your password" className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none" style={inputBase} />
                      <button type="button" onClick={() => setLoginForm(f => ({
                    ...f,
                    showPassword: !f.showPassword
                  }))} className="absolute right-4 top-1/2 -translate-y-1/2">
                        {loginForm.showPassword ? <EyeOff size={15} style={{
                      color: '#94A3B8'
                    }} /> : <Eye size={15} style={{
                      color: '#94A3B8'
                    }} />}
                      </button>
                    </div>
                  </div>
                  {loginError && <p className="text-xs font-medium" style={{
                color: '#EF4444'
              }}>{loginError}</p>}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded-md border-2 flex items-center justify-center" style={{
                    borderColor: '#E2E8F0'
                  }} />
                      <span className="text-xs" style={{
                    color: '#64748B'
                  }}>Remember me</span>
                    </label>
                    <button type="button" className="text-xs font-medium" style={{
                  color: '#FFB800'
                }}>Forgot password?</button>
                  </div>
                  <motion.button whileHover={{
                scale: 1.01
              }} whileTap={{
                scale: 0.99
              }} type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white mt-2 disabled:opacity-50" style={{
                background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)',
                boxShadow: '0 4px 14px rgba(11,30,61,0.3)'
              }}>
                    {loading ? <><Loader2 size={15} className="animate-spin" /><span>Signing in...</span></> : <><span>Sign In</span><ArrowRight size={15} /></>}
                  </motion.button>
                </form>
              </motion.div> : <motion.div key="register" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} transition={{
            duration: 0.2
          }}>
                <h2 className="text-2xl font-bold mb-0.5" style={{
              color: '#0B1E3D',
              letterSpacing: '-0.03em'
            }}>
                  {registerStep === 1 && 'Create account'}
                  {registerStep === 2 && 'Business role'}
                  {registerStep === 3 && 'Company profile'}
                  {registerStep === 4 && 'Set password'}
                </h2>
                <p className="text-sm mb-5" style={{
              color: '#64748B'
            }}>
                  {registerStep === 1 && <span>Join Solar Swytch — <span style={{
                  fontStyle: 'italic',
                  color: '#94A3B8'
                }}>आपला सोलार व्यवसाय सुरू करा</span></span>}
                  {registerStep === 2 && 'Tell us about your business and role'}
                  {registerStep === 3 && 'Fill in your company details to get started'}
                  {registerStep === 4 && 'Almost done — secure your account'}
                </p>

                <div className="flex items-center gap-1.5 mb-6">
                  {registerStepLabels.map((item, i) => {
                const stepNum = i + 1 as RegisterStep;
                const isActive = registerStep === stepNum;
                const isDone = registerStep > stepNum;
                return <React.Fragment key={item.label}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{
                      backgroundColor: isDone ? '#22C55E' : isActive ? '#7C5CFC' : '#E2E8F0',
                      color: isDone || isActive ? 'white' : '#94A3B8'
                    }}>
                            {isDone ? <Check size={11} /> : stepNum}
                          </div>
                          <span className="text-xs font-medium hidden sm:block" style={{
                      color: isActive ? '#7C5CFC' : isDone ? '#22C55E' : '#94A3B8'
                    }}>
                            {item.label}
                          </span>
                        </div>
                        {i < totalSteps - 1 && <div className="flex-1 h-px transition-colors" style={{
                    backgroundColor: registerStep > stepNum ? '#22C55E' : '#E2E8F0'
                  }} />}
                      </React.Fragment>;
              })}
                </div>

                <AnimatePresence mode="wait">
                  {registerStep === 1 && <motion.div key="step1" initial={{
                opacity: 0,
                x: 16
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -16
              }} transition={{
                duration: 0.2
              }} className="space-y-4">
                      {registerError && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                        <p className="text-xs text-red-600">{registerError}</p>
                      </div>}
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{
                    color: '#374151'
                  }}>Full Name</label>
                        <div className="relative">
                          <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{
                      color: '#94A3B8'
                    }} />
                          <input type="text" value={registerForm.fullName} onChange={e => setRegisterForm(f => ({
                      ...f,
                      fullName: e.target.value
                    }))} placeholder="Your full name" className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none" style={inputBase} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{
                    color: '#374151'
                  }}>Email Address</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{
                      color: '#94A3B8'
                    }} />
                          <input type="email" value={registerForm.email} onChange={e => setRegisterForm(f => ({
                      ...f,
                      email: e.target.value
                    }))} placeholder="you@company.com" className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none" style={inputBase} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{
                    color: '#374151'
                  }}>Phone Number</label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{
                      color: '#94A3B8'
                    }} />
                          <input type="tel" value={registerForm.phone} onChange={e => setRegisterForm(f => ({
                      ...f,
                      phone: e.target.value
                    }))} placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none" style={inputBase} />
                        </div>
                      </div>
                    </motion.div>}
                  {registerStep === 2 && renderStep2()}
                  {registerStep === 3 && renderStep3()}
                  {registerStep === 4 && renderStep4()}
                </AnimatePresence>

                <div className="flex items-center gap-3 mt-7">
                  {registerStep > 1 && <button onClick={handleRegisterBack} className="flex-none px-5 py-3 rounded-xl text-sm font-semibold" style={{
                backgroundColor: '#E2E8F0',
                color: '#64748B'
              }}>
                      Back
                    </button>}
                  <motion.button whileHover={{
                scale: 1.01
              }} whileTap={{
                scale: 0.99
              }} onClick={handleRegisterNext} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{
                background: 'linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)',
                boxShadow: '0 4px 14px rgba(124,92,252,0.28)'
              }}>
                    {loading ? <><Loader2 size={15} className="animate-spin" /><span>Creating...</span></> : registerStep < 4 ? <><span>Next</span><ChevronRight size={15} /></> : <><span>Create Account</span><ArrowRight size={15} /></>}
                  </motion.button>
                </div>
                <p className="text-center text-xs mt-4" style={{
              color: '#CBD5E1'
            }}>
                  <span>Step {registerStep} of {totalSteps}</span>
                </p>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </div>;
};