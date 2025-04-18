import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  players, type Player, type InsertPlayer,
  contactSubmissions, type Contact, type InsertContact,
  faqs, type Faq, type InsertFaq,
  seoSettings, type SeoSettings, type InsertSeo,
  analyticsSettings, type AnalyticsSettings, type InsertAnalytics
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

import { SiteContent, InsertSiteContent } from '@shared/content-schema';

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
  
  currentUserId: number;
  currentEventId: number;
  currentPlayerId: number;
  currentContactId: number;
  currentFaqId: number;
  currentSiteContentId: number;
  currentSeoId: number;
  currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.players = new Map();
    this.contactSubmissions = new Map();
    this.faqs = new Map();
    this.siteContents = new Map();
    this.seoSettings = new Map();
    this.analyticsSettings = new Map();
    
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentPlayerId = 1;
    this.currentContactId = 1;
    this.currentFaqId = 1;
    this.currentSiteContentId = 1;
    this.currentSeoId = 1;
    this.currentAnalyticsId = 1;
    
    // Initialize with sample data
    this.initializeData();
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
  
  // Contact methods
  async createContactSubmission(insertSubmission: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const submission: Contact = { 
      ...insertSubmission, 
      id, 
      createdAt: new Date() 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
  
  async getContactSubmissions(): Promise<Contact[]> {
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
  
  private initializeData() {
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
      answer: "Pentru parteneriate și sponsorizări, te rugăm să ne contactezi direct prin formularul de contact sau la adresa de email partnerships@moldovaproleague.md. Echipa noastră îți va răspunde în cel mai scurt timp cu detalii despre pachetele de sponsorizare disponibile.",
      order: 5
    });
  }
}

export const storage = new MemStorage();
