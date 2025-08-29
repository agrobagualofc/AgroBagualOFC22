import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  birthDate: date("birth_date"),
  role: varchar("role"), // Função no agro
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const animals = pgTable("animals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // vaca, touro, terneiro, etc
  breed: varchar("breed"), // raça
  name: varchar("name").notNull(),
  description: text("description"),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dailyMilkProduction: decimal("daily_milk_production", { precision: 6, scale: 2 }),
  monthlyMilkProduction: decimal("monthly_milk_production", { precision: 8, scale: 2 }),
  category: varchar("category"), // produtor, corte, reprodutor, inseminação
  photoUrl: varchar("photo_url"),
  birthDate: date("birth_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vaccinations = pgTable("vaccinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id").notNull().references(() => animals.id),
  vaccineName: varchar("vaccine_name").notNull(),
  applicationDate: timestamp("application_date").notNull(),
  nextDueDate: timestamp("next_due_date"),
  quarantineDays: integer("quarantine_days"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // plantio, serviço, colheita, pecuária
  isUrgent: boolean("is_urgent").default(false),
  reminderDate: timestamp("reminder_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category"), // ordenha, alimentação, tratamento, etc
  isUrgent: boolean("is_urgent").default(false),
  noteDate: timestamp("note_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketListings = pgTable("market_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // sementes, equipamentos, gado, insumos
  price: decimal("price", { precision: 10, scale: 2 }),
  condition: varchar("condition"), // novo, usado, etc
  location: varchar("location"),
  contactInfo: varchar("contact_info"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gpsRoutes = pgTable("gps_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  routeData: jsonb("route_data"), // Coordenadas e dados da rota
  area: decimal("area", { precision: 10, scale: 4 }), // hectares
  activity: varchar("activity"), // pulverizar, colher, plantar
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  animals: many(animals),
  reminders: many(reminders),
  notes: many(notes),
  marketListings: many(marketListings),
  gpsRoutes: many(gpsRoutes),
}));

export const animalsRelations = relations(animals, ({ one, many }) => ({
  user: one(users, {
    fields: [animals.userId],
    references: [users.id],
  }),
  vaccinations: many(vaccinations),
}));

export const vaccinationsRelations = relations(vaccinations, ({ one }) => ({
  animal: one(animals, {
    fields: [vaccinations.animalId],
    references: [animals.id],
  }),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  user: one(users, {
    fields: [reminders.userId],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export const marketListingsRelations = relations(marketListings, ({ one }) => ({
  user: one(users, {
    fields: [marketListings.userId],
    references: [users.id],
  }),
}));

export const gpsRoutesRelations = relations(gpsRoutes, ({ one }) => ({
  user: one(users, {
    fields: [gpsRoutes.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnimalSchema = createInsertSchema(animals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVaccinationSchema = createInsertSchema(vaccinations).omit({
  id: true,
  createdAt: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketListingSchema = createInsertSchema(marketListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGpsRouteSchema = createInsertSchema(gpsRoutes).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Animal = typeof animals.$inferSelect;
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type MarketListing = typeof marketListings.$inferSelect;
export type InsertMarketListing = z.infer<typeof insertMarketListingSchema>;
export type GpsRoute = typeof gpsRoutes.$inferSelect;
export type InsertGpsRoute = z.infer<typeof insertGpsRouteSchema>;
