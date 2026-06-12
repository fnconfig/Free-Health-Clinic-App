import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, X, Check, Lock, ChevronRight } from "lucide-react";
import { GpibLogo } from "./GpibLogo";

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: "PATIENT" | "DOCTOR" | "ADMIN" | null;
  onSuccess: (role: "PATIENT" | "DOCTOR" | "ADMIN") => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onSuccess,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [animatingStage, setAnimatingStage] = useState<"SELECT" | "LOADING" | "SUCCESS">("SELECT");
  const [hasConsented, setHasConsented] = useState(true);

  // Set context variables depending on targetRole
  const getRoleTitle = () => {
    switch (targetRole) {
      case "PATIENT":
        return "Portal Pasien Jemaat";
      case "DOCTOR":
        return "Konsol Dokter Relawan";
      case "ADMIN":
        return "Sistem Pengawas Admin (Diakonia)";
      default:
        return "Portal Terenkripsi";
    }
  };

  const getAuthorizedAccounts = () => {
    const list = [
      {
        email: "fritssigerdkayadoe@gmail.com",
        name: "Frits Sigerd Kayadoe",
        label: "Jemaat Aktif",
        avatarBg: "bg-sky-600 text-white",
        initials: "FK"
      }
    ];

    if (targetRole === "DOCTOR") {
      list.unshift({
        email: "dr.sarah@gpibbukitzaitun.org",
        name: "dr. Sarah Taylor, Sp.PD",
        label: "Dokter Spesialis Relawan",
        avatarBg: "bg-emerald-600 text-white",
        initials: "ST"
      });
    } else if (targetRole === "ADMIN") {
      list.unshift({
        email: "admin@gpibbukitzaitun.org",
        name: "Admin Diakonia Bukit Zaitun",
        label: "Pengawas Keamanan Utama",
        avatarBg: "bg-slate-900 text-brand-cream",
        initials: "AD"
      });
    }
    return list;
  };

  const handleSelectAccount = (email: string) => {
    if (!hasConsented) {
      alert("Harap setujui pernyataan kepatuhan keamanan data medis sebelum melanjutkan.");
      return;
    }
    setSelectedEmail(email);
    setAnimatingStage("LOADING");

    // Simulate authentic security handshake
    setTimeout(() => {
      setAnimatingStage("SUCCESS");
      setTimeout(() => {
        if (targetRole) {
          onSuccess(targetRole);
        }
        // Reset states for future usage
        setSelectedEmail(null);
        setAnimatingStage("SELECT");
        onClose();
      }, 1400);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={animatingStage === "SELECT" ? onClose : undefined}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal body */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden font-sans z-10"
        >
          {/* Header decoration */}
          <div className="h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05]" />

          {/* Close button */}
          {animatingStage === "SELECT" && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="p-6 md:p-8 flex flex-col items-center">
            
            {/* Stage: Account Chooser */}
            {animatingStage === "SELECT" && (
              <div className="w-full">
                {/* Branding row */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    {/* Raw Google G logo SVG style */}
                    <svg className="h-6 w-6" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span className="text-slate-400 font-bold">Sign in with Google</span>
                  </div>

                  <p className="text-xs text-slate-450 font-bold uppercase tracking-widest mt-1">SINKRONISASI REKAM MEDIS</p>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">Pilih Akun Google Anda</h3>
                  <div className="mt-1.5 flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                    <GpibLogo size={18} />
                    <span className="text-[10px] text-brand-blue font-bold tracking-wide uppercase">{getRoleTitle()}</span>
                  </div>
                </div>

                {/* Account Choice selectors List */}
                <div className="space-y-2.5 mb-6">
                  {getAuthorizedAccounts().map((acc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAccount(acc.email)}
                      className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-brand-blue/30 active:scale-[0.99] transition-all text-left cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full ${acc.avatarBg} flex items-center justify-center font-bold text-sm tracking-wide shadow-2xs`}>
                          {acc.initials}
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-slate-800 block leading-tight">{acc.name}</span>
                          <span className="text-xs text-slate-500 font-medium block">{acc.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 roundedbg-slate-100 text-slate-500 uppercase tracking-widest bg-slate-100 text-[8px] text-slate-450">
                          {acc.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-350 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}

                  {/* Add standard alternative */}
                  <button
                    onClick={() => handleSelectAccount(`visitor.${Date.now() % 100}@gmail.com`)}
                    className="w-full flex items-center justify-between p-3 border border-slate-200 border-dashed rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-left cursor-pointer group text-xs text-slate-500 font-semibold"
                  >
                    <span className="pl-2">Gunakan akun Google pengetesan lainnya</span>
                    <span className="text-[11px] font-bold text-brand-blue pr-2">Masuk Baru</span>
                  </button>
                </div>

                {/* Consent Compliance Agreement */}
                <div className="border-t border-slate-100 pt-4 px-1.5">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasConsented}
                      onChange={(e) => setHasConsented(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                      Dengan masuk, saya menyetujui ketaatan rekam medis digital (EMR) dan menyelaraskan integrasi email Google ke server database aman <strong className="text-slate-700">GPIB Bukit Zaitun</strong> sesuai Standar Privasi Medis.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Stage: Loading/Handshaking Animation */}
            {animatingStage === "LOADING" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                {/* Custom Google-colored beautiful spinner spinner */}
                <div className="relative h-16 w-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-brand-blue border-r-brand-green border-b-amber-400 border-l-rose-500 animate-spin" />
                  <Lock className="absolute inset-0 m-auto h-5 w-5 text-slate-400" />
                </div>
                
                <span className="text-[10px] uppercase font-bold text-brand-blue tracking-widest block bg-blue-50 border border-blue-100 px-2 rounded-sm mb-2">Google SecurID Handshake</span>
                <h4 className="text-lg font-bold text-slate-800 tracking-tight">Menghubungkan Akun Google...</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed font-semibold">
                  Mendapatkan kredensial medis terenkripsi dari federasi Google OAuth untuk dikunci aman ke server GPIB BZ.
                </p>
              </motion.div>
            )}

            {/* Stage: Success checkmark animation */}
            {animatingStage === "SUCCESS" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-5 shadow-inner">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <Check className="h-9 w-9 stroke-[3]" />
                  </motion.div>
                </div>
                
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest block bg-emerald-50 border border-emerald-100 px-2 rounded-sm mb-2">LOGIN BERHASIL</span>
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">Otentikasi Google Sukses</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed font-semibold">
                  Sesi aman telah disinkronisasikan. Mengalihkan ke wilayah pelayanan Anda...
                </p>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
