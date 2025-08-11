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

  // Admin - Get scheduled matches with Faceit URLs
  app.get("/api/admin/scheduled-matches", async (req, res) => {
    try {
      const matches = await storage.getScheduledMatches();
      res.json(matches);
    } catch (error) {
      console.error("Error fetching scheduled matches:", error);
      res.status(500).json({ message: "Failed to fetch scheduled matches" });
    }
  });

  // Admin - Update Faceit URL for a match
  app.post("/api/admin/scheduled-matches", async (req, res) => {
    try {
      const { team1, team2, faceitUrl } = req.body;
      
      if (!team1 || !team2) {
        return res.status(400).json({ message: "Team names are required" });
      }

      const updatedMatch = await storage.updateScheduledMatchFaceitUrl(team1, team2, faceitUrl);
      res.json(updatedMatch);
    } catch (error) {
      console.error("Error updating Faceit URL:", error);
      res.status(500).json({ message: "Failed to update Faceit URL" });
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
        console.error("Validation error for match result:", errorMessage);
        console.error("Request body:", req.body);
        console.error("Validation errors:", result.error.errors);
        return res.status(400).json({ message: errorMessage });
      }

      const { groupName, team1Name, team2Name, team1Score, team2Score, streamUrl, technicalWin, technicalWinner } = result.data;

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

      // Validate that teams are not tied (no draws allowed in CS2)
      if (team1Score === team2Score) {
        return res.status(400).json({ message: "În CS2 BO1 nu pot fi egaluri. O echipă trebuie să câștige" });
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

  // Stage 2 Bracket API endpoints
  app.get("/api/stage2-bracket", async (req, res) => {
    try {
      const bracket = await storage.getStage2Bracket();
      res.json(bracket);
    } catch (error) {
      console.error("Error fetching Stage 2 bracket:", error);
      res.status(500).json({ message: "Failed to fetch Stage 2 bracket" });
    }
  });

  app.post("/api/admin/stage2-bracket", async (req, res) => {
    try {
      const { insertStage2BracketSchema } = await import("@shared/schema");
      
      const result = insertStage2BracketSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error for Stage 2 match:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }

      const newMatch = await storage.createStage2Match(result.data);
      res.status(201).json(newMatch);
    } catch (error) {
      console.error("Error creating Stage 2 match:", error);
      res.status(500).json({ message: "Failed to create Stage 2 match" });
    }
  });

  app.put("/api/admin/stage2-bracket/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 2 match ID" });
      }

      const { insertStage2BracketSchema } = await import("@shared/schema");
      
      const result = insertStage2BracketSchema.partial().safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }

      const updatedMatch = await storage.updateStage2Match(id, result.data);
      res.json(updatedMatch);
    } catch (error) {
      console.error("Error updating Stage 2 match:", error);
      res.status(500).json({ message: "Failed to update Stage 2 match" });
    }
  });

  app.delete("/api/admin/stage2-bracket/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 2 match ID" });
      }

      await storage.deleteStage2Match(id);
      res.json({ message: "Stage 2 match deleted successfully" });
    } catch (error) {
      console.error("Error deleting Stage 2 match:", error);
      res.status(500).json({ message: "Failed to delete Stage 2 match" });
    }
  });

  // Stage 3 Swiss routes
  app.get("/api/stage3-swiss-standings", async (req, res) => {
    try {
      const standings = await storage.getStage3SwissStandings();
      res.json(standings);
    } catch (error) {
      console.error("Error fetching Stage 3 Swiss standings:", error);
      res.status(500).json({ message: "Failed to fetch Stage 3 Swiss standings" });
    }
  });

  app.get("/api/stage3-qualified-teams", async (req, res) => {
    try {
      const qualifiedTeams = await storage.getStage3QualifiedTeams();
      res.json(qualifiedTeams);
    } catch (error) {
      console.error("Error fetching Stage 3 qualified teams:", error);
      res.status(500).json({ message: "Failed to fetch Stage 3 qualified teams" });
    }
  });

  app.get("/api/stage3-swiss-matches", async (req, res) => {
    try {
      const matches = await storage.getStage3SwissMatches();
      res.json(matches);
    } catch (error) {
      console.error("Error fetching Stage 3 Swiss matches:", error);
      res.status(500).json({ message: "Failed to fetch Stage 3 Swiss matches" });
    }
  });

  app.post("/api/admin/stage3-swiss-matches", async (req, res) => {
    try {
      const { insertStage3SwissMatchSchema } = await import("@shared/schema");
      
      const result = insertStage3SwissMatchSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error for Stage 3 Swiss match:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }

      const newMatch = await storage.createStage3Match(result.data);
      res.status(201).json(newMatch);
    } catch (error) {
      console.error("Error creating Stage 3 Swiss match:", error);
      res.status(500).json({ message: "Failed to create Stage 3 Swiss match" });
    }
  });

  app.put("/api/admin/stage3-swiss-matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 3 Swiss match ID" });
      }

      const { insertStage3SwissMatchSchema } = await import("@shared/schema");
      
      const result = insertStage3SwissMatchSchema.partial().safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }

      const updatedMatch = await storage.updateStage3Match(id, result.data);
      if (!updatedMatch) {
        return res.status(404).json({ message: "Stage 3 Swiss match not found" });
      }
      
      res.json(updatedMatch);
    } catch (error) {
      console.error("Error updating Stage 3 Swiss match:", error);
      res.status(500).json({ message: "Failed to update Stage 3 Swiss match" });
    }
  });

  app.delete("/api/admin/stage3-swiss-matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 3 Swiss match ID" });
      }

      await storage.deleteStage3Match(id);
      const success = true;
      if (!success) {
        return res.status(404).json({ message: "Stage 3 Swiss match not found" });
      }
      
      res.json({ message: "Stage 3 Swiss match deleted successfully" });
    } catch (error) {
      console.error("Error deleting Stage 3 Swiss match:", error);
      res.status(500).json({ message: "Failed to delete Stage 3 Swiss match" });
    }
  });

  app.post("/api/admin/stage3-swiss-team", async (req, res) => {
    try {
      const team = await storage.createStage3Team(req.body);
      res.json(team);
    } catch (error) {
      console.error("Error creating Stage 3 team:", error);
      res.status(500).json({ message: "Failed to create Stage 3 team" });
    }
  });

  app.put("/api/admin/stage3-swiss-team/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 3 team ID" });
      }

      const team = await storage.updateStage3Team(id, req.body);
      res.json(team);
    } catch (error) {
      console.error("Error updating Stage 3 team:", error);
      res.status(500).json({ message: "Failed to update Stage 3 team" });
    }
  });

  app.post("/api/admin/stage3-swiss-match", async (req, res) => {
    try {
      const match = await storage.createStage3Match(req.body);
      res.json(match);
    } catch (error) {
      console.error("Error creating Stage 3 match:", error);
      res.status(500).json({ message: "Failed to create Stage 3 match" });
    }
  });

  app.put("/api/admin/stage3-swiss-match/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 3 match ID" });
      }

      const match = await storage.updateStage3Match(id, req.body);
      res.json(match);
    } catch (error) {
      console.error("Error updating Stage 3 match:", error);
      res.status(500).json({ message: "Failed to update Stage 3 match" });
    }
  });

  app.delete("/api/admin/stage3-swiss-match/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 3 match ID" });
      }

      await storage.deleteStage3Match(id);
      res.json({ message: "Stage 3 match deleted successfully" });
    } catch (error) {
      console.error("Error deleting Stage 3 match:", error);
      res.status(500).json({ message: "Failed to delete Stage 3 match" });
    }
  });

  // Stage 4 Playoff routes
  app.get("/api/stage4-playoff", async (req, res) => {
    try {
      const matches = await storage.getStage4PlayoffMatches();
      res.json(matches);
    } catch (error) {
      console.error("Error fetching Stage 4 Playoff matches:", error);
      res.status(500).json({ message: "Failed to fetch Stage 4 Playoff matches" });
    }
  });

  // Get Stage 3 qualified teams (top 8 for Stage 4 Playoff)
  app.get("/api/stage3-qualified-teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { stage3Swiss } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      // Get top 8 teams based on Stage 3 Swiss standings
      const qualifiedTeams = await db
        .select({ teamName: stage3Swiss.teamName })
        .from(stage3Swiss)
        .orderBy(desc(stage3Swiss.wins), desc(stage3Swiss.roundDifference))
        .limit(8);
      
      const teamNames = qualifiedTeams.map(team => team.teamName);
      res.json(teamNames);
    } catch (error) {
      console.error("Error fetching Stage 3 qualified teams:", error);
      res.status(500).json({ message: "Failed to fetch Stage 3 qualified teams" });
    }
  });

  app.post("/api/admin/stage4-playoff", async (req, res) => {
    try {
      const { insertStage4PlayoffSchema } = await import("@shared/schema");
      
      const result = insertStage4PlayoffSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error for Stage 4 Playoff match:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }

      const newMatch = await storage.createStage4Match(result.data);
      res.status(201).json(newMatch);
    } catch (error) {
      console.error("Error creating Stage 4 Playoff match:", error);
      res.status(500).json({ message: "Failed to create Stage 4 Playoff match" });
    }
  });

  // Auto-progression function for Stage 4 Playoff
  async function updateStage4Progression(updatedMatch: any) {
    try {
      if (!updatedMatch.isPlayed || !updatedMatch.winnerName) {
        return; // Only proceed if match is played and has winner
      }

      const allMatches = await storage.getStage4PlayoffMatches();
      
      // QF1 winner goes to SF1 team1, QF2 winner goes to SF1 team2
      // QF3 winner goes to SF2 team1, QF4 winner goes to SF2 team2
      // SF1 winner goes to Final team1, SF2 winner goes to Final team2
      
      if (updatedMatch.bracketRound === 'quarterfinals') {
        // Find corresponding semifinal
        const semiFinalPosition = updatedMatch.bracketPosition <= 2 ? 1 : 2;
        const teamSlot = updatedMatch.bracketPosition % 2 === 1 ? 'team1Name' : 'team2Name';
        
        const semiFinal = allMatches.find(m => 
          m.bracketRound === 'semifinals' && m.bracketPosition === semiFinalPosition
        );
        
        if (semiFinal) {
          const updateData = { [teamSlot]: updatedMatch.winnerName };
          await storage.updateStage4Match(semiFinal.id, updateData);
        }
      } else if (updatedMatch.bracketRound === 'semifinals') {
        // Find final match
        const finalMatch = allMatches.find(m => m.bracketRound === 'final');
        
        if (finalMatch) {
          const teamSlot = updatedMatch.bracketPosition === 1 ? 'team1Name' : 'team2Name';
          const updateData = { [teamSlot]: updatedMatch.winnerName };
          await storage.updateStage4Match(finalMatch.id, updateData);
        }
      }
    } catch (error) {
      console.error("Error in Stage 4 auto-progression:", error);
    }
  }

  app.put("/api/admin/stage4-playoff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 4 Playoff match ID" });
      }

      const { insertStage4PlayoffSchema } = await import("@shared/schema");
      
      const result = insertStage4PlayoffSchema.partial().safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        console.error("Validation error:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }

      const updatedMatch = await storage.updateStage4Match(id, result.data);
      if (!updatedMatch) {
        return res.status(404).json({ message: "Stage 4 Playoff match not found" });
      }
      
      // Auto-progression logic - advance winners to next round
      await updateStage4Progression(updatedMatch);
      
      res.json(updatedMatch);
    } catch (error) {
      console.error("Error updating Stage 4 Playoff match:", error);
      res.status(500).json({ message: "Failed to update Stage 4 Playoff match" });
    }
  });

  app.delete("/api/admin/stage4-playoff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Stage 4 Playoff match ID" });
      }

      await storage.deleteStage4Match(id);
      res.json({ message: "Stage 4 Playoff match deleted successfully" });
    } catch (error) {
      console.error("Error deleting Stage 4 Playoff match:", error);
      res.status(500).json({ message: "Failed to delete Stage 4 Playoff match" });
    }
  });

  // V0R4YN Counter routes
  app.get("/api/v0r4yn-counter", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { var4unCounter } = await import("@shared/schema");
      
      const [counter] = await db.select().from(var4unCounter).limit(1);
      
      if (!counter) {
        // Initialize counter if it doesn't exist
        const [newCounter] = await db.insert(var4unCounter)
          .values({ totalLikes: 0 })
          .returning();
        return res.json(newCounter);
      }
      
      res.json(counter);
    } catch (error) {
      console.error("Error fetching V0R4YN counter:", error);
      res.status(500).json({ message: "Failed to fetch V0R4YN counter" });
    }
  });

  app.post("/api/v0r4yn-counter/increment", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { var4unCounter } = await import("@shared/schema");
      const { sql } = await import("drizzle-orm");
      
      // Increment counter atomically
      const [updatedCounter] = await db.update(var4unCounter)
        .set({ 
          totalLikes: sql`${var4unCounter.totalLikes} + 1`,
          lastUpdated: new Date()
        })
        .returning();
      
      if (!updatedCounter) {
        // Counter doesn't exist, create it with 1 like
        const [newCounter] = await db.insert(var4unCounter)
          .values({ totalLikes: 1 })
          .returning();
        return res.json(newCounter);
      }
      
      res.json(updatedCounter);
    } catch (error) {
      console.error("Error incrementing V0R4YN counter:", error);
      res.status(500).json({ message: "Failed to increment V0R4YN counter" });
    }
  });

  // ===========================
  // KINGSTON x HYPERX SUPERCUP API ROUTES
  // Separate API routes for Kingston x HyperX tournament
  // ===========================

  // Kingston Teams routes
  app.get("/api/kingston/teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      
      const teams = await db.select().from(kingstonTeams);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching Kingston teams:", error);
      res.status(500).json({ error: "Failed to fetch Kingston teams" });
    }
  });

  app.get("/api/kingston/teams/:id/members", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { db } = await import("./db");
      const { kingstonTeamMembers } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const members = await db.select().from(kingstonTeamMembers).where(eq(kingstonTeamMembers.teamId, teamId));
      res.json(members);
    } catch (error) {
      console.error("Error fetching Kingston team members:", error);
      res.status(500).json({ error: "Failed to fetch Kingston team members" });
    }
  });

  // Kingston Group Standings
  app.get("/api/kingston/group-standings", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonGroupStandings } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const standings = await db.select().from(kingstonGroupStandings)
        .orderBy(kingstonGroupStandings.groupName, desc(kingstonGroupStandings.points), desc(kingstonGroupStandings.roundDifference));
      res.json(standings);
    } catch (error) {
      console.error("Error fetching Kingston group standings:", error);
      res.status(500).json({ error: "Failed to fetch Kingston group standings" });
    }
  });

  // Kingston Match Results
  app.get("/api/kingston/match-results", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonMatchResults } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const results = await db.select().from(kingstonMatchResults)
        .orderBy(desc(kingstonMatchResults.createdAt));
      res.json(results);
    } catch (error) {
      console.error("Error fetching Kingston match results:", error);
      res.status(500).json({ error: "Failed to fetch Kingston match results" });
    }
  });

  // Kingston Stage 2 Swiss routes
  app.get("/api/kingston/stage2-swiss-standings", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonStage2Swiss } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const standings = await db.select().from(kingstonStage2Swiss)
        .orderBy(desc(kingstonStage2Swiss.wins), desc(kingstonStage2Swiss.roundsWon));
      res.json(standings);
    } catch (error) {
      console.error("Error fetching Kingston Stage 2 Swiss standings:", error);
      res.status(500).json({ error: "Failed to fetch Kingston Stage 2 Swiss standings" });
    }
  });

  app.get("/api/kingston/stage2-swiss-matches", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonStage2SwissMatches } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const matches = await db.select().from(kingstonStage2SwissMatches)
        .orderBy(kingstonStage2SwissMatches.roundNumber, desc(kingstonStage2SwissMatches.createdAt));
      res.json(matches);
    } catch (error) {
      console.error("Error fetching Kingston Stage 2 Swiss matches:", error);
      res.status(500).json({ error: "Failed to fetch Kingston Stage 2 Swiss matches" });
    }
  });

  // Kingston Stage 3 Playoff routes  
  app.get("/api/kingston/stage3-playoff", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonStage3Playoff } = await import("@shared/schema");
      
      const matches = await db.select().from(kingstonStage3Playoff)
        .orderBy(kingstonStage3Playoff.bracketPosition);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching Kingston Stage 3 Playoff matches:", error);
      res.status(500).json({ error: "Failed to fetch Kingston Stage 3 Playoff matches" });
    }
  });

  // ===========================
  // KINGSTON ADMIN API ROUTES
  // Administrative routes for Kingston tournament management
  // ===========================

  // Kingston Admin: Get Group Configuration
  app.get("/api/kingston/admin/group-config", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonGroupConfiguration } = await import("@shared/schema");
      
      const config = await db.select().from(kingstonGroupConfiguration);
      res.json(config);
    } catch (error) {
      console.error("Error fetching Kingston group config:", error);
      res.status(500).json({ error: "Failed to fetch Kingston group configuration" });
    }
  });

  // Kingston Admin: Save Group Configuration
  app.post("/api/kingston/admin/save-group-config", async (req, res) => {
    try {
      const { groups } = req.body;
      const { db } = await import("./db");
      const { kingstonGroupConfiguration } = await import("@shared/schema");
      
      // Clear existing configuration
      await db.delete(kingstonGroupConfiguration);
      
      // Insert new configuration
      for (const group of groups) {
        for (const team of group.teams) {
          await db.insert(kingstonGroupConfiguration).values({
            groupName: group.groupName,
            teamId: team.id,
            teamName: team.name
          });
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving Kingston group config:", error);
      res.status(500).json({ error: "Failed to save Kingston group configuration" });
    }
  });

  // Kingston Admin: Create Team
  app.post("/api/kingston/admin/teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams, insertKingstonTeamSchema } = await import("@shared/schema");
      
      const result = insertKingstonTeamSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const [team] = await db.insert(kingstonTeams).values(result.data).returning();
      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating Kingston team:", error);
      res.status(500).json({ error: "Failed to create Kingston team" });
    }
  });

  // Kingston Admin: Update Team
  app.put("/api/kingston/admin/teams/:id", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { db } = await import("./db");
      const { kingstonTeams, insertKingstonTeamSchema } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const result = insertKingstonTeamSchema.partial().safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const [updatedTeam] = await db.update(kingstonTeams)
        .set(result.data)
        .where(eq(kingstonTeams.id, teamId))
        .returning();
        
      if (!updatedTeam) {
        return res.status(404).json({ error: "Kingston team not found" });
      }
      
      res.json(updatedTeam);
    } catch (error) {
      console.error("Error updating Kingston team:", error);
      res.status(500).json({ error: "Failed to update Kingston team" });
    }
  });

  // Kingston Admin: Delete Team
  app.delete("/api/kingston/admin/teams/:id", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      await db.delete(kingstonTeams).where(eq(kingstonTeams.id, teamId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting Kingston team:", error);
      res.status(500).json({ error: "Failed to delete Kingston team" });
    }
  });

  // Kingston Admin: Auto-distribute teams
  app.post("/api/kingston/admin/auto-distribute-teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams, kingstonGroupConfiguration } = await import("@shared/schema");
      
      // Fetch all Kingston teams
      const teams = await db.select().from(kingstonTeams);
      
      if (teams.length === 0) {
        return res.status(400).json({ error: "No Kingston teams available for distribution" });
      }

      // Clear existing configuration
      await db.delete(kingstonGroupConfiguration);

      // Define groups (A to H for 32 teams)
      const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const groupsData = groups.map(name => ({ 
        groupName: name, 
        displayName: `Group ${name}`, 
        teams: [] as any[]
      }));

      // Shuffle teams randomly
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
      
      // Distribute teams evenly across groups
      shuffledTeams.forEach((team, index) => {
        const groupIndex = index % groups.length;
        groupsData[groupIndex].teams.push(team);
      });

      // Save to database
      for (const group of groupsData) {
        for (const team of group.teams) {
          await db.insert(kingstonGroupConfiguration).values({
            groupName: group.groupName,
            teamId: team.id,
            teamName: team.name
          });
        }
      }

      res.json({
        success: true,
        groups: groupsData,
        teamsDistributed: teams.length,
        groupsCount: groups.length
      });
    } catch (error) {
      console.error("Error auto-distributing Kingston teams:", error);
      res.status(500).json({ error: "Failed to auto-distribute Kingston teams" });
    }
  });

  // Kingston Admin: Create Match Result
  app.post("/api/kingston/admin/match-results", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonMatchResults, insertKingstonMatchResultSchema } = await import("@shared/schema");
      
      const result = insertKingstonMatchResultSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const [matchResult] = await db.insert(kingstonMatchResults).values(result.data).returning();
      res.status(201).json(matchResult);
    } catch (error) {
      console.error("Error creating Kingston match result:", error);
      res.status(500).json({ error: "Failed to create Kingston match result" });
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
