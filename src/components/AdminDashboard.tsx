/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Shield, Server, Users, ClipboardCheck, Heart, AlertOctagon, Terminal, Search, 
  RefreshCw, CheckCircle, PlusSquare, Trash2, ArrowDownCircle, AlertCircle 
} from "lucide-react";
import { Role } from "../types";

interface AdminDashboardProps {
  currentRole: Role;
  onPostLog: (action: string, details: string) => void;
}

export default function AdminDashboard({ currentRole, onPostLog }: AdminDashboardProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [statData, setStatData] = useState({
    activePatients: 142,
    completedVisits: 389,
    pendingTriageCount: 3,
    faithInterventions: 54
  });

  // Role Management State
  const [activeUserEmail, setActiveUserEmail] = useState("");
  const [authorizedDoctors, setAuthorizedDoctors] = useState<string[]>([]);
  const [authorizedAdmins, setAuthorizedAdmins] = useState<string[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"DOCTOR" | "ADMIN">("DOCTOR");
  const MASTER_ADMIN = "fritssigerdkayadoe@gmail.com";

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const u = JSON.parse(userStr);
        setActiveUserEmail(u.email);
      }
      const docs = JSON.parse(localStorage.getItem("authorizedDoctors") || '["dr.sarah@gpibbukitzaitun.org"]');
      const admins = JSON.parse(localStorage.getItem("authorizedAdmins") || '["admin@gpibbukitzaitun.org"]');
      setAuthorizedDoctors(docs);
      setAuthorizedAdmins(admins);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddUser = () => {
    if (!newUserEmail) return;
    if (newUserRole === "DOCTOR" && !authorizedDoctors.includes(newUserEmail)) {
      const newDocs = [...authorizedDoctors, newUserEmail];
      setAuthorizedDoctors(newDocs);
      localStorage.setItem("authorizedDoctors", JSON.stringify(newDocs));
    } else if (newUserRole === "ADMIN" && !authorizedAdmins.includes(newUserEmail)) {
      const newAdms = [...authorizedAdmins, newUserEmail];
      setAuthorizedAdmins(newAdms);
      localStorage.setItem("authorizedAdmins", JSON.stringify(newAdms));
    }
    onPostLog("Hak Akses Ditambahkan", `Master Admin mendaftarkan ${newUserEmail} sebagai ${newUserRole}`);
    setNewUserEmail("");
  };

  const handleRemoveUser = (email: string, role: string) => {
    if (email === MASTER_ADMIN) {
      alert("Master Admin tidak dapat dihapus.");
      return;
    }
    if (role === "DOCTOR") {
      const newDocs = authorizedDoctors.filter(e => e !== email);
      setAuthorizedDoctors(newDocs);
      localStorage.setItem("authorizedDoctors", JSON.stringify(newDocs));
    } else if (role === "ADMIN") {
      const newAdms = authorizedAdmins.filter(e => e !== email);
      setAuthorizedAdmins(newAdms);
      localStorage.setItem("authorizedAdmins", JSON.stringify(newAdms));
    }
    onPostLog("Hak Akses Dicabut", `Master Admin menghapus akses ${email} sebagai ${role}`);
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/logs");
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to sync server logs:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Simulate admin-only endpoint retrieval with headers
      const response = await fetch("/api/admin/metrics", {
        headers: { "x-user-role": currentRole }
      });
      if (response.ok) {
        const data = await response.json();
        setStatData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (currentRole === Role.ADMIN) {
      fetchLogs();
      fetchMetrics();
    }
  }, [currentRole]);

  // Handle Manual Log Submission
  const handleSimulateLog = async () => {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actorEmail: "admin@gpibbukitzaitun.org",
        actorRole: "ADMIN",
        action: "Audit Administrasi",
        details: "Administrator melakukan audit keamanan rekam medis jemaat."
      })
    });
    fetchLogs();
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.id.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase()) ||
    log.actorEmail.toLowerCase().includes(search.toLowerCase())
  );

  // Structural Role Guard Simulation
  if (currentRole !== Role.ADMIN) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-sans">
        <div className="h-16 w-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-600 animate-pulse">
          <AlertOctagon className="h-8 w-8 stroke-[2.5]" />
        </div>
        <h3 className="text-3xl font-bold text-slate-850 mb-3">Akses Ditolak</h3>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed mb-6 font-semibold">
          Kebijakan Keamanan (REQ-AUTH-06 & Bagian 3.8): Portal administratif ini dibatasi secara ketat hanya untuk sesi Admin berlisensi. Upaya akses mencurigakan telah dicatat ke server audit keamanan.
        </p>
        <div className="bg-slate-900 text-slate-350 rounded-xl p-4 text-xs font-mono max-w-md mx-auto text-left space-y-1.5 shadow-md border border-slate-700">
          <p className="text-rose-400"># LAPORAN PENOLAKAN SISTEM:</p>
          <p>PATH: /admin/dashboard</p>
          <p>ROLE_SESI_PENGGUNA: {currentRole}</p>
          <p>TINDAKAN: PERCOBAAN_AKSES_DILARANG</p>
          <p>AUDIT_KEAMANAN_DIRULIS: TRUE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Admin Title banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-blue rounded-xl text-sky-200">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-brand-blue font-bold uppercase tracking-widest block">Menara Kontrol Operasional & Audit</span>
            <h2 className="text-2xl font-black text-brand-cream tracking-tight">Konsol Administratif Diakonia</h2>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSimulateLog}
            className="px-4 py-2 bg-brand-blue hover:bg-opacity-90 transition text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs text-white"
          >
            <PlusSquare className="h-4 w-4" />
            <span>Catat Log Audit Manual</span>
          </button>
          
          <button
            onClick={() => { fetchLogs(); fetchMetrics(); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 transition text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 border border-slate-700 text-slate-300"
          >
            <RefreshCw className={loading ? "h-4 w-4 animate-spin text-brand-blue" : "h-4 w-4 text-brand-blue"} />
            <span>Sinkron data Real-Time</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Widgets */}

      {/* Role Management Widget (Only for Master Admin) */}
      {activeUserEmail === MASTER_ADMIN && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-green" />
              <span>Manajemen Otorisasi Sistem (Master Admin)</span>
            </h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input 
              type="email" 
              placeholder="Masukkan email (Google/Custom) baru..." 
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="flex-1 p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-brand-blue"
            />
            <select 
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as "DOCTOR" | "ADMIN")}
              className="p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-brand-blue bg-white"
            >
              <option value="DOCTOR">Hak Akses: DOKTER RELAWAN</option>
              <option value="ADMIN">Hak Akses: ADMIN DIAKONIA</option>
            </select>
            <button 
              onClick={handleAddUser}
              className="px-4 py-2 bg-brand-green hover:bg-green-700 text-white font-bold rounded-lg text-sm transition"
            >
              Daftarkan Akses
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin List */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Daftar Admin Diakonia</h4>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-sm font-semibold bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-brand-blue">{MASTER_ADMIN} <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded ml-2">MASTER</span></span>
                </li>
                {authorizedAdmins.map((email) => (
                  <li key={email} className="flex justify-between items-center text-sm font-semibold bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-700">{email}</span>
                    <button onClick={() => handleRemoveUser(email, "ADMIN")} className="text-rose-500 hover:text-rose-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Doctor List */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Daftar Dokter Relawan</h4>
              <ul className="space-y-2">
                {authorizedDoctors.length === 0 && <li className="text-xs text-slate-400">Belum ada dokter terdaftar.</li>}
                {authorizedDoctors.map((email) => (
                  <li key={email} className="flex justify-between items-center text-sm font-semibold bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-700">{email}</span>
                    <button onClick={() => handleRemoveUser(email, "DOCTOR")} className="text-rose-500 hover:text-rose-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-bold">Pasien Terdaftar</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">{statData.activePatients}</span>
            <span className="text-[10px] text-brand-blue font-bold bg-blue-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Jemaat & Umum</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-bold">Kunjungan Selesai</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">{statData.completedVisits}</span>
            <span className="text-[10px] text-brand-green font-bold bg-green-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Subsidi Diakonia</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-bold">Pelayanan Pastoral</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">{statData.faithInterventions}</span>
            <span className="text-[10px] text-brand-blue font-bold bg-blue-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Dukungan Doa</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-bold">Antrean Triase</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">{statData.pendingTriageCount}</span>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-sm animate-pulse uppercase tracking-wide">Menunggu</span>
          </div>
        </div>
      </div>

      {/* Live append-only audit log console */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Server className="h-5 w-5 text-brand-blue" />
              <span>Log Audit Keamanan Real-Time (Tanpa-Ubah/Append-Only)</span>
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Dokumentasi historis tak terhapuskan yang dicatat otomatis oleh setiap tindakan dokter, admin, atau jemaat. Manajemen rekayasa record dilarang keras secara sistem.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-450" />
            <input
              type="text"
              placeholder="Cari tindakan atau operator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Audit Log table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 font-bold">
                <th className="py-3 px-4 uppercase tracking-wider text-[10px]">WAKTU (WITA)</th>
                <th className="py-3 px-4 uppercase tracking-wider text-[10px]">OPERATOR</th>
                <th className="py-3 px-4 uppercase tracking-wider text-[10px]">ROLE</th>
                <th className="py-3 px-4 uppercase tracking-wider text-[10px]">TINDAKAN KEAMANAN SECURE</th>
                <th className="py-3 px-4 uppercase tracking-wider text-[10px]">METADATA DETAIL / PARAMETER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-450 font-sans font-semibold">
                    Tidak ada parameter audit yang terlacak.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{log.actorEmail}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        log.actorRole === "ADMIN" 
                          ? "bg-slate-900 border border-slate-800 text-white" 
                          : log.actorRole === "DOCTOR" 
                          ? "bg-blue-50 text-brand-blue border border-brand-blue/20" 
                          : "bg-green-50 text-brand-green border border-brand-green/20"
                      }`}>
                        {log.actorRole === "DOCTOR" ? "DOKTER" : log.actorRole === "PATIENT" ? "PASIEN" : log.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{log.action === "Roster Audit Done" ? "Audit Roster Medis" : log.action}</td>
                    <td className="py-3 px-4 text-[11px] font-sans text-slate-500 leading-relaxed max-w-sm whitespace-normal font-medium">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff schedules and chaplains section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Doctors list card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
            <ClipboardCheck className="h-4.5 w-4.5 text-brand-blue" />
            <span>Dokter Spesialis Relawan Hari Jumat</span>
          </h4>

          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 border border-brand-blue/20 flex items-center justify-center font-bold text-xs text-brand-blue">ST</div>
                <div>
                  <span className="font-bold text-sm text-slate-800 block">dr. Sarah Taylor, Sp.PD</span>
                  <span className="text-xs text-slate-400 font-semibold">Spesialis Penyakit Dalam • Koordinator Sesi</span>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-green-50 text-brand-green border border-brand-green/20 px-2 py-0.5 rounded-md uppercase tracking-wider">Aktif Bertugas</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-205 flex items-center justify-center font-bold text-xs text-slate-600">RP</div>
                <div>
                  <span className="font-bold text-sm text-slate-800 block">dr. Robert Patel, Sp.A</span>
                  <span className="text-xs text-slate-400 font-semibold">Spesialis Anak • Konsultan On-Call</span>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">Standby</span>
            </div>
          </div>
        </div>

        {/* Holistic pastoral lists */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 font-sans">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
            <Heart className="h-4.5 w-4.5 text-brand-blue" />
            <span>Pendeta & Koordinator Diakonia Sosial</span>
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 border border-brand-green/20 flex items-center justify-center font-bold text-xs text-brand-green">MW</div>
                <div>
                  <span className="font-bold text-sm text-slate-800 block">Pdt. Marc Wilcox, M.Th</span>
                  <span className="text-xs text-slate-400 font-semibold">Pelayanan Jemaat & Pendamping Iman GPIB</span>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-green-50 text-brand-green border border-brand-green/25 px-2 py-0.5 rounded-md uppercase tracking-wider">Terjadwal</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">EA</div>
                <div>
                  <span className="font-bold text-sm text-slate-800 block">Evelyn Adams, S.Psi</span>
                  <span className="text-xs text-slate-400 font-semibold">Koordinator Kesehatan Mental & Sosial</span>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">Standby</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
