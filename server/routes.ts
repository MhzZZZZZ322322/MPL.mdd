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
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Discord Webhook Functions
async function sendDiscordNotification(teamName: string, memberCount: number, logoUrl: string) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("DISCORD_WEBHOOK_URL not configured");
      return;
    }

    const embed = {
      title: "🎯 Nouă Echipă Înregistrată!",
      description: `O echipă nouă s-a înregistrat pentru Kingston FURY x HyperX Supercup`,
      color: 0x7C3AED,
      fields: [
        {
          name: "Numele Echipei",
          value: teamName,
          inline: true
        },
        {
          name: "Numărul de Membri",
          value: `${memberCount} jucători`,
          inline: true
        },
        {
          name: "Status",
          value: "În așteptarea aprobării",
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Moldova Pro League"
      }
    };

    const payload = {
      username: "MPL Tournament Bot",
      embeds: [embed]
    };

    // Removed debug logging for production

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send Discord notification:", response.status, response.statusText, errorText);
    } else {
      console.log(`Discord notification sent for team: ${teamName}`);
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}

async function sendDiscordNewsNotification(title: string, excerpt: string, slug: string) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL_NEWS;
    if (!webhookUrl) {
      console.warn("DISCORD_WEBHOOK_URL_NEWS not configured");
      return;
    }

    // Use the actual site URL where the article is published
    const newsUrl = `https://mpl.md/blog/${slug}`;
    
    const embed = {
      title: "📰 BREAKING NEWS pe scena CS2 din Moldova! 🔥",
      description: `${excerpt || title}`,
      color: 0xFF6B35, // Orange color for news
      fields: [
        {
          name: "📖 Citește toată știrea aici:",
          value: `[${title}](${newsUrl})`,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Moldova Pro League | Esports din inima Moldovei",
        icon_url: "https://mpl.md/logo.png"
      }
    };

    const payload = {
      username: "MPL News Bot",
      content: "🔥 **BREAKING NEWS pe scena CS2 din Moldova!** 🔥",
      embeds: [embed]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send Discord news notification:", response.status, response.statusText, errorText);
    } else {
      console.log(`Discord news notification sent for article: ${title}`);
    }
  } catch (error) {
    console.error("Error sending Discord news notification:", error);
  }
}

async function sendDiscordReviewNotification(teamName: string, status: 'approved' | 'rejected', isDirectInvite?: boolean, rejectionReason?: string) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("DISCORD_WEBHOOK_URL not configured");
      return;
    }

    const isApproved = status === 'approved';
    const embed = {
      title: isApproved ? "✅ Echipă Aprobată!" : "❌ Echipă Respinsă",
      description: `Echipa **${teamName}** a fost ${isApproved ? 'aprobată' : 'respinsă'} pentru Kingston FURY x HyperX Supercup`,
      color: isApproved ? 0x22C55E : 0xEF4444,
      fields: [
        {
          name: "Numele Echipei",
          value: teamName,
          inline: true
        },
        {
          name: "Status Final",
          value: isApproved ? "Aprobată" : "Respinsă",
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Moldova Pro League"
      }
    };

    if (isApproved && typeof isDirectInvite === 'boolean') {
      embed.fields.push({
        name: "🎯 Tip Invitație",
        value: isDirectInvite ? "🟣 Invitație Directă" : "🔵 Prin Calificare",
        inline: true
      });
    }

    if (!isApproved && rejectionReason) {
      embed.fields.push({
        name: "📝 Motivul Respingerii",
        value: rejectionReason,
        inline: false
      });
    }

    const payload = {
      username: "MPL Admin Bot",
      embeds: [embed]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send Discord review notification:", response.status, response.statusText, errorText);
    } else {
      console.log(`Discord review notification sent for team: ${teamName} (${status})`);
    }
  } catch (error) {
    console.error("Error sending Discord review notification:", error);
  }
}

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'logos');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `team_${timestamp}${ext}`);
  }
});

const upload = multer({ 
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});

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
        .orderBy(desc(stage3Swiss.wins))
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
  // KINGSTON FURY x HYPERX SUPERCUP API ROUTES
  // Separate API routes for Kingston FURY x HyperX tournament
  // ===========================

  // Kingston FURY Teams routes (removed duplicate endpoint - using the one that filters by approved status below)

  app.get("/api/kingston/teams/:id/members", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { db } = await import("./db");
      const { kingstonTeamMembers } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const members = await db.select().from(kingstonTeamMembers).where(eq(kingstonTeamMembers.teamId, teamId));
      res.json(members);
    } catch (error) {
      console.error("Error fetching Kingston FURY team members:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY team members" });
    }
  });

  // Kingston FURY Group Standings
  app.get("/api/kingston/group-standings", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonGroupStandings } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const standings = await db.select().from(kingstonGroupStandings)
        .orderBy(kingstonGroupStandings.groupName, desc(kingstonGroupStandings.points), desc(kingstonGroupStandings.roundDifference));
      res.json(standings);
    } catch (error) {
      console.error("Error fetching Kingston FURY group standings:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY group standings" });
    }
  });

  // Kingston FURY Match Results
  app.get("/api/kingston/match-results", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonMatchResults } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const results = await db.select().from(kingstonMatchResults)
        .orderBy(desc(kingstonMatchResults.createdAt));
      res.json(results);
    } catch (error) {
      console.error("Error fetching Kingston FURY match results:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY match results" });
    }
  });

  // Kingston FURY Stage 2 Swiss routes
  app.get("/api/kingston/stage2-swiss-standings", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonStage2Swiss } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const standings = await db.select().from(kingstonStage2Swiss)
        .orderBy(desc(kingstonStage2Swiss.wins), desc(kingstonStage2Swiss.roundsWon));
      res.json(standings);
    } catch (error) {
      console.error("Error fetching Kingston FURY Stage 2 Swiss standings:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY Stage 2 Swiss standings" });
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
      console.error("Error fetching Kingston FURY Stage 2 Swiss matches:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY Stage 2 Swiss matches" });
    }
  });

  // Kingston FURY Stage 3 Playoff routes  
  app.get("/api/kingston/stage3-playoff", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonStage3Playoff } = await import("@shared/schema");
      
      const matches = await db.select().from(kingstonStage3Playoff)
        .orderBy(kingstonStage3Playoff.bracketPosition);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching Kingston FURY Stage 3 Playoff matches:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY Stage 3 Playoff matches" });
    }
  });

  // ===========================
  // KINGSTON ADMIN API ROUTES
  // Administrative routes for Kingston FURY tournament management
  // ===========================

  // Kingston FURY Admin: Get Group Configuration
  app.get("/api/kingston/admin/group-config", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonGroupConfiguration } = await import("@shared/schema");
      
      const config = await db.select().from(kingstonGroupConfiguration);
      res.json(config);
    } catch (error) {
      console.error("Error fetching Kingston FURY group config:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY group configuration" });
    }
  });

  // Kingston FURY Admin: Save Group Configuration
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
            teamName: team.name,
            displayName: `${group.groupName} - ${team.name}`
          });
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving Kingston FURY group config:", error);
      res.status(500).json({ error: "Failed to save Kingston FURY group configuration" });
    }
  });

  // Kingston FURY Admin: Create Team
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
      console.error("Error creating Kingston FURY team:", error);
      res.status(500).json({ error: "Failed to create Kingston FURY team" });
    }
  });

  // Kingston FURY Admin: Update Team
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
        return res.status(404).json({ error: "Kingston FURY team not found" });
      }
      
      res.json(updatedTeam);
    } catch (error) {
      console.error("Error updating Kingston FURY team:", error);
      res.status(500).json({ error: "Failed to update Kingston FURY team" });
    }
  });

  // Kingston FURY Admin: Delete Team
  app.delete("/api/kingston/admin/teams/:id", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      await db.delete(kingstonTeams).where(eq(kingstonTeams.id, teamId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting Kingston FURY team:", error);
      res.status(500).json({ error: "Failed to delete Kingston FURY team" });
    }
  });

  // Kingston FURY Admin: Auto-distribute teams
  app.post("/api/kingston/admin/auto-distribute-teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams, kingstonGroupConfiguration } = await import("@shared/schema");
      
      // Fetch all Kingston FURY teams
      const teams = await db.select().from(kingstonTeams);
      
      if (teams.length === 0) {
        return res.status(400).json({ error: "No Kingston FURY teams available for distribution" });
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
            teamName: team.name,
            displayName: `${group.groupName} - ${team.name}`
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
      console.error("Error auto-distributing Kingston FURY teams:", error);
      res.status(500).json({ error: "Failed to auto-distribute Kingston FURY teams" });
    }
  });

  // Kingston FURY Admin: Reset all results
  app.post("/api/kingston/admin/reset-results", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonMatchResults, kingstonGroupConfiguration, kingstonStage2Swiss, kingstonStage3Playoff } = await import("@shared/schema");
      
      // Reset toate tabelele de rezultate Kingston FURY
      await db.delete(kingstonMatchResults);
      await db.delete(kingstonGroupConfiguration);
      await db.delete(kingstonStage2Swiss);
      await db.delete(kingstonStage3Playoff);
      
      res.json({ 
        success: true, 
        message: "Toate rezultatele și configurațiile Kingston FURY au fost resetate" 
      });
    } catch (error) {
      console.error("Error resetting Kingston FURY results:", error);
      res.status(500).json({ error: "Failed to reset Kingston FURY results" });
    }
  });

  // Kingston FURY Admin: Create Team Member
  app.post("/api/kingston/admin/team-members", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeamMembers, insertKingstonTeamMemberSchema } = await import("@shared/schema");
      
      const result = insertKingstonTeamMemberSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const [teamMember] = await db.insert(kingstonTeamMembers).values(result.data).returning();
      res.status(201).json(teamMember);
    } catch (error) {
      console.error("Error creating Kingston FURY team member:", error);
      res.status(500).json({ error: "Failed to create Kingston FURY team member" });
    }
  });

  // Kingston FURY Admin: Get Team Members
  app.get("/api/kingston/admin/team-members/:teamId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const { db } = await import("./db");
      const { kingstonTeamMembers } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const members = await db.select().from(kingstonTeamMembers)
        .where(eq(kingstonTeamMembers.teamId, teamId));
      res.json(members);
    } catch (error) {
      console.error("Error fetching Kingston FURY team members:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY team members" });
    }
  });

  // Public Team Registration for Kingston FURY
  app.post("/api/kingston/register-team", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams, kingstonTeamMembers } = await import("@shared/schema");
      
      const { name, logoUrl, members } = req.body;
      
      if (!name || !logoUrl || !members || members.length < 5) {
        return res.status(400).json({ error: "Date incomplete - echipa trebuie să aibă nume, logo și minimum 5 membri" });
      }

      // Create team with pending status
      const [team] = await db.insert(kingstonTeams).values({
        name,
        logoUrl,
        logoData: null, // Will be updated when logo is uploaded
        status: "pending"
      }).returning();

      // Create team members
      for (const member of members) {
        if (member.nickname && member.faceitProfile && member.discordAccount) {
          await db.insert(kingstonTeamMembers).values({
            teamId: team.id,
            nickname: member.nickname,
            faceitProfile: member.faceitProfile,
            discordAccount: member.discordAccount,
            role: member.role || "player",
            position: member.position || "main"
          });
        }
      }

      // Send Discord notification
      try {
        await sendDiscordNotification(name, members.length, logoUrl);
      } catch (discordError) {
        console.warn("Discord notification failed, but team registration succeeded:", discordError);
      }

      res.status(201).json({ 
        message: "Echipa a fost înregistrată cu succes și urmează să fie verificată",
        teamId: team.id 
      });
    } catch (error) {
      console.error("Error registering team:", error);
      res.status(500).json({ error: "Failed to register team" });
    }
  });

  // Upload Team Logo - Save as base64 in database
  app.post("/api/upload/team-logo", upload.single('logo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      // Convert file to base64
      const fileBuffer = fs.readFileSync(req.file.path);
      const base64Data = fileBuffer.toString('base64');
      const mimeType = req.file.mimetype;
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      
      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
      
      // Generate unique identifier for the logo
      const logoId = `logo_${Date.now()}`;
      const logoUrl = `/api/team-logo/${logoId}`;
      
      res.json({ 
        url: logoUrl,
        logoData: dataUrl, // Send base64 data for immediate use
        logoId: logoId,
        message: "Logo uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ error: "Failed to upload logo" });
    }
  });

  // Update team with logo data after registration
  app.post("/api/kingston/update-team-logo", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const { teamId, logoUrl, logoData } = req.body;
      
      if (!teamId || !logoUrl || !logoData) {
        return res.status(400).json({ error: "teamId, logoUrl and logoData are required" });
      }

      await db.update(kingstonTeams)
        .set({ logoUrl, logoData })
        .where(eq(kingstonTeams.id, teamId));

      res.json({ 
        success: true, 
        message: "Logo updated successfully" 
      });
    } catch (error) {
      console.error("Error updating team logo:", error);
      res.status(500).json({ error: "Failed to update team logo" });
    }
  });

  // Serve team logos from database
  app.get("/api/team-logo/:logoId", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      // Find team by logo_url containing the logoId
      const team = await db.select().from(kingstonTeams)
        .where(eq(kingstonTeams.logoUrl, `/api/team-logo/${req.params.logoId}`))
        .limit(1);
        
      if (team.length === 0 || !team[0].logoData) {
        return res.status(404).json({ error: "Logo not found" });
      }
      
      // Extract base64 data and mime type
      const logoData = team[0].logoData;
      const matches = logoData.match(/^data:([^;]+);base64,(.+)$/);
      
      if (!matches) {
        return res.status(400).json({ error: "Invalid logo data format" });
      }
      
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      res.set('Content-Type', mimeType);
      res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
      res.send(buffer);
      
    } catch (error) {
      console.error("Error serving logo:", error);
      res.status(500).json({ error: "Failed to serve logo" });
    }
  });

  // Serve Kingston team logos by team ID
  app.get("/api/kingston/teams/:id/logo", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const teamId = parseInt(req.params.id);
      if (isNaN(teamId)) {
        return res.status(400).json({ error: "Invalid team ID" });
      }
      
      // Find team by ID
      const [team] = await db.select().from(kingstonTeams)
        .where(eq(kingstonTeams.id, teamId))
        .limit(1);
        
      if (!team || !team.logoData) {
        return res.status(404).json({ error: "Logo not found" });
      }
      
      // Extract base64 data and mime type
      const logoData = team.logoData;
      const matches = logoData.match(/^data:([^;]+);base64,(.+)$/);
      
      if (!matches) {
        return res.status(400).json({ error: "Invalid logo data format" });
      }
      
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      res.set('Content-Type', mimeType);
      res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
      res.send(buffer);
      
    } catch (error) {
      console.error("Error serving Kingston team logo:", error);
      res.status(500).json({ error: "Failed to serve logo" });
    }
  });

  // Kingston FURY Admin: Get Pending Teams
  app.get("/api/kingston/admin/pending-teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams, kingstonTeamMembers } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const pendingTeams = await db.select().from(kingstonTeams)
        .where(eq(kingstonTeams.status, "pending"));
      
      // Get members for each team
      const teamsWithMembers = await Promise.all(
        pendingTeams.map(async (team) => {
          const members = await db.select().from(kingstonTeamMembers)
            .where(eq(kingstonTeamMembers.teamId, team.id));
          return { ...team, members };
        })
      );
      
      res.json(teamsWithMembers);
    } catch (error) {
      console.error("Error fetching pending teams:", error);
      res.status(500).json({ error: "Failed to fetch pending teams" });
    }
  });

  // Kingston FURY Admin: Approve/Reject Team
  app.patch("/api/kingston/admin/teams/:teamId/review", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const { status, rejectionReason, isDirectInvite } = req.body;
      
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Status invalid" });
      }

      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const updateData: any = {
        status,
        reviewedAt: new Date(),
        reviewedBy: "admin", // În viitor poți adăuga sistem de autentificare
      };
      
      if (status === "approved" && typeof isDirectInvite === "boolean") {
        updateData.isDirectInvite = isDirectInvite;
      }
      
      if (status === "rejected" && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      // Get team name before updating for Discord notification
      const [team] = await db.select().from(kingstonTeams)
        .where(eq(kingstonTeams.id, teamId))
        .limit(1);

      await db.update(kingstonTeams)
        .set(updateData)
        .where(eq(kingstonTeams.id, teamId));

      // Send Discord notification for review result
      if (team) {
        try {
          await sendDiscordReviewNotification(
            team.name, 
            status as 'approved' | 'rejected',
            isDirectInvite,
            rejectionReason
          );
        } catch (discordError) {
          console.warn("Discord review notification failed:", discordError);
        }
      }

      res.json({ message: `Echipa a fost ${status === "approved" ? "aprobată" : "respinsă"}` });
    } catch (error) {
      console.error("Error reviewing team:", error);
      res.status(500).json({ error: "Failed to review team" });
    }
  });


  // Kingston Public: Get Only Manually Approved Teams (Real Registrations)
  app.get("/api/kingston/teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      // Return ONLY teams with status "approved" - these are real registrations that admin manually approved
      const teams = await db.select({
        id: kingstonTeams.id,
        name: kingstonTeams.name,
        logoUrl: kingstonTeams.logoUrl,
        logoData: kingstonTeams.logoData, // Include logoData for frontend
        tournament: kingstonTeams.tournament,
        status: kingstonTeams.status,
        isActive: kingstonTeams.isActive,
        isDirectInvite: kingstonTeams.isDirectInvite,
        submittedAt: kingstonTeams.submittedAt,
        reviewedAt: kingstonTeams.reviewedAt,
        reviewedBy: kingstonTeams.reviewedBy,
        rejectionReason: kingstonTeams.rejectionReason,
        createdAt: kingstonTeams.createdAt
      }).from(kingstonTeams)
        .where(eq(kingstonTeams.status, "approved")); // Only manually approved teams
      res.json(teams);
    } catch (error) {
      console.error("Error fetching Kingston FURY teams:", error);
      res.status(500).json({ error: "Failed to fetch Kingston FURY teams" });
    }
  });

  // Kingston FURY Admin: Get All Registered (Approved) Teams
  app.get("/api/kingston/admin/registered-teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const teams = await db.select({
        id: kingstonTeams.id,
        name: kingstonTeams.name,
        logoUrl: kingstonTeams.logoUrl,
        logoData: kingstonTeams.logoData,
        tournament: kingstonTeams.tournament,
        status: kingstonTeams.status,
        isDirectInvite: kingstonTeams.isDirectInvite,
        isActive: kingstonTeams.isActive,
        submittedAt: kingstonTeams.submittedAt,
        reviewedAt: kingstonTeams.reviewedAt,
        reviewedBy: kingstonTeams.reviewedBy,
        rejectionReason: kingstonTeams.rejectionReason,
        createdAt: kingstonTeams.createdAt
      }).from(kingstonTeams)
        .where(eq(kingstonTeams.status, "approved"));
      res.json(teams);
    } catch (error) {
      console.error("Error deleting Kingston FURY teams:", error);
      res.status(500).json({ error: "Failed to delete Kingston FURY teams" });
    }
  });

  // Send Discord notification for existing pending teams
  app.post("/api/kingston/admin/notify-pending-teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const pendingTeams = await db.select().from(kingstonTeams).where(eq(kingstonTeams.status, "pending"));
      
      if (pendingTeams.length === 0) {
        return res.json({ message: 'Nu există echipe în așteptare', notificationsSent: 0 });
      }

      let successCount = 0;
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      
      if (!webhookUrl) {
        return res.status(400).json({ error: 'Discord webhook nu este configurat' });
      }

      for (const team of pendingTeams) {
        try {
          const embed = {
            title: "📋 Echipă în Așteptare (Notificare Retroactivă)",
            description: `Echipa **${team.name}** așteaptă aprobare pentru Kingston FURY x HyperX Supercup`,
            color: 0xF59E0B, // Orange color for retrospective notifications
            fields: [
              {
                name: "Numele Echipei",
                value: team.name,
                inline: true
              },
              {
                name: "Data Înregistrării",
                value: new Date(team.createdAt).toLocaleDateString('ro-RO'),
                inline: true
              },
              {
                name: "Status",
                value: "În așteptarea aprobării",
                inline: true
              }
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: "Moldova Pro League • Notificare Retroactivă"
            }
          };

          const payload = {
            username: "MPL Tournament Bot",
            embeds: [embed]
          };

          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            successCount++;
            console.log(`Retroactive Discord notification sent for team: ${team.name}`);
          } else {
            const errorText = await response.text();
            console.error(`Failed to send retroactive Discord notification for ${team.name}:`, response.status, response.statusText, errorText);
          }

          // Small delay between notifications to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error sending notification for team ${team.name}:`, error);
        }
      }

      res.json({ 
        message: `Notificări trimise pentru ${successCount} din ${pendingTeams.length} echipe în așteptare`,
        notificationsSent: successCount,
        totalPendingTeams: pendingTeams.length
      });
    } catch (error) {
      console.error('Error sending retrospective notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  });

  // Kingston FURY Admin: Update Team
  app.patch("/api/kingston/admin/teams/:id", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      if (isNaN(teamId)) {
        return res.status(400).json({ error: "Invalid team ID" });
      }

      const { name } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Valid team name is required" });
      }

      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      const [updatedTeam] = await db.update(kingstonTeams)
        .set({ 
          name: name.trim(),
          reviewedAt: new Date(),
          reviewedBy: "admin" // În viitor poți adăuga sistem de autentificare
        })
        .where(eq(kingstonTeams.id, teamId))
        .returning();

      if (!updatedTeam) {
        return res.status(404).json({ error: "Team not found" });
      }

      res.json(updatedTeam);
    } catch (error) {
      console.error("Error deleting Kingston FURY team:", error);
      res.status(500).json({ error: "Failed to delete Kingston FURY team" });
    }
  });

  // Kingston FURY Admin: Update Team Type Only (quick update)
  app.patch("/api/kingston/admin/teams/:teamId/type", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      if (isNaN(teamId)) {
        return res.status(400).json({ error: "Invalid team ID" });
      }

      const { isDirectInvite } = req.body;
      
      if (typeof isDirectInvite !== 'boolean') {
        return res.status(400).json({ error: "isDirectInvite must be a boolean" });
      }

      const { db } = await import("./db");
      const { kingstonTeams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      // Update only the team type
      const [updatedTeam] = await db.update(kingstonTeams)
        .set({ isDirectInvite })
        .where(eq(kingstonTeams.id, teamId))
        .returning();

      if (!updatedTeam) {
        return res.status(404).json({ error: "Team not found" });
      }

      res.json(updatedTeam);
    } catch (error) {
      console.error("Error updating team type:", error);
      res.status(500).json({ error: "Failed to update team type" });
    }
  });

  // Kingston FURY Admin: Full Update Team (name, logo, members, type)
  app.patch("/api/kingston/admin/teams/:teamId/full-update", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      if (isNaN(teamId)) {
        return res.status(400).json({ error: "Invalid team ID" });
      }

      const { name, logoData, members, isDirectInvite } = req.body;
      
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Valid team name is required" });
      }

      if (!Array.isArray(members)) {
        return res.status(400).json({ error: "Members must be an array" });
      }

      const { db } = await import("./db");
      const { kingstonTeams, kingstonTeamMembers } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      // Start transaction
      await db.transaction(async (tx) => {
        // Update team details
        const updateData: any = {
          name: name.trim(),
          reviewedAt: new Date(),
          reviewedBy: "admin"
        };

        if (logoData) {
          updateData.logoData = logoData;
          updateData.logoUrl = `/api/kingston/teams/${teamId}/logo`;
        }

        if (typeof isDirectInvite === "boolean") {
          updateData.isDirectInvite = isDirectInvite;
        }

        await tx.update(kingstonTeams)
          .set(updateData)
          .where(eq(kingstonTeams.id, teamId));

        // Delete existing members
        await tx.delete(kingstonTeamMembers)
          .where(eq(kingstonTeamMembers.teamId, teamId));

        // Insert new members
        if (members.length > 0) {
          const validMembers = members.filter((member: any) => 
            member.nickname && member.nickname.trim().length > 0
          );

          if (validMembers.length > 0) {
            const membersToInsert = validMembers.map((member: any) => ({
              teamId: teamId,
              nickname: member.nickname.trim(),
              faceitProfile: member.faceitProfile?.trim() || '',
              discordAccount: member.discordAccount?.trim() || '',
              role: member.role || 'member',
              position: member.position || 'main'
            }));

            await tx.insert(kingstonTeamMembers)
              .values(membersToInsert);
          }
        }
      });

      res.json({ message: "Team updated successfully with all details" });
    } catch (error) {
      console.error("Error updating Kingston FURY team:", error);
      res.status(500).json({ error: "Failed to update Kingston FURY team" });
    }
  });

  // Kingston FURY Admin: Delete Team
  app.delete("/api/kingston/admin/teams/:id", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      if (isNaN(teamId)) {
        return res.status(400).json({ error: "Invalid team ID" });
      }

      const { db } = await import("./db");
      const { kingstonTeams, kingstonTeamMembers } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      // Delete team members first (foreign key constraint)
      await db.delete(kingstonTeamMembers)
        .where(eq(kingstonTeamMembers.teamId, teamId));

      // Delete the team
      const deletedTeams = await db.delete(kingstonTeams)
        .where(eq(kingstonTeams.id, teamId))
        .returning();

      if (deletedTeams.length === 0) {
        return res.status(404).json({ error: "Team not found" });
      }

      res.json({ message: "Team and all members deleted successfully" });
    } catch (error) {
      console.error("Error deleting Kingston FURY team:", error);
      res.status(500).json({ error: "Failed to delete Kingston FURY team" });
    }
  });

  // Kingston FURY Admin: Create Match Result
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
      console.error("Error creating Kingston FURY match result:", error);
      res.status(500).json({ error: "Failed to create Kingston FURY match result" });
    }
  });

  // ===========================
  // BLOG/NEWS API ROUTES
  // ===========================

  // Get all blog articles (public)
  app.get("/api/blog/articles", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { blogArticles } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const articles = await db.select().from(blogArticles)
        .orderBy(desc(blogArticles.publishedAt), desc(blogArticles.createdAt));
      
      res.json(articles);
    } catch (error) {
      console.error("Error fetching blog articles:", error);
      res.status(500).json({ error: "Failed to fetch blog articles" });
    }
  });

  // Get published articles only (public)
  app.get("/api/blog/articles/published", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { blogArticles } = await import("@shared/schema");
      const { desc, eq } = await import("drizzle-orm");
      
      const articles = await db.select().from(blogArticles)
        .where(eq(blogArticles.status, "published"))
        .orderBy(desc(blogArticles.publishedAt));
      
      res.json(articles);
    } catch (error) {
      console.error("Error fetching published blog articles:", error);
      res.status(500).json({ error: "Failed to fetch published blog articles" });
    }
  });

  // Get single article by slug (public)
  app.get("/api/blog/articles/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { db } = await import("./db");
      const { blogArticles } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const [article] = await db.select().from(blogArticles)
        .where(eq(blogArticles.slug, slug));
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Increment view count
      await db.update(blogArticles)
        .set({ viewCount: article.viewCount + 1 })
        .where(eq(blogArticles.id, article.id));

      res.json({ ...article, viewCount: article.viewCount + 1 });
    } catch (error) {
      console.error("Error fetching blog article by slug:", error);
      res.status(500).json({ error: "Failed to fetch blog article" });
    }
  });

  // Create new article (admin)
  app.post("/api/blog/articles", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { blogArticles, insertBlogArticleSchema } = await import("@shared/schema");
      
      const validationResult = insertBlogArticleSchema.safeParse(req.body);
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const articleData = validationResult.data;
      
      // Auto-publish if status is published and no publishedAt date
      if (articleData.status === 'published' && !articleData.publishedAt) {
        articleData.publishedAt = new Date();
      }

      const [article] = await db.insert(blogArticles).values(articleData).returning();
      
      // Send Discord notification if article is published
      if (article.status === 'published') {
        try {
          await sendDiscordNewsNotification(article.title, article.excerpt, article.slug);
        } catch (discordError) {
          console.warn("Discord news notification failed, but article creation succeeded:", discordError);
        }
      }
      
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating blog article:", error);
      res.status(500).json({ error: "Failed to create blog article" });
    }
  });

  // Update article (admin)
  app.patch("/api/blog/articles/:id", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }

      const { db } = await import("./db");
      const { blogArticles, insertBlogArticleSchema } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const validationResult = insertBlogArticleSchema.safeParse(req.body);
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const articleData = {
        ...validationResult.data,
        updatedAt: new Date()
      };

      // Get the original article to check if status is changing to published
      const [originalArticle] = await db.select().from(blogArticles)
        .where(eq(blogArticles.id, articleId));

      if (!originalArticle) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Auto-set publishedAt if changing to published status
      if (articleData.status === 'published' && !articleData.publishedAt) {
        articleData.publishedAt = new Date();
      }

      const [updatedArticle] = await db.update(blogArticles)
        .set(articleData)
        .where(eq(blogArticles.id, articleId))
        .returning();

      if (!updatedArticle) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Send Discord notification if article is being published for the first time
      if (updatedArticle.status === 'published' && originalArticle.status !== 'published') {
        try {
          await sendDiscordNewsNotification(updatedArticle.title, updatedArticle.excerpt, updatedArticle.slug);
        } catch (discordError) {
          console.warn("Discord news notification failed, but article update succeeded:", discordError);
        }
      }

      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating blog article:", error);
      res.status(500).json({ error: "Failed to update blog article" });
    }
  });

  // Delete article (admin)
  app.delete("/api/blog/articles/:id", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }

      const { db } = await import("./db");
      const { blogArticles } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      const deletedArticles = await db.delete(blogArticles)
        .where(eq(blogArticles.id, articleId))
        .returning();

      if (deletedArticles.length === 0) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog article:", error);
      res.status(500).json({ error: "Failed to delete blog article" });
    }
  });

  // ===========================
  // KINGSTON TOURNAMENT REPORT GENERATION
  // ===========================
  
  // Kingston FURY Tournament Report - Similar to Google Sheets format
  app.get("/api/kingston/tournament-report", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { 
        kingstonTeams, 
        kingstonTeamMembers, 
        kingstonGroupStandings,
        kingstonMatchResults,
        kingstonStage2Swiss,
        kingstonStage2SwissMatches,
        kingstonStage3Playoff
      } = await import("@shared/schema");
      const { eq, desc, sql } = await import("drizzle-orm");

      // Get all approved teams with members
      const teams = await db.select().from(kingstonTeams)
        .where(eq(kingstonTeams.status, "approved"));
        
      const teamsWithMembers = await Promise.all(
        teams.map(async (team) => {
          const members = await db.select().from(kingstonTeamMembers)
            .where(eq(kingstonTeamMembers.teamId, team.id));
          return { ...team, members };
        })
      );

      // Get group standings
      const groupStandings = await db.select().from(kingstonGroupStandings)
        .orderBy(kingstonGroupStandings.groupName, desc(kingstonGroupStandings.points));

      // Get match results
      const matchResults = await db.select().from(kingstonMatchResults)
        .orderBy(desc(kingstonMatchResults.createdAt));

      // Get Stage 2 Swiss results
      const stage2Swiss = await db.select().from(kingstonStage2Swiss)
        .orderBy(desc(kingstonStage2Swiss.wins), desc(kingstonStage2Swiss.roundsWon));
        
      const stage2Matches = await db.select().from(kingstonStage2SwissMatches)
        .orderBy(kingstonStage2SwissMatches.roundNumber);

      // Get Stage 3 Playoff results
      const stage3Playoff = await db.select().from(kingstonStage3Playoff)
        .orderBy(kingstonStage3Playoff.bracketPosition);

      // Calculate tournament statistics
      const tournamentStats = {
        totalTeams: teams.length,
        totalPlayers: teamsWithMembers.reduce((acc, team) => acc + team.members.length, 0),
        totalMatches: matchResults.length + stage2Matches.length + stage3Playoff.filter(m => m.isPlayed).length,
        completedMatches: matchResults.filter(m => m.team1Score !== null && m.team2Score !== null).length + 
                         stage2Matches.filter(m => m.isPlayed).length + 
                         stage3Playoff.filter(m => m.isPlayed).length,
        tournamentStartDate: "15 august 2025",
        tournamentEndDate: "28 septembrie 2025",
        prizePool: "100,000 LEI în produse HyperX + Kingston FURY Gaming Gear",
        reportGeneratedAt: new Date().toISOString()
      };

      // Identify top performers (MVP candidates)
      const mvpCandidates = teamsWithMembers
        .flatMap(team => 
          team.members.map(member => ({
            nickname: member.nickname,
            teamName: team.name,
            faceitProfile: member.faceitProfile,
            role: member.role,
            position: member.position
          }))
        )
        .slice(0, 10); // Top 10 players for MVP consideration

      // Generate comprehensive report
      const tournamentReport = {
        metadata: {
          tournamentName: "Kingston FURY x HyperX - Supercup Season 1",
          format: "32 Teams - 3 Stages (Groups + Swiss + Double Elimination)",
          organizerInfo: {
            name: "Moldova Pro League (MPL)",
            contact: "admin@moldovapro.gg",
            website: "https://moldovapro.gg"
          },
          sponsors: ["Kingston FURY", "HyperX"],
          ...tournamentStats
        },
        
        teams: {
          registered: teamsWithMembers,
          summary: teamsWithMembers.map(team => ({
            id: team.id,
            name: team.name,
            membersCount: team.members.length,
            registrationDate: team.submittedAt,
            approvalDate: team.reviewedAt,
            captain: team.members.find(m => m.role === "captain")?.nickname || team.members[0]?.nickname
          }))
        },
        
        results: {
          stage1Groups: {
            standings: groupStandings,
            matches: matchResults
          },
          stage2Swiss: {
            standings: stage2Swiss,
            matches: stage2Matches
          },
          stage3Playoff: {
            matches: stage3Playoff
          }
        },
        
        awards: {
          prizes: {
            firstPlace: {
              description: "5x HyperX Cloud III S Wireless + 5x Kingston FURY Renegade DDR5 RGB",
              recipients: stage3Playoff.find(m => m.bracketRound === "final" && m.isPlayed)?.winnerName || "TBD"
            },
            secondPlace: {
              description: "5x HyperX Alloy Rise 75 Keyboard + 5x Kingston FURY Beast DDR5 RGB", 
              recipients: stage3Playoff.find(m => m.bracketRound === "final" && m.isPlayed)?.loserName || "TBD"
            },
            thirdPlace: {
              description: "5x HyperX Pulsefire Haste 2 Wireless + 5x Kingston DT Exodia S 256GB + Merchandise",
              recipients: "TBD"
            },
            aceOfAces: {
              description: "Kingston FURY Renegade 48GB DDR5 Limited Edition",
              recipient: "TBD" // To be determined by tournament admin
            }
          },
          mvpCandidates: mvpCandidates
        },
        
        statistics: tournamentStats
      };

      res.json(tournamentReport);
    } catch (error) {
      console.error("Error generating Kingston FURY tournament report:", error);
      res.status(500).json({ error: "Failed to generate tournament report" });
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
