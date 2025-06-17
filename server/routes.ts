import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertEventSchema, insertPlayerSchema, insertFaqSchema } from "@shared/schema";
import { insertSiteContentSchema } from "@shared/content-schema";
import { csServersRouter } from "./routes/cs-servers-routes";
import { registerSimpleGroupsAPI } from "./simple-groups-api";
import { registerTournamentDatabaseAPI } from "./tournament-database";
import { verifyAdminCredentials } from "./auth-config";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Teams routes
  app.get("/api/teams", async (req, res) => {
    try {
      const tournament = req.query.tournament as string;
      const teams = await storage.getTeams(tournament);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id/members", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const members = await storage.getTeamMembers(teamId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Get specific event
  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  
  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      // Using safeParse to handle validation
      const result = insertEventSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      const event = await storage.createEvent(result.data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });
  
  // Update event
  app.patch("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // Using safeParse to handle validation
      const result = insertEventSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      // First check if event exists
      const existingEvent = await storage.getEvent(id);
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Update event
      const updatedEvent = await storage.updateEvent(id, result.data);
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });
  
  // Delete event
  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // First check if event exists
      const existingEvent = await storage.getEvent(id);
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Delete event
      await storage.deleteEvent(id);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Get all players or players by game
  app.get("/api/players", async (req, res) => {
    try {
      const game = req.query.game as string | undefined;
      const players = await storage.getPlayers(game);
      res.json(players);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  // Get specific player
  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const player = await storage.getPlayer(id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      console.error("Error fetching player:", error);
      res.status(500).json({ message: "Failed to fetch player" });
    }
  });

  // Create player
  app.post("/api/players", async (req, res) => {
    try {
      // Using safeParse to handle validation
      const result = insertPlayerSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      const player = await storage.createPlayer(result.data);
      res.status(201).json(player);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ message: "Failed to create player" });
    }
  });
  
  // Update player
  app.patch("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      // Using safeParse to handle validation
      const result = insertPlayerSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      // First check if player exists
      const existingPlayer = await storage.getPlayer(id);
      if (!existingPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Update player
      const updatedPlayer = await storage.updatePlayer(id, result.data);
      res.json(updatedPlayer);
    } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ message: "Failed to update player" });
    }
  });
  
  // Delete player
  app.delete("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      // First check if player exists
      const existingPlayer = await storage.getPlayer(id);
      if (!existingPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Delete player
      await storage.deletePlayer(id);
      res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
      console.error("Error deleting player:", error);
      res.status(500).json({ message: "Failed to delete player" });
    }
  });

  // Get all FAQs
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getFaqs();
      res.json(faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });
  
  // Get specific FAQ
  app.get("/api/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid FAQ ID" });
      }
      
      const faq = await storage.getFaq(id);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      
      res.json(faq);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      res.status(500).json({ message: "Failed to fetch FAQ" });
    }
  });
  
  // Create FAQ
  app.post("/api/faqs", async (req, res) => {
    try {
      // Using safeParse to handle validation
      const result = insertFaqSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      const faq = await storage.createFaq(result.data);
      res.status(201).json(faq);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(500).json({ message: "Failed to create FAQ" });
    }
  });
  
  // Update FAQ
  app.patch("/api/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid FAQ ID" });
      }
      
      // Using safeParse to handle validation
      const result = insertFaqSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      // First check if FAQ exists
      const existingFaq = await storage.getFaq(id);
      if (!existingFaq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      
      // Update FAQ
      const updatedFaq = await storage.updateFaq(id, result.data);
      res.json(updatedFaq);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(500).json({ message: "Failed to update FAQ" });
    }
  });
  
  // Delete FAQ
  app.delete("/api/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid FAQ ID" });
      }
      
      // First check if FAQ exists
      const existingFaq = await storage.getFaq(id);
      if (!existingFaq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      
      // Delete FAQ
      await storage.deleteFaq(id);
      res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });
  
  // Get all contact submissions
  app.get("/api/contact", async (req, res) => {
    try {
      const contactSubmissions = await storage.getContactSubmissions();
      res.json(contactSubmissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });
  
  // Site content routes
  app.get("/api/content", async (req, res) => {
    try {
      const contents = await storage.getSiteContents();
      res.json(contents);
    } catch (error) {
      console.error("Error fetching site contents:", error);
      res.status(500).json({ message: "Failed to fetch site contents" });
    }
  });
  
  app.get("/api/content/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const content = await storage.getSiteContentByKey(key);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  
  app.patch("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      // Using safeParse to handle validation
      const result = insertSiteContentSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedContent = await storage.updateSiteContent(id, result.data);
      res.json(updatedContent);
    } catch (error) {
      console.error("Error updating content:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  // Create contact submission
  app.post("/api/contact", async (req, res) => {
    try {
      console.log("Contact form submission received:", req.body);
      
      // Using safeParse to handle validation
      const result = insertContactSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      const submission = await storage.createContactSubmission(result.data);
      console.log("Contact form submission created:", submission.id);
      
      res.status(201).json({ 
        message: "Mesajul a fost trimis cu succes!",
        id: submission.id 
      });
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Admin authentication endpoint
  app.post("/api/admin/login", (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username și parola sunt obligatorii" });
      }
      
      const isValid = verifyAdminCredentials(username, password);
      
      if (isValid) {
        // Generate a simple session token (in production, use JWT)
        const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        res.json({ 
          success: true, 
          message: "Autentificare reușită",
          token: sessionToken 
        });
      } else {
        res.status(401).json({ 
          success: false, 
          error: "Credențiale invalide" 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Eroare internă de server" });
    }
  });

  // Match results endpoint - public display
  app.get("/api/match-results", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { matchResults } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const results = await db.select().from(matchResults).orderBy(desc(matchResults.matchDate));
      res.json(results);
    } catch (error) {
      console.error("Error fetching match results:", error);
      res.status(500).json({ message: "Failed to fetch match results" });
    }
  });

  // Admin match results endpoints
  app.get("/api/admin/match-results", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { matchResults } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const results = await db.select().from(matchResults).orderBy(desc(matchResults.matchDate));
      res.json(results);
    } catch (error) {
      console.error("Error fetching admin match results:", error);
      res.status(500).json({ message: "Failed to fetch match results" });
    }
  });

  app.post("/api/admin/match-results", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { matchResults, insertMatchResultSchema } = await import("@shared/schema");
      const { and, eq } = await import("drizzle-orm");
      
      const result = insertMatchResultSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }

      const { groupName, team1Name, team2Name, team1Score, team2Score, streamUrl } = result.data;

      // Validate teams are different
      if (team1Name === team2Name) {
        return res.status(400).json({ message: "O echipă nu poate juca împotriva ei însăși" });
      }

      // Check if teams have already played against each other in this group
      const { or } = await import("drizzle-orm");
      
      const existingMatches = await db.select().from(matchResults).where(
        and(
          eq(matchResults.groupName, groupName),
          or(
            // Check both possible combinations: A vs B and B vs A
            and(
              eq(matchResults.team1Name, team1Name),
              eq(matchResults.team2Name, team2Name)
            ),
            and(
              eq(matchResults.team1Name, team2Name),
              eq(matchResults.team2Name, team1Name)
            )
          )
        )
      );

      if (existingMatches.length > 0) {
        return res.status(400).json({ 
          message: `Echipele ${team1Name} și ${team2Name} au mai jucat între ele în grupa ${groupName}. În CS2 BO1, fiecare echipă poate juca doar o dată cu fiecare altă echipă din grupă.` 
        });
      }

      // Validate CS2 BO1 scores (minimum 13 rounds to win, no draws)
      if (team1Score < 13 && team2Score < 13) {
        return res.status(400).json({ message: "În CS2 BO1, o echipă trebuie să câștige cu minimum 13 runde" });
      }

      if (team1Score >= 13 && team2Score >= 13) {
        return res.status(400).json({ message: "În CS2 BO1, doar o echipă poate câștiga (nu pot fi ambele cu 13+ runde)" });
      }
      
      const newMatch = await db.insert(matchResults).values(result.data).returning();
      res.status(201).json(newMatch[0]);
    } catch (error) {
      console.error("Error creating match result:", error);
      res.status(500).json({ message: "Failed to create match result" });
    }
  });

  app.put("/api/admin/match-results/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid match result ID" });
      }

      const { db } = await import("./db");
      const { matchResults, insertMatchResultSchema } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const result = insertMatchResultSchema.partial().safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedMatch = await db.update(matchResults)
        .set(result.data)
        .where(eq(matchResults.id, id))
        .returning();
        
      if (updatedMatch.length === 0) {
        return res.status(404).json({ message: "Match result not found" });
      }
      
      res.json(updatedMatch[0]);
    } catch (error) {
      console.error("Error updating match result:", error);
      res.status(500).json({ message: "Failed to update match result" });
    }
  });

  app.delete("/api/admin/match-results/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid match result ID" });
      }

      const { db } = await import("./db");
      const { matchResults } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const deletedMatch = await db.delete(matchResults)
        .where(eq(matchResults.id, id))
        .returning();
        
      if (deletedMatch.length === 0) {
        return res.status(404).json({ message: "Match result not found" });
      }
      
      res.json({ message: "Match result deleted successfully" });
    } catch (error) {
      console.error("Error deleting match result:", error);
      res.status(500).json({ message: "Failed to delete match result" });
    }
  });

  // Use CS Servers router
  app.use(csServersRouter);

  // Register tournament management APIs with database persistence
  registerTournamentDatabaseAPI(app);
  
  // Keep legacy API for backward compatibility
  registerSimpleGroupsAPI(app);

  const httpServer = createServer(app);

  return httpServer;
}
