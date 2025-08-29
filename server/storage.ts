import {
  users,
  animals,
  vaccinations,
  reminders,
  notes,
  marketListings,
  gpsRoutes,
  type User,
  type UpsertUser,
  type Animal,
  type InsertAnimal,
  type Vaccination,
  type InsertVaccination,
  type Reminder,
  type InsertReminder,
  type Note,
  type InsertNote,
  type MarketListing,
  type InsertMarketListing,
  type GpsRoute,
  type InsertGpsRoute,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Animal operations
  getAnimals(userId: string): Promise<Animal[]>;
  createAnimal(animal: InsertAnimal): Promise<Animal>;
  getAnimal(id: string): Promise<Animal | undefined>;
  updateAnimal(id: string, animal: Partial<InsertAnimal>): Promise<Animal>;
  deleteAnimal(id: string): Promise<void>;
  
  // Vaccination operations
  getVaccinations(animalId: string): Promise<Vaccination[]>;
  createVaccination(vaccination: InsertVaccination): Promise<Vaccination>;
  
  // Reminder operations
  getReminders(userId: string): Promise<Reminder[]>;
  getTodayReminders(userId: string): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: string, reminder: Partial<InsertReminder>): Promise<Reminder>;
  deleteReminder(id: string): Promise<void>;
  
  // Note operations
  getNotes(userId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  
  // Market operations
  getMarketListings(): Promise<MarketListing[]>;
  getUserMarketListings(userId: string): Promise<MarketListing[]>;
  createMarketListing(listing: InsertMarketListing): Promise<MarketListing>;
  updateMarketListing(id: string, listing: Partial<InsertMarketListing>): Promise<MarketListing>;
  deleteMarketListing(id: string): Promise<void>;
  
  // GPS operations
  getGpsRoutes(userId: string): Promise<GpsRoute[]>;
  createGpsRoute(route: InsertGpsRoute): Promise<GpsRoute>;
  deleteGpsRoute(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Animal operations
  async getAnimals(userId: string): Promise<Animal[]> {
    return await db.select().from(animals)
      .where(eq(animals.userId, userId))
      .orderBy(desc(animals.createdAt));
  }

  async createAnimal(animal: InsertAnimal): Promise<Animal> {
    const [newAnimal] = await db.insert(animals).values(animal).returning();
    return newAnimal;
  }

  async getAnimal(id: string): Promise<Animal | undefined> {
    const [animal] = await db.select().from(animals).where(eq(animals.id, id));
    return animal;
  }

  async updateAnimal(id: string, animal: Partial<InsertAnimal>): Promise<Animal> {
    const [updatedAnimal] = await db
      .update(animals)
      .set({ ...animal, updatedAt: new Date() })
      .where(eq(animals.id, id))
      .returning();
    return updatedAnimal;
  }

  async deleteAnimal(id: string): Promise<void> {
    await db.delete(animals).where(eq(animals.id, id));
  }

  // Vaccination operations
  async getVaccinations(animalId: string): Promise<Vaccination[]> {
    return await db.select().from(vaccinations)
      .where(eq(vaccinations.animalId, animalId))
      .orderBy(desc(vaccinations.applicationDate));
  }

  async createVaccination(vaccination: InsertVaccination): Promise<Vaccination> {
    const [newVaccination] = await db.insert(vaccinations).values(vaccination).returning();
    return newVaccination;
  }

  // Reminder operations
  async getReminders(userId: string): Promise<Reminder[]> {
    return await db.select().from(reminders)
      .where(eq(reminders.userId, userId))
      .orderBy(desc(reminders.reminderDate));
  }

  async getTodayReminders(userId: string): Promise<Reminder[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db.select().from(reminders)
      .where(
        and(
          eq(reminders.userId, userId),
          eq(reminders.isCompleted, false)
        )
      )
      .orderBy(desc(reminders.isUrgent), reminders.reminderDate);
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [newReminder] = await db.insert(reminders).values(reminder).returning();
    return newReminder;
  }

  async updateReminder(id: string, reminder: Partial<InsertReminder>): Promise<Reminder> {
    const [updatedReminder] = await db
      .update(reminders)
      .set({ ...reminder, updatedAt: new Date() })
      .where(eq(reminders.id, id))
      .returning();
    return updatedReminder;
  }

  async deleteReminder(id: string): Promise<void> {
    await db.delete(reminders).where(eq(reminders.id, id));
  }

  // Note operations
  async getNotes(userId: string): Promise<Note[]> {
    return await db.select().from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.noteDate));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async updateNote(id: string, note: Partial<InsertNote>): Promise<Note> {
    const [updatedNote] = await db
      .update(notes)
      .set({ ...note, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updatedNote;
  }

  async deleteNote(id: string): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  // Market operations
  async getMarketListings(): Promise<MarketListing[]> {
    return await db.select().from(marketListings)
      .where(eq(marketListings.isActive, true))
      .orderBy(desc(marketListings.createdAt));
  }

  async getUserMarketListings(userId: string): Promise<MarketListing[]> {
    return await db.select().from(marketListings)
      .where(eq(marketListings.userId, userId))
      .orderBy(desc(marketListings.createdAt));
  }

  async createMarketListing(listing: InsertMarketListing): Promise<MarketListing> {
    const [newListing] = await db.insert(marketListings).values(listing).returning();
    return newListing;
  }

  async updateMarketListing(id: string, listing: Partial<InsertMarketListing>): Promise<MarketListing> {
    const [updatedListing] = await db
      .update(marketListings)
      .set({ ...listing, updatedAt: new Date() })
      .where(eq(marketListings.id, id))
      .returning();
    return updatedListing;
  }

  async deleteMarketListing(id: string): Promise<void> {
    await db.delete(marketListings).where(eq(marketListings.id, id));
  }

  // GPS operations
  async getGpsRoutes(userId: string): Promise<GpsRoute[]> {
    return await db.select().from(gpsRoutes)
      .where(eq(gpsRoutes.userId, userId))
      .orderBy(desc(gpsRoutes.createdAt));
  }

  async createGpsRoute(route: InsertGpsRoute): Promise<GpsRoute> {
    const [newRoute] = await db.insert(gpsRoutes).values(route).returning();
    return newRoute;
  }

  async deleteGpsRoute(id: string): Promise<void> {
    await db.delete(gpsRoutes).where(eq(gpsRoutes.id, id));
  }
}

export const storage = new DatabaseStorage();
