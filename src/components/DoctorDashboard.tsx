/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Users, Activity, ClipboardList, Clock, Sparkles, CheckSquare, Pill, AlertCircle, 
  ChevronRight, Calendar, User, Heart, MessageSquare, Plus, Save, Compass 
} from "lucide-react";
import { Patient, Appointment, Prescription, AppointmentStatus, AppointmentUrgency } from "../types";

interface DoctorDashboardProps {
  doctorName: string;
  appointments: Appointment[];
  patients: Patient[];
  prescriptions: Prescription[];
  onSaveConsultation: (appointmentId: string, notes: string, suggestions?: any, newPrescriptions?: Prescription[]) => void;
  onPostLog: (action: string, details: string) => void;
}

export default function DoctorDashboard({ 
  doctorName, 
  appointments, 
  patients, 
  prescriptions,
  onSaveConsultation,
  onPostLog
}: DoctorDashboardProps) {
  const [activeApptId, setActiveApptId] = useState<string | null>(appointments[0]?.id || null);
  const [consultNotes, setConsultNotes] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);
  
  // New drug drawer states
  const [rxName, setRxName] = useState("");
  const [rxDosage, setRxDosage] = useState("");
  const [rxFrequency, setRxFrequency] = useState("");
  const [rxRefills, setRxRefills] = useState<number>(3);
  const [rxInstructions, setRxInstructions] = useState("");
  const [draftPrescriptions, setDraftPrescriptions] = useState<Prescription[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeAppt = appointments.find(appt => appt.id === activeApptId);
  const activePatient = activeAppt ? patients.find(pat => pat.id === activeAppt.patientId) : null;
  const activePatientRx = activePatient ? prescriptions.filter(rx => rx.patientId === activePatient.id) : [];

  const handleConsultSelect = (apptId: string) => {
    setActiveApptId(apptId);
    const appt = appointments.find(a => a.id === apptId);
    setConsultNotes(appt?.notes || "");
    setAiSuggestion(appt?.suggestedFollowUp || null);
    setDraftPrescriptions([]);
    setSaveSuccess(false);
  };

  const handleTriggerAI = async () => {
    if (!consultNotes.trim()) return;
    setAiLoading(true);
    try {
      const response = await fetch("/api/gemini/suggest-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorNotes: consultNotes })
      });

      if (!response.ok) throw new Error("AI scheduling suggestion server failed.");

      const data = await response.json();
      setAiSuggestion({
        timeframe: data.timeframe,
        reason: data.reason,
        urgency: data.urgency,
        approved: false
      });
    } catch (e) {
      console.error(e);
      // Fallback
      setAiSuggestion({
        timeframe: "In 2 weeks",
        reason: "Generic clinical re-evaluation and symptoms review.",
        urgency: "Routine",
        approved: false
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddDraftRx = () => {
    if (!rxName.trim() || !rxDosage.trim() || !activePatient) return;
    const newRx: Prescription = {
      id: `rx-new-${Date.now()}`,
      patientId: activePatient.id,
      datePrescribed: new Date().toISOString().split("T")[0],
      medicationName: rxName.trim(),
      dosage: rxDosage.trim(),
      frequency: rxFrequency.trim() || "Once daily",
      instructions: rxInstructions.trim() || "Take with meals.",
      doctorName: doctorName,
      refillsLeft: rxRefills
    };

    setDraftPrescriptions([...draftPrescriptions, newRx]);
    setRxName("");
    setRxDosage("");
    setRxFrequency("");
    setRxInstructions("");
    setRxRefills(3);
  };

  const handleSaveAll = () => {
    if (!activeApptId) return;
    
    onSaveConsultation(
      activeApptId, 
      consultNotes, 
      aiSuggestion ? { ...aiSuggestion, approved: true } : undefined,
      draftPrescriptions
    );

    onPostLog(
      "Completed Consultation",
      `Dr. Sarah Taylor saved consult chart for ${activePatient?.name}. Followup suggestion locked: ${aiSuggestion?.timeframe || "None"}`
    );

    setSaveSuccess(true);
    setDraftPrescriptions([]);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  // Status counters
  const totalSlots = appointments.length;
  const pendingTriage = appointments.filter(a => a.status === AppointmentStatus.PENDING_TRIAGE).length;
  const completedCount = appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Clinician Hub Info Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs text-brand-blue font-bold uppercase tracking-wider block">Panel Pencatatan Medis & Konsultasi Dokter</span>
          <h2 className="text-2xl font-black text-slate-800 mt-1">{doctorName}</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Dokter Spesialis & Relawan Diakonia Kesehatan • Klinik Kesehatan GPIB Bukit Zaitun</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="px-4 py-2 bg-brand-light border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Pasien</span>
            <span className="text-lg font-extrabold text-slate-800 block mt-1">{totalSlots}</span>
          </div>
          <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">Menunggu Triase</span>
            <span className="text-lg font-extrabold text-amber-750 block mt-1">{pendingTriage}</span>
          </div>
          <div className="px-4 py-2 bg-green-50 border border-brand-green/20 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-brand-green block tracking-wider">Selesai</span>
            <span className="text-lg font-extrabold text-brand-green block mt-1">{completedCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
               {/* Left column: Appointment Schedule Navigation list */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <ClipboardList className="h-4.5 w-4.5 text-brand-blue" />
              <span>Daftar Antrean Konsultasi</span>
            </h3>

            <div className="space-y-2.5">
              {appointments.map((appt) => {
                const isSelected = appt.id === activeApptId;
                return (
                  <button
                    key={appt.id}
                    onClick={() => handleConsultSelect(appt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? "bg-brand-light border-brand-blue shadow-xs" 
                        : "border-slate-100 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-500">{appt.timeSlot.split(" - ")[0]}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                          appt.status === AppointmentStatus.COMPLETED 
                            ? "bg-green-50 text-brand-green border border-brand-green/20" 
                            : appt.status === AppointmentStatus.PENDING_TRIAGE 
                            ? "bg-amber-50 text-amber-700 border border-amber-100" 
                            : "bg-blue-50 text-brand-blue border border-brand-blue/20"
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800 text-sm block">{appt.patientName}</span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">{appt.reason}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-slate-450 font-bold transition-transform ${isSelected ? "translate-x-1" : ""}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Sesi Medis: Jumat 12:00 - 13:00 WITA</span>
          </div>
        </div>

        {/* Right column: Patient Electronic Medical Record (EMR) Details */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          {activePatient && activeAppt ? (
            <>
              {/* Patient Basic detail head */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold rounded-lg flex items-center justify-center">
                    {activePatient.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{activePatient.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                      <span>Lahir {activePatient.birthDate}</span>
                      <span>•</span>
                      <span>Bahasa: {activePatient.preferredLanguage === "Indonesian" ? "B. Indonesia" : activePatient.preferredLanguage}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1 text-xs">
                  <span className="font-bold text-slate-655 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 block">
                    {activePatient.insuranceNotes === "None (Free Roster)" ? "Program Diakonia Gratis" : activePatient.insuranceNotes}
                  </span>
                  {activePatient.faithSupportRequested && (
                    <span className="inline-flex items-center gap-1 text-brand-blue bg-blue-50 border border-brand-blue/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold mt-1">
                      <Heart className="h-3 w-3 fill-brand-green stroke-0 text-brand-green" />
                      Butuh Dukungan Pastoral & Doa
                    </span>
                  )}
                </div>
              </div>

              {/* Triage summary container */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-brand-blue animate-spin-slow" />
                    <span>Hasil Analisa Triase Gejala Otomatis AI</span>
                  </div>
                  
                  {activeAppt.triageCompleted ? (
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                      activeAppt.urgency === AppointmentUrgency.URGENT 
                        ? "bg-rose-50 text-rose-750 border border-rose-100" 
                        : activeAppt.urgency === AppointmentUrgency.SOON 
                        ? "bg-amber-100 text-amber-800" 
                        : "bg-slate-200 text-slate-700"
                    }`}>
                      Tingkat Urgensi: {activeAppt.urgency === AppointmentUrgency.URGENT ? "SEGERA" : activeAppt.urgency === AppointmentUrgency.SOON ? "SEMI SEGERA" : "RUTIN"}
                    </span>
                  ) : (
                    <span className="text-[9px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 font-extrabold uppercase tracking-wider animate-pulse rounded-md">
                      Menunggu Pasien Isi Obrolan
                    </span>
                  )}
                </div>

                {activeAppt.triageCompleted ? (
                  <pre className="text-xs leading-relaxed font-sans text-slate-750 whitespace-pre-wrap font-semibold">
                    {activeAppt.triageSummary}
                  </pre>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2 flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse" />
                    <span>Pasien belum melengkapi obrolan triase mandiri sebelum kunjungan. Silakan lakukan pemeriksaan fisik langsung (walk-in).</span>
                  </div>
                )}
              </div>

              {/* Patient's History & Allergies block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Riwayat Diagnosa Penyakit</span>
                  {activePatient.medicalHistory.length === 0 ? (
                    <span className="text-xs text-slate-500 mt-1 block font-semibold">Tidak ada riwayat penyakit kronis</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activePatient.medicalHistory.map((cond, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {cond}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Alergi Obat Diketahui</span>
                  {activePatient.allergies.length === 0 ? (
                    <span className="text-[10px] text-brand-green font-bold mt-2 bg-green-50 border border-green-150 rounded px-2.5 py-1 block uppercase tracking-wider w-fit">Tidak Ada Alergi Obat</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activePatient.allergies.map((all, idx) => (
                        <span key={idx} className="bg-rose-50 border border-rose-100 text-rose-750 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {all}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation Note entry field */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catatan Konsultasi & Rekam Medis Dokter</label>
                  <span className="text-[11px] text-slate-400 font-semibold">Tuliskan objektif vitalitas & diagnosa medis</span>
                </div>
                <textarea
                  value={consultNotes}
                  onChange={(e) => setConsultNotes(e.target.value)}
                  placeholder="Masukkan vital, pemeriksaan fisik, resep dokter, saran medis, terapi, atau instruksi pemulihan..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:border-brand-blue focus:outline-hidden"
                  disabled={activeAppt.status === AppointmentStatus.COMPLETED}
                />
              </div>

              {/* Suggeted Follow-up Planning - Section 3.4 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-blue" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Metode Penjadwalan Berbantuan AI</span>
                  </div>
                  
                  {activeAppt.status !== AppointmentStatus.COMPLETED && (
                    <button
                      type="button"
                      onClick={handleTriggerAI}
                      disabled={!consultNotes.trim() || aiLoading}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-brand-blue/20 text-brand-blue font-bold rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1 disabled:opacity-40 shadow-xs"
                    >
                      {aiLoading ? "Menganalisa..." : "Minta Rekomendasi Medis AI"}
                    </button>
                  )}
                </div>

                {aiSuggestion ? (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2.5 animate-fade-in text-xs font-semibold">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Rekomendasi Waktu: <span className="text-brand-blue font-extrabold">{aiSuggestion.timeframe === "In 2 weeks" ? "Dalam 2 Minggu" : aiSuggestion.timeframe}</span></span>
                      <span className="font-bold bg-blue-50 border border-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-md uppercase tracking-wide text-[9px]">Urgensi: {aiSuggestion.urgency}</span>
                    </div>
                    <p className="text-xs text-slate-650 leading-relaxed italic">
                      Pertimbangan Klinis AI: {aiSuggestion.reason}
                    </p>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      ✓ Rekomendasi di atas akan disimpan otomatis ke rekam medis pasien setelah Anda menyetujui.
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-450 italic font-semibold leading-relaxed">
                    Ketik hasil observasi klinis atau diagnosa Anda di kolom Catatan Konsultasi terlebih dahulu, lalu klik tombol analisis untuk meregenerasi saran jadwal konsultasi ulang otomatis!
                  </p>
                )}
              </div>

              {/* Dynamic Prescriptions Writer component */}
              {activeAppt.status !== AppointmentStatus.COMPLETED && (
                <div className="p-4 border border-slate-200 rounded-xl space-y-3.5 bg-slate-50/50">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Pill className="h-4 w-4 text-brand-green" />
                    <span>Pembuat Resep Obat Gratis Baru (Rx)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
                    <input
                      type="text"
                      placeholder="Nama Obat (Generik)"
                      value={rxName}
                      onChange={(e) => setRxName(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Dosis (mis. 500mg, 1 Tab)"
                      value={rxDosage}
                      onChange={(e) => setRxDosage(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Frekuensi (mis. 3x Sehari)"
                      value={rxFrequency}
                      onChange={(e) => setRxFrequency(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium text-xs"
                    />
                    <div className="flex gap-1">
                      <select
                        value={rxRefills}
                        onChange={(e) => setRxRefills(Number(e.target.value))}
                        className="px-1.5 py-1.5 border border-slate-200 rounded-lg bg-white flex-1 font-bold text-xs"
                      >
                        <option value={1}>1x Isi Ulang</option>
                        <option value={2}>2x Isi Ulang</option>
                        <option value={3}>3x Isi Ulang</option>
                        <option value={5}>5x Isi Ulang</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddDraftRx}
                        className="px-2.5 bg-brand-blue hover:bg-opacity-90 text-white rounded-lg cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {draftPrescriptions.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Antrean Penulisan Resep:</span>
                      {draftPrescriptions.map((rx, i) => (
                        <div key={i} className="text-xs bg-blue-50 border border-brand-blue/15 text-brand-blue p-2 rounded-lg flex justify-between items-center font-bold">
                          <span><strong>{rx.medicationName}</strong> {rx.dosage} - {rx.frequency} ({rx.refillsLeft} kali isi ulang)</span>
                          <button
                            type="button"
                            onClick={() => setDraftPrescriptions(draftPrescriptions.filter((_, idx) => idx !== i))}
                            className="text-rose-650 hover:text-rose-800 font-bold text-xs ml-3"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Consultation controls */}
              {activeAppt.status !== AppointmentStatus.COMPLETED ? (
                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold">Semua perubahan langsung disimpan secara lokal di peramban.</span>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="px-5 py-2.5 bg-brand-blue hover:bg-opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow transition duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Save className="h-4 w-4" />
                      <span>Selesaikan & Tutup Konsultasi</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-650 bg-slate-50 p-4 rounded-xl border font-semibold">
                  <span>✓ Pemeriksaan medis berhasil diselesaikan & rekat resep obat dikirimkan. Rekomendasi kontrol ulang: {activeAppt.suggestedFollowUp?.timeframe || "Tidak ada"}</span>
                  <span className="font-extrabold text-brand-green uppercase tracking-widest text-[10px]">Terkunci</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-brand-green/20 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <CheckSquare className="h-4.5 w-4.5 text-brand-green" />
                  <span>Catatan medis jemaat berhasil diperbarui secara permanen dan disinkronkan ke resep lokal!</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-400 text-sm">
              No active Friday clinic appointments select slot list to initiate consulting console.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
