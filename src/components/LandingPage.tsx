/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Heart, Calendar, Clock, MapPin, Sparkles, CheckCircle2, 
  HelpCircle, Users, Shield, Plus, HeartHandshake, Stethoscope, Pill, Globe, Database 
} from "lucide-react";
import { GpibLogo } from "./GpibLogo";

interface LandingPageProps {
  onEnterPortal: (role: "PATIENT" | "DOCTOR" | "ADMIN") => void;
}

const DICTIONARY = {
  id: {
    heroTag: "Melayani Dengan Kasih, Menyembuhkan Dengan Harapan",
    heroTitlePrefix: "Pelayanan Kesehatan Inklusif & ",
    heroTitleAccent: "Sepenuhnya Gratis",
    heroDesc: "Selamat datang di asisten kesehatan digital Klinik Kesehatan GPIB Bukit Zaitun Makassar. Kami menyediakan konsultasi medis profesional, pembantuan rekam medis digital berbasis AI, serta obat-obatan gratis demi pemulihan menyeluruh jemaat dan masyarakat sekitar.",
    pajLabel: "PANDUAN RAWAT JALAN",
    pajTitle: "Pemberdayaan Pasien Lewat Asisten Triase AI",
    step1: "1. Masuk Portal Pasien: Gunakan akun rekam medis Google Anda untuk login secara instan & aman.",
    step2: "2. Obrolan Triase Gejala AI: Ceritakan keluhan Anda ke asisten AI yang hangat & terenkripsi untuk mengompilasi rekam dokter otomatis.",
    step3: "3. Ambil Slot Jadwal Jumat: Pilih jam pelayanan yang kosong di hari Jumat.",
    btnStart: "Mulai Triase Gejala",
    btnPatient: "Masuk Portal Pasien",
    btnDoctor: "Konsol Dokter Relawan",
    btnAdmin: "Dashboard Admin",
    pillarTitle: "4 Pilar Utama Pelayanan Kami",
    programTitle: "PROGRAM DIAKONIA KESEHATAN",
    pillars: [
      {
        title: "Pemeriksaan Kesehatan",
        description: "Pemeriksaan kesehatan dasar berkala oleh dokter umum dan dokter spesialis relawan jemaat secara berkala."
      },
      {
        title: "Layanan Kesehatan",
        description: "Konsultasi medis humanis dan bimbingan kesehatan primer demi pencegahan penyakit jangka pendek maupun panjang."
      },
      {
        title: "Pengobatan Gratis",
        description: "Pemberian obat pendukung dan obat kronis sesuai resep dokter tanpa memungut sepeser pun biaya pengobatan."
      },
      {
        title: "Kasih Untuk Semua",
        description: "Pelayanan inklusif bagi seluruh lapisan masyarakat tanpa memandang kualifikasi ekonomi, sosial, atau asuransi."
      }
    ],
    brandValues: [
      { label: "BERIMAN" },
      { label: "PEDULI" },
      { label: "MELAYANI" },
      { label: "BERSAMA" }
    ]
  },
  en: {
    heroTag: "Serving with Love, Healing with Hope",
    heroTitlePrefix: "Inclusive Healthcare, ",
    heroTitleAccent: "Completely Free",
    heroDesc: "Welcome to the digital health companion of GPIB Bukit Zaitun Makassar Health Clinic. We provide professional medical consultations, AI-powered electronic medical record assistance, and free medication for the physical recovery of our church congregation and local neighborhood.",
    pajLabel: "OUTPATIENT PATIENT CARE GUIDE",
    pajTitle: "Patient Empowerment via AI Triage Companion",
    step1: "1. Login Patient Portal: Use your Google medical credentials to sign-in instantly & securely.",
    step2: "2. Smart Symptom Triage: Tell your symptoms to our warm, encrypted AI assistant to construct clinical record history ahead of time.",
    step3: "3. Confirm Friday Slot: Select your preferred consultation hour on Friday clinic days.",
    btnStart: "Begin Triage Dialogue",
    btnPatient: "Enter Patient Portal",
    btnDoctor: "Volunteer Doctor Console",
    btnAdmin: "Admin Dashboard",
    pillarTitle: "The 4 Pillars of Our Service",
    programTitle: "CHURCH DIAKONIA HEALTHCARE PROGRAM",
    pillars: [
      {
        title: "Medical Checkups",
        description: "Routine primary wellness and specialty diagnostics provided by volunteer parish physicians."
      },
      {
        title: "Holistic Counseling",
        description: "Humanist medical care, primary counseling, and lifestyle education for preventive wellbeing."
      },
      {
        title: "Free Pharmacy Support",
        description: "Distribution of support medications and chronic treatment supplies strictly per doctor prescriptions."
      },
      {
        title: "Compassion For All",
        description: "Inclusive healthcare for everyone, regardless of economic, insurance, or social background."
      }
    ],
    brandValues: [
      { label: "FAITHFUL" },
      { label: "CARING" },
      { label: "SERVING" },
      { label: "TOGETHER" }
    ]
  }
};

export default function LandingPage({ onEnterPortal }: LandingPageProps) {
  const [lang, setLang] = useState<"id" | "en">("id");
  const t = DICTIONARY[lang];

  // Icons array linked to localized pillars
  const clinicalIconList = [
    <Stethoscope className="h-8 w-8 text-brand-blue" />,
    <Heart className="h-8 w-8 text-brand-blue" />,
    <Pill className="h-8 w-8 text-brand-blue" />,
    <HeartHandshake className="h-8 w-8 text-brand-blue" />
  ];

  // Icons array linked to brand values
  const brandValueIconList = [
    <Shield className="h-5 w-5 text-brand-blue" />,
    <Heart className="h-5 w-5 text-brand-blue" />,
    <Plus className="h-5 w-5 text-brand-blue" />,
    <Users className="h-5 w-5 text-brand-blue" />
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      {/* Top bar with beautiful language toggle button */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex justify-end">
        <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors">
          <Globe className="h-4 w-4 text-slate-400 ml-1.5" />
          <button
            onClick={() => setLang("id")}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
              lang === "id"
                ? "bg-brand-blue text-white shadow-3xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            Bahasa (ID)
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
              lang === "en"
                ? "bg-brand-blue text-white shadow-3xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            English (EN)
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-8 md:py-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Stylized Logo Emblem matching the branding image perfectly */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative hover:scale-105 transition-transform duration-300 drop-shadow-md">
            <GpibLogo size={135} className="bg-white rounded-full p-0.5 border border-slate-100 shadow-sm" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-brand-blue mt-5 uppercase">
            Klinik Kesehatan
          </h1>
          <p className="text-sm text-brand-green font-bold uppercase tracking-widest mt-1">
            GPIB BUKIT ZAITUN MAKASSAR
          </p>
          <div className="w-24 h-1 bg-brand-green mt-3.5 rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-light border border-slate-200 rounded-full text-brand-blue text-xs font-bold mb-6 uppercase tracking-wider">
          <Heart className="h-3.5 w-3.5 fill-brand-green stroke-0 text-brand-green animate-pulse" />
          <span>{t.heroTag}</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.12] mb-6">
          {t.heroTitlePrefix}<span className="text-brand-blue">{t.heroTitleAccent}</span>
        </h2>

        <p className="text-base md:text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed font-medium">
          {t.heroDesc}
        </p>

        {/* Brand Values Row (BERIMAN, PEDULI, MELAYANI, BERSAMA) */}
        <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto mb-12 border-b border-t border-slate-200 py-5 w-full">
          {t.brandValues.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="h-11 w-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-2xs hover:border-brand-green transition duration-200">
                {brandValueIconList[idx]}
              </div>
              <span className="text-[10px] md:text-xs font-bold text-slate-700 mt-2 tracking-wider uppercase">
                {val.label}
              </span>
            </div>
          ))}
        </div>

        {/* Portal Access Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl mt-4">
          <button
            onClick={() => onEnterPortal("PATIENT")}
            className="flex-1 px-6 py-3.5 bg-brand-blue hover:bg-opacity-95 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer text-sm"
            id="btn-patient-portal-landing"
          >
            <Calendar className="h-4.5 w-4.5 text-brand-cream" />
            <span>{t.btnPatient}</span>
          </button>
          
          <button
            onClick={() => onEnterPortal("DOCTOR")}
            className="flex-1 px-6 py-3.5 bg-white border border-slate-250 hover:bg-slate-50 text-slate-800 font-bold rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
            id="btn-doctor-portal-landing"
          >
            <Clock className="h-4.5 w-4.5 text-brand-green" />
            <span>{t.btnDoctor}</span>
          </button>

          <button
            onClick={() => onEnterPortal("ADMIN")}
            className="flex-1 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
            id="btn-admin-portal-landing"
          >
            <Database className="h-4.5 w-4.5 text-slate-300" />
            <span>{t.btnAdmin}</span>
          </button>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="bg-white border-y border-slate-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-brand-green font-bold block mb-1">{t.programTitle}</span>
            <h3 className="text-3xl font-black text-slate-900 uppercase">{t.pillarTitle}</h3>
            <div className="w-12 h-1 bg-brand-blue mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.pillars.map((pillar, idx) => (
              <div 
                key={idx} 
                className="flex flex-col p-6 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-brand-cream transition-all duration-200 shadow-3xs"
              >
                <div className="p-3 bg-white border border-slate-200 rounded-xl h-fit w-fit text-brand-blue mb-4 shadow-2xs">
                  {clinicalIconList[idx]}
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase mb-2 tracking-wider">
                  {pillar.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Triage Guide Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-brand-blue rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-brand-green opacity-20 blur-2xl" />
          
          <div className="flex-1 space-y-4">
            <span className="text-xs uppercase tracking-widest text-brand-cream font-bold block">{t.pajLabel}</span>
            <h3 className="text-2xl md:text-3xl font-light leading-tight">{t.pajTitle}</h3>
            
            <ul className="space-y-3.5 text-xs font-semibold max-w-xl text-slate-100">
              <li className="flex gap-3">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-cream shrink-0 mt-0.5" />
                <span>{t.step1}</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-cream shrink-0 mt-0.5" />
                <span>{t.step2}</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-cream shrink-0 mt-0.5" />
                <span>{t.step3}</span>
              </li>
            </ul>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => onEnterPortal("PATIENT")}
              className="w-full md:px-8 py-4 bg-brand-green hover:bg-opacity-95 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-brand-cream" />
              <span>{t.btnStart}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
