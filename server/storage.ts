import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  players, type Player, type InsertPlayer,
  contactSubmissions, type Contact, type InsertContact,
  faqs, type Faq, type InsertFaq
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Player methods
  getPlayers(game?: string): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  
  // Contact methods
  createContactSubmission(submission: InsertContact): Promise<Contact>;
  getContactSubmissions(): Promise<Contact[]>;
  
  // FAQ methods
  getFaqs(): Promise<Faq[]>;
  getFaq(id: number): Promise<Faq | undefined>;
  createFaq(faq: InsertFaq): Promise<Faq>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private players: Map<number, Player>;
  private contactSubmissions: Map<number, Contact>;
  private faqs: Map<number, Faq>;
  
  currentUserId: number;
  currentEventId: number;
  currentPlayerId: number;
  currentContactId: number;
  currentFaqId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.players = new Map();
    this.contactSubmissions = new Map();
    this.faqs = new Map();
    
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentPlayerId = 1;
    this.currentContactId = 1;
    this.currentFaqId = 1;
    
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
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
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
    const player: Player = { ...insertPlayer, id };
    this.players.set(id, player);
    return player;
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
  
  private initializeData() {
    // Add events
    this.createEvent({
      title: "HATOR CS LEAGUE MOLDOVA",
      description: "Turneu oficial organizat de MPL în parteneriat cu Darwin și Hator Gaming. Participă la una dintre cele mai așteptate competiții CS din Moldova!",
      date: "15 Mai 2025",
      platform: "PC",
      teamSize: "5v5",
      prize: "10000 MDL + Periferice Hator",
      status: "În curând",
      imageUrl: "https://i.ibb.co/1f5rHyK/hator-cs-league.png"
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
      score: 1458
    });
    
    this.createPlayer({
      nickname: "ProdigyMD",
      realName: "Victor M.",
      team: "Nexus",
      game: "CS:GO",
      score: 1395
    });
    
    this.createPlayer({
      nickname: "MDSniper",
      realName: "Ion C.",
      team: "Phoenix",
      game: "CS:GO",
      score: 1287
    });
    
    // Add players for LoL
    this.createPlayer({
      nickname: "MoldLegend",
      realName: "Andrei T.",
      team: "Dragons",
      game: "LoL",
      score: 2145
    });
    
    this.createPlayer({
      nickname: "KingMidMD",
      realName: "Dorin R.",
      team: "Titans",
      game: "LoL",
      score: 1983
    });
    
    this.createPlayer({
      nickname: "SupportGod",
      realName: "Maria S.",
      team: "Dragons",
      game: "LoL",
      score: 1865
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
