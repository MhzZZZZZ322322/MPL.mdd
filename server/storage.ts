import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  players, type Player, type InsertPlayer,
  contactSubmissions, type Contact, type InsertContact,
  faqs, type Faq, type InsertFaq,
  seoSettings, type SeoSettings, type InsertSeo,
  analyticsSettings, type AnalyticsSettings, type InsertAnalytics,
  teams, type Team, type InsertTeam,
  teamMembers, type TeamMember, type InsertTeamMember
} from "@shared/schema";
import { type CsServer, type InsertCsServer } from '@shared/schema-cs-servers';

// modify the interface with any CRUD methods
// you might need

import { SiteContent, InsertSiteContent } from '@shared/content-schema';
import * as fs from 'fs';
import * as path from 'path';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;
  
  // Player methods
  getPlayers(game?: string): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player>;
  deletePlayer(id: number): Promise<void>;
  
  // CS Server methods
  getCsServers(): Promise<CsServer[]>;
  getCsServer(id: number): Promise<CsServer | undefined>;
  updateCsServerLikes(id: number): Promise<CsServer>;
  updateCsServerStatus(id: number, status: boolean, players: number): Promise<CsServer>;
  
  // Contact methods
  createContactSubmission(submission: InsertContact): Promise<Contact>;
  getContactSubmissions(): Promise<Contact[]>;
  
  // FAQ methods
  getFaqs(): Promise<Faq[]>;
  getFaq(id: number): Promise<Faq | undefined>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: number, faq: Partial<InsertFaq>): Promise<Faq>;
  deleteFaq(id: number): Promise<void>;
  
  // Site Content methods
  getSiteContents(): Promise<SiteContent[]>;
  getSiteContentByKey(key: string): Promise<SiteContent | undefined>;
  updateSiteContent(id: number, content: Partial<InsertSiteContent>): Promise<SiteContent>;
  
  // SEO Settings methods
  getSeoSettings(): Promise<SeoSettings[]>;
  getSeoSettingByUrl(pageUrl: string): Promise<SeoSettings | undefined>;
  createSeoSetting(seo: InsertSeo): Promise<SeoSettings>;
  updateSeoSetting(id: number, seo: Partial<InsertSeo>): Promise<SeoSettings>;
  
  // Analytics Settings methods
  getAnalyticsSettings(): Promise<AnalyticsSettings | undefined>;
  updateAnalyticsSettings(id: number, settings: Partial<InsertAnalytics>): Promise<AnalyticsSettings>;
  createAnalyticsSettings(settings: InsertAnalytics): Promise<AnalyticsSettings>;
  
  // Team methods
  getTeams(tournament?: string): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(id: number): Promise<void>;
  
  // Team Member methods
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private players: Map<number, Player>;
  private contactSubmissions: Map<number, Contact>;
  private faqs: Map<number, Faq>;
  private siteContents: Map<number, SiteContent>;
  private seoSettings: Map<number, SeoSettings>;
  private analyticsSettings: Map<number, AnalyticsSettings>;
  private csServers: Map<number, CsServer>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  
  currentUserId: number;
  currentEventId: number;
  currentPlayerId: number;
  currentContactId: number;
  currentFaqId: number;
  currentSiteContentId: number;
  currentSeoId: number;
  currentAnalyticsId: number;
  currentCsServerId: number;
  currentTeamId: number;
  currentTeamMemberId: number;
  
  // CS Server methods
  async getCsServers(): Promise<CsServer[]> {
    return Array.from(this.csServers.values());
  }
  
  async getCsServer(id: number): Promise<CsServer | undefined> {
    return this.csServers.get(id);
  }
  
  async updateCsServerLikes(id: number): Promise<CsServer> {
    const server = this.csServers.get(id);
    
    if (!server) {
      throw new Error(`CS Server with id ${id} not found`);
    }
    
    const currentLikes = server.likes || 0;
    
    const updatedServer = {
      ...server,
      likes: currentLikes + 1
    };
    
    this.csServers.set(id, updatedServer);
    return updatedServer;
  }
  
  async updateCsServerStatus(id: number, status: boolean, players: number): Promise<CsServer> {
    const server = this.csServers.get(id);
    
    if (!server) {
      throw new Error(`CS Server with id ${id} not found`);
    }
    
    const updatedServer = {
      ...server,
      status,
      players
    };
    
    this.csServers.set(id, updatedServer);
    return updatedServer;
  }

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.players = new Map();
    this.contactSubmissions = new Map();
    this.faqs = new Map();
    this.siteContents = new Map();
    this.seoSettings = new Map();
    this.analyticsSettings = new Map();
    this.csServers = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentPlayerId = 1;
    this.currentContactId = 1;
    this.currentFaqId = 1;
    this.currentSiteContentId = 1;
    this.currentSeoId = 1;
    this.currentAnalyticsId = 1;
    this.currentCsServerId = 1;
    this.currentTeamId = 1;
    this.currentTeamMemberId = 1;
    
    // Load contact submissions from file first
    this.loadContactsFromFile();
    
    // Initialize with sample data
    this.initializeData();
  }

  // Team methods
  async getTeams(tournament?: string): Promise<Team[]> {
    const teams = Array.from(this.teams.values());
    if (tournament) {
      return teams.filter(team => team.tournament === tournament);
    }
    return teams;
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const team: Team = { 
      id,
      name: insertTeam.name,
      logoUrl: insertTeam.logoUrl,
      tournament: insertTeam.tournament || "hator-cs-league",
      isActive: insertTeam.isActive !== undefined ? insertTeam.isActive : true,
      createdAt: new Date()
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: number, updateData: Partial<InsertTeam>): Promise<Team> {
    const team = this.teams.get(id);
    if (!team) throw new Error(`Team with id ${id} not found`);
    
    const updatedTeam: Team = {
      ...team,
      ...updateData,
    };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<void> {
    this.teams.delete(id);
  }

  // Team Member methods
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(member => member.teamId === teamId);
  }

  async createTeamMember(insertMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.currentTeamMemberId++;
    const member: TeamMember = { 
      id,
      teamId: insertMember.teamId,
      nickname: insertMember.nickname,
      faceitProfile: insertMember.faceitProfile,
      role: insertMember.role || "player",
      position: insertMember.position || "main",
      isActive: insertMember.isActive !== undefined ? insertMember.isActive : true
    };
    this.teamMembers.set(id, member);
    return member;
  }

  async updateTeamMember(id: number, updateData: Partial<InsertTeamMember>): Promise<TeamMember> {
    const member = this.teamMembers.get(id);
    if (!member) throw new Error(`Team member with id ${id} not found`);
    
    const updatedMember: TeamMember = {
      ...member,
      ...updateData,
    };
    this.teamMembers.set(id, updatedMember);
    return updatedMember;
  }

  async deleteTeamMember(id: number): Promise<void> {
    this.teamMembers.delete(id);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    // Ensure imageUrl is always a string, setting a default if undefined
    const eventData = {
      ...insertEvent,
      imageUrl: insertEvent.imageUrl || "",
      location: insertEvent.location || "",
      platform: insertEvent.platform || "",
      teamSize: insertEvent.teamSize || "",
      prize: insertEvent.prize || "",
      status: insertEvent.status || "upcoming",
      registrationLink: insertEvent.registrationLink || null
    };
    const event: Event = { ...eventData, id };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, updateData: Partial<InsertEvent>): Promise<Event> {
    const existingEvent = this.events.get(id);
    
    if (!existingEvent) {
      throw new Error(`Event with id ${id} not found`);
    }
    
    const updatedEvent: Event = {
      ...existingEvent,
      ...updateData,
      // Ensure these fields remain strings if they're undefined in the update
      imageUrl: updateData.imageUrl !== undefined ? updateData.imageUrl : existingEvent.imageUrl,
      location: updateData.location !== undefined ? updateData.location : existingEvent.location,
      platform: updateData.platform !== undefined ? updateData.platform : existingEvent.platform,
      teamSize: updateData.teamSize !== undefined ? updateData.teamSize : existingEvent.teamSize,
      prize: updateData.prize !== undefined ? updateData.prize : existingEvent.prize,
      status: updateData.status !== undefined ? updateData.status : existingEvent.status,
      // Keep registrationLink as is if not updated
      registrationLink: updateData.registrationLink !== undefined ? updateData.registrationLink : existingEvent.registrationLink
    };
    
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<void> {
    if (!this.events.has(id)) {
      throw new Error(`Event with id ${id} not found`);
    }
    
    this.events.delete(id);
  }
  
  // Player methods
  async getPlayers(game?: string): Promise<Player[]> {
    const players = Array.from(this.players.values());
    if (game) {
      return players.filter(player => player.game === game);
    }
    return players;
  }
  
  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }
  
  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    // Ensure score is a number (not undefined)
    const score = insertPlayer.score !== undefined ? insertPlayer.score : 0;
    
    const player: Player = {
      id,
      nickname: insertPlayer.nickname,
      realName: insertPlayer.realName,
      team: insertPlayer.team,
      game: insertPlayer.game,
      score: score,
      country: insertPlayer.country || null,
      profileImage: insertPlayer.profileImage || "",
      socialLinks: insertPlayer.socialLinks || null,
      achievements: insertPlayer.achievements || null,
      stats: insertPlayer.stats || null
    };
    
    this.players.set(id, player);
    return player;
  }
  
  async updatePlayer(id: number, updateData: Partial<InsertPlayer>): Promise<Player> {
    const existingPlayer = this.players.get(id);
    
    if (!existingPlayer) {
      throw new Error(`Player with id ${id} not found`);
    }
    
    // Ensure we properly handle potential null/undefined values
    const updatedPlayer: Player = {
      ...existingPlayer,
      nickname: updateData.nickname ?? existingPlayer.nickname,
      realName: updateData.realName ?? existingPlayer.realName,
      team: updateData.team ?? existingPlayer.team,
      game: updateData.game ?? existingPlayer.game,
      score: updateData.score !== undefined ? updateData.score : existingPlayer.score,
      country: updateData.country ?? existingPlayer.country,
      profileImage: updateData.profileImage ?? existingPlayer.profileImage,
      socialLinks: updateData.socialLinks ?? existingPlayer.socialLinks,
      achievements: updateData.achievements ?? existingPlayer.achievements,
      stats: updateData.stats ?? existingPlayer.stats
    };
    
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }
  
  async deletePlayer(id: number): Promise<void> {
    if (!this.players.has(id)) {
      throw new Error(`Player with id ${id} not found`);
    }
    
    this.players.delete(id);
  }
  
  // Contact methods with persistence
  private contactsFilePath = path.join(process.cwd(), 'contact_data.json');

  // Load contact submissions from file
  private loadContactsFromFile(): void {
    try {
      if (fs.existsSync(this.contactsFilePath)) {
        const fileData = fs.readFileSync(this.contactsFilePath, 'utf8');
        const contactData = JSON.parse(fileData);
        
        // Clear current Map and populate with file data
        this.contactSubmissions.clear();
        for (const contact of contactData.contacts) {
          // Ensure createdAt is a Date object
          contact.createdAt = new Date(contact.createdAt);
          this.contactSubmissions.set(contact.id, contact);
        }
        
        // Set the current ID to be higher than any existing ID
        if (contactData.contacts.length > 0) {
          const maxId = Math.max(...contactData.contacts.map((c: Contact) => c.id));
          this.currentContactId = maxId + 1;
        }

        console.log(`Loaded ${this.contactSubmissions.size} contact submissions from file`);
      }
    } catch (error) {
      console.error('Error loading contact data from file:', error);
    }
  }

  // Save contact submissions to file
  private saveContactsToFile(): void {
    try {
      const contacts = Array.from(this.contactSubmissions.values());
      const data = { 
        contacts, 
        lastUpdated: new Date().toISOString() 
      };
      fs.writeFileSync(this.contactsFilePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Saved ${contacts.length} contact submissions to file`);
    } catch (error) {
      console.error('Error saving contact data to file:', error);
    }
  }

  async createContactSubmission(insertSubmission: InsertContact): Promise<Contact> {
    // Load existing contacts first to ensure we have the latest data
    this.loadContactsFromFile();
    
    const id = this.currentContactId++;
    const submission: Contact = { 
      ...insertSubmission, 
      id, 
      createdAt: new Date() 
    };
    this.contactSubmissions.set(id, submission);
    
    // Save to file for persistence
    this.saveContactsToFile();
    return submission;
  }
  
  async getContactSubmissions(): Promise<Contact[]> {
    // Load from file to get the latest data
    this.loadContactsFromFile();
    return Array.from(this.contactSubmissions.values());
  }
  
  // FAQ methods
  async getFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values()).sort((a, b) => a.order - b.order);
  }
  
  async getFaq(id: number): Promise<Faq | undefined> {
    return this.faqs.get(id);
  }
  
  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const id = this.currentFaqId++;
    const faq: Faq = { ...insertFaq, id };
    this.faqs.set(id, faq);
    return faq;
  }
  
  async updateFaq(id: number, updateData: Partial<InsertFaq>): Promise<Faq> {
    const existingFaq = this.faqs.get(id);
    
    if (!existingFaq) {
      throw new Error(`FAQ with id ${id} not found`);
    }
    
    const updatedFaq: Faq = {
      ...existingFaq,
      ...updateData
    };
    
    this.faqs.set(id, updatedFaq);
    return updatedFaq;
  }
  
  async deleteFaq(id: number): Promise<void> {
    if (!this.faqs.has(id)) {
      throw new Error(`FAQ with id ${id} not found`);
    }
    
    this.faqs.delete(id);
  }
  
  // Site Content methods
  async getSiteContents(): Promise<SiteContent[]> {
    return Array.from(this.siteContents.values());
  }
  
  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    return Array.from(this.siteContents.values()).find(
      (content) => content.contentKey === key
    );
  }
  
  async updateSiteContent(id: number, content: Partial<InsertSiteContent>): Promise<SiteContent> {
    const existingContent = this.siteContents.get(id);
    
    if (!existingContent) {
      throw new Error(`Site content with id ${id} not found`);
    }
    
    const updatedContent: SiteContent = {
      ...existingContent,
      ...content,
      updatedAt: new Date()
    };
    
    this.siteContents.set(id, updatedContent);
    return updatedContent;
  }
  
  // SEO Settings methods
  async getSeoSettings(): Promise<SeoSettings[]> {
    return Array.from(this.seoSettings.values());
  }
  
  async getSeoSettingByUrl(pageUrl: string): Promise<SeoSettings | undefined> {
    return Array.from(this.seoSettings.values()).find(
      (setting) => setting.pageUrl === pageUrl
    );
  }
  
  async createSeoSetting(seo: InsertSeo): Promise<SeoSettings> {
    const id = this.currentSeoId++;
    const seoSetting: SeoSettings = {
      id,
      title: seo.title,
      pageUrl: seo.pageUrl,
      metaDescription: seo.metaDescription,
      metaKeywords: seo.metaKeywords || null,
      metaRobots: seo.metaRobots || null,
      canonicalUrl: seo.canonicalUrl || null,
      structuredData: seo.structuredData || null,
      openGraph: seo.openGraph || null,
      twitterCard: seo.twitterCard || null,
      updatedAt: new Date()
    };
    this.seoSettings.set(id, seoSetting);
    return seoSetting;
  }
  
  async updateSeoSetting(id: number, seo: Partial<InsertSeo>): Promise<SeoSettings> {
    const existingSetting = this.seoSettings.get(id);
    
    if (!existingSetting) {
      throw new Error(`SEO setting with id ${id} not found`);
    }
    
    const updatedSetting: SeoSettings = {
      ...existingSetting,
      title: seo.title ?? existingSetting.title,
      pageUrl: seo.pageUrl ?? existingSetting.pageUrl,
      metaDescription: seo.metaDescription ?? existingSetting.metaDescription,
      metaKeywords: seo.metaKeywords ?? existingSetting.metaKeywords,
      metaRobots: seo.metaRobots ?? existingSetting.metaRobots,
      canonicalUrl: seo.canonicalUrl ?? existingSetting.canonicalUrl,
      structuredData: seo.structuredData ?? existingSetting.structuredData,
      openGraph: seo.openGraph ?? existingSetting.openGraph,
      twitterCard: seo.twitterCard ?? existingSetting.twitterCard,
      updatedAt: new Date()
    };
    
    this.seoSettings.set(id, updatedSetting);
    return updatedSetting;
  }
  
  // Analytics Settings methods
  async getAnalyticsSettings(): Promise<AnalyticsSettings | undefined> {
    const settings = Array.from(this.analyticsSettings.values());
    return settings.length > 0 ? settings[0] : undefined;
  }
  
  async updateAnalyticsSettings(id: number, settings: Partial<InsertAnalytics>): Promise<AnalyticsSettings> {
    const existingSettings = this.analyticsSettings.get(id);
    
    if (!existingSettings) {
      throw new Error(`Analytics settings with id ${id} not found`);
    }
    
    const updatedSettings: AnalyticsSettings = {
      ...existingSettings,
      googleTagManagerId: settings.googleTagManagerId ?? existingSettings.googleTagManagerId,
      googleAnalyticsId: settings.googleAnalyticsId ?? existingSettings.googleAnalyticsId,
      googleSearchConsoleVerification: settings.googleSearchConsoleVerification ?? existingSettings.googleSearchConsoleVerification,
      facebookPixelId: settings.facebookPixelId ?? existingSettings.facebookPixelId,
      microsoftClarityId: settings.microsoftClarityId ?? existingSettings.microsoftClarityId,
      robotsTxt: settings.robotsTxt ?? existingSettings.robotsTxt,
      sitemapXml: settings.sitemapXml ?? existingSettings.sitemapXml,
      customHeaderScripts: settings.customHeaderScripts ?? existingSettings.customHeaderScripts,
      siteIndexingEnabled: settings.siteIndexingEnabled ?? existingSettings.siteIndexingEnabled,
      updatedAt: new Date()
    };
    
    this.analyticsSettings.set(id, updatedSettings);
    return updatedSettings;
  }
  
  async createAnalyticsSettings(settings: InsertAnalytics): Promise<AnalyticsSettings> {
    const id = this.currentAnalyticsId++;
    const analyticsSetting: AnalyticsSettings = {
      id,
      googleTagManagerId: settings.googleTagManagerId || null,
      googleAnalyticsId: settings.googleAnalyticsId || null,
      googleSearchConsoleVerification: settings.googleSearchConsoleVerification || null,
      facebookPixelId: settings.facebookPixelId || null,
      microsoftClarityId: settings.microsoftClarityId || null,
      robotsTxt: settings.robotsTxt || null,
      sitemapXml: settings.sitemapXml || null,
      customHeaderScripts: settings.customHeaderScripts || null,
      siteIndexingEnabled: settings.siteIndexingEnabled || true,
      updatedAt: new Date()
    };
    this.analyticsSettings.set(id, analyticsSetting);
    return analyticsSetting;
  }
  
  private initializeData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$uAJwYP4R80jVKxZ.pT4hVuXz/iNZBkr7mXM3YFcQ5J9X8DX6HkODa", // "admin322" hashed
      role: "admin"
    });
    
    // Initialize CS Servers
    const retake1Server: CsServer = {
      id: this.currentCsServerId++,
      name: "Server CS2 Moldova",
      ip: "37.233.50.55",
      port: 27015,
      location: "Moldova",
      mode: "Retake 1",
      status: true, // Inițializează ca online conform informațiilor primite
      players: 0,
      maxPlayers: 16,
      likes: 0
    };
    this.csServers.set(retake1Server.id, retake1Server);
    
    const retake2Server: CsServer = {
      id: this.currentCsServerId++,
      name: "Server CS2 Moldova",
      ip: "37.233.50.55",
      port: 27016,
      location: "Moldova",
      mode: "Retake 2",
      status: true, // Inițializează ca online conform informațiilor primite
      players: 0,
      maxPlayers: 16,
      likes: 0
    };
    this.csServers.set(retake2Server.id, retake2Server);
    
    const deathmatchServer: CsServer = {
      id: this.currentCsServerId++,
      name: "Server CS2 Moldova",
      ip: "37.233.50.55",
      port: 27017,
      location: "Moldova",
      mode: "Deathmatch",
      status: true, // Inițializează ca online conform informațiilor primite
      players: 0,
      maxPlayers: 16,
      likes: 0
    };
    this.csServers.set(deathmatchServer.id, deathmatchServer);
    
    // Initialize site content
    // Hero section
    const heroContent: SiteContent = {
      id: this.currentSiteContentId++,
      contentKey: "hero",
      title: "Moldova Pro League",
      content: "Prima comunitate esports din Moldova",
      contentType: "hero",
      imageUrl: "/assets/MPL logo black-white.png",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.siteContents.set(heroContent.id, heroContent);
    
    // About section
    const aboutContent: SiteContent = {
      id: this.currentSiteContentId++,
      contentKey: "about",
      title: "Despre Noi",
      content: "Moldova Pro League (MPL) este prima comunitate de esports din Moldova, creată cu scopul de a dezvolta scena competitivă de jocuri video în țara noastră. Fondată în 2018 de către un grup de pasionați, MPL a crescut de la un mic turneu local la o organizație recunoscută la nivel național care găzduiește competiții pentru multiple jocuri precum CS:GO, League of Legends și FIFA.",
      contentType: "text",
      imageUrl: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.siteContents.set(aboutContent.id, aboutContent);
    
    // Mission section
    const missionContent: SiteContent = {
      id: this.currentSiteContentId++,
      contentKey: "mission",
      title: "Misiunea Noastră",
      content: "Ne dedicăm dezvoltării ecosistemului esports din Moldova prin organizarea de turnee competitive, crearea oportunităților pentru jucătorii talentați și construirea unei comunități puternice și incluzive.",
      contentType: "text",
      imageUrl: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.siteContents.set(missionContent.id, missionContent);
    
    // Events section title
    const eventsHeaderContent: SiteContent = {
      id: this.currentSiteContentId++,
      contentKey: "events-header",
      title: "Turnee & Evenimente",
      content: "Descoperă toate evenimentele organizate de MPL. De la competiții online la evenimente LAN, suntem dedicați să oferim cea mai bună experiență pentru comunitatea esports din Moldova.",
      contentType: "section-title",
      imageUrl: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.siteContents.set(eventsHeaderContent.id, eventsHeaderContent);
    
    // Rankings section title
    const rankingsHeaderContent: SiteContent = {
      id: this.currentSiteContentId++,
      contentKey: "rankings-header",
      title: "Clasamente Jucători",
      content: "Cei mai buni jucători din cadrul competițiilor noastre. Clasamentele sunt actualizate după fiecare turneu oficial MPL.",
      contentType: "section-title",
      imageUrl: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.siteContents.set(rankingsHeaderContent.id, rankingsHeaderContent);
    
    // Partners section title
    const partnersHeaderContent: SiteContent = {
      id: this.currentSiteContentId++,
      contentKey: "partners-header",
      title: "Partenerii Noștri",
      content: "Companiile care susțin dezvoltarea esports în Moldova alături de noi. Datorită acestor parteneriate putem oferi premii valoroase și organizăm turnee de calitate.",
      contentType: "section-title",
      imageUrl: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.siteContents.set(partnersHeaderContent.id, partnersHeaderContent);
    
    // FAQ section title
    const faqHeaderContent: SiteContent = {
      id: this.currentSiteContentId++,
      contentKey: "faq-header",
      title: "Întrebări Frecvente",
      content: "Găsește răspunsuri la cele mai comune întrebări despre MPL și evenimentele noastre.",
      contentType: "section-title",
      imageUrl: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.siteContents.set(faqHeaderContent.id, faqHeaderContent);
    
    // Contact section title
    const contactHeaderContent: SiteContent = {
      id: this.currentSiteContentId++,
      contentKey: "contact-header",
      title: "Contactează-ne",
      content: "Ai întrebări sau sugestii? Vrei să participi la turnee sau să devii partener? Completează formularul și te vom contacta în cel mai scurt timp.",
      contentType: "section-title",
      imageUrl: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.siteContents.set(contactHeaderContent.id, contactHeaderContent);

    // Teams in alphabetical order for better navigation
    const teamsData = [
      { name: "Auratix", logoUrl: "/team-logos/Auratix.png" },
      { name: "Barbosii", logoUrl: "/team-logos/Barbosii.png" },
      { name: "Bloody", logoUrl: "/team-logos/Bloody.png" },
      { name: "Bobb3rs", logoUrl: "/team-logos/Bobb3rs.png" },
      { name: "BPSP", logoUrl: "/team-logos/BPSP.png" },
      { name: "Brigada", logoUrl: "/team-logos/Brigada.png" },
      { name: "Brigada Meteor", logoUrl: "/team-logos/Brigada Meteor.png" },
      { name: "Cadian Team", logoUrl: "/team-logos/Cadian Team.png" },
      { name: "Ciocana Esports", logoUrl: "/team-logos/Ciocana Esports.png" },
      { name: "Ciocălău Team", logoUrl: "/team-logos/Ciocălău Team.png" },
      { name: "Cipok", logoUrl: "/team-logos/Cipok.png" },
      { name: "Coli", logoUrl: "/team-logos/Coli.png" },
      { name: "Crasat", logoUrl: "/team-logos/Crasat.png" },
      { name: "Cucumba", logoUrl: "/team-logos/Cucumba.png" },
      { name: "Flux Line", logoUrl: "/team-logos/Flux Line.png" },
      { name: "Golden Five", logoUrl: "/team-logos/Golden Five.png" },
      { name: "Into the Beach", logoUrl: "/team-logos/Into the Beach.png" },
      { name: "Japon", logoUrl: "/team-logos/Japon.png" },
      { name: "K9 Team", logoUrl: "/team-logos/K9 Team.png" },
      { name: "Killuminaty", logoUrl: "/team-logos/Killuminaty.png" },
      { name: "KostiujeniKlinik", logoUrl: "/team-logos/KostiujeniKlinik.png" },
      { name: "La Passion", logoUrl: "/team-logos/La Passion.png" },
      { name: "Lean Vision", logoUrl: "/team-logos/Lean Vision.png" },
      { name: "Legalize", logoUrl: "/team-logos/Legalize.png" },
      { name: "LitEnergy", logoUrl: "/team-logos/LitEnergy.png" },
      { name: "LYSQ", logoUrl: "/team-logos/LYSQ.png" },
      { name: "Muligambia", logoUrl: "/team-logos/Muligambia.png" },
      { name: "Neo Egoist League", logoUrl: "/team-logos/Neo Egoist League.png" },
      { name: "Onyx", logoUrl: "/team-logos/Onyx.png" },
      { name: "RCBVR", logoUrl: "/team-logos/RCBVR.png" },
      { name: "Robotaim", logoUrl: "/team-logos/Robotaim.png" },
      { name: "Rumina", logoUrl: "/team-logos/Rumina.png" },
      { name: "Shashlik", logoUrl: "/team-logos/Shashlik.png" },
      { name: "Trigger", logoUrl: "/team-logos/Tigger.png" },
      { name: "VeryGoodTeam", logoUrl: "/team-logos/VeryGoodTeam.png" },
      { name: "WenDeagle", logoUrl: "/team-logos/WenDeagle.png" },
      { name: "Wenzo", logoUrl: "/team-logos/Wenzo.png" },
      { name: "X-one", logoUrl: "/team-logos/X-one.png" },
      { name: "XPlosion", logoUrl: "/team-logos/XPloison.webp" }
    ];

    const createdTeams: Team[] = [];
    teamsData.forEach(teamData => {
      const team: Team = {
        id: this.currentTeamId++,
        name: teamData.name,
        logoUrl: teamData.logoUrl,
        tournament: "hator-cs-league",
        isActive: true,
        createdAt: new Date()
      };
      this.teams.set(team.id, team);
      createdTeams.push(team);
    });

    // Team members correctly mapped to alphabetical team order
    const finalTeamMembers = [
      // Team 1: Auratix (Tankkillerr captain)
      { teamId: 1, nickname: "Tankkillerr", role: "captain", position: "main" },
      { teamId: 1, nickname: "ash1kkk", role: "player", position: "main" },
      { teamId: 1, nickname: "TrownZy", role: "player", position: "main" },
      { teamId: 1, nickname: "4nbdfdfdf", role: "player", position: "main" },
      { teamId: 1, nickname: "l1nx", role: "player", position: "main" },
      { teamId: 1, nickname: "O2DED", role: "player", position: "reserve" },
      { teamId: 1, nickname: "Cobqkq", role: "player", position: "reserve" },
      
      // Team 2: Barbosii (btate captain)
      { teamId: 2, nickname: "btate", role: "captain", position: "main" },
      { teamId: 2, nickname: "Lewis169", role: "player", position: "main" },
      { teamId: 2, nickname: "cozmann", role: "player", position: "main" },
      { teamId: 2, nickname: "qwus0", role: "player", position: "main" },
      { teamId: 2, nickname: "Brf_Bogdan", role: "player", position: "main" },
      
      // Team 3: Bloody (MrPalste captain)
      { teamId: 3, nickname: "MrPalste", role: "captain", position: "main" },
      { teamId: 3, nickname: "MaL1", role: "player", position: "main" },
      { teamId: 3, nickname: "nkwr", role: "player", position: "main" },
      { teamId: 3, nickname: "sased2096", role: "player", position: "main" },
      { teamId: 3, nickname: "Nonstoping", role: "player", position: "main" },
      { teamId: 3, nickname: "dan1k", role: "player", position: "reserve" },
      { teamId: 3, nickname: "wanderer", role: "player", position: "reserve" },
      
      // Team 4: Bobb3rs (ZanT3X captain)
      { teamId: 4, nickname: "ZanT3X", role: "captain", position: "main" },
      { teamId: 4, nickname: "ezforleoha", role: "player", position: "main" },
      { teamId: 4, nickname: "Z1L4K", role: "player", position: "main" },
      { teamId: 4, nickname: "Fyralyx", role: "player", position: "main" },
      { teamId: 4, nickname: "Yakuzaishi", role: "player", position: "main" },
      
      // Team 5: BPSP (M1kee captain)
      { teamId: 5, nickname: "M1kee", role: "captain", position: "main" },
      { teamId: 5, nickname: "strky_1", role: "player", position: "main" },
      { teamId: 5, nickname: "-formet-", role: "player", position: "main" },
      { teamId: 5, nickname: "KureaCYA", role: "player", position: "main" },
      { teamId: 5, nickname: "Bandajel", role: "player", position: "main" },
      
      // Team 6: Brigada (TonyBossuB captain)
      { teamId: 6, nickname: "TonyBossuB", role: "captain", position: "main" },
      { teamId: 6, nickname: "Adm1ralExE", role: "player", position: "main" },
      { teamId: 6, nickname: "Kolea777", role: "player", position: "main" },
      { teamId: 6, nickname: "dariusbosu1", role: "player", position: "main" },
      { teamId: 6, nickname: "StasBosu", role: "player", position: "main" },
      
      // Team 7: Brigada Meteor (yeahmen707 captain)
      { teamId: 7, nickname: "yeahmen707", role: "captain", position: "main" },
      { teamId: 7, nickname: "cacioc1", role: "player", position: "main" },
      { teamId: 7, nickname: "RoyalD1", role: "player", position: "main" },
      { teamId: 7, nickname: "_4AM", role: "player", position: "main" },
      { teamId: 7, nickname: "neirhe", role: "player", position: "main" },
      { teamId: 7, nickname: "Smali_", role: "player", position: "reserve" },
      
      // Team 8: Cadian Team (cadiaN captain)
      { teamId: 8, nickname: "cadiaN", role: "captain", position: "main" },
      { teamId: 8, nickname: "5h1zzu", role: "player", position: "main" },
      { teamId: 8, nickname: "machoman", role: "player", position: "main" },
      { teamId: 8, nickname: "kiyyyo-_-", role: "player", position: "main" },
      { teamId: 8, nickname: "Enkiee", role: "player", position: "main" },
      
      // Team 9: Ciocana Esports (CoMMaNDeR_MD captain)
      { teamId: 9, nickname: "CoMMaNDeR_MD", role: "captain", position: "main" },
      { teamId: 9, nickname: "f1ke_soft", role: "player", position: "main" },
      { teamId: 9, nickname: "FraGGvesta9", role: "player", position: "main" },
      { teamId: 9, nickname: "HamsteR_TR", role: "player", position: "main" },
      { teamId: 9, nickname: "tr1cketw", role: "player", position: "main" },
      { teamId: 9, nickname: "xxx13", role: "player", position: "main" },
      { teamId: 9, nickname: "Shutting2", role: "player", position: "reserve" },
      
      // Team 10: Ciocălău Team (xen0 captain)
      { teamId: 10, nickname: "xen0", role: "captain", position: "main" },
      { teamId: 10, nickname: "Esantorix", role: "player", position: "main" },
      { teamId: 10, nickname: "kryz3w", role: "player", position: "main" },
      { teamId: 10, nickname: "SF-eMakzie", role: "player", position: "main" },
      { teamId: 10, nickname: "Bama_Booy", role: "player", position: "main" },
      { teamId: 10, nickname: "Kirspiden", role: "player", position: "reserve" },
      { teamId: 10, nickname: "Headcleaner", role: "player", position: "reserve" },
      
      // Team 11: Cipok (KROUL1YSFORD captain)
      { teamId: 11, nickname: "KROUL1YSFORD", role: "captain", position: "main" },
      { teamId: 11, nickname: "CHORS1", role: "player", position: "main" },
      { teamId: 11, nickname: "Latinskii", role: "player", position: "main" },
      { teamId: 11, nickname: "Lolipop3121", role: "player", position: "main" },
      { teamId: 11, nickname: "absent12", role: "player", position: "main" },
      { teamId: 11, nickname: "Pinz4ru", role: "player", position: "reserve" },
      
      // Team 12: Coli (denisZ1x captain)
      { teamId: 12, nickname: "denisZ1x", role: "captain", position: "main" },
      { teamId: 12, nickname: "maskkout", role: "player", position: "main" },
      { teamId: 12, nickname: "kideeFrumu", role: "player", position: "main" },
      { teamId: 12, nickname: "Jesus5521", role: "player", position: "main" },
      { teamId: 12, nickname: "Biffaw", role: "player", position: "main" },
      { teamId: 12, nickname: "M7nraifu", role: "player", position: "main" },
      { teamId: 12, nickname: "predator_md", role: "player", position: "main" },
      
      // Team 13: Crasat (Feniyxad captain)
      { teamId: 13, nickname: "Feniyxad", role: "captain", position: "main" },
      { teamId: 13, nickname: "px_csgo1", role: "player", position: "main" },
      { teamId: 13, nickname: "By_Vega", role: "player", position: "main" },
      { teamId: 13, nickname: "czxxy", role: "player", position: "main" },
      { teamId: 13, nickname: "Stan145", role: "player", position: "main" },
      
      // Team 14: Cucumba (v6d5 captain)
      { teamId: 14, nickname: "v6d5", role: "captain", position: "main" },
      { teamId: 14, nickname: "KaTaRiZ1337", role: "player", position: "main" },
      { teamId: 14, nickname: "xBogdy", role: "player", position: "main" },
      { teamId: 14, nickname: "7140", role: "player", position: "main" },
      { teamId: 14, nickname: "HELLBOYzx", role: "player", position: "main" },
      { teamId: 14, nickname: "ManoleBanan", role: "player", position: "reserve" },
      
      // Team 15: Flux Line (hide74- captain)
      { teamId: 15, nickname: "hide74-", role: "captain", position: "main" },
      { teamId: 15, nickname: "rheinTod", role: "player", position: "main" },
      { teamId: 15, nickname: "wizzhaha", role: "player", position: "main" },
      { teamId: 15, nickname: "-GuTu", role: "player", position: "main" },
      { teamId: 15, nickname: "SayMons_", role: "player", position: "main" },
      { teamId: 15, nickname: "17theooo", role: "player", position: "reserve" },
      { teamId: 15, nickname: "y0kuza", role: "player", position: "reserve" },
      
      // Team 16: Golden Five (mooghiwara captain)
      { teamId: 16, nickname: "mooghiwara", role: "captain", position: "main" },
      { teamId: 16, nickname: "Klasse91", role: "player", position: "main" },
      { teamId: 16, nickname: "maTim", role: "player", position: "main" },
      { teamId: 16, nickname: "RONI1337", role: "player", position: "main" },
      { teamId: 16, nickname: "IOneTapI", role: "player", position: "main" },
      
      // Team 17: Into the Beach (chazya captain)
      { teamId: 17, nickname: "chazya", role: "captain", position: "main" },
      { teamId: 17, nickname: "SWAGTEAR", role: "player", position: "main" },
      { teamId: 17, nickname: "DediDR", role: "player", position: "main" },
      { teamId: 17, nickname: "Lavandar", role: "player", position: "main" },
      { teamId: 17, nickname: "madl9", role: "player", position: "main" },
      
      // Team 18: Japon (BoreaTaga captain)
      { teamId: 18, nickname: "BoreaTaga", role: "captain", position: "main" },
      { teamId: 18, nickname: "Yntelect", role: "player", position: "main" },
      { teamId: 18, nickname: "CCLey_", role: "player", position: "main" },
      { teamId: 18, nickname: "Krab1k__", role: "player", position: "main" },
      { teamId: 18, nickname: "Santiik1", role: "player", position: "main" },
      { teamId: 18, nickname: "MxGamer124", role: "player", position: "reserve" },
      { teamId: 18, nickname: "danyazabiv", role: "player", position: "reserve" },
      
      // Team 19: K9 Team (-farra captain)
      { teamId: 19, nickname: "-farra", role: "captain", position: "main" },
      { teamId: 19, nickname: "-DeYn-", role: "player", position: "main" },
      { teamId: 19, nickname: "s0R1DE", role: "player", position: "main" },
      { teamId: 19, nickname: "deman--", role: "player", position: "main" },
      { teamId: 19, nickname: "ankqzzz", role: "player", position: "main" },
      { teamId: 19, nickname: "AngryTolean", role: "player", position: "reserve" },
      { teamId: 19, nickname: "iNsanityMD", role: "player", position: "reserve" },
      { teamId: 19, nickname: "-starsmd", role: "player", position: "reserve" },
      
      // Team 20: Killuminaty (aC_97 captain)
      { teamId: 20, nickname: "aC_97", role: "captain", position: "main" },
      { teamId: 20, nickname: "Raw0-", role: "player", position: "main" },
      { teamId: 20, nickname: "-pROSECCO", role: "player", position: "main" },
      { teamId: 20, nickname: "LiSun", role: "player", position: "main" },
      { teamId: 20, nickname: "wolfistomas", role: "player", position: "main" },
      { teamId: 20, nickname: "pavlovvv", role: "player", position: "reserve" },
      
      // Team 21: KostiujeniKlinik (PhXGON captain)
      { teamId: 21, nickname: "PhXGON", role: "captain", position: "main" },
      { teamId: 21, nickname: "Ovitaaa1", role: "player", position: "main" },
      { teamId: 21, nickname: "Pavar0tnik", role: "player", position: "main" },
      { teamId: 21, nickname: "sky4real", role: "player", position: "main" },
      { teamId: 21, nickname: "Sobranie-777", role: "player", position: "main" },
      { teamId: 21, nickname: "QuatrRo_", role: "player", position: "reserve" },
      
      // Team 22: La Passion (NuBekk captain)
      { teamId: 22, nickname: "NuBekk", role: "captain", position: "main" },
      { teamId: 22, nickname: "Sok1able_", role: "player", position: "main" },
      { teamId: 22, nickname: "kulya777", role: "player", position: "main" },
      { teamId: 22, nickname: "OxpLoyTaBa", role: "player", position: "main" },
      { teamId: 22, nickname: "chifuleacc", role: "player", position: "main" },
      { teamId: 22, nickname: "nocliippp", role: "player", position: "reserve" },
      { teamId: 22, nickname: "uukassen", role: "player", position: "reserve" },
      
      // Team 23: Lean Vision (M1ndfvck captain)
      { teamId: 23, nickname: "M1ndfvck", role: "captain", position: "main" },
      { teamId: 23, nickname: "ltmzzz", role: "player", position: "main" },
      { teamId: 23, nickname: "riks99", role: "player", position: "main" },
      { teamId: 23, nickname: "ayuk1n", role: "player", position: "main" },
      { teamId: 23, nickname: "Chukunda", role: "player", position: "main" },
      
      // Team 24: Legalize (sn1deRR captain)
      { teamId: 24, nickname: "sn1deRR", role: "captain", position: "main" },
      { teamId: 24, nickname: "wh1te353", role: "player", position: "main" },
      { teamId: 24, nickname: "gerda", role: "player", position: "main" },
      { teamId: 24, nickname: "-tsoykyrit", role: "player", position: "main" },
      { teamId: 24, nickname: "lowtaber69", role: "player", position: "main" },
      { teamId: 24, nickname: "8fable8", role: "player", position: "reserve" },
      
      // Team 25: LitEnergy (denzy captain)
      { teamId: 25, nickname: "denzy", role: "captain", position: "main" },
      { teamId: 25, nickname: "hahanz0-", role: "player", position: "main" },
      { teamId: 25, nickname: "potapke", role: "player", position: "main" },
      { teamId: 25, nickname: "-pickup", role: "player", position: "main" },
      { teamId: 25, nickname: "Bagheera-_", role: "player", position: "main" },
      { teamId: 25, nickname: "_avi-", role: "player", position: "reserve" },
      
      // Team 26: LYSQ (1lazcc captain)
      { teamId: 26, nickname: "1lazcc", role: "captain", position: "main" },
      { teamId: 26, nickname: "F1nalYST", role: "player", position: "main" },
      { teamId: 26, nickname: "N3KK1T", role: "player", position: "main" },
      { teamId: 26, nickname: "sweeth3at_", role: "player", position: "main" },
      { teamId: 26, nickname: "Daveees", role: "player", position: "main" },
      { teamId: 26, nickname: "sebi11wx", role: "player", position: "reserve" },
      
      // Team 27: Muligambia (Fr0yMan captain)
      { teamId: 27, nickname: "Fr0yMan", role: "captain", position: "main" },
      { teamId: 27, nickname: "A1ken0_0", role: "player", position: "main" },
      { teamId: 27, nickname: "Miyazaki", role: "player", position: "main" },
      { teamId: 27, nickname: "-1foXy1-", role: "player", position: "main" },
      { teamId: 27, nickname: "l3xerrr", role: "player", position: "main" },
      { teamId: 27, nickname: "Kraken404", role: "player", position: "reserve" },
      { teamId: 27, nickname: "trywz", role: "player", position: "reserve" },
      
      // Team 28: Neo Egoist League (itzHYPEER captain)
      { teamId: 28, nickname: "itzHYPEER", role: "captain", position: "main" },
      { teamId: 28, nickname: "Zev1x_x", role: "player", position: "main" },
      { teamId: 28, nickname: "Tr1zizxc", role: "player", position: "main" },
      { teamId: 28, nickname: "keanet-", role: "player", position: "main" },
      { teamId: 28, nickname: "SqTrueOmega", role: "player", position: "main" },
      
      // Team 29: Onyx (Rexodd_ captain)
      { teamId: 29, nickname: "Rexodd_", role: "captain", position: "main" },
      { teamId: 29, nickname: "vovchikk", role: "player", position: "main" },
      { teamId: 29, nickname: "Timurssz", role: "player", position: "main" },
      { teamId: 29, nickname: "bimka13", role: "player", position: "main" },
      { teamId: 29, nickname: "mauham", role: "player", position: "main" },
      { teamId: 29, nickname: "skip74", role: "player", position: "main" },
      { teamId: 29, nickname: "ZenoK1ng", role: "player", position: "reserve" },
      { teamId: 29, nickname: "Rexodd", role: "player", position: "reserve" },
      
      // Team 30: RCBVR (DumaSula captain)
      { teamId: 30, nickname: "DumaSula", role: "captain", position: "main" },
      { teamId: 30, nickname: "UchihaRoby", role: "player", position: "main" },
      { teamId: 30, nickname: "My11", role: "player", position: "main" },
      { teamId: 30, nickname: "T0r1no", role: "player", position: "main" },
      { teamId: 30, nickname: "chocomilk17", role: "player", position: "main" },
      { teamId: 30, nickname: "lelavaida", role: "player", position: "reserve" },
      
      // Team 31: Robotaim (-n1ghtmarr captain)
      { teamId: 31, nickname: "-n1ghtmarr", role: "captain", position: "main" },
      { teamId: 31, nickname: "mori66", role: "player", position: "main" },
      { teamId: 31, nickname: "HappyRaider", role: "player", position: "main" },
      { teamId: 31, nickname: "v1snea", role: "player", position: "main" },
      { teamId: 31, nickname: "Clu4er4", role: "player", position: "main" },
      
      // Team 32: Rumina (Huh52 captain)
      { teamId: 32, nickname: "Huh52", role: "captain", position: "main" },
      { teamId: 32, nickname: "Mamin_Cvetok", role: "player", position: "main" },
      { teamId: 32, nickname: "illinir", role: "player", position: "main" },
      { teamId: 32, nickname: "Pochita52", role: "player", position: "main" },
      { teamId: 32, nickname: "Kasador_52", role: "player", position: "main" },
      
      // Team 33: Shashlik (BogdanR23 captain)
      { teamId: 33, nickname: "BogdanR23", role: "captain", position: "main" },
      { teamId: 33, nickname: "Vaneasous", role: "player", position: "main" },
      { teamId: 33, nickname: "sashasous", role: "player", position: "main" },
      { teamId: 33, nickname: "999PingOnCs", role: "player", position: "main" },
      { teamId: 33, nickname: "spexFV", role: "player", position: "main" },
      
      // Team 34: Trigger (patan1 captain)
      { teamId: 34, nickname: "patan1", role: "captain", position: "main" },
      { teamId: 34, nickname: "-D4Nt3Z", role: "player", position: "main" },
      { teamId: 34, nickname: "NoobOnRadar", role: "player", position: "main" },
      { teamId: 34, nickname: "TheCerebro", role: "player", position: "main" },
      { teamId: 34, nickname: "MaxxBT", role: "player", position: "main" },
      { teamId: 34, nickname: "danchicago", role: "player", position: "reserve" },
      { teamId: 34, nickname: "buGaa1", role: "player", position: "reserve" },
      
      // Team 35: VeryGoodTeam (DrMadness captain)
      { teamId: 35, nickname: "DrMadness", role: "captain", position: "main" },
      { teamId: 35, nickname: "hex4l0ve", role: "player", position: "main" },
      { teamId: 35, nickname: "Bronxxxxx", role: "player", position: "main" },
      { teamId: 35, nickname: "ENKOhUN773R_", role: "player", position: "main" },
      { teamId: 35, nickname: "dnx666", role: "player", position: "main" },
      { teamId: 35, nickname: "Flash", role: "player", position: "reserve" },
      { teamId: 35, nickname: "YTProst", role: "player", position: "reserve" },
      { teamId: 35, nickname: "gabriel_03", role: "player", position: "reserve" },
      { teamId: 35, nickname: "Mitowily", role: "player", position: "reserve" },
      
      // Team 36: WenDeagle (Alohadron captain)
      { teamId: 36, nickname: "Alohadron", role: "captain", position: "main" },
      { teamId: 36, nickname: "Super_Bobik", role: "player", position: "main" },
      { teamId: 36, nickname: "WenDigol", role: "player", position: "main" },
      { teamId: 36, nickname: "SL3SH_12", role: "player", position: "main" },
      { teamId: 36, nickname: "1liusa", role: "player", position: "main" },
      { teamId: 36, nickname: "MMSGMamaliga", role: "player", position: "reserve" },
      
      // Team 37: Wenzo (-ExTaZzy- captain)
      { teamId: 37, nickname: "-ExTaZzy-", role: "captain", position: "main" },
      { teamId: 37, nickname: "Twizzy_rs", role: "player", position: "main" },
      { teamId: 37, nickname: "sucdeananas", role: "player", position: "main" },
      { teamId: 37, nickname: "MDTryharder", role: "player", position: "main" },
      { teamId: 37, nickname: "-f0rz3-", role: "player", position: "main" },
      { teamId: 37, nickname: "-Dekj", role: "player", position: "reserve" },
      { teamId: 37, nickname: "P1ko_x", role: "player", position: "reserve" },
      
      // Team 38: X-one (-OPIUMVXQ- captain)
      { teamId: 38, nickname: "-OPIUMVXQ-", role: "captain", position: "main" },
      { teamId: 38, nickname: "yar1tyss", role: "player", position: "main" },
      { teamId: 38, nickname: "g0speLbtw", role: "player", position: "main" },
      { teamId: 38, nickname: "SolevoI_Voi", role: "player", position: "main" },
      { teamId: 38, nickname: "tronick999", role: "player", position: "main" },
      
      // Team 39: XPlosion (Duke_0 captain)
      { teamId: 39, nickname: "Duke_0", role: "captain", position: "main" },
      { teamId: 39, nickname: "Gr1MM-", role: "player", position: "main" },
      { teamId: 39, nickname: "BENGOSO", role: "player", position: "main" },
      { teamId: 39, nickname: "RayeN-", role: "player", position: "main" },
      { teamId: 39, nickname: "Gherman-", role: "player", position: "main" },
      { teamId: 39, nickname: "P1oNeR-_-", role: "player", position: "reserve" },
      { teamId: 39, nickname: "acierdnay", role: "player", position: "reserve" }
    ];

    finalTeamMembers.forEach(member => {
      const teamMember: TeamMember = {
        id: this.currentTeamMemberId++,
        teamId: member.teamId,
        nickname: member.nickname,
        faceitProfile: `https://www.faceit.com/en/players/${member.nickname}`,
        role: member.role,
        position: member.position,
        isActive: true
      };
      this.teamMembers.set(teamMember.id, teamMember);
    });


    
    // Add events
    this.createEvent({
      title: "HATOR CS2 LEAGUE MOLDOVA - SEZONUL 1",
      description: "Cel mai tare turneu online de Counter-Strike 2 din Moldova și România, organizat de MPL în parteneriat cu HATOR și susținut de Darwin.",
      date: "Mai - Iunie 2025",
      platform: "FACEIT",
      teamSize: "5v5 Clasic",
      prize: "5x Gaming Chair HATOR Arc 2 XL + 5x Mouse HATOR Quasar 3 ULTRA 8K + 5x Căști HATOR Hypergang 2 USB 7.1 + 3x Mousepad HATOR Tonn eSport 3XL MONTE",
      status: "În curând",
      imageUrl: "https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg",
      location: "Online",
      registrationLink: "https://discord.gg/moldovaproleague"
    });
    
    this.createEvent({
      title: "CS:GO 5v5 Tournament",
      description: "Turneu competitiv de Counter-Strike: Global Offensive cu premii și streaming live.",
      date: "12 Aug 2023",
      platform: "PC",
      teamSize: "5v5",
      prize: "5000 MDL",
      status: "Încheiat",
      imageUrl: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createEvent({
      title: "LoL Championship",
      description: "Campionat de League of Legends cu echipe din toată Moldova. Înscrie-te acum!",
      date: "20 Aug 2023",
      platform: "PC",
      teamSize: "5v5",
      prize: "7500 MDL",
      status: "Încheiat",
      imageUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createEvent({
      title: "FIFA 23 Cup",
      description: "Turneu 1v1 de FIFA 23 pentru toți pasionații de fotbal virtual din Moldova.",
      date: "5 Sep 2023",
      platform: "Console",
      teamSize: "1v1",
      prize: "3000 MDL",
      status: "Încheiat",
      imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    });
    
    // Add players for CS:GO
    this.createPlayer({
      nickname: "AlexGG",
      realName: "Alexandru G.",
      team: "Valhalla",
      game: "CS:GO",
      score: 1458,
      country: "Moldova",
      profileImage: "https://robohash.org/AlexGG?set=set4&bgset=bg1",
      socialLinks: "https://twitter.com/alexgg, https://instagram.com/alexgg",
      achievements: "Campion MPL Winter Cup 2023, Locul 2 la Regional Masters",
      stats: "KD: 1.45, HS%: 68%, ADR: 88.5"
    });
    
    this.createPlayer({
      nickname: "ProdigyMD",
      realName: "Victor M.",
      team: "Nexus",
      game: "CS:GO",
      score: 1395,
      country: "Moldova",
      profileImage: "https://robohash.org/ProdigyMD?set=set4&bgset=bg2",
      socialLinks: "https://twitter.com/prodigymd",
      achievements: "Locul 3 MPL Summer Cup 2023",
      stats: "KD: 1.28, HS%: 61%, ADR: 80.2"
    });
    
    this.createPlayer({
      nickname: "MDSniper",
      realName: "Ion C.",
      team: "Phoenix",
      game: "CS:GO",
      score: 1287,
      country: "Moldova",
      profileImage: "https://robohash.org/MDSniper?set=set4&bgset=bg1",
      socialLinks: "https://instagram.com/mdsniper",
      achievements: "MVP MPL Qualifier 2023",
      stats: "KD: 1.15, HS%: 58%, ADR: 75.0"
    });
    
    // Add players for LoL
    this.createPlayer({
      nickname: "MoldLegend",
      realName: "Andrei T.",
      team: "Dragons",
      game: "LoL",
      score: 2145,
      country: "Moldova",
      profileImage: "https://robohash.org/MoldLegend?set=set4&bgset=bg2",
      socialLinks: "https://twitter.com/moldlegend",
      achievements: "Campion MPL LoL Cup 2023",
      stats: "KDA: 4.2, CS/min: 8.5, Vision Score: 35+"
    });
    
    this.createPlayer({
      nickname: "KingMidMD",
      realName: "Dorin R.",
      team: "Titans",
      game: "LoL",
      score: 1983,
      country: "Moldova",
      profileImage: "https://robohash.org/KingMidMD?set=set4&bgset=bg1",
      socialLinks: "https://instagram.com/kingmidmd",
      achievements: "All-Stars MPL 2023",
      stats: "KDA: 3.8, CS/min: 8.2, Vision Score: 32"
    });
    
    this.createPlayer({
      nickname: "SupportGod",
      realName: "Maria S.",
      team: "Dragons",
      game: "LoL",
      score: 1865,
      country: "Moldova",
      profileImage: "https://robohash.org/SupportGod?set=set4&bgset=bg2",
      socialLinks: "https://twitter.com/supportgod",
      achievements: "Best Support MPL 2023",
      stats: "KDA: 5.1, Vision Score: 42, Survival rate: 75%"
    });
    
    // Add FAQs
    this.createFaq({
      question: "Cum mă pot alătura MPL?",
      answer: "Pentru a te alătura comunității MPL, poți să ne contactezi prin formular sau să te alături serverului nostru de Discord. Pentru a participa la turnee, trebuie să te înregistrezi pe platforma noastră și să urmărești anunțurile despre evenimentele viitoare.",
      order: 1
    });
    
    this.createFaq({
      question: "Ce jocuri sunt incluse în turnee?",
      answer: "În prezent, organizăm turnee pentru CS:GO, League of Legends, FIFA, Dota 2 și Valorant. Planificăm să extindem în viitor cu mai multe jocuri în funcție de interesul comunității. Dacă ai sugestii pentru alte jocuri, ne poți contacta!",
      order: 2
    });
    
    this.createFaq({
      question: "Cum se desfășoară turneele?",
      answer: "Turneele noastre se desfășoară atât online cât și offline, în funcție de tipul evenimentului. Folosim platforme specializate pentru organizare și avem arbitri dedicați. Fiecare turneu are reguli specifice care sunt anunțate înainte de înscriere. Premiile sunt distribuite la finalul competițiilor.",
      order: 3
    });
    
    this.createFaq({
      question: "Este nevoie de echipament special?",
      answer: "Pentru turneele online, ai nevoie doar de echipamentul tău personal și o conexiune stabilă la internet. Pentru evenimentele offline, noi asigurăm infrastructura necesară. Jucătorii pot aduce propriile periferice (tastatură, mouse, căști) dacă doresc.",
      order: 4
    });
    
    this.createFaq({
      question: "Cum pot deveni sponsor?",
      answer: "Pentru parteneriate și sponsorizări, te rugăm să ne contactezi direct prin formularul de contact sau la adresa de email proleaguemoldova@gmail.com. Echipa noastră îți va răspunde în cel mai scurt timp cu detalii despre pachetele de sponsorizare disponibile.",
      order: 5
    });
  }
}

export const storage = new MemStorage();
