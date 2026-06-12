import { pgTable, serial, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table mapping Google authentication identities
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Patients table representing medical profiles at the clinic
export const patients = pgTable('patients', {
  id: text('id').primaryKey(), // pat-1, pat-2...
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  birthDate: text('birth_date').notNull(),
  preferredLanguage: text('preferred_language').notNull(),
  faithSupportRequested: boolean('faith_support_requested').notNull().default(false),
  faithNotes: text('faith_notes'),
  insuranceNotes: text('insurance_notes').notNull(),
  medicalHistory: jsonb('medical_history').notNull().$type<string[]>(),
  allergies: jsonb('allergies').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Appointments table containing consultation times, triage notes, and AI summaries
export const appointments = pgTable('appointments', {
  id: text('id').primaryKey(), // appt-1, appt-2...
  patientId: text('patient_id').references(() => patients.id).notNull(),
  patientName: text('patient_name').notNull(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull(), // Checked with AppointmentStatus enum
  urgency: text('urgency').notNull(), // Checked with AppointmentUrgency enum
  triageSummary: text('triage_summary').notNull().default(''),
  triageChatHistory: jsonb('triage_chat_history').notNull().$type<any[]>(), // TriageMessage[]
  triageCompleted: boolean('triage_completed').notNull().default(false),
  notes: text('notes'), // Doctor consult note
  suggestedFollowUp: jsonb('suggested_follow_up'),
  updatedAt: text('updated_at').notNull(),
});

// Prescriptions table tracking distributed medications
export const prescriptions = pgTable('prescriptions', {
  id: text('id').primaryKey(), // rx-1, rx-2...
  patientId: text('patient_id').references(() => patients.id).notNull(),
  datePrescribed: text('date_prescribed').notNull(),
  medicationName: text('medication_name').notNull(),
  dosage: text('dosage').notNull(),
  frequency: text('frequency').notNull(),
  instructions: text('instructions').notNull(),
  doctorName: text('doctor_name').notNull(),
  refillsLeft: integer('refills_left').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit Logs table recording app state modifications and access events
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  actorEmail: text('actor_email').notNull(),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
});

// Defining relation links for ORM structure
export const patientsRelations = relations(patients, ({ many }) => ({
  appointments: many(appointments),
  prescriptions: many(prescriptions),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  patient: one(patients, {
    fields: [prescriptions.patientId],
    references: [patients.id],
  }),
}));
