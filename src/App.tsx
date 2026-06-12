/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Heart, ShieldAlert, Sparkles, User, Users, Clipboard, AlertTriangle, HelpCircle, 
  ChevronDown, Database, Star, MapPin 
} from "lucide-react";
import { Role, Patient, Appointment, Prescription, AppointmentStatus, AppointmentUrgency } from "./types";
import { getLocalData, saveLocalData } from "./data";
import LandingPage from "./components/LandingPage";
import PatientPortal from "./components/PatientPortal";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import TriageChatModal from "./components/TriageChatModal";
import { GpibLogo } from "./components/GpibLogo";
import { GoogleSignInModal } from "./components/GoogleSignInModal";

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  
  // Local EMR database state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  
  // Active AI triage modal tracker
  const [activeTriageApptId, setActiveTriageApptId] = useState<string | null>(null);

  // Google OAuth flow simulation states
  const [targetRoleToAuth, setTargetRoleToAuth] = useState<Role | null>(null);
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);

  // Initialize medical state on mount from database APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsRes, apptsRes, prescriptionsRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/appointments"),
          fetch("/api/prescriptions")
        ]);

        if (patientsRes.ok && apptsRes.ok && prescriptionsRes.ok) {
          const listPatients = await patientsRes.json();
          const listAppts = await apptsRes.json();
          const listRx = await prescriptionsRes.json();

          if (listPatients.length > 0) {
            setPatients(listPatients);
            setAppointments(listAppts);
            setPrescriptions(listRx);
            
            // Also update local storage so they are hot-loaded next time
            saveLocalData({
              patients: listPatients,
              appointments: listAppts,
              prescriptions: listRx
            });
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load records from Relational Postgres Database, resorting to local fallback:", e);
      }

      // Local storage fallback
      const data = getLocalData();
      setPatients(data.patients);
      setAppointments(data.appointments);
      setPrescriptions(data.prescriptions);

      // Trigger initial synchronization to the server!
      try {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.error("Failed to seed initial Postgres state:", err);
      }
    };

    loadData();
  }, []);

  // Sync state modifications to browser storage and Cloud SQL
  const syncState = async (updatedPatients: Patient[], updatedAppts: Appointment[], updatedRx: Prescription[]) => {
    setPatients(updatedPatients);
    setAppointments(updatedAppts);
    setPrescriptions(updatedRx);
    
    // Save locally
    saveLocalData({
      patients: updatedPatients,
      appointments: updatedAppts,
      prescriptions: updatedRx
    });

    // Save to Cloud SQL relational db
    try {
      await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patients: updatedPatients,
          appointments: updatedAppts,
          prescriptions: updatedRx
        })
      });
    } catch (e) {
      console.error("Failed to synchronize state to Cloud SQL:", e);
    }
  };

  // Dispatch persistent server audit events (REQ-AUTH-06 / Section 3.8)
  const handlePostLog = async (action: string, details: string) => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actorEmail: currentRole === Role.PATIENT 
            ? "fritssigerdkayadoe@gmail.com" 
            : currentRole === Role.DOCTOR 
            ? "dr.sarah@gpibbukitzaitun.org" 
            : currentRole === Role.ADMIN 
            ? "admin@gpibbukitzaitun.org" 
            : "visitor@gpibbukitzaitun.org",
          actorRole: currentRole || "VISITOR",
          action,
          details
        })
      });
    } catch (e) {
      console.error("Failed to push operational audit dispatch to backend server:", e);
    }
  };

  // Handle patient booking a Friday slot
  const handleBookAppointment = (date: string, timeSlot: string, reason: string, faithSupport: boolean) => {
    const primaryPatient = patients.find(p => p.email === "fritssigerdkayadoe@gmail.com") || patients[0];
    
    const newAppt: Appointment = {
      id: `appt-new-${Date.now()}`,
      patientId: primaryPatient.id,
      patientName: primaryPatient.name,
      date,
      timeSlot,
      reason,
      status: AppointmentStatus.PENDING_TRIAGE,
      urgency: AppointmentUrgency.ROUTINE,
      triageCompleted: false,
      triageSummary: "",
      triageChatHistory: [],
      updatedAt: new Date().toISOString()
    };

    const updatedAppts = [newAppt, ...appointments];
    
    // Update patient faith support details if requested
    const updatedPatients = patients.map(p => {
      if (p.id === primaryPatient.id) {
        return {
          ...p,
          faithSupportRequested: faithSupport,
          faithNotes: faithSupport ? "Chaplain peer prayer requested at bedside." : p.faithNotes
        };
      }
      return p;
    });

    syncState(updatedPatients, updatedAppts, prescriptions);
  };

  // Launch pre-visit symptom triage modal
  const handleStartTriage = (apptId: string) => {
    setActiveTriageApptId(apptId);
  };

  // Callback once the AI chatbot completes symptoms review
  const handleTriageComplete = (summary: string, chatHistory: any[], urgency: AppointmentUrgency) => {
    if (!activeTriageApptId) return;

    const updatedAppts = appointments.map((appt) => {
      if (appt.id === activeTriageApptId) {
        return {
          ...appt,
          status: AppointmentStatus.CONFIRMED, // Promoted automatically to confirmed once triage is complete!
          triageCompleted: true,
          triageSummary: summary,
          triageChatHistory: chatHistory,
          urgency: urgency,
          updatedAt: new Date().toISOString()
        };
      }
      return appt;
    });

    syncState(patients, updatedAppts, prescriptions);
    
    const primaryPatient = patients[0];
    handlePostLog(
      "AI Triage Completed",
      `Patient ${primaryPatient?.name} successfully completed AI Symptoms checklist. Urgency determined: ${urgency}`
    );
    
    setActiveTriageApptId(null);
  };

  // Doctor consultation note file and Rx dispatcher
  const handleSaveConsultation = (appointmentId: string, notes: string, suggestions?: any, newPrescriptions?: Prescription[]) => {
    const updatedAppts = appointments.map((appt) => {
      if (appt.id === appointmentId) {
        return {
          ...appt,
          status: AppointmentStatus.COMPLETED,
          notes: notes,
          suggestedFollowUp: suggestions,
          updatedAt: new Date().toISOString()
        };
      }
      return appt;
    });

    let updatedRx = [...prescriptions];
    if (newPrescriptions && newPrescriptions.length > 0) {
      updatedRx = [...newPrescriptions, ...updatedRx];
    }

    syncState(patients, updatedAppts, updatedRx);
  };

  // Switch perspective and trigger database logging
  const handleEnterPortal = (role: Role | "PATIENT" | "DOCTOR" | "ADMIN") => {
    const parsedRole = role as Role;
    setTargetRoleToAuth(parsedRole);
    setIsGoogleAuthModalOpen(true);
  };

  const handleGoogleAuthSuccess = async (role: Role) => {
    setCurrentRole(role);
    
    // Determine simulated credentials based on role
    const mockEmail = role === Role.PATIENT 
      ? "fritssigerdkayadoe@gmail.com" 
      : role === Role.DOCTOR 
      ? "dr.sarah@gpibbukitzaitun.org" 
      : "admin@gpibbukitzaitun.org";
    
    const mockName = role === Role.PATIENT 
      ? "Frits Sigerd Kayadoe" 
      : role === Role.DOCTOR 
      ? "dr. Sarah Taylor, Sp.PD" 
      : "Admin Diakonia BZ";

    try {
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: `google-uid-${role.toLowerCase()}`,
          email: mockEmail,
          displayName: mockName,
          photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${role.toLowerCase()}`
        })
      });
    } catch (error) {
      console.error("Failed to sync authenticated Google profile to database:", error);
    }

    handlePostLog(
      "Google Sign-In Success",
      `Google OAuth session synchronized successfully to PostgreSQL for: ${role} workspace.`
    );
  };

  const handleReturnHome = () => {
    const oldRole = currentRole;
    setCurrentRole(null);
    if (oldRole) {
      handlePostLog(
        "Opened Public Landing Page",
        `Operator closed ${oldRole} workspace, returning to clinic home page.`
      );
    }
  };

  const primaryPatient = patients.find(p => p.email === "fritssigerdkayadoe@gmail.com") || patients[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Upper Navigation Global framing navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div 
            onClick={handleReturnHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <GpibLogo size={36} className="group-hover:scale-105 transition-transform drop-shadow-xs" />
            <div>
              <span className="font-sans font-bold text-brand-blue text-sm block leading-none uppercase">Klinik Kesehatan</span>
              <span className="text-[9px] text-brand-green font-bold tracking-widest uppercase block mt-0.5">GPIB Bukit Zaitun Makassar</span>
            </div>
          </div>

          {/* Perspective Switching Hub */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Tampilan Demo:</span>
            
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-1 flex items-center gap-1">
              <button
                onClick={() => handleEnterPortal(Role.PATIENT)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  currentRole === Role.PATIENT 
                    ? "bg-white text-brand-blue shadow-xs border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700 font-semibold"
                }`}
                id="switcher-btn-patient"
              >
                <User className="h-3.5 w-3.5 text-brand-blue" />
                <span>Pasien</span>
              </button>
              
              <button
                onClick={() => handleEnterPortal(Role.DOCTOR)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  currentRole === Role.DOCTOR 
                    ? "bg-white text-brand-blue shadow-xs border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700 font-semibold"
                }`}
                id="switcher-btn-doctor"
              >
                <Users className="h-3.5 w-3.5 text-brand-blue" />
                <span>Dokter</span>
              </button>
              
              <button
                onClick={() => handleEnterPortal(Role.ADMIN)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  currentRole === Role.ADMIN 
                    ? "bg-white text-brand-blue shadow-xs border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700 font-semibold"
                }`}
                id="switcher-btn-admin"
              >
                <Database className="h-3.5 w-3.5 text-brand-blue" />
                <span>Admin</span>
              </button>
            </div>

            {currentRole !== null && (
              <button
                onClick={handleReturnHome}
                className="hidden sm:inline-flex px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition leading-none cursor-pointer border border-slate-200"
              >
                Beranda
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area based on active view state */}
      <main className="flex-1">
        {currentRole === null ? (
          <LandingPage onEnterPortal={(role) => handleEnterPortal(role)} />
        ) : currentRole === Role.PATIENT ? (
          primaryPatient ? (
            <PatientPortal 
              patient={primaryPatient}
              appointments={appointments}
              prescriptions={prescriptions}
              onBookAppointment={handleBookAppointment}
              onStartTriage={handleStartTriage}
              onLogOut={handleReturnHome}
              onPostLog={handlePostLog}
            />
          ) : (
            <div className="text-center py-20 text-slate-500 font-semibold">Memuat Rekam Medis Pasien...</div>
          )
        ) : currentRole === Role.DOCTOR ? (
          <DoctorDashboard 
            doctorName="dr. Sarah Taylor, Sp.PD"
            appointments={appointments}
            patients={patients}
            prescriptions={prescriptions}
            onSaveConsultation={handleSaveConsultation}
            onPostLog={handlePostLog}
          />
        ) : currentRole === Role.ADMIN ? (
          <AdminDashboard 
            currentRole={currentRole}
            onPostLog={handlePostLog}
          />
        ) : null}
      </main>

      {/* Active AI Triage Chat Overlay Modal container */}
      {activeTriageApptId && (
        <TriageChatModal 
          onClose={() => setActiveTriageApptId(null)}
          onTriageComplete={handleTriageComplete}
        />
      )}

      {/* Google Sign-in / Sign-up Overlay Modal */}
      <GoogleSignInModal
        isOpen={isGoogleAuthModalOpen}
        onClose={() => setIsGoogleAuthModalOpen(false)}
        targetRole={targetRoleToAuth}
        onSuccess={(role) => handleGoogleAuthSuccess(role as Role)}
      />

      {/* Compact holistic church wellness footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-bold text-brand-blue">"Klinik Kesehatan" GPIB BUKIT ZAITUN MAKASSAR</p>
        <p className="text-brand-green font-semibold">Melayani Dengan Kasih, Menyembuhkan Dengan Harapan</p>
        <p className="text-[10px] text-slate-450">© 2026 GPIB Bukit Zaitun Makassar. Pelayanan rekam medis aman & terpercaya.</p>
      </footer>

    </div>
  );
}
