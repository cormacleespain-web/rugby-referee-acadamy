import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums matching the plan
export const userRoleEnum = pgEnum("user_role", [
  "referee",
  "coach",
  "admin",
]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "draft",
  "submitted",
  "payment_pending",
  "paid",
  "assigned",
  "in_review",
  "completed",
  "cancelled",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: userRoleEnum("role").notNull().default("referee"),
  country: text("country"),
  languages: text("languages").array(),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeConnectId: text("stripe_connect_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
});

export const pricing = pgTable("pricing", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  region: text("region").notNull(),
  currency: text("currency").notNull(),
  amountCents: integer("amount_cents").notNull(),
  active: boolean("active").notNull().default(true),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  status: submissionStatusEnum("status").notNull().default("draft"),
  videoUrl: text("video_url"),
  videoPath: text("video_path"),
  selfReview: jsonb("self_review"),
  assignedCoachId: uuid("assigned_coach_id").references(() => profiles.id),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  dueAt: timestamp("due_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  coachId: uuid("coach_id")
    .notNull()
    .references(() => profiles.id),
  feedback: text("feedback"),
  statistics: jsonb("statistics"),
  performanceInsights: text("performance_insights"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  coachShareCents: integer("coach_share_cents"),
  youthShareCents: integer("youth_share_cents"),
  platformShareCents: integer("platform_share_cents"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  country: text("country"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const youthInitiatives = pgTable("youth_initiatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  imageUrl: text("image_url"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").references(() => profiles.id),
  name: text("name").notNull(),
  country: text("country"),
  languages: text("languages").array(),
  roleTitle: text("role_title"),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  displayOrder: integer("display_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  submissions: many(submissions, { relationName: "submissionUser" }),
  assignedSubmissions: many(submissions, { relationName: "assignedCoach" }),
  reports: many(reports),
  payments: many(payments),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  pricing: many(pricing),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  user: one(profiles, {
    fields: [submissions.userId],
    references: [profiles.id],
    relationName: "submissionUser",
  }),
  service: one(services, {
    fields: [submissions.serviceId],
    references: [services.id],
  }),
  assignedCoach: one(profiles, {
    fields: [submissions.assignedCoachId],
    references: [profiles.id],
    relationName: "assignedCoach",
  }),
  reports: many(reports),
  payments: many(payments),
}));

export const pricingRelations = relations(pricing, ({ one }) => ({
  service: one(services, {
    fields: [pricing.serviceId],
    references: [services.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  submission: one(submissions),
  coach: one(profiles, {
    fields: [reports.coachId],
    references: [profiles.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  submission: one(submissions),
  user: one(profiles),
}));
