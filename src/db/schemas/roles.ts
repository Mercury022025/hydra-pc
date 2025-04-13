import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { userRoles } from './users'; // Import from the users file

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles), // Relation defined here
}));
