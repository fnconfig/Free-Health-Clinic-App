/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  Heart, Calendar, FileText, Pill, Plus, ArrowRight, CheckCircle2, AlertCircle, 
  HelpCircle, Globe, ChevronRight, User, LogOut, X 
} from "lucide-react";
import { Patient, Appointment, Prescription, AppointmentStatus, AppointmentUrgency } from "../types";

interface PatientPortalProps {
  patient: Patient;
  appointments: Appointment[];
  prescriptions: Prescription[];
  onBookAppointment: (date: string, timeSlot: string, reason: string, faithSupport: boolean) => void;
  onStartTriage: (appointmentId: string) => void;
  onLogOut: () => void;
  onPostLog: (action: string, details: string) => void;
}

export default function PatientPortal({ 
  patient, 
  appointments, 
  prescriptions, 
  onBookAppointment, 
  onStartTriage,
  onLogOut,
  onPostLog
}: PatientPortalProps) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [faithSupport, setFaithSupport] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showUpdateNotice, setShowUpdateNotice] = useState(true);

  const availableSlots = [
    "12:00 PM - 12:15 PM",
    "12:15 PM - 12:30 PM",
    "12:30 PM - 12:45 PM",
    "12:45 PM - 01:00 PM"
  ].filter(slot => !appointments.some(appt => appt.timeSlot === slot && appt.status !== AppointmentStatus.CANCELLED));

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !reason.trim()) return;

    onBookAppointment("2026-06-12", selectedSlot, reason, faithSupport);
    
    // Log audit event to database
    onPostLog(
      "Created Appointment Slot",
      `Patient ${patient.name} reserved Friday checkup at ${selectedSlot}. Faith Support: ${faithSupport ? "Yes" : "No"}`
    );

    setSelectedSlot("");
    setReason("");
    setFaithSupport(false);
    
    setShowNotification("Your Friday appointment spot is saved! Please complete your Symptom Triage next.");
    setTimeout(() => {
      setShowNotification(null);
    }, 5000);
  };

  const patientAppointments = appointments.filter(appt => appt.patientId === patient.id);
  const pendingTriageAppt = patientAppointments.find(appt => appt.status === AppointmentStatus.PENDING_TRIAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Upper Welcome and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-lg">
            {patient.name[0]}
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Portal Kesehatan Jemaat & Pasien</span>
            <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none cursor-pointer focus:ring-0 select-none font-bold"
            >
              <option value="Indonesian">Bahasa Indonesia (ID)</option>
              <option value="English">English (US)</option>
              <option value="Español">Español (ES)</option>
            </select>
          </div>

          <button
            onClick={onLogOut}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer font-bold"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-500" />
            <span>Keluar Portal</span>
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-brand-green/20 text-slate-800 text-xs rounded-xl flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" />
          <p className="font-semibold">{showNotification}</p>
        </div>
      )}

      {/* Immediate Triage Recommendation Card */}
      {pendingTriageAppt && (
        <div className="mb-8 bg-gradient-to-r from-brand-blue to-brand-dark rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-pulse">
          <div className="absolute right-0 top-0 translate-x-12 translate-y-12 h-36 w-36 rounded-full bg-brand-green opacity-20 blur-xl" />
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-green border border-brand-green/30 rounded-md text-[10px] font-extrabold text-white uppercase tracking-wider">
              <Heart className="h-3.5 w-3.5 fill-white stroke-0 text-white" />
              <span>Tindakan Diperlukan Untuk Hari Jumat</span>
            </div>
            <h3 className="text-xl font-black">Lengkapi Triase Gejala Online</h3>
            <p className="text-xs text-brand-cream leading-relaxed font-semibold">
              Dokter memerlukan ringkasan keluhan medis terstruktur sebelum konsultasi jam {pendingTriageAppt.timeSlot}. Mari jawab beberapa pertanyaan keluhan klinis singkat bersama asisten pintar kami.
            </p>
          </div>

          <button
            onClick={() => onStartTriage(pendingTriageAppt.id)}
            className="px-5 py-3 bg-white text-brand-blue hover:text-white hover:bg-brand-green transition-all duration-200 font-extrabold rounded-xl shrink-0 flex items-center gap-2 group cursor-pointer shadow-sm text-xs uppercase tracking-wider"
          >
            <span>Mulai Obrolan Gejala</span>
            <ArrowRight className="h-4 w-4 text-brand-blue group-hover:text-white transition group-hover:translate-x-1" />
          </button>
        </div>
      )}

      {/* Main Grid: Info columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Medical Summary and Bookings */}
        <div className="lg:col-span-8 space-y-8">
          {/* Care Slots and Visits */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Calendar className="h-5 w-5 text-brand-blue" />
              <span>Jadwal Konsultasi Hari Jumat Anda</span>
            </h3>

            {patientAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-455 text-xs font-medium">
                Belum ada jadwal konsultasi aktif untuk hari Jumat ini. Silakan pesan slot di bawah.
              </div>
            ) : (
              <div className="space-y-4">
                {patientAppointments.map((appt) => (
                  <div 
                    key={appt.id} 
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xs transition"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{appt.timeSlot}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          appt.status === AppointmentStatus.CONFIRMED 
                            ? "bg-emerald-50 text-brand-green border border-brand-green/20" 
                            : appt.status === AppointmentStatus.PENDING_TRIAGE 
                            ? "bg-amber-50 text-amber-700 animate-pulse border border-amber-100"
                            : "bg-green-50 text-green-700 border border-green-100"
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-650 font-semibold mt-1">Keluhan: {appt.reason}</p>
                      
                      {appt.triageCompleted && (
                        <div className="mt-2.5 p-2.5 bg-white border border-brand-green/15 rounded-lg text-slate-600 text-xs flex items-start gap-1.5 leading-relaxed max-w-lg shadow-2xs">
                           <CheckCircle2 className="h-3.5 w-3.5 text-brand-green shrink-0 mt-0.5" />
                          <div className="font-medium text-[11px]">
                            <span className="font-bold text-slate-850 block mb-0.5">Triase Selesai:</span> 
                            Ringkasan keluhan medis sudah dicatat secara aman dalam rekam medis digital. Prioritas urgensi ditentukan: <span className="font-bold text-rose-600 uppercase tracking-wide">{appt.urgency}</span>.
                          </div>
                        </div>
                      )}
                    </div>

                    {appt.status === AppointmentStatus.PENDING_TRIAGE && (
                      <button
                        onClick={() => onStartTriage(appt.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm uppercase tracking-wider shrink-0"
                      >
                        <Heart className="h-3.5 w-3.5 fill-brand-cream text-brand-cream" />
                        <span>Isi Triase Medis</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Booking scheduler */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2 uppercase tracking-wide">
              <Plus className="h-5 w-5 text-brand-green animate-pulse" />
              <span>Pesan Slot Layanan Jumat</span>
            </h3>
            <p className="text-xs text-slate-450 mb-6 font-semibold">
              Klinik Kesehatan GPIB Bukit Zaitun beroperasi di hari Jumat pagi. Seluruh pelayanan medis umum bebas biaya. Pilih jam kosong di bawah:
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4 font-sans">
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">PILIH SLOT WAKTU KUNJUNGAN</label>
                {availableSlots.length === 0 ? (
                  <p className="text-xs text-rose-600 font-semibold p-3 bg-rose-50 rounded-lg border border-rose-100">
                    Semua slot konsultasi hari Jumat ini sudah penuh terisi. Hubungi sekretariat gereja atau datang langsung untuk antrean walk-in darurat.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition text-center cursor-pointer ${
                          selectedSlot === slot 
                            ? "bg-brand-blue border-brand-blue text-white font-bold shadow-sm" 
                            : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {slot.split(" - ")[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">KELUHAN ATAU GEJALA UTAMA</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ceritakan rasa tidak nyaman, keluhan penyakit, atau kebutuhan perpanjangan resep obat Anda agar dokter kami bisa mempersiapkan diri..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>              {/* Faith Outreach Options */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="faithSupport"
                    checked={faithSupport}
                    onChange={(e) => setFaithSupport(e.target.checked)}
                    className="h-4.5 w-4.5 text-slate-800 border-slate-300 rounded-md focus:ring-slate-500 cursor-pointer mt-0.5"
                  />
                  <div className="text-xs">
                    <label htmlFor="faithSupport" className="font-bold text-slate-800 cursor-pointer flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-brand-blue fill-brand-cream" />
                      <span>Dukungan Pastoral & Doa Pendampingan (Opsional)</span>
                    </label>
                    <p className="text-slate-500 leading-relaxed mt-0.5 font-medium">
                      Apakah Anda membutuhkan tim diakonia, penatua, atau pendeta gereja untuk mendoakan atau berbincang dengan Anda secara khusus mengenai kondisi pemulihan Anda? Pilihan ini bersifat opsional & gratis.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedSlot || !reason.trim()}
                className="w-full py-3 bg-brand-blue hover:bg-opacity-95 text-white font-bold rounded-xl disabled:bg-slate-200 disabled:text-slate-400 hover:shadow transition duration-200 cursor-pointer text-xs uppercase tracking-wider"
              >
                Pesan Slot Layanan Jumat Sekarang
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Allergy profiles and Active Prescriptions */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Medical Record Folder details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <FileText className="h-5 w-5 text-brand-blue" />
              <span>Profil Rekam Medis Anda</span>
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Riwayat Diagnosa Penyakit</span>
                {patient.medicalHistory.length === 0 ? (
                  <span className="text-xs text-slate-500 font-medium">Belum ada riwayat</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {patient.medicalHistory.map((cond, idx) => (
                      <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {cond}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Alergi Obat Medis</span>
                {patient.allergies.length === 0 ? (
                  <span className="text-[10px] text-brand-green font-bold bg-green-50 border border-green-150 px-2 py-0.5 rounded-md uppercase tracking-wider">Tidak Ada Alergi</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {patient.allergies.map((all, idx) => (
                      <span key={idx} className="bg-rose-50 border border-rose-100 text-rose-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {all}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {showUpdateNotice && (
                <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start justify-between gap-1.5 font-semibold">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="h-4 w-4 text-brand-blue shrink-0" />
                    <span>Untuk menambahkan/memperbarui daftar diagnosa medis atau alergi obat Anda, mohon konsultasikan ke dokter sewaktu kunjungan.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUpdateNotice(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-50 cursor-pointer shrink-0"
                    title="Tutup"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Prescriptions Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm font-sans">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Pill className="h-5 w-5 text-brand-blue" />
              <span>Resep Obat Gratis Aktif (Rx)</span>
            </h3>

            {prescriptions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                Belum ada resep obat gratis yang dimasukkan dalam program Anda.
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">{rx.medicationName}</h4>
                        <span className="text-xs text-slate-500 font-semibold">{rx.dosage} • {rx.frequency}</span>
                      </div>
                      <span className="text-[9px] py-0.5 px-2 bg-slate-100 border border-slate-200 text-brand-blue font-bold rounded-full uppercase shrink-0">
                        Sisa {rx.refillsLeft} Isi Ulang
                      </span>
                    </div>
                    <p className="text-xs text-slate-650 leading-relaxed border-t border-slate-200 pt-2 bg-white p-2 rounded-md border border-slate-100 font-semibold italic">
                      &ldquo;{rx.instructions}&rdquo;
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Dokter: {rx.doctorName} • Tanggal {rx.datePrescribed}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
