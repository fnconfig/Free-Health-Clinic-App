/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageSquare, Send, Sparkles, AlertCircle, RefreshCw, Check, ArrowRight, X } from "lucide-react";
import { TriageMessage, AppointmentUrgency } from "../types";

interface TriageChatModalProps {
  onClose: () => void;
  onTriageComplete: (summary: string, chatHistory: TriageMessage[], urgency: AppointmentUrgency) => void;
}

export default function TriageChatModal({ onClose, onTriageComplete }: TriageChatModalProps) {
  const [messages, setMessages] = useState<TriageMessage[]>([
    {
      id: "init-welcome",
      sender: "ai",
      text: "Syalom! Selamat datang di Layanan Triase Mandiri Klinik Kesehatan GPIB Bukit Zaitun Makassar. Saya adalah Asisten Medis Companion Anda.\n\nSaya akan membantu mencatat gejala dan keluhan fisik Anda secara terstruktur agar tim Dokter kami dapat membacanya sebelum kunjungan dinas medis hari Jumat ini.\n\nUntuk memulai, mohon ceritakan secara singkat keluhan penyakit, gejala tubuh, atau perpanjangan resep obat bebas yang sedang Anda butuhkan?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [triageDone, setTriageDone] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [suggestedUrgency, setSuggestedUrgency] = useState<AppointmentUrgency>(AppointmentUrgency.ROUTINE);
  const [showEmergencyWarning, setShowEmergencyWarning] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to message bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmitSymptom = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    // Add patient message
    const userMsg: TriageMessage = {
      id: `pat-${Date.now()}`,
      sender: "patient",
      text: userText,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory: updatedHistory })
      });

      if (!response.ok) {
        throw new Error("Triage endpoint service error.");
      }

      const data = await response.json();
      
      const aiMsg: TriageMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply || "Saya telah menerima keluhan ini. Tim medis kami akan segera mengetahuinya sewaktu Anda datang hari Jumat.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.triageCompleted) {
        setTriageDone(true);
        setGeneratedSummary(data.suggestedSummary || "Ringkasan rekam medis triase berhasil digenerasikan.");
        // Protect against casing mismatch
        const parsedUrgency = data.suggestedUrgency as AppointmentUrgency || AppointmentUrgency.ROUTINE;
        setSuggestedUrgency(parsedUrgency);
      }
    } catch (error) {
      console.error("AI triage handler failure:", error);
      // Mock retry fallback
      const aiMsg: TriageMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "Saya sudah mencatat keluhan lanjutan Anda ini dengan baik untuk antrean data dokter.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectQuickComplaint = (complaint: string) => {
    setInput(complaint);
  };

  const handleFinalize = () => {
    onTriageComplete(generatedSummary, messages, suggestedUrgency);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header toolbar */}
        <div className="px-5 py-4 bg-brand-blue text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg border border-white/20">
              <Sparkles className="h-5 w-5 text-brand-green" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight uppercase tracking-wider">Triase Kesehatan Mandiri AI</h3>
              <p className="text-[10px] text-brand-cream font-bold uppercase tracking-widest">Klinik Kesehatan GPIB Bukit Zaitun</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border border-transparent hover:border-white/20 transition-all"
          >
            Batal
          </button>
        </div>

        {/* Warning Callout bar */}
        {showEmergencyWarning && (
          <div className="px-5 py-3 bg-rose-50 border-b border-rose-100 text-rose-950 text-[11px] flex items-start justify-between gap-3 leading-relaxed transition-all duration-300">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
              <p className="font-semibold">
                <strong className="text-rose-800">PERINGATAN GAWAT DARURAT:</strong> Jika Anda mengalami sesak napas berat tiba-tiba, nyeri hebat atau himpitan kuat di dada, atau penurunan kesadaran, mohon hubungi nomor ambulans darurat (118) atau segera menuju IGD rumah sakit terdekat. Pengecekan triase asisten medis ini digunakan untuk mempercepat persiapan data medis klinik rawat jalan hari Jumat umum dan tidak ditujukan untuk penanganan gawat darurat.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowEmergencyWarning(false)}
              className="text-rose-500 hover:text-rose-900 hover:bg-rose-100 p-1 rounded-lg transition shrink-0 cursor-pointer"
              title="Tutup Peringatan"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Messaging Board / Completion Stage */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50">
          {!triageDone ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed ${
                    msg.sender === "patient" 
                      ? "bg-brand-blue text-white rounded-tr-none shadow-sm" 
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
                  }`}>
                    {msg.text.split("\n\n").map((para, i) => (
                      <p key={i} className="mb-2 last:mb-0 whitespace-pre-wrap">{para}</p>
                    ))}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-505 rounded-2xl rounded-tl-none p-4 text-xs shadow-sm flex items-center gap-2 font-semibold">
                    <RefreshCw className="h-4 w-4 animate-spin text-brand-blue" />
                    <span>Companion sedang menganalisa keluhan medis Anda dengan kritis...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            /* Triage Completion Screen */
            <div className="py-6 px-4 text-center max-w-lg mx-auto flex flex-col justify-center h-full">
              <div className="h-12 w-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-green shadow-2xs">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 mb-2 uppercase tracking-wide">Triase Selesai & Berhasil Dicatat!</h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed font-semibold">
                Terima kasih telah menjawab pertanyaan bantuan medis kami. Kami telah merangkum ringkasan keluhan fisik Anda untuk langsung diakses dokter kami saat kunjungan hari Jumat.
              </p>

              {/* Generated summary box */}
              <div className="text-left bg-white rounded-xl p-4 border border-brand-green/20 mb-6 max-h-48 overflow-y-auto custom-scrollbar text-xs leading-relaxed text-slate-700 shadow-2xs">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
                  <span className="font-extrabold text-brand-blue block text-[10px] uppercase tracking-wider">Ringkasan Laporan Dokter</span>
                  <span className="text-[9px] font-extrabold bg-blue-50 border border-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Urgensi: {suggestedUrgency === "URGENT" ? "SEGERA" : suggestedUrgency === "SEMI_URGENT" ? "SEMI SEGERA" : "RUTIN"}
                  </span>
                </div>
                <pre className="font-sans whitespace-pre-wrap font-semibold text-[11px] text-slate-700">{generatedSummary}</pre>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setTriageDone(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition duration-200 cursor-pointer border border-slate-200 shadow-2xs"
                >
                  Ubah Jawaban
                </button>
                <button
                  type="button"
                  onClick={handleFinalize}
                  className="flex-1 py-3 bg-brand-blue hover:bg-opacity-95 text-white text-xs font-bold rounded-xl hover:shadow transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm uppercase tracking-wider"
                >
                  <span>Konfirmasi & Simpan</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Tray (shown contextually) */}
        {!triageDone && (
          <div className="p-4 bg-white border-t border-slate-200">
            {/* Quick Suggestion tags */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] text-slate-400 font-bold self-center uppercase tracking-wider">Keluhan Umum:</span>
                <button
                  type="button"
                  onClick={() => selectQuickComplaint("Saya mengalami tekanan darah tinggi mendadak dan perlu resep obat pengontrol tensi Amilodipine/Lisinopril untuk satu bulan.")}
                  className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 cursor-pointer font-semibold"
                >
                  Beli/Minta Resep Obat Tekanan Darah
                </button>
                <button
                  type="button"
                  onClick={() => selectQuickComplaint("Badan terasa gemetar, kesemutan di ujung kaki, kelaparan hebat, dan sering kencing dalam seminggu terakhir.")}
                  className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 cursor-pointer font-semibold"
                >
                  Gula Darah / Diabetes
                </button>
                <button
                  type="button"
                  onClick={() => selectQuickComplaint("Sakit kepala bagian belakang berdenyut-denyut kencang dan pegal kaku di otot pundak belakang.")}
                  className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 cursor-pointer font-semibold"
                >
                  Sakit Kepala / Otot Tegang
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitSymptom} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis keluhan atau apa yang Anda rasakan saat ini..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-blue focus:outline-hidden"
                required
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2.5 bg-brand-blue hover:bg-opacity-95 text-white rounded-xl disabled:bg-slate-200 disabled:text-slate-450 transition cursor-pointer flex items-center justify-center shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
