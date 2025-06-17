import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertEventSchema, insertPlayerSchema, insertFaqSchema } from "@shared/schema";
import { insertSiteContentSchema } from "@shared/content-schema";
import { csServersRouter } from "./routes/cs-servers-routes";
import { registerSimpleGroupsAPI } from "./simple-groups-api";
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

  // Use CS Servers router
  app.use(csServersRouter);

  // Tournament Groups API Routes
  app.get("/api/tournament-groups", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { tournamentGroups, groupTeams, teams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const groups = await db.select({
        id: tournamentGroups.id,
        groupName: tournamentGroups.groupName,
        groupDisplayName: tournamentGroups.groupDisplayName,
        tournament: tournamentGroups.tournament,
        isActive: tournamentGroups.isActive,
      })
      .from(tournamentGroups)
      .where(eq(tournamentGroups.isActive, true))
      .orderBy(tournamentGroups.groupName);

      // Pentru fiecare grupă, obține echipele cu statistici
      const groupsWithTeams = await Promise.all(
        groups.map(async (group) => {
          const teamsInGroup = await db.select({
            id: groupTeams.id,
            teamId: groupTeams.teamId,
            teamName: teams.name,
            teamLogo: teams.logoUrl,
            matchesPlayed: groupTeams.matchesPlayed,
            wins: groupTeams.wins,
            draws: groupTeams.draws,
            losses: groupTeams.losses,
            roundsWon: groupTeams.roundsWon,
            roundsLost: groupTeams.roundsLost,
            roundDifference: groupTeams.roundDifference,
            points: groupTeams.points,
            position: groupTeams.position,
            lastUpdated: groupTeams.lastUpdated,
          })
          .from(groupTeams)
          .innerJoin(teams, eq(groupTeams.teamId, teams.id))
          .where(eq(groupTeams.groupId, group.id))
          .orderBy(groupTeams.position);

          return {
            ...group,
            teams: teamsInGroup,
          };
        })
      );

      res.json(groupsWithTeams);
    } catch (error) {
      console.error("Error fetching tournament groups:", error);
      res.status(500).json({ message: "Failed to fetch tournament groups" });
    }
  });

  // Get specific group with teams
  app.get("/api/tournament-groups/:groupName", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { tournamentGroups, groupTeams, teams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const groupName = req.params.groupName.toUpperCase();
      
      const [group] = await db.select()
        .from(tournamentGroups)
        .where(eq(tournamentGroups.groupName, groupName));

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      const teamsInGroup = await db.select({
        id: groupTeams.id,
        teamId: groupTeams.teamId,
        teamName: teams.name,
        teamLogo: teams.logoUrl,
        matchesPlayed: groupTeams.matchesPlayed,
        wins: groupTeams.wins,
        draws: groupTeams.draws,
        losses: groupTeams.losses,
        roundsWon: groupTeams.roundsWon,
        roundsLost: groupTeams.roundsLost,
        roundDifference: groupTeams.roundDifference,
        points: groupTeams.points,
        position: groupTeams.position,
        lastUpdated: groupTeams.lastUpdated,
      })
      .from(groupTeams)
      .innerJoin(teams, eq(groupTeams.teamId, teams.id))
      .where(eq(groupTeams.groupId, group.id))
      .orderBy(groupTeams.position);

      res.json({
        ...group,
        teams: teamsInGroup,
      });
    } catch (error) {
      console.error("Error fetching group:", error);
      res.status(500).json({ message: "Failed to fetch group" });
    }
  });

  // Manual sync with Google Sheets
  app.post("/api/sync-groups", async (req, res) => {
    try {
      const { syncNow } = await import("./google-sheets-sync");
      await syncNow();
      res.json({ message: "Synchronization completed successfully" });
    } catch (error) {
      console.error("Error syncing with Google Sheets:", error);
      res.status(500).json({ message: "Failed to sync with Google Sheets" });
    }
  });

  // This route is replaced by the simplified groups API

  // Register simplified groups API for tournament management
  registerSimpleGroupsAPI(app);

  const httpServer = createServer(app);

  return httpServer;
}
