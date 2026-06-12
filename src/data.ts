/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient, Appointment, Prescription, AppointmentStatus, AppointmentUrgency } from "./types";

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "pat-1",
    name: "Frits S. Kayadoe",
    email: "fritssigerdkayadoe@gmail.com",
    phone: "(555) 019-2834",
    birthDate: "1982-10-14",
    preferredLanguage: "English (US)",
    faithSupportRequested: true,
    faithNotes: "Welcomes pastoral prayer before exams. Values a brief devotion.",
    insuranceNotes: "No Insurance - Full-subsidy community-supported care",
    medicalHistory: ["Essential Hypertension", "Mild Asthma (Seasonal)"],
    allergies: ["Penicillin", "Sulfa drugs"]
  },
  {
    id: "pat-2",
    name: "Maria Rodriguez",
    email: "maria.r@gmail.com",
    phone: "(555) 438-9210",
    birthDate: "1975-04-22",
    preferredLanguage: "Español (ES)",
    faithSupportRequested: false,
    insuranceNotes: "No Insurance - Local migrant support program",
    medicalHistory: ["Type 2 Diabetes Mellitus", "Hyperlipidemia"],
    allergies: ["Aspirin"]
  },
  {
    id: "pat-3",
    name: "James Chen",
    email: "j.chen@gmail.com",
    phone: "(555) 289-5431",
    birthDate: "1960-12-05",
    preferredLanguage: "English (US)",
    faithSupportRequested: true,
    faithNotes: "Enjoys connecting with church community peer support network.",
    insuranceNotes: "No Insurance - Under-employed status",
    medicalHistory: ["Chronic Low Back Pain", "Gastroesophageal Reflux Disease (GERD)"],
    allergies: []
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "appt-1",
    patientId: "pat-2",
    patientName: "Maria Rodriguez",
    date: "2026-06-12", // Clean matching date context
    timeSlot: "12:00 PM - 12:15 PM",
    reason: "Routine diabetes checkup & blood glucose log review",
    status: AppointmentStatus.CONFIRMED,
    urgency: AppointmentUrgency.ROUTINE,
    triageCompleted: true,
    triageSummary: "PATIENT DIABETES REPORT:\n- Symptoms: Slight tingling in toes, occasional dry mouth.\n- Glucose records: Fasting readings range 140-165 mg/dL.\n- Medication adherence: Reports taking Metformin daily with dinner.\n- Urgency: Classified as Routine follow-up visit.",
    triageChatHistory: [
      { id: "m1", sender: "patient", text: "I'm coming in for my seasonal diabetes checkup.", timestamp: "2026-06-11T12:00:00Z" },
      { id: "m2", sender: "ai", text: "Thank you, Maria. Have you felt any recent changes like dry mouth, blurred vision, or numbness/tingling in your hands or feet?", timestamp: "2026-06-11T12:01:00Z" },
      { id: "m3", sender: "patient", text: "A little tingling in my small toes at night.", timestamp: "2026-06-11T12:02:00Z" },
      { id: "m4", sender: "ai", text: "I will make sure the doctor checks your feet carefully on Friday. Is there anything else you want to note about your medications or blood sugar levels?", timestamp: "2026-06-11T12:03:00Z" },
      { id: "m5", sender: "patient", text: "Fasting glucose has been high, around 155 on average. Still taking Metformin.", timestamp: "2026-06-11T12:04:00Z" }
    ],
    updatedAt: "2026-06-11T12:05:00Z"
  },
  {
    id: "appt-2",
    patientId: "pat-1",
    patientName: "Frits S. Kayadoe",
    date: "2026-06-12",
    timeSlot: "12:15 PM - 12:30 PM",
    reason: "Hypertension checkup and prescription evaluation",
    status: AppointmentStatus.PENDING_TRIAGE,
    urgency: AppointmentUrgency.ROUTINE,
    triageCompleted: false,
    triageSummary: "",
    triageChatHistory: [],
    updatedAt: "2026-06-11T08:00:00Z"
  },
  {
    id: "appt-3",
    patientId: "pat-3",
    patientName: "James Chen",
    date: "2026-06-12",
    timeSlot: "12:30 PM - 12:45 PM",
    reason: "Severe back stiffness and pain when standing up",
    status: AppointmentStatus.CONFIRMED,
    urgency: AppointmentUrgency.SOON,
    triageCompleted: true,
    triageSummary: "CLINICAL PRESENTATION:\n- Complaint: Right-sided lumbar muscle stiffness, radiating slightly to glute.\n- Duration: 5 days, triggered by lifting heavy volunteer boxes.\n- Relieving Factors: Over-the-counter Ibuprofen offers partial relief.\n- Faith preference: James asked to connect with clinic staff peer circle after exam.",
    triageChatHistory: [
      { id: "mr1", sender: "patient", text: "My back is extremely stiff and hurts whenever I try to stand straight.", timestamp: "2026-06-10T14:30:00Z" },
      { id: "mr2", sender: "ai", text: "I'm sorry to hear that, James. Did this pain start suddenly after lifting something, or is it a long-term ache that got worse?", timestamp: "2026-06-10T14:31:00Z" },
      { id: "mr3", sender: "patient", text: "It flared up 5 days ago when lifting storage crates.", timestamp: "2026-06-10T14:32:00Z" }
    ],
    updatedAt: "2026-06-10T14:33:00Z"
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: "rx-1",
    patientId: "pat-1",
    datePrescribed: "2026-03-10",
    medicationName: "Lisinopril",
    dosage: "10 mg",
    frequency: "Once daily in the morning",
    instructions: "Take with water with or without food. Monitor blood pressure weekly.",
    doctorName: "Dr. Sarah Taylor, MD",
    refillsLeft: 2
  },
  {
    id: "rx-2",
    patientId: "pat-2",
    datePrescribed: "2026-02-15",
    medicationName: "Metformin HCl",
    dosage: "500 mg",
    frequency: "Twice daily with meals",
    instructions: "Always take with food to minimize stomach discomfort. Report persistent nausea.",
    doctorName: "Dr. Sarah Taylor, MD",
    refillsLeft: 3
  },
  {
    id: "rx-3",
    patientId: "pat-3",
    datePrescribed: "2026-05-12",
    medicationName: "Omeprazole",
    dosage: "20 mg",
    frequency: "Once daily before breakfast",
    instructions: "Take 30 minutes before first beverage or breakfast. Complete duration as indicated.",
    doctorName: "Dr. Sarah Taylor, MD",
    refillsLeft: 1
  }
];

export function getLocalData() {
  const local = localStorage.getItem("grace_clinic_data");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Failed to parse local medical portal storage:", e);
    }
  }

  // Fallback / seed initial payload
  const seed = {
    patients: INITIAL_PATIENTS,
    appointments: INITIAL_APPOINTMENTS,
    prescriptions: INITIAL_PRESCRIPTIONS
  };
  localStorage.setItem("grace_clinic_data", JSON.stringify(seed));
  return seed;
}

export function saveLocalData(data: { patients: Patient[]; appointments: Appointment[]; prescriptions: Prescription[] }) {
  localStorage.setItem("grace_clinic_data", JSON.stringify(data));
}
