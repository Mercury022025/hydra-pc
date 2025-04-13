import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid, date, integer } from 'drizzle-orm/pg-core';

export const chatProfiles = pgTable('chat_profiles', {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  birthDate: date("birth_date"),
  gender: text("gender"),
  height: integer("height"),
  bodyType: text("body_type"),
  hairColor: text("hair_color"),
  eyeColor: text("eye_color"),
  bio: text("bio"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
});

export const chatProfileInterests = pgTable("chat_profile_interests", {
  chatProfileId: uuid("chat_profile_id").references(() => chatProfiles.id),
  interestId: uuid("interest_id").references(() => interests.id),
});

// Define the relationship between chatProfiles and chatProfileInterests
export const chatProfilesRelations = relations(chatProfiles, ({ many }) => ({
  chatProfileInterests: many(chatProfileInterests), // Link to the junction table
}));


