/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN"
}

export enum AppointmentUrgency {
  ROUTINE = "Routine",
  SOON = "Soon",
  URGENT = "Urgent"
}

export enum AppointmentStatus {
  PENDING_TRIAGE = "Pending Triage",
  CONFIRMED = "Confirmed",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  preferredLanguage: string;
  faithSupportRequested: boolean;
  faithNotes?: string;
  insuranceNotes: string; // Typically "No Insurance - Fully Free Clinic"
  medicalHistory: string[];
  allergies: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  icon?: string;
}

export interface TriageMessage {
  id: string;
  sender: "patient" | "ai";
  text: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: AppointmentStatus;
  urgency: AppointmentUrgency;
  triageSummary: string;
  triageChatHistory: TriageMessage[];
  triageCompleted: boolean;
  notes?: string; // Doctor's consultation note
  suggestedFollowUp?: {
    timeframe: string;
    reason: string;
    urgency: AppointmentUrgency;
    approved: boolean;
  };
  prescriptions?: Prescription[];
  updatedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  datePrescribed: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  doctorName: string;
  refillsLeft: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: Role;
  action: string;
  details: string;
}
