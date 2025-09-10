import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Event schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull().default(""),
  platform: text("platform").notNull().default(""),
  teamSize: text("team_size").notNull().default(""),
  prize: text("prize").notNull().default(""),
  status: text("status").notNull().default("upcoming"),
  imageUrl: text("image_url").notNull().default(""),
  registrationLink: text("registration_link").default(""),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Player schema
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  nickname: text("nickname").notNull(),
  realName: text("real_name").notNull(),
  team: text("team").notNull(),
  game: text("game").notNull(),
  score: integer("score").notNull().default(0),
  country: text("country").default("Moldova"),
  profileImage: text("profile_image").notNull().default(""),
  socialLinks: text("social_links").default(""),
  achievements: text("achievements").default(""),
  stats: text("stats").default(""),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Contact submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;

// FAQ schema
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

// SEO schema
export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  pageUrl: text("page_url").notNull().unique(),
  title: text("title").notNull(),
  metaDescription: text("meta_description").notNull(),
  metaKeywords: text("meta_keywords").default(""),
  metaRobots: text("meta_robots").default("index, follow"),
  canonicalUrl: text("canonical_url").default(""),
  structuredData: text("structured_data").default(""),
  openGraph: text("open_graph").default(""),
  twitterCard: text("twitter_card").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSeoSchema = createInsertSchema(seoSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSeo = z.infer<typeof insertSeoSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;

// Analytics settings schema
export const analyticsSettings = pgTable("analytics_settings", {
  id: serial("id").primaryKey(),
  googleTagManagerId: text("google_tag_manager_id").default(""),
  googleAnalyticsId: text("google_analytics_id").default(""),
  googleSearchConsoleVerification: text("google_search_console_verification").default(""),
  facebookPixelId: text("facebook_pixel_id").default(""),
  robotsTxt: text("robots_txt").default("User-agent: *\nAllow: /"),
  sitemapXml: text("sitemap_xml").default(""),
  customHeaderScripts: text("custom_header_scripts").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analyticsSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type AnalyticsSettings = typeof analyticsSettings.$inferSelect;

// Teams schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  tournament: text("tournament").notNull().default("hator-cs-league"),
  isActive: boolean("is_active").notNull().default(true),
  isDirectInvite: boolean("is_direct_invite").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

// Team members schema
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  nickname: text("nickname").notNull(),
  faceitProfile: text("faceit_profile").notNull(),
  role: text("role").notNull().default("player"), // player, captain, coach
  position: text("position").notNull().default("main"), // main, reserve
  isActive: boolean("is_active").notNull().default(true),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// Tournament Groups - Grupele de turneu
export const tournamentGroups = pgTable("tournament_groups", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  groupDisplayName: text("group_display_name").notNull(), // Group A, Group B, etc.
  tournament: text("tournament").notNull().default("hator-cs-league"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Group Teams - Echipele din grupe cu statistici
export const groupTeams = pgTable("group_teams", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  teamId: integer("team_id").notNull(),
  matchesPlayed: integer("matches_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  roundsWon: integer("rounds_won").notNull().default(0),
  roundsLost: integer("rounds_lost").notNull().default(0),
  roundDifference: integer("round_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  position: integer("position").notNull().default(1),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Scheduled Matches - Meciurile programate cu link-uri Faceit
export const scheduledMatches = pgTable("scheduled_matches", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  faceitUrl: text("faceit_url"), // Link-ul către room-ul Faceit
  matchDate: timestamp("match_date").notNull(),
  matchTime: text("match_time").notNull(), // "18:00", "18:45", etc.
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  isPlayed: boolean("is_played").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Match Results - Rezultatele meciurilor
export const matchResults = pgTable("match_results", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score").notNull(),
  team2Score: integer("team2_score").notNull(),
  winnerId: integer("winner_id"), // ID-ul echipei câștigătoare
  streamUrl: text("stream_url"), // Link-ul către stream
  technicalWin: boolean("technical_win").notNull().default(false), // Câștig tehnic
  technicalWinner: text("technical_winner"), // Numele echipei care a câștigat tehnic
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  matchDate: timestamp("match_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Group Configuration - Configurația grupelor
export const groupConfiguration = pgTable("group_configuration", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  displayName: text("display_name").notNull(), // Group A, Group B, etc.
  teamIds: text("team_ids").notNull(), // JSON array cu ID-urile echipelor
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group Standings - Clasamentele grupelor
export const groupStandings = pgTable("group_standings", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  groupName: text("group_name").notNull(),
  matchesPlayed: integer("matches_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  roundsWon: integer("rounds_won").notNull().default(0),
  roundsLost: integer("rounds_lost").notNull().default(0),
  roundDifference: integer("round_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  position: integer("position").notNull().default(1),
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas and types for the new tables
export const insertScheduledMatchSchema = createInsertSchema(scheduledMatches).omit({
  id: true,
  createdAt: true,
});

export const insertMatchResultSchema = createInsertSchema(matchResults).omit({
  id: true,
  createdAt: true,
  matchDate: true,
}).extend({
  team1Score: z.number().min(0),
  team2Score: z.number().min(0),
});

export const insertGroupConfigurationSchema = createInsertSchema(groupConfiguration).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGroupStandingsSchema = createInsertSchema(groupStandings).omit({
  id: true,
  lastUpdated: true,
});

export type InsertScheduledMatch = z.infer<typeof insertScheduledMatchSchema>;
export type ScheduledMatch = typeof scheduledMatches.$inferSelect;

export type InsertMatchResult = z.infer<typeof insertMatchResultSchema>;
export type MatchResult = typeof matchResults.$inferSelect;

export type InsertGroupConfiguration = z.infer<typeof insertGroupConfigurationSchema>;
export type GroupConfiguration = typeof groupConfiguration.$inferSelect;

export type InsertGroupStandings = z.infer<typeof insertGroupStandingsSchema>;
export type GroupStandings = typeof groupStandings.$inferSelect;

// Stage 2 Bracket - Plasa Stage 2 cu 10 echipe
export const stage2Bracket = pgTable("stage2_bracket", {
  id: serial("id").primaryKey(),
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score"), // null dacă meciul nu a fost jucat
  team2Score: integer("team2_score"), // null dacă meciul nu a fost jucat
  winnerName: text("winner_name"), // numele echipei câștigătoare
  bracketPosition: integer("bracket_position").notNull(), // poziția în plasă (1-5 pentru 5 meciuri)
  isPlayed: boolean("is_played").notNull().default(false),
  streamUrl: text("stream_url"), // link către stream/faceit
  technicalWin: boolean("technical_win").notNull().default(false),
  technicalWinner: text("technical_winner"),
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  matchDate: timestamp("match_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStage2BracketSchema = createInsertSchema(stage2Bracket).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  matchDate: true
});

export type InsertStage2Bracket = z.infer<typeof insertStage2BracketSchema>;
export type Stage2Bracket = typeof stage2Bracket.$inferSelect;

// Stage 3 Swiss - Swiss system pentru 16 echipe
export const stage3Swiss = pgTable("stage3_swiss", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  roundsWon: integer("rounds_won").notNull().default(0),
  roundsLost: integer("rounds_lost").notNull().default(0),
  status: text("status").notNull().default("active"), // active, qualified, eliminated
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stage 3 Swiss Matches - Meciurile din swiss system
export const stage3SwissMatches = pgTable("stage3_swiss_matches", {
  id: serial("id").primaryKey(),
  roundNumber: integer("round_number").notNull(), // runda 1-8
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score"), // null dacă meciul nu a fost jucat
  team2Score: integer("team2_score"), // null dacă meciul nu a fost jucat
  winnerName: text("winner_name"), // numele echipei câștigătoare
  isPlayed: boolean("is_played").notNull().default(false),
  streamUrl: text("stream_url"), // link către stream/faceit
  technicalWin: boolean("technical_win").notNull().default(false),
  technicalWinner: text("technical_winner"),
  matchType: text("match_type").notNull().default("BO1"), // BO1 sau BO3 pentru decisive matches
  isDecisive: boolean("is_decisive").notNull().default(false), // true pentru 2-2 vs 2-2 meciuri
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  matchDate: timestamp("match_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStage3SwissSchema = createInsertSchema(stage3Swiss).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStage3SwissMatchSchema = createInsertSchema(stage3SwissMatches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  matchDate: true,
}).extend({
  matchDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val || val === '' || val === null) return null;
    if (typeof val === 'string') {
      if (val.trim() === '') return null;
      return new Date(val);
    }
    return val;
  })
});

export type InsertStage3Swiss = z.infer<typeof insertStage3SwissSchema>;
export type Stage3Swiss = typeof stage3Swiss.$inferSelect;
export type InsertStage3SwissMatch = z.infer<typeof insertStage3SwissMatchSchema>;
export type Stage3SwissMatch = typeof stage3SwissMatches.$inferSelect;

// Stage 4 Playoff - Playoff bracket cu 8 echipe calificate din Stage 3
export const stage4Playoff = pgTable("stage4_playoff", {
  id: serial("id").primaryKey(),
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score"), // null dacă meciul nu a fost jucat
  team2Score: integer("team2_score"), // null dacă meciul nu a fost jucat
  winnerName: text("winner_name"), // numele echipei câștigătoare
  bracketRound: text("bracket_round").notNull(), // 'quarterfinals', 'semifinals', 'final', 'third_place'
  bracketPosition: integer("bracket_position").notNull(), // poziția în plasă
  isPlayed: boolean("is_played").notNull().default(false),
  streamUrl: text("stream_url"), // link către stream/faceit
  technicalWin: boolean("technical_win").notNull().default(false),
  technicalWinner: text("technical_winner"),
  matchType: text("match_type").notNull().default("BO3"), // BO3 pentru toate meciurile playoff
  playDate: text("play_date"), // "18.07.2025", "19.07.2025", "20.07.2025"
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  matchDate: timestamp("match_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStage4PlayoffSchema = createInsertSchema(stage4Playoff).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  bracketPosition: z.union([z.string(), z.number()]).transform(val => {
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }),
  matchDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val || val === '' || val === null) return null;
    if (typeof val === 'string') {
      if (val.trim() === '') return null;
      return new Date(val);
    }
    return val;
  })
});

export type InsertStage4Playoff = z.infer<typeof insertStage4PlayoffSchema>;
export type Stage4Playoff = typeof stage4Playoff.$inferSelect;

// Matches - Meciurile din turneu
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  team1Id: integer("team1_id").notNull(),
  team2Id: integer("team2_id").notNull(),
  team1Score: integer("team1_score").default(0),
  team2Score: integer("team2_score").default(0),
  status: text("status").notNull().default("scheduled"), // scheduled, live, completed
  datePlayed: timestamp("date_played"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas pentru inserare
export const insertTournamentGroupSchema = createInsertSchema(tournamentGroups).omit({
  id: true,
  createdAt: true,
});

export const insertGroupTeamSchema = createInsertSchema(groupTeams).omit({
  id: true,
  lastUpdated: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertTournamentGroup = z.infer<typeof insertTournamentGroupSchema>;
export type TournamentGroup = typeof tournamentGroups.$inferSelect;

export type InsertGroupTeam = z.infer<typeof insertGroupTeamSchema>;
export type GroupTeam = typeof groupTeams.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

// V0R4YN Counter - Counter pentru onori pe pagina secretă
export const var4unCounter = pgTable("var4un_counter", {
  id: serial("id").primaryKey(),
  totalLikes: integer("total_likes").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertV0r4ynCounterSchema = createInsertSchema(var4unCounter).omit({
  id: true,
  lastUpdated: true,
});

export type InsertV0r4ynCounter = z.infer<typeof insertV0r4ynCounterSchema>;
export type V0r4ynCounter = typeof var4unCounter.$inferSelect;

// Blog/News Articles - Sistem de blog pentru site
export const blogArticles = pgTable("blog_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly version of title
  excerpt: text("excerpt").notNull(), // Scurtă descriere/preview
  content: text("content").notNull(), // Conținutul complet al articolului (HTML)
  featuredImageUrl: text("featured_image_url"), // Imaginea principală
  featuredImageData: text("featured_image_data"), // Base64 encoded image data
  featuredImageAltText: text("featured_image_alt_text"), // Alt text pentru imaginea principală (obligatoriu)
  featuredImageCaption: text("featured_image_caption"), // Caption pentru imagine
  featuredImageLicense: text("featured_image_license"), // Licența/sursa imaginii
  tags: text("tags").default(""), // Tags separate prin virgulă
  primaryCategory: text("primary_category").default(""), // Categoria principală
  secondaryCategories: text("secondary_categories").default(""), // Categorii secundare (separate prin virgulă)
  status: text("status").notNull().default("draft"), // draft, scheduled, published, archived
  viewCount: integer("view_count").notNull().default(0), // Numărul de vizualizări
  publishedAt: timestamp("published_at"), // Data publicării (poate fi programată în viitor)
  scheduledAt: timestamp("scheduled_at"), // Data programată pentru publicare automată
  authorName: text("author_name").notNull().default("MPL Admin"), // Numele autorului
  authorEmail: text("author_email").default("admin@moldovapro.md"), // Email autor
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  previewToken: text("preview_token"), // Token pentru previzualizare înainte de publicare
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogArticleSchema = createInsertSchema(blogArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
}).extend({
  publishedAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val || val === '' || val === null) return null;
    if (typeof val === 'string') {
      if (val.trim() === '') return null;
      return new Date(val);
    }
    return val;
  }),
  scheduledAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val || val === '' || val === null) return null;
    if (typeof val === 'string') {
      if (val.trim() === '') return null;
      return new Date(val);
    }
    return val;
  }),
  featuredImageAltText: z.string().min(1, "Alt text este obligatoriu pentru imagine").optional()
});

export type InsertBlogArticle = z.infer<typeof insertBlogArticleSchema>;
export type BlogArticle = typeof blogArticles.$inferSelect;

// ===========================
// KINGSTON FURY x HYPERX SUPERCUP DATABASE TABLES
// Separate database structure for Kingston FURY x HyperX tournament
// ===========================

// Kingston FURY Teams
export const kingstonTeams = pgTable("kingston_teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  logoData: text("logo_data"), // Base64 encoded logo data
  tournament: text("tournament").notNull().default("kingston-hyperx-supercup"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  isDirectInvite: boolean("is_direct_invite").notNull().default(false), // true pentru echipele cu invitație directă
  isActive: boolean("is_active").notNull().default(true),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by"), // admin username care a făcut review
  rejectionReason: text("rejection_reason"), // motivul respingerii
  createdAt: timestamp("created_at").defaultNow(),
});

// Kingston FURY Team Members
export const kingstonTeamMembers = pgTable("kingston_team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  nickname: text("nickname").notNull(),
  faceitProfile: text("faceit_profile").notNull(),
  discordAccount: text("discord_account").notNull(),
  role: text("role").notNull().default("player"), // player, captain, coach
  position: text("position").notNull().default("main"), // main, reserve
  isActive: boolean("is_active").notNull().default(true),
});

// Kingston Tournament Groups
export const kingstonTournamentGroups = pgTable("kingston_tournament_groups", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  groupDisplayName: text("group_display_name").notNull(), // Group A, Group B, etc.
  tournament: text("tournament").notNull().default("kingston-hyperx-supercup"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Kingston Group Teams
export const kingstonGroupTeams = pgTable("kingston_group_teams", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  teamId: integer("team_id").notNull(),
  matchesPlayed: integer("matches_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  roundsWon: integer("rounds_won").notNull().default(0),
  roundsLost: integer("rounds_lost").notNull().default(0),
  roundDifference: integer("round_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  position: integer("position").notNull().default(1),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Kingston Scheduled Matches
export const kingstonScheduledMatches = pgTable("kingston_scheduled_matches", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, D
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  faceitUrl: text("faceit_url"), // Link-ul către room-ul Faceit
  matchDate: text("match_date").notNull(), // "11 septembrie", "12 septembrie", etc.
  matchTime: text("match_time").notNull(), // "19:00", "20:10", "21:20"
  dayOfWeek: text("day_of_week").notNull(), // "Joi", "Vineri", "Sâmbătă", "Duminică"
  stage: text("stage").notNull().default("groups"), // "groups", "playoff"
  matchFormat: text("match_format").notNull().default("BO1"), // "BO1", "BO3", "BO5"
  tournamentId: text("tournament_id").notNull().default("kingston-hyperx-supercup"),
  isPlayed: boolean("is_played").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Kingston Match Results
export const kingstonMatchResults = pgTable("kingston_match_results", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score").notNull(),
  team2Score: integer("team2_score").notNull(),
  winnerId: integer("winner_id"), // ID-ul echipei câștigătoare
  streamUrl: text("stream_url"), // Link-ul către stream
  technicalWin: boolean("technical_win").notNull().default(false), // Câștig tehnic
  technicalWinner: text("technical_winner"), // Numele echipei care a câștigat tehnic
  tournamentId: text("tournament_id").notNull().default("kingston-hyperx-supercup"),
  matchDate: timestamp("match_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Kingston Group Configuration - Now tracks individual team assignments
export const kingstonGroupConfiguration = pgTable("kingston_group_configuration", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, D (doar 4 grupe)
  displayName: text("display_name").notNull(), // Group A, Group B, etc.
  teamId: integer("team_id").notNull(), // ID-ul echipei
  teamName: text("team_name").notNull(), // Numele echipei
  tournamentId: text("tournament_id").notNull().default("kingston-hyperx-supercup"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Kingston Group Standings
export const kingstonGroupStandings = pgTable("kingston_group_standings", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  groupName: text("group_name").notNull(),
  matchesPlayed: integer("matches_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  roundsWon: integer("rounds_won").notNull().default(0),
  roundsLost: integer("rounds_lost").notNull().default(0),
  roundDifference: integer("round_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  position: integer("position").notNull().default(1),
  tournamentId: text("tournament_id").notNull().default("kingston-hyperx-supercup"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Kingston Stage 2 Swiss System (16 echipe din Stage 1)
export const kingstonStage2Swiss = pgTable("kingston_stage2_swiss", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  roundsWon: integer("rounds_won").notNull().default(0),
  roundsLost: integer("rounds_lost").notNull().default(0),
  status: text("status").notNull().default("active"), // active, qualified, eliminated
  tournamentId: text("tournament_id").notNull().default("kingston-hyperx-supercup"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Kingston Stage 2 Swiss Matches
export const kingstonStage2SwissMatches = pgTable("kingston_stage2_swiss_matches", {
  id: serial("id").primaryKey(),
  roundNumber: integer("round_number").notNull(), // runda 1-8
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score"), // null dacă meciul nu a fost jucat
  team2Score: integer("team2_score"), // null dacă meciul nu a fost jucat
  winnerName: text("winner_name"), // numele echipei câștigătoare
  isPlayed: boolean("is_played").notNull().default(false),
  streamUrl: text("stream_url"), // link către stream/faceit
  technicalWin: boolean("technical_win").notNull().default(false),
  technicalWinner: text("technical_winner"),
  matchType: text("match_type").notNull().default("BO1"), // BO1 pentru stage 2
  tournamentId: text("tournament_id").notNull().default("kingston-hyperx-supercup"),
  matchDate: timestamp("match_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Kingston Stage 3 Double Elimination Playoff (8 echipe calificate din Stage 2)
export const kingstonStage3Playoff = pgTable("kingston_stage3_playoff", {
  id: serial("id").primaryKey(),
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score"), // null dacă meciul nu a fost jucat
  team2Score: integer("team2_score"), // null dacă meciul nu a fost jucat
  winnerName: text("winner_name"), // numele echipei câștigătoare
  loserName: text("loser_name"), // numele echipei învingătoare (pentru lower bracket)
  bracketType: text("bracket_type").notNull(), // 'upper', 'lower'
  bracketRound: text("bracket_round").notNull(), // 'quarterfinals', 'semifinals', 'final', 'grand_final'
  bracketPosition: integer("bracket_position").notNull(), // poziția în plasă
  isPlayed: boolean("is_played").notNull().default(false),
  streamUrl: text("stream_url"), // link către stream/faceit
  technicalWin: boolean("technical_win").notNull().default(false),
  technicalWinner: text("technical_winner"),
  matchType: text("match_type").notNull().default("BO3"), // BO3 pentru playoff
  playDate: text("play_date"), // "27.09.2025", "28.09.2025"
  tournamentId: text("tournament_id").notNull().default("kingston-hyperx-supercup"),
  matchDate: timestamp("match_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas pentru Kingston tables
export const insertKingstonTeamSchema = createInsertSchema(kingstonTeams).omit({
  id: true,
  createdAt: true,
});

export const insertKingstonTeamMemberSchema = createInsertSchema(kingstonTeamMembers).omit({
  id: true,
});

export const insertKingstonScheduledMatchSchema = createInsertSchema(kingstonScheduledMatches).omit({
  id: true,
  createdAt: true,
});

export const insertKingstonMatchResultSchema = createInsertSchema(kingstonMatchResults).omit({
  id: true,
  createdAt: true,
  matchDate: true,
}).extend({
  team1Score: z.number().min(0),
  team2Score: z.number().min(0),
});

export const insertKingstonGroupConfigurationSchema = createInsertSchema(kingstonGroupConfiguration).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKingstonGroupStandingsSchema = createInsertSchema(kingstonGroupStandings).omit({
  id: true,
  lastUpdated: true,
});

export const insertKingstonStage2SwissSchema = createInsertSchema(kingstonStage2Swiss).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKingstonStage2SwissMatchSchema = createInsertSchema(kingstonStage2SwissMatches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  matchDate: true,
}).extend({
  matchDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val || val === '' || val === null) return null;
    if (typeof val === 'string') {
      if (val.trim() === '') return null;
      return new Date(val);
    }
    return val;
  })
});

export const insertKingstonStage3PlayoffSchema = createInsertSchema(kingstonStage3Playoff).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  bracketPosition: z.union([z.string(), z.number()]).transform(val => {
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }),
  matchDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val || val === '' || val === null) return null;
    if (typeof val === 'string') {
      if (val.trim() === '') return null;
      return new Date(val);
    }
    return val;
  })
});

// Export types pentru Kingston
export type InsertKingstonTeam = z.infer<typeof insertKingstonTeamSchema>;
export type KingstonTeam = typeof kingstonTeams.$inferSelect;

export type InsertKingstonTeamMember = z.infer<typeof insertKingstonTeamMemberSchema>;
export type KingstonTeamMember = typeof kingstonTeamMembers.$inferSelect;

export type InsertKingstonScheduledMatch = z.infer<typeof insertKingstonScheduledMatchSchema>;
export type KingstonScheduledMatch = typeof kingstonScheduledMatches.$inferSelect;

export type InsertKingstonMatchResult = z.infer<typeof insertKingstonMatchResultSchema>;
export type KingstonMatchResult = typeof kingstonMatchResults.$inferSelect;

export type InsertKingstonGroupConfiguration = z.infer<typeof insertKingstonGroupConfigurationSchema>;
export type KingstonGroupConfiguration = typeof kingstonGroupConfiguration.$inferSelect;

export type InsertKingstonGroupStandings = z.infer<typeof insertKingstonGroupStandingsSchema>;
export type KingstonGroupStandings = typeof kingstonGroupStandings.$inferSelect;

export type InsertKingstonStage2Swiss = z.infer<typeof insertKingstonStage2SwissSchema>;
export type KingstonStage2Swiss = typeof kingstonStage2Swiss.$inferSelect;

export type InsertKingstonStage2SwissMatch = z.infer<typeof insertKingstonStage2SwissMatchSchema>;
export type KingstonStage2SwissMatch = typeof kingstonStage2SwissMatches.$inferSelect;

export type InsertKingstonStage3Playoff = z.infer<typeof insertKingstonStage3PlayoffSchema>;
export type KingstonStage3Playoff = typeof kingstonStage3Playoff.$inferSelect;
