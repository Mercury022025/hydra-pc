import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  pgSchema // Import pgSchema
} from 'drizzle-orm/pg-core';
import { roles } from './roles'; // Import from the roles file

// --- Conceptual Placeholder for auth.users ---
export const authSchema = pgSchema('auth');

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  // Add other auth.users columns only if needed for other references
});
// --- End Placeholder ---

// Placeholder/Conceptual Users table if needed for relations
// export const users = pgTable('users', {
//   id: uuid('id').primaryKey(),
// });

export const userRoles = pgTable(
  'user_roles',
  {
    userId: uuid('user_id').notNull(), // Conceptually references auth.users.id
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }), // Reference roles.id from roles.ts
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
  })
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  role: one(roles, { // Use imported roles
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  // user: one(users, { ... }) // If using the conceptual users table
}));

export const userProfiles = pgTable('user_profiles', {
  userId: uuid('user_id').primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }), // Add reference and cascade
  username: text('username').unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
//   user: one(users, { ... }) // If using the conceptual users table
// }));

// export const usersRelations = relations(users, ({ many, one }) => ({
//   roles: many(userRoles),
//   profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
// }));
