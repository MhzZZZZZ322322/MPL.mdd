// Script pentru migrarea echipelor și membrilor către PostgreSQL
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './shared/schema.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

// Toate echipele în ordinea alfabetică corectă cu datele complete
const allTeams = [
  { id: 1, name: "Auratix", logoUrl: "/team-logos/Auratix.png", tournament: "hator-cs-league", isActive: true },
  { id: 2, name: "BaitMD", logoUrl: "/team-logos/BaitMD.webp", tournament: "hator-cs-league", isActive: true },
  { id: 3, name: "Barbosii", logoUrl: "/team-logos/Barbosii.png", tournament: "hator-cs-league", isActive: true },
  { id: 4, name: "Bloody", logoUrl: "/team-logos/Bloody.png", tournament: "hator-cs-league", isActive: true },
  { id: 5, name: "Bobb3rs", logoUrl: "/team-logos/Bobb3rs.png", tournament: "hator-cs-league", isActive: true },
  { id: 6, name: "BPSP", logoUrl: "/team-logos/BPSP.png", tournament: "hator-cs-league", isActive: true },
  { id: 7, name: "Brigada", logoUrl: "/team-logos/Brigada.png", tournament: "hator-cs-league", isActive: true },
  { id: 8, name: "Brigada Meteor", logoUrl: "/team-logos/Brigada Meteor.png", tournament: "hator-cs-league", isActive: true },
  { id: 9, name: "Cadian Team", logoUrl: "/team-logos/Cadian Team.png", tournament: "hator-cs-league", isActive: true },
  { id: 10, name: "Ciocana Esports", logoUrl: "/team-logos/Ciocana Esports.png", tournament: "hator-cs-league", isActive: true },
  { id: 11, name: "Ciocălău Team", logoUrl: "/team-logos/Ciocălău Team.png", tournament: "hator-cs-league", isActive: true },
  { id: 12, name: "Cipok", logoUrl: "/team-logos/Cipok.png", tournament: "hator-cs-league", isActive: true },
  { id: 13, name: "Coli", logoUrl: "/team-logos/Coli.png", tournament: "hator-cs-league", isActive: true },
  { id: 14, name: "Crasat", logoUrl: "/team-logos/Crasat.png", tournament: "hator-cs-league", isActive: true },
  { id: 15, name: "Cucumba", logoUrl: "/team-logos/Cucumba.png", tournament: "hator-cs-league", isActive: true },
  { id: 16, name: "Flux Line", logoUrl: "/team-logos/Flux Line.png", tournament: "hator-cs-league", isActive: true },
  { id: 17, name: "Golden Five", logoUrl: "/team-logos/Golden Five.png", tournament: "hator-cs-league", isActive: true },
  { id: 18, name: "Into the Beach", logoUrl: "/team-logos/Into the Beach.png", tournament: "hator-cs-league", isActive: true },
  { id: 19, name: "Japon", logoUrl: "/team-logos/Japon.png", tournament: "hator-cs-league", isActive: true },
  { id: 20, name: "K9 Team", logoUrl: "/team-logos/K9 Team.png", tournament: "hator-cs-league", isActive: true },
  { id: 21, name: "Killuminaty", logoUrl: "/team-logos/Killuminaty.png", tournament: "hator-cs-league", isActive: true },
  { id: 22, name: "KostiujeniKlinik", logoUrl: "/team-logos/KostiujeniKlinik.png", tournament: "hator-cs-league", isActive: true },
  { id: 23, name: "La Passion", logoUrl: "/team-logos/La Passion.png", tournament: "hator-cs-league", isActive: true },
  { id: 24, name: "Lean Vision", logoUrl: "/team-logos/Lean Vision.png", tournament: "hator-cs-league", isActive: true },
  { id: 25, name: "Legalize", logoUrl: "/team-logos/Legalize.png", tournament: "hator-cs-league", isActive: true },
  { id: 26, name: "LitEnergy", logoUrl: "/team-logos/LitEnergy.png", tournament: "hator-cs-league", isActive: true },
  { id: 27, name: "LYSQ", logoUrl: "/team-logos/LYSQ.png", tournament: "hator-cs-league", isActive: true },
  { id: 28, name: "Muligambia", logoUrl: "/team-logos/Muligambia.png", tournament: "hator-cs-league", isActive: true },
  { id: 29, name: "Neo Egoist League", logoUrl: "/team-logos/Neo Egoist League.png", tournament: "hator-cs-league", isActive: true },
  { id: 30, name: "Onyx", logoUrl: "/team-logos/Onyx.png", tournament: "hator-cs-league", isActive: true },
  { id: 31, name: "RCBVR", logoUrl: "/team-logos/RCBVR.png", tournament: "hator-cs-league", isActive: true },
  { id: 32, name: "Robotaim", logoUrl: "/team-logos/Robotaim.png", tournament: "hator-cs-league", isActive: true },
  { id: 33, name: "Rumina", logoUrl: "/team-logos/Rumina.png", tournament: "hator-cs-league", isActive: true },
  { id: 34, name: "Shashlik", logoUrl: "/team-logos/Shashlik.png", tournament: "hator-cs-league", isActive: true },
  { id: 35, name: "Trigger", logoUrl: "/team-logos/Tigger.png", tournament: "hator-cs-league", isActive: true },
  { id: 36, name: "VeryGoodTeam", logoUrl: "/team-logos/VeryGoodTeam.png", tournament: "hator-cs-league", isActive: true },
  { id: 37, name: "WenDeagle", logoUrl: "/team-logos/WenDeagle.png", tournament: "hator-cs-league", isActive: true },
  { id: 38, name: "Wenzo", logoUrl: "/team-logos/Wenzo.png", tournament: "hator-cs-league", isActive: true },
  { id: 39, name: "WinSpirit", logoUrl: "/team-logos/WinSpirit.webp", tournament: "hator-cs-league", isActive: true },
  { id: 40, name: "X-one", logoUrl: "/team-logos/X-one.png", tournament: "hator-cs-league", isActive: true },
  { id: 41, name: "XPlosion", logoUrl: "/team-logos/XPloison.webp", tournament: "hator-cs-league", isActive: true },
  { id: 42, name: "Xtreme Players", logoUrl: "/team-logos/Xtreme Players.webp", tournament: "hator-cs-league", isActive: true }
];

// Toți membrii echipelor cu maparea corectă
const allTeamMembers = [
  // Team 1: Auratix (Tankkillerr captain)
  { teamId: 1, nickname: "Tankkillerr", role: "captain", position: "main" },
  { teamId: 1, nickname: "ashkkk", role: "player", position: "main" },
  { teamId: 1, nickname: "TrownZy", role: "player", position: "main" },
  { teamId: 1, nickname: "nbdfdfdf", role: "player", position: "main" },
  { teamId: 1, nickname: "lnx", role: "player", position: "main" },
  { teamId: 1, nickname: "ODED", role: "player", position: "reserve" },
  { teamId: 1, nickname: "Cobqkq", role: "player", position: "reserve" },
  
  // Team 2: BaitMD (NeoK1nG- captain)
  { teamId: 2, nickname: "NeoK1nG-", role: "captain", position: "main" },
  { teamId: 2, nickname: "Mehti89", role: "player", position: "main" },
  { teamId: 2, nickname: "dopezneel-", role: "player", position: "main" },
  { teamId: 2, nickname: "MaJ0r4Ka", role: "player", position: "main" },
  { teamId: 2, nickname: "MasChef", role: "player", position: "main" },
  { teamId: 2, nickname: "batelfield", role: "player", position: "reserve" },
  { teamId: 2, nickname: "B1LAMAGICA", role: "player", position: "reserve" },
  { teamId: 2, nickname: "IamNakey", role: "player", position: "reserve" },
  
  // Team 3: Barbosii (btate captain)
  { teamId: 3, nickname: "btate", role: "captain", position: "main" },
  { teamId: 3, nickname: "Lewis", role: "player", position: "main" },
  { teamId: 3, nickname: "cozmann", role: "player", position: "main" },
  { teamId: 3, nickname: "qwus0", role: "player", position: "main" },
  { teamId: 3, nickname: "Brf_Bogdan", role: "player", position: "main" },
  
  // Team 4: Bloody (MrPalste captain)
  { teamId: 4, nickname: "MrPalste", role: "captain", position: "main" },
  { teamId: 4, nickname: "MaL1", role: "player", position: "main" },
  { teamId: 4, nickname: "nkwr", role: "player", position: "main" },
  { teamId: 4, nickname: "sased2096", role: "player", position: "main" },
  { teamId: 4, nickname: "Nonstoping", role: "player", position: "main" },
  { teamId: 4, nickname: "dan1k", role: "player", position: "reserve" },
  { teamId: 4, nickname: "wanderer", role: "player", position: "reserve" },
  
  // Team 5: Bobb3rs (ZanT3X captain)
  { teamId: 5, nickname: "ZanT3X", role: "captain", position: "main" },
  { teamId: 5, nickname: "ezforleoha", role: "player", position: "main" },
  { teamId: 5, nickname: "ZLK", role: "player", position: "main" },
  { teamId: 5, nickname: "Fyralyx", role: "player", position: "main" },
  { teamId: 5, nickname: "Yakuzaishi", role: "player", position: "main" },
  
  // Team 6: BPSP (M1kee captain)
  { teamId: 6, nickname: "M1kee", role: "captain", position: "main" },
  { teamId: 6, nickname: "strky_", role: "player", position: "main" },
  { teamId: 6, nickname: "-formet-", role: "player", position: "main" },
  { teamId: 6, nickname: "KureaCYA", role: "player", position: "main" },
  { teamId: 6, nickname: "Bandajel", role: "player", position: "main" },
  
  // Team 7: Brigada (TonyBossuB captain)
  { teamId: 7, nickname: "TonyBossuB", role: "captain", position: "main" },
  { teamId: 7, nickname: "AdmralExE", role: "player", position: "main" },
  { teamId: 7, nickname: "Kolea", role: "player", position: "main" },
  { teamId: 7, nickname: "dariusbosu", role: "player", position: "main" },
  { teamId: 7, nickname: "StasBosu", role: "player", position: "main" },
  
  // Team 8: Brigada Meteor (yeahmen0 captain)
  { teamId: 8, nickname: "yeahmen0", role: "captain", position: "main" },
  { teamId: 8, nickname: "cacioc", role: "player", position: "main" },
  { teamId: 8, nickname: "RoyalD", role: "player", position: "main" },
  { teamId: 8, nickname: "_AM", role: "player", position: "main" },
  { teamId: 8, nickname: "neirhe", role: "player", position: "main" },
  { teamId: 8, nickname: "Smali_", role: "player", position: "reserve" },
  
  // Team 9: Cadian Team (cadiaN captain)
  { teamId: 9, nickname: "cadiaN", role: "captain", position: "main" },
  { teamId: 9, nickname: "c cadiaN", role: "player", position: "main" },
  { teamId: 9, nickname: "hzzu", role: "player", position: "main" },
  { teamId: 9, nickname: "m machoman", role: "player", position: "main" },
  { teamId: 9, nickname: "k kiyyyo-_-", role: "player", position: "main" },
  { teamId: 9, nickname: "E Enkiee", role: "player", position: "main" },
  
  // Team 10: Ciocana Esports (CoMMaNDeR_MD captain)
  { teamId: 10, nickname: "CoMMaNDeR_MD", role: "captain", position: "main" },
  { teamId: 10, nickname: "fke_soft", role: "player", position: "main" },
  { teamId: 10, nickname: "FraGGvesta", role: "player", position: "main" },
  { teamId: 10, nickname: "HamsteR_TR", role: "player", position: "main" },
  { teamId: 10, nickname: "trcketw", role: "player", position: "main" },
  { teamId: 10, nickname: "xxx", role: "player", position: "main" },
  { teamId: 10, nickname: "Shutting", role: "player", position: "reserve" },
  
  // Team 11: Ciocălău Team (vd captain)
  { teamId: 11, nickname: "vd", role: "captain", position: "main" },
  { teamId: 11, nickname: "KaTaRiZ", role: "player", position: "main" },
  { teamId: 11, nickname: "xBogdy", role: "player", position: "main" },
  { teamId: 11, nickname: "0", role: "player", position: "main" },
  { teamId: 11, nickname: "HELLBOYzx", role: "player", position: "main" },
  { teamId: 11, nickname: "ManoleBanan", role: "player", position: "reserve" },
  
  // Team 12: Cipok (itzHYPEER captain)
  { teamId: 12, nickname: "itzHYPEER", role: "captain", position: "main" },
  { teamId: 12, nickname: "Zevx_x", role: "player", position: "main" },
  { teamId: 12, nickname: "Trzizxc", role: "player", position: "main" },
  { teamId: 12, nickname: "keanet-", role: "player", position: "main" },
  { teamId: 12, nickname: "SqTrueOmega", role: "player", position: "main" },
  
  // Team 13: Coli (denzy captain)
  { teamId: 13, nickname: "denzy", role: "captain", position: "main" },
  { teamId: 13, nickname: "hahanz0-", role: "player", position: "main" },
  { teamId: 13, nickname: "potapke", role: "player", position: "main" },
  { teamId: 13, nickname: "-pickup", role: "player", position: "main" },
  { teamId: 13, nickname: "Bagheera-_", role: "player", position: "main" },
  { teamId: 13, nickname: "_avi-", role: "player", position: "reserve" },
  
  // Team 14: Crasat (chazya captain)
  { teamId: 14, nickname: "chazya", role: "captain", position: "main" },
  { teamId: 14, nickname: "SWAGTEAR", role: "player", position: "main" },
  { teamId: 14, nickname: "DediDR", role: "player", position: "main" },
  { teamId: 14, nickname: "Lavandar", role: "player", position: "main" },
  { teamId: 14, nickname: "madl", role: "player", position: "main" },
  
  // Team 15: Cucumba (DrMadness captain)
  { teamId: 15, nickname: "DrMadness", role: "captain", position: "main" },
  { teamId: 15, nickname: "hexl0ve", role: "player", position: "main" },
  { teamId: 15, nickname: "Bronxxxxx", role: "player", position: "main" },
  { teamId: 15, nickname: "ENKOhUNR_", role: "player", position: "main" },
  { teamId: 15, nickname: "dnx", role: "player", position: "main" },
  { teamId: 15, nickname: "Flash", role: "player", position: "reserve" },
  { teamId: 15, nickname: "YTProst", role: "player", position: "reserve" },
  { teamId: 15, nickname: "gabriel_0", role: "player", position: "reserve" },
  { teamId: 15, nickname: "Mitowily", role: "player", position: "reserve" },
  
  // Team 16: Flux Line (PhXGON captain)
  { teamId: 16, nickname: "PhXGON", role: "captain", position: "main" },
  { teamId: 16, nickname: "Ovitaaa", role: "player", position: "main" },
  { teamId: 16, nickname: "Pavar0tnik", role: "player", position: "main" },
  { teamId: 16, nickname: "skyreal", role: "player", position: "main" },
  { teamId: 16, nickname: "Sobranie-", role: "player", position: "main" },
  { teamId: 16, nickname: "QuatrRo_", role: "player", position: "reserve" },
  
  // Team 17: Golden Five (Fr0yMan captain)
  { teamId: 17, nickname: "Fr0yMan", role: "captain", position: "main" },
  { teamId: 17, nickname: "Aken0_0", role: "player", position: "main" },
  { teamId: 17, nickname: "Miyazaki", role: "player", position: "main" },
  { teamId: 17, nickname: "-foXy-", role: "player", position: "main" },
  { teamId: 17, nickname: "lxerrr", role: "player", position: "main" },
  { teamId: 17, nickname: "Kraken0", role: "player", position: "reserve" },
  { teamId: 17, nickname: "trywz", role: "player", position: "reserve" },
  
  // Team 18: Into the Beach (sndeRR captain)
  { teamId: 18, nickname: "sndeRR", role: "captain", position: "main" },
  { teamId: 18, nickname: "whte", role: "player", position: "main" },
  { teamId: 18, nickname: "gerda", role: "player", position: "main" },
  { teamId: 18, nickname: "-tsoykyrit", role: "player", position: "main" },
  { teamId: 18, nickname: "lowtaber", role: "player", position: "main" },
  { teamId: 18, nickname: "(fable) )", role: "player", position: "reserve" },
  
  // Team 19: Japon (patan captain)
  { teamId: 19, nickname: "patan", role: "captain", position: "main" },
  { teamId: 19, nickname: "-DNtZ", role: "player", position: "main" },
  { teamId: 19, nickname: "NoobOnRadar", role: "player", position: "main" },
  { teamId: 19, nickname: "TheCerebro", role: "player", position: "main" },
  { teamId: 19, nickname: "MaxxBT", role: "player", position: "main" },
  { teamId: 19, nickname: "danchicago", role: "player", position: "reserve" },
  { teamId: 19, nickname: "buGaa", role: "player", position: "reserve" },
  
  // Team 20: K9 Team (Alohadron captain)
  { teamId: 20, nickname: "Alohadron", role: "captain", position: "main" },
  { teamId: 20, nickname: "Super_Bobik", role: "player", position: "main" },
  { teamId: 20, nickname: "WenDigol", role: "player", position: "main" },
  { teamId: 20, nickname: "SLSH_", role: "player", position: "main" },
  { teamId: 20, nickname: "liusa", role: "player", position: "main" },
  { teamId: 20, nickname: "MMSGMamaliga", role: "player", position: "reserve" },
  
  // Team 21: Killuminaty (lazcc captain)
  { teamId: 21, nickname: "lazcc", role: "captain", position: "main" },
  { teamId: 21, nickname: "FnalYST", role: "player", position: "main" },
  { teamId: 21, nickname: "NKKT", role: "player", position: "main" },
  { teamId: 21, nickname: "sweethat_", role: "player", position: "main" },
  { teamId: 21, nickname: "Daveees", role: "player", position: "main" },
  { teamId: 21, nickname: "sebiwx", role: "player", position: "reserve" },
  
  // Team 22: KostiujeniKlinik (DumaSula captain)
  { teamId: 22, nickname: "DumaSula", role: "captain", position: "main" },
  { teamId: 22, nickname: "UchihaRoby", role: "player", position: "main" },
  { teamId: 22, nickname: "My", role: "player", position: "main" },
  { teamId: 22, nickname: "T0rno", role: "player", position: "main" },
  { teamId: 22, nickname: "chocomilk", role: "player", position: "main" },
  { teamId: 22, nickname: "lelavaida", role: "player", position: "reserve" },
  
  // Team 23: La Passion (Feniyxad captain)
  { teamId: 23, nickname: "Feniyxad", role: "captain", position: "main" },
  { teamId: 23, nickname: "px_csgo", role: "player", position: "main" },
  { teamId: 23, nickname: "By_Vega", role: "player", position: "main" },
  { teamId: 23, nickname: "czxxy", role: "player", position: "main" },
  { teamId: 23, nickname: "Stan", role: "player", position: "main" },
  
  // Team 24: Lean Vision (Rexodd_ captain)
  { teamId: 24, nickname: "Rexodd_", role: "captain", position: "main" },
  { teamId: 24, nickname: "vovchikk", role: "player", position: "main" },
  { teamId: 24, nickname: "Timurssz", role: "player", position: "main" },
  { teamId: 24, nickname: "bimka", role: "player", position: "main" },
  { teamId: 24, nickname: "mauham", role: "player", position: "main" },
  { teamId: 24, nickname: "skip", role: "player", position: "main" },
  { teamId: 24, nickname: "ZenoKng", role: "player", position: "reserve" },
  { teamId: 24, nickname: "Rexodd", role: "player", position: "reserve" },
  
  // Team 25: Legalize (hide- captain)
  { teamId: 25, nickname: "hide-", role: "captain", position: "main" },
  { teamId: 25, nickname: "h hide-", role: "player", position: "main" },
  { teamId: 25, nickname: "r rheinTod", role: "player", position: "main" },
  { teamId: 25, nickname: "w wizzhaha", role: "player", position: "main" },
  { teamId: 25, nickname: "- -GuTu", role: "player", position: "main" },
  { teamId: 25, nickname: "S SayMons_", role: "player", position: "main" },
  { teamId: 25, nickname: "theooo", role: "player", position: "reserve" },
  { teamId: 25, nickname: "y y0kuza", role: "player", position: "reserve" },
  
  // Team 26: LitEnergy (-ExTaZzy- captain)
  { teamId: 26, nickname: "-ExTaZzy-", role: "captain", position: "main" },
  { teamId: 26, nickname: "Twizzy_rs", role: "player", position: "main" },
  { teamId: 26, nickname: "sucdeananas", role: "player", position: "main" },
  { teamId: 26, nickname: "MDTryharder", role: "player", position: "main" },
  { teamId: 26, nickname: "-f0rz-", role: "player", position: "main" },
  { teamId: 26, nickname: "-Dekj", role: "player", position: "reserve" },
  { teamId: 26, nickname: "Pko_x", role: "player", position: "reserve" },
  
  // Team 27: LYSQ (mooghiwara captain)
  { teamId: 27, nickname: "mooghiwara", role: "captain", position: "main" },
  { teamId: 27, nickname: "Klasse", role: "player", position: "main" },
  { teamId: 27, nickname: "maTim", role: "player", position: "main" },
  { teamId: 27, nickname: "RONI", role: "player", position: "main" },
  { teamId: 27, nickname: "IOneTapI", role: "player", position: "main" },
  
  // Team 28: Muligambia (Huh captain)
  { teamId: 28, nickname: "Huh", role: "captain", position: "main" },
  { teamId: 28, nickname: "Mamin_Cvetok", role: "player", position: "main" },
  { teamId: 28, nickname: "illinir", role: "player", position: "main" },
  { teamId: 28, nickname: "Pochita", role: "player", position: "main" },
  { teamId: 28, nickname: "Kasador_", role: "player", position: "main" },
  
  // Team 29: Neo Egoist League (-farra captain)
  { teamId: 29, nickname: "-farra", role: "captain", position: "main" },
  { teamId: 29, nickname: "-DeYn-", role: "player", position: "main" },
  { teamId: 29, nickname: "s0RDE", role: "player", position: "main" },
  { teamId: 29, nickname: "deman--", role: "player", position: "main" },
  { teamId: 29, nickname: "ankqzzz", role: "player", position: "main" },
  { teamId: 29, nickname: "AngryTolean", role: "player", position: "main" },
  { teamId: 29, nickname: "iNsanityMD", role: "player", position: "main" },
  { teamId: 29, nickname: "-starsmd", role: "player", position: "main" },
  
  // Team 30: Onyx (aC_ captain)
  { teamId: 30, nickname: "aC_", role: "captain", position: "main" },
  { teamId: 30, nickname: "Raw0-", role: "player", position: "main" },
  { teamId: 30, nickname: "-pROSECCO", role: "player", position: "main" },
  { teamId: 30, nickname: "LiSun", role: "player", position: "main" },
  { teamId: 30, nickname: "wolfistomas", role: "player", position: "main" },
  { teamId: 30, nickname: "pavlovvv", role: "player", position: "reserve" },
  
  // Team 31: RCBVR (BogdanR captain)
  { teamId: 31, nickname: "BogdanR", role: "captain", position: "main" },
  { teamId: 31, nickname: "Vaneasous", role: "player", position: "main" },
  { teamId: 31, nickname: "sashasous", role: "player", position: "main" },
  { teamId: 31, nickname: "PingOnCs", role: "player", position: "main" },
  { teamId: 31, nickname: "spexFV", role: "player", position: "main" },
  
  // Team 32: Robotaim (KROULYSFORD captain)
  { teamId: 32, nickname: "KROULYSFORD", role: "captain", position: "main" },
  { teamId: 32, nickname: "C CHORS", role: "player", position: "main" },
  { teamId: 32, nickname: "L Latinskii", role: "player", position: "main" },
  { teamId: 32, nickname: "K KROULYSFORD", role: "player", position: "main" },
  { teamId: 32, nickname: "L Lolipop", role: "player", position: "main" },
  { teamId: 32, nickname: "a absent", role: "player", position: "main" },
  { teamId: 32, nickname: "P Pinzru", role: "player", position: "reserve" },
  
  // Team 33: Rumina (NuBekk captain)
  { teamId: 33, nickname: "NuBekk", role: "captain", position: "main" },
  { teamId: 33, nickname: "Sokable_", role: "player", position: "main" },
  { teamId: 33, nickname: "kulya", role: "player", position: "main" },
  { teamId: 33, nickname: "OxpLoyTaBa", role: "player", position: "main" },
  { teamId: 33, nickname: "chifuleacc", role: "player", position: "main" },
  { teamId: 33, nickname: "nocliippp", role: "player", position: "reserve" },
  { teamId: 33, nickname: "uukassen", role: "player", position: "reserve" },
  
  // Team 34: Shashlik (xen0 captain)
  { teamId: 34, nickname: "xen0", role: "captain", position: "main" },
  { teamId: 34, nickname: "Esantorix", role: "player", position: "main" },
  { teamId: 34, nickname: "kryzw", role: "player", position: "main" },
  { teamId: 34, nickname: "SF-eMakzie", role: "player", position: "main" },
  { teamId: 34, nickname: "Bama_Booy", role: "player", position: "main" },
  { teamId: 34, nickname: "Kirspiden", role: "player", position: "reserve" },
  { teamId: 34, nickname: "Headcleaner", role: "player", position: "reserve" },
  
  // Team 35: Trigger (denisZx captain)
  { teamId: 35, nickname: "denisZx", role: "captain", position: "main" },
  { teamId: 35, nickname: "maskkout", role: "player", position: "main" },
  { teamId: 35, nickname: "kideeFrumu", role: "player", position: "main" },
  { teamId: 35, nickname: "Jesus", role: "player", position: "main" },
  { teamId: 35, nickname: "Biffaw", role: "player", position: "main" },
  { teamId: 35, nickname: "Mnraifu", role: "player", position: "main" },
  { teamId: 35, nickname: "predator_md", role: "player", position: "main" },
  
  // Team 36: VeryGoodTeam (BoreaTaga captain)
  { teamId: 36, nickname: "BoreaTaga", role: "captain", position: "main" },
  { teamId: 36, nickname: "Yntelect", role: "player", position: "main" },
  { teamId: 36, nickname: "CCLey_", role: "player", position: "main" },
  { teamId: 36, nickname: "Krabk__", role: "player", position: "main" },
  { teamId: 36, nickname: "Santiik", role: "player", position: "main" },
  { teamId: 36, nickname: "MxGamer", role: "player", position: "reserve" },
  { teamId: 36, nickname: "danyazabiv", role: "player", position: "reserve" },
  
  // Team 37: WenDeagle (Mndfvck captain)
  { teamId: 37, nickname: "Mndfvck", role: "captain", position: "main" },
  { teamId: 37, nickname: "M Mndfvck", role: "player", position: "main" },
  { teamId: 37, nickname: "l ltmzzz", role: "player", position: "main" },
  { teamId: 37, nickname: "r riks", role: "player", position: "main" },
  { teamId: 37, nickname: "a ayukn", role: "player", position: "main" },
  { teamId: 37, nickname: "C Chukunda", role: "player", position: "main" },
  
  // Team 38: Wenzo (-nghtmarr captain)
  { teamId: 38, nickname: "-nghtmarr", role: "captain", position: "main" },
  { teamId: 38, nickname: "mori", role: "player", position: "main" },
  { teamId: 38, nickname: "HappyRaider", role: "player", position: "main" },
  { teamId: 38, nickname: "vsnea", role: "player", position: "main" },
  { teamId: 38, nickname: "Cluer", role: "player", position: "main" },
  
  // Team 39: WinSpirit (LightStormyx captain)
  { teamId: 39, nickname: "LightStormyx", role: "captain", position: "main" },
  { teamId: 39, nickname: "WRacer420", role: "player", position: "main" },
  { teamId: 39, nickname: "Dany0443", role: "player", position: "main" },
  { teamId: 39, nickname: "Free_man1337", role: "player", position: "main" },
  { teamId: 39, nickname: "stass4", role: "player", position: "main" },
  
  // Team 40: X-one (-OPIUMVXQ- captain)
  { teamId: 40, nickname: "-OPIUMVXQ-", role: "captain", position: "main" },
  { teamId: 40, nickname: "yar1tyss", role: "player", position: "main" },
  { teamId: 40, nickname: "g0speLbtw", role: "player", position: "main" },
  { teamId: 40, nickname: "SolevoI_Voi", role: "player", position: "main" },
  { teamId: 40, nickname: "tronick999", role: "player", position: "main" },
  
  // Team 41: XPlosion (Duke_0 captain)
  { teamId: 41, nickname: "Duke_0", role: "captain", position: "main" },
  { teamId: 41, nickname: "Gr1MM-", role: "player", position: "main" },
  { teamId: 41, nickname: "BENGOSO", role: "player", position: "main" },
  { teamId: 41, nickname: "RayeN-", role: "player", position: "main" },
  { teamId: 41, nickname: "Gherman-", role: "player", position: "main" },
  { teamId: 41, nickname: "P1oNeR-_-", role: "player", position: "reserve" },
  { teamId: 41, nickname: "acierdnay", role: "player", position: "reserve" },
  
  // Team 42: Xtreme Players (w0lf3nstein captain)
  { teamId: 42, nickname: "w0lf3nstein", role: "captain", position: "main" },
  { teamId: 42, nickname: "kaeden-", role: "player", position: "main" },
  { teamId: 42, nickname: "1L0e_", role: "player", position: "main" },
  { teamId: 42, nickname: "enthusiastul1", role: "player", position: "main" },
  { teamId: 42, nickname: "daf10-", role: "player", position: "main" }
];

async function migrateData() {
  try {
    console.log('Începe migrarea echipelor către PostgreSQL...');
    
    // Șterge datele existente (pentru curățarea completă)
    await db.delete(schema.teamMembers);
    await db.delete(schema.teams);
    
    // Inserează echipele
    console.log('Inserare echipe...');
    for (const team of allTeams) {
      await db.insert(schema.teams).values({
        name: team.name,
        logoUrl: team.logoUrl,
        tournament: team.tournament,
        isActive: team.isActive,
        createdAt: new Date()
      });
    }
    
    // Inserează membrii echipelor
    console.log('Inserare membri echipe...');
    for (const member of allTeamMembers) {
      await db.insert(schema.teamMembers).values({
        teamId: member.teamId,
        nickname: member.nickname,
        faceitProfile: `https://www.faceit.com/en/players/${member.nickname}`,
        role: member.role,
        position: member.position,
        isActive: true
      });
    }
    
    console.log('Migrarea completă! Toate cele 42 de echipe și membrii lor au fost adăugați în PostgreSQL.');
    
  } catch (error) {
    console.error('Eroare în timpul migrării:', error);
  } finally {
    await pool.end();
  }
}

migrateData();