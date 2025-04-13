import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const chatProfiles = pgTable('chat_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name').notNull(),
  avatarUrl: text('avatar_url'),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Add relations here if fakeProfiles relate to other tables
