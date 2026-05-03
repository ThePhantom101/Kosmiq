import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  pgEnum,
  decimal,
  boolean,
  customType,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// --- Custom Types & Extensions ---

/**
 * pgvector support for 768-dimension embeddings.
 * Used for semantic search across classical texts and user chronicles.
 */
const vector768 = customType<{ data: number[] }>({
  dataType() {
    return "vector(768)";
  },
});

// --- Enums ---

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "pro",
  "god_tier",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "career",
  "health",
  "relationship",
  "finance",
  "travel",
  "spiritual",
  "life_event",
]);

// --- Tables ---

/**
 * 1. users
 * Handles authentication, premium tier management, and generative asset links.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  subscriptionTier: subscriptionTierEnum("subscription_tier")
    .default("free")
    .notNull(),
  mandalaUrl: text("mandala_url"), // URL to the generated "Soul Signature" art
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * 2. profiles
 * Stores multimodal birth data, biometric hashes for rectification, and Ayanamsa settings.
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  dob: text("dob").notNull(), // ISO 8601 date (YYYY-MM-DD)
  tob: text("tob").notNull(), // ISO 8601 time (HH:mm:ss)
  lat: decimal("lat", { precision: 10, scale: 7 }).notNull(),
  long: decimal("long", { precision: 10, scale: 7 }).notNull(),
  tzOffset: integer("tz_offset").notNull(), // Offset in minutes
  ayanamsaOffset: decimal("ayanamsa_offset", { precision: 10, scale: 7 }), // Custom Lahiri tweak
  biometricHash: text("biometric_hash"), // Feature hash for Face/Palm rectification
  chartStyle: text("chart_style").default("north_indian").notNull(),
  isGuest: boolean("is_guest").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * 3. charts
 * High-precision mathematical cache for planetary degrees and Shodashvargas (D1-D60).
 */
export const charts = pgTable("charts", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  planetaryDegrees: jsonb("planetary_degrees").notNull(), // Detailed longitudes and signs
  shodashvarga: jsonb("shodashvarga").notNull(), // Serialized divisional charts
  planetaryStrengths: jsonb("planetary_strengths").notNull(), // Shadbala and Sthana bala
  ashtakavarga: jsonb("ashtakavarga").notNull(), // BAV and SAV values
  lastCalculatedAt: timestamp("last_calculated_at").defaultNow().notNull(),
});

/**
 * 4. chronicles
 * Synced health data (Apple Health/Google Fit) and life events for the feedback loop.
 */
export const chronicles = pgTable("chronicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  eventName: text("event_name").notNull(),
  eventTimestamp: timestamp("event_timestamp").notNull(),
  eventType: eventTypeEnum("event_type").notNull(),
  bioDataSnapshot: jsonb("bio_data_snapshot"), // HRV, Sleep, Stress metrics
  aiValidationScore: decimal("ai_validation_score", {
    precision: 5,
    scale: 2,
  }), // Predictive accuracy metric
});

/**
 * 5. compatibility
 * Networked relationship data for N-way synastry (Family, Business, Romance).
 */
export const compatibility = pgTable("compatibility", {
  id: uuid("id").defaultRandom().primaryKey(),
  primaryProfileId: uuid("primary_profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  secondaryProfileId: uuid("secondary_profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  relationshipType: text("relationship_type").notNull(),
  scoreData: jsonb("score_data").notNull(), // Gun Milan and Dasha compatibility
  groupId: uuid("group_id"), // Identifier for team or family clusters
});

/**
 * 6. knowledge_base
 * Reference library of classical Vedic shlokas and empirical predictive patterns.
 */
export const knowledgeBase = pgTable("knowledge_base", {
  id: uuid("id").defaultRandom().primaryKey(),
  source: text("source").notNull(), // e.g., "BPHS", "Saravali"
  referenceKey: text("reference_key"), // Chapter/Verse number
  content: text("content").notNull(),
  tags: jsonb("tags").notNull(), // Astrological feature tagging
  remedies: jsonb("remedies"), // Prescribed rituals or actions
});

/**
 * 7. embeddings
 * The 768d pgvector implementation for semantic intelligence and search.
 */
export const embeddings = pgTable("embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  referenceId: uuid("reference_id").notNull(), // FK to knowledge_base or chronicles
  referenceType: text("reference_type").notNull(), // "text" or "event"
  vector: vector768("vector").notNull(),
  metadata: jsonb("metadata"),
});

/**
 * 8. conversations
 * AI UI state, interaction history, Soul Signature metadata, and Heatmaps.
 */
export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  interactionType: text("interaction_type").notNull(), // "chat", "timeline", "heatmap"
  payload: jsonb("payload").notNull(), // Chat messages or visualization metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Relational Mappings ---

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  conversations: many(conversations),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  chart: one(charts, {
    fields: [profiles.id],
    references: [charts.profileId],
  }),
  chronicles: many(chronicles),
  compatibilityResults: many(compatibility),
}));

export const chartsRelations = relations(charts, ({ one }) => ({
  profile: one(profiles, {
    fields: [charts.profileId],
    references: [profiles.id],
  }),
}));
