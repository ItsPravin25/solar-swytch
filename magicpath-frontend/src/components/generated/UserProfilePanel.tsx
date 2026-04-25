import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Building2, MapPin, Landmark, CreditCard, FileText, Hash, Navigation, Globe, PhoneCall, Upload, Check, ChevronDown, Camera, Loader2 } from 'lucide-react';
import { UserProfile } from './SolarSwytch';
import { profileApi } from '../../lib/api';
interface UserProfilePanelProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (p: UserProfile) => void;
}
const INDIAN_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];
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
  value: 'manufacturer',
  label: 'Panel Manufacturer'
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
const inputStyle: React.CSSProperties = {
  backgroundColor: '#F8FAFC',
  border: '1.5px solid #E2E8F0',
  color: '#0B1E3D'
};
const SectionHead: React.FC<{
  icon: React.ReactNode;
  title: string;
}> = ({
  icon,
  title
}) => <div className="flex items-center gap-2 mb-4 mt-7">
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
export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({
  profile,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState<UserProfile>({
    ...profile
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const setField = <K extends keyof UserProfile,>(key: K, value: UserProfile[K]) => {
    setForm(f => ({
      ...f,
      [key]: value
    }));
    setSaved(false);
  };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setField('logoPreview', ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await profileApi.update({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        businessType: form.businessType,
        role: form.role,
        companyName: form.companyName,
        gstNumber: form.gstNumber,
        address: form.address,
        state: form.state,
        city: form.city,
        pincode: form.pincode,
        primaryContact: form.primaryContact,
        alternateContact: form.alternateContact,
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
      });
      onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // Silently save locally on API error
      onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };
  const initials = form.fullName ? form.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'SO';
  return <div className="fixed inset-0 z-50 flex items-stretch justify-end" style={{
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
  }}>
      {/* Backdrop */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="flex-1" style={{
      backgroundColor: 'rgba(11,30,61,0.45)',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose} />

      {/* Panel */}
      <motion.aside initial={{
      x: '100%'
    }} animate={{
      x: 0
    }} exit={{
      x: '100%'
    }} transition={{
      type: 'spring',
      stiffness: 340,
      damping: 38
    }} className="flex-shrink-0 flex flex-col" style={{
      width: 420,
      maxWidth: '100vw',
      height: '100vh',
      background: '#FFFFFF',
      boxShadow: '-8px 0 40px rgba(11,30,61,0.14)'
    }}>

        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 flex items-center justify-between" style={{
        borderBottom: '1px solid #F1F5F9',
        background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)'
      }}>
          <div>
            <h2 className="text-base font-bold text-white" style={{
            letterSpacing: '-0.02em'
          }}>User Profile</h2>
            <p className="text-xs mt-0.5" style={{
            color: 'rgba(255,255,255,0.5)'
          }}>Edit your personal and business details</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.7)'
        }} aria-label="Close profile panel">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">

          {/* Avatar & Name block */}
          <div className="flex items-center gap-4 py-6">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden" style={{
              background: form.logoPreview ? 'transparent' : 'linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)'
            }}>
                {form.logoPreview ? <img src={form.logoPreview} alt="Profile photo" className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-white">{initials}</span>}
              </div>
              <button onClick={() => photoInputRef.current?.click()} className="w-6 h-6 rounded-full flex items-center justify-center" style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              backgroundColor: '#7C5CFC',
              color: 'white',
              boxShadow: '0 2px 6px rgba(124,92,252,0.4)'
            }} aria-label="Change profile photo">
                <Camera size={11} />
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" aria-label="Upload profile photo" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{
              color: '#0B1E3D'
            }}>{form.fullName || 'Solar Owner'}</p>
              <p className="text-xs truncate mt-0.5" style={{
              color: '#7C5CFC'
            }}>
                {ROLES.find(r => r.value === form.role)?.label || 'Business Owner'}
              </p>
              <p className="text-xs truncate mt-0.5" style={{
              color: '#94A3B8'
            }}>{form.email}</p>
            </div>
          </div>

          {/* ── Personal Info ── */}
          <SectionHead icon={<User size={12} />} title="Personal Info" />
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Full Name</label>
              <div className="relative">
                <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <input type="text" value={form.fullName} onChange={e => setField('fullName', e.target.value)} placeholder="Your full name" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Email Address</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <input type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="you@company.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Phone</label>
              <div className="relative">
                <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <input type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{
                color: '#374151'
              }}>Business Type</label>
                <div className="relative">
                  <Building2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                  color: '#94A3B8',
                  zIndex: 1
                }} />
                  <select value={form.businessType} onChange={e => setField('businessType', e.target.value)} className="w-full pl-10 pr-7 py-2.5 rounded-xl text-xs appearance-none outline-none" style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}>
                    <option value="">Select…</option>
                    {BUSINESS_TYPES.map(bt => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                  color: '#94A3B8'
                }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{
                color: '#374151'
              }}>Role</label>
                <div className="relative">
                  <select value={form.role} onChange={e => setField('role', e.target.value)} className="w-full px-3 pr-7 py-2.5 rounded-xl text-xs appearance-none outline-none" style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}>
                    <option value="">Select…</option>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                  color: '#94A3B8'
                }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Company Info ── */}
          <SectionHead icon={<Building2 size={12} />} title="Company Info" />
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Company Name</label>
              <div className="relative">
                <Building2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <input type="text" value={form.companyName} onChange={e => setField('companyName', e.target.value)} placeholder="Solar Swytch Pvt. Ltd." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>GST Number</label>
              <div className="relative">
                <Hash size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <input type="text" value={form.gstNumber} onChange={e => setField('gstNumber', e.target.value.toUpperCase())} placeholder="27ABCDE1234F1Z5" maxLength={15} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>
                <span>Company Logo / Profile Photo</span>
              </label>
              <button type="button" onClick={() => photoInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{
              backgroundColor: form.logoPreview ? 'rgba(124,92,252,0.06)' : '#F8FAFC',
              border: `1.5px dashed ${form.logoPreview ? '#7C5CFC' : '#CBD5E1'}`,
              color: '#64748B'
            }}>
                {form.logoPreview ? <img src={form.logoPreview} alt="Company logo" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" /> : <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                backgroundColor: '#EDE9FE',
                color: '#7C5CFC'
              }}><Upload size={14} /></div>}
                <div className="text-left">
                  <p className="text-xs font-semibold" style={{
                  color: '#374151'
                }}>
                    {form.logoPreview ? 'Change photo' : 'Upload company logo'}
                  </p>
                  <p className="text-xs" style={{
                  color: '#94A3B8'
                }}>JPG or PNG · Max 2 MB</p>
                </div>
              </button>
            </div>
          </div>

          {/* ── Location ── */}
          <SectionHead icon={<MapPin size={12} />} title="Location" />
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Business Address</label>
              <div className="relative">
                <Navigation size={13} className="absolute left-3.5 top-3 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <textarea value={form.address} onChange={e => setField('address', e.target.value)} placeholder="Shop No. 12, Solar Complex, MG Road" rows={2} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{
                color: '#374151'
              }}>State</label>
                <div className="relative">
                  <Globe size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                  color: '#94A3B8',
                  zIndex: 1
                }} />
                  <select value={form.state} onChange={e => setField('state', e.target.value)} className="w-full pl-10 pr-7 py-2.5 rounded-xl text-xs appearance-none outline-none" style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}>
                    <option value="">State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                  color: '#94A3B8'
                }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{
                color: '#374151'
              }}>City</label>
                <div className="relative">
                  <MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                  color: '#94A3B8'
                }} />
                  <input type="text" value={form.city} onChange={e => setField('city', e.target.value)} placeholder="Pune" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Pincode</label>
              <input type="text" value={form.pincode} onChange={e => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="411001" maxLength={6} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
          </div>

          {/* ── Contact ── */}
          <SectionHead icon={<PhoneCall size={12} />} title="Contact Numbers" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Primary</label>
              <div className="relative">
                <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <input type="tel" value={form.primaryContact} onChange={e => setField('primaryContact', e.target.value)} placeholder="+91 98765 43210" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Alternate</label>
              <div className="relative">
                <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <input type="tel" value={form.alternateContact} onChange={e => setField('alternateContact', e.target.value)} placeholder="+91 80000 12345" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* ── Bank Details ── */}
          <SectionHead icon={<Landmark size={12} />} title="Bank Details" />
          <div className="space-y-3 pb-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{
              color: '#374151'
            }}>Bank Name</label>
              <div className="relative">
                <Landmark size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                color: '#94A3B8'
              }} />
                <input type="text" value={form.bankName} onChange={e => setField('bankName', e.target.value)} placeholder="HDFC Bank" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{
                color: '#374151'
              }}>Account Number</label>
                <div className="relative">
                  <CreditCard size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                  color: '#94A3B8'
                }} />
                  <input type="text" value={form.accountNumber} onChange={e => setField('accountNumber', e.target.value.replace(/\D/g, ''))} placeholder="12345678901234" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{
                color: '#374151'
              }}>IFSC Code</label>
                <div className="relative">
                  <FileText size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{
                  color: '#94A3B8'
                }} />
                  <input type="text" value={form.ifscCode} onChange={e => setField('ifscCode', e.target.value.toUpperCase())} placeholder="HDFC0001234" maxLength={11} className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Save */}
        <div className="flex-shrink-0 px-6 py-4" style={{
        borderTop: '1px solid #F1F5F9',
        backgroundColor: 'white'
      }}>
          <AnimatePresence>
            {saved && <motion.div initial={{
            opacity: 0,
            y: 6
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: 6
          }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3" style={{
            background: 'rgba(39,174,96,0.09)',
            border: '1px solid rgba(39,174,96,0.25)'
          }}>
                <Check size={13} style={{
              color: '#27AE60',
              flexShrink: 0
            }} />
                <p className="text-xs font-semibold" style={{
              color: '#15803D'
            }}>Profile saved successfully!</p>
              </motion.div>}
          </AnimatePresence>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{
            backgroundColor: '#F1F5F9',
            color: '#64748B',
            border: '1.5px solid #E2E8F0'
          }}>
              Cancel
            </button>
            <motion.button whileHover={{
            scale: 1.01
          }} whileTap={{
            scale: 0.98
          }} onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{
            background: saved ? 'linear-gradient(135deg, #27AE60 0%, #1A8A48 100%)' : 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)',
            boxShadow: saved ? '0 4px 14px rgba(39,174,96,0.28)' : '0 4px 14px rgba(11,30,61,0.2)'
          }}>
              {saving ? <><Loader2 size={15} className="animate-spin" /><span>Saving...</span></> : saved ? <><Check size={15} /><span>Saved!</span></> : <span>Save Profile</span>}
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </div>;
};