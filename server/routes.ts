import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { 
  insertAnimalSchema, 
  insertReminderSchema, 
  insertNoteSchema,
  insertMarketListingSchema,
  insertGpsRouteSchema,
  insertVaccinationSchema
} from "@shared/schema";
import { getWeatherData } from "./services/weather";
import { analyzeImageWithAI, chatWithAI } from "./services/openai";
import multer from "multer";
import { isUnauthorizedError } from "./lib/authUtils";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Weather routes
  app.get("/api/weather/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const weatherData = await getWeatherData(location);
      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Animal routes
  app.get("/api/animals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const animals = await storage.getAnimals(userId);
      res.json(animals);
    } catch (error) {
      console.error("Error fetching animals:", error);
      res.status(500).json({ message: "Failed to fetch animals" });
    }
  });

  app.post("/api/animals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const animalData = insertAnimalSchema.parse({ ...req.body, userId });
      const animal = await storage.createAnimal(animalData);
      res.json(animal);
    } catch (error) {
      console.error("Error creating animal:", error);
      res.status(400).json({ message: "Failed to create animal" });
    }
  });

  app.get("/api/animals/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const animal = await storage.getAnimal(id);
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json(animal);
    } catch (error) {
      console.error("Error fetching animal:", error);
      res.status(500).json({ message: "Failed to fetch animal" });
    }
  });

  // Vaccination routes
  app.get("/api/animals/:animalId/vaccinations", isAuthenticated, async (req, res) => {
    try {
      const { animalId } = req.params;
      const vaccinations = await storage.getVaccinations(animalId);
      res.json(vaccinations);
    } catch (error) {
      console.error("Error fetching vaccinations:", error);
      res.status(500).json({ message: "Failed to fetch vaccinations" });
    }
  });

  app.post("/api/vaccinations", isAuthenticated, async (req, res) => {
    try {
      const vaccinationData = insertVaccinationSchema.parse(req.body);
      const vaccination = await storage.createVaccination(vaccinationData);
      res.json(vaccination);
    } catch (error) {
      console.error("Error creating vaccination:", error);
      res.status(400).json({ message: "Failed to create vaccination" });
    }
  });

  // Reminder routes
  app.get("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await storage.getReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.get("/api/reminders/today", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const todayReminders = await storage.getTodayReminders(userId);
      res.json(todayReminders);
    } catch (error) {
      console.error("Error fetching today's reminders:", error);
      res.status(500).json({ message: "Failed to fetch today's reminders" });
    }
  });

  app.post("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Creating reminder with data:", { ...req.body, userId });
      const reminderData = insertReminderSchema.parse({ ...req.body, userId });
      console.log("Parsed reminder data:", reminderData);
      const reminder = await storage.createReminder(reminderData);
      console.log("Created reminder:", reminder);
      res.json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(400).json({ message: "Failed to create reminder", error: (error as Error).message });
    }
  });

  // Note routes
  app.get("/api/notes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notes = await storage.getNotes(userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Creating note with data:", { ...req.body, userId });
      const noteData = insertNoteSchema.parse({ ...req.body, userId });
      console.log("Parsed note data:", noteData);
      const note = await storage.createNote(noteData);
      console.log("Created note:", note);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Failed to create note", error: (error as Error).message });
    }
  });

  // Market routes
  app.get("/api/market/listings", async (req, res) => {
    try {
      const listings = await storage.getMarketListings();
      res.json(listings);
    } catch (error) {
      console.error("Error fetching market listings:", error);
      res.status(500).json({ message: "Failed to fetch market listings" });
    }
  });

  app.post("/api/market/listings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listingData = insertMarketListingSchema.parse({ ...req.body, userId });
      const listing = await storage.createMarketListing(listingData);
      res.json(listing);
    } catch (error) {
      console.error("Error creating market listing:", error);
      res.status(400).json({ message: "Failed to create market listing" });
    }
  });

  // GPS routes
  app.get("/api/gps/routes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routes = await storage.getGpsRoutes(userId);
      res.json(routes);
    } catch (error) {
      console.error("Error fetching GPS routes:", error);
      res.status(500).json({ message: "Failed to fetch GPS routes" });
    }
  });

  app.post("/api/gps/routes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routeData = insertGpsRouteSchema.parse({ ...req.body, userId });
      const route = await storage.createGpsRoute(routeData);
      res.json(route);
    } catch (error) {
      console.error("Error creating GPS route:", error);
      res.status(400).json({ message: "Failed to create GPS route" });
    }
  });

  // SemeIA routes
  app.post("/api/semeia/chat", isAuthenticated, async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await chatWithAI(message);
      res.json({ response });
    } catch (error) {
      console.error("Error in SemeIA chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.post("/api/semeia/analyze-image", isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const analysis = await analyzeImageWithAI(base64Image);
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // News route (placeholder for agricultural news)
  app.get("/api/news", async (req, res) => {
    try {
      // For now, return static agricultural news
      // In production, this would connect to a real news API
      const news = [
        {
          id: "1",
          title: "Nova tecnologia aumenta produtividade em 30%",
          summary: "Equipamentos de última geração chegam ao mercado brasileiro",
          imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          publishedAt: new Date().toISOString(),
          category: "tecnologia"
        },
        {
          id: "2",
          title: "Preços do boi gordo sobem 8% na semana",
          summary: "Mercado aquecido impulsiona valores na praça de São Paulo",
          imageUrl: "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          category: "mercado"
        },
        {
          id: "3",
          title: "Safra de trigo bate recorde histórico",
          summary: "Condições climáticas favoráveis resultam em colheita excepcional",
          imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          category: "agricultura"
        }
      ];
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
