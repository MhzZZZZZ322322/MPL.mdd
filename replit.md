# Moldova Pro League (MPL) - Replit Guide

## Overview
Moldova Pro League (MPL) is a web application for a Moldovan esports organization. It's a full-stack application designed to manage and showcase esports events, particularly focusing on CS2 tournaments. The application provides features for game server monitoring, comprehensive event management (including tournament brackets and match results), player rankings, and dynamic content management. Its purpose is to serve as a central hub for the organization's activities, offering real-time updates and an engaging user experience for fans and participants.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preference: Eliminate all fire symbols (🔥) from the entire site for a clean, professional look.

## Recent Changes  
- August 14, 2025: **KINGSTON_TEAM_DISTRIBUTION_UPDATED** - Actualizat distribuția echipelor Kingston de la "16 direct + 16 calificare" la "12 selectate direct + 20 prin calificare" în toată pagina. Corectat toate textele și numerotarea pentru a reflecta noul format cu 20 locuri prin calificare.
- August 14, 2025: **KINGSTON_PAGE_FORMAT_CONSISTENCY_COMPLETE** - Actualizat complet pagina KingstonHyperXSupercup.tsx pentru consistență totală cu noul format: eliminat toate referințele la "Swiss System", "Stage 3", și "4 etape". Corectat texte la "3 etape" (cu Stage 0), "Grupe + Double Elimination", și cronograma completă. Eliminat componenta KingstonStage3Playoff nedolosită.
- August 14, 2025: **KINGSTON_FORMAT_COMPONENTS_FINALIZED** - Actualizat complet componentele Stage3Swiss.tsx și Stage4Playoff.tsx pentru a afișa notificări de schimbare de format în loc de funcționalitatea veche. Componente transformate în mesaje informative care explică eliminarea Swiss System și Stage 4 din noul format simplificat. Actualizat translations.ts pentru eliminarea completă a referințelor Swiss System.
- August 14, 2025: **KINGSTON_FORMAT_RESTRUCTURE_COMPLETE** - Restructurat complet formatul turneului Kingston pe toată pagina: 32 echipe totale (16 direct + 16 calificare), Stage 0 = Calificare (toate echipele înregistrate), Stage 1 = 8 Grupe cu 4 echipe (primele 2 avansează, 32→16), Stage 2 = Double Elimination cu 16 echipe (Upper/Lower Bracket). Eliminat Swiss System și Stage 3. Eliminat toate referințele la vârsta de 16 ani și FACEIT Level 4. Corectat "5 în roster + 5 substitute". Format final simplificat și consistent pe întreaga pagină.
- August 13, 2025: **ROMANIA_REFERENCES_ELIMINATED_COMPLETE** - Eliminat complet toate referințele la "România" din întreaga platformă (9+ fișiere actualizate), inclusiv pagina turneului Kingston, traduceri, meta descriptions, și storage server. Platforma MPL este acum exclusiv orientată spre Moldova cu eligibilitate doar pentru cetățenii moldoveni.
- August 13, 2025: **KINGSTON_HERO_LAYOUT_OPTIMIZED** - Optimizat layout-ul hero section pentru turneul Kingston: mărit înălțimea minimă la 80vh pe ecrane mici, adăugat padding și spațiere responsivă pentru butoane pentru a fi vizibile la zoom 100%. Redus opacitatea imaginii de fundal la 25% cu overlay mai puternic (80%) pentru vizibilitate îmbunătățită a textului și butoanelor. Adăugat shadow și border la butoane pentru contrast.
- August 13, 2025: **KINGSTON_DUPLICATE_PRIZES_SECTIONS_ELIMINATED** - Eliminat complet secțiunile duplicate cu premiile de pe pagina turneului Kingston. Menținut doar secțiunea principală cu premiile poziționată primul după hero section pentru prioritizarea vizuală maximă și claritate.
- August 13, 2025: **KINGSTON_TOURNAMENT_SCHEDULE_IMAGE** - Adăugat imaginea oficială cu programul turneului Kingston "Supercup Season 1" deasupra secțiunii "Regulamentul Turneului". Imaginea se întinde pe toată lățimea paginii în mod liniar cu sponsori (Kingston FURY, HyperX, Darwin).
- August 13, 2025: **KINGSTON_BACKGROUND_IMAGE_UPDATED** - Actualizat imaginea de fundal a paginii turneului Kingston cu design-ul oficial "Supercup Season 1" optimizat cu logo MPL și tipografie clară pe fundal scenic elegant. Adjustat opacitatea la 60% cu overlay 50% pentru vizibilitate optimă.
- August 11, 2025: **KINGSTON_STAGE0_QUALIFIERS_ADDED** - Adăugat Stage 0 - Calificarea în formatul turneului Kingston. Implementat secțiune completă cu detalii despre procesul de calificare (11-13 septembrie), format eliminare directă, și informații despre cele 16 locuri disponibile prin calificare.
- August 11, 2025: **KINGSTON_FORMAT_SELECTION_UPDATED** - Actualizat formatul turneului Kingston: 32 echipe (16 selectate direct + 16 prin calificare) în loc de format generic. Modificat toate referințele în pagina turneului și descrierile de înregistrare.
- August 11, 2025: **KINGSTON_PRIZE_POOL_UPDATED** - Actualizat suma totală a premiilor turneului Kingston de la 130,000 LEI la 100,000 LEI în toate locurile din platformă (client, server, raport turneu).
- August 11, 2025: **KINGSTON_TOURNAMENT_PRIZES_CONFIRMED** - Actualizat pagina turneului Kingston cu premiile oficiale confirmate de HyperX și Kingston. Implementat endpoint `/api/kingston/tournament-report` pentru generarea raportului complet de turneu similar cu exemplul Google Sheets. Premii detaliate: Locul 1 (HyperX Cloud III S Wireless + Kingston FURY Renegade DDR5), Locul 2 (HyperX Alloy Rise 75 + Kingston FURY Beast DDR5), Locul 3 (HyperX Pulsefire Haste 2 + Kingston merchandising), Ace of Aces (Kingston FURY Renegade 48GB DDR5 Limited Edition).
- August 11, 2025: **HOMEPAGE_LAYOUT_OPTIMIZATION** - Optimizat spațierea pe pagina principală: redus înălțimea hero slider de la h-screen la h-[65vh], redus padding-ul BlogSection de la py-20 la py-12, mutat modulul "Știri & Actualizări" între slideshow și cardurile "Turnee Regulate" pentru layout mai compact și profesional.
- August 11, 2025: **MPL_KEYBOARD_SHORTCUT_REMOVAL** - Eliminat complet funcționalitatea de secvență tastatură "mpl" din toate componentele (App.tsx și ComingSoon.tsx). Nu mai există restart/redirect automat la tastarea acestor caractere.
- August 11, 2025: **BLOG_SYSTEM_ADVANCED_IMPLEMENTATION** - Extins schema blog cu câmpuri pentru alt text, caption, licență imagine, categorii (principală/secundare), programare automată, și token preview. Implementat Media Manager cu procesare imagini, categorii predefinite, autori multipli, tag-uri sugerite, și funcționalitate de scheduling pentru publicare automată.
- August 11, 2025: **BLOG_SYSTEM_STYLING_COMPLETE** - Integrat sistemul de blog în stilistica oficială a site-ului (fundal negru, efecte purple/blue, design consistent). Mutat blog management din interfața de turneu în panoul principal admin la `/admin/blog`. Rezolvat PayloadTooLargeError prin mărirea limitelor serverului la 50MB pentru încărcarea imaginilor mari în blog.
- August 11, 2025: **BLOG_SYSTEM_COMPLETE** - Implementat sistemul complet de blog/știri cu editor admin rich text, upload poze, stocare în PostgreSQL, afișare cronologică pe site. Inclus SEO metadata, tags, view counter și sistem complet CRUD.
- August 11, 2025: **KINGSTON_TEAM_EDITING_COMPLETE** - Implementat editarea completă echipelor înregistrate: nume, logo, membri cu toate detaliile (nickname, FACEIT, Discord, rol, poziție). Sistem de tranzacții pentru integritatea datelor.
- August 11, 2025: **KINGSTON_LOGO_SYSTEM_COMPLETE** - Implementat sistemul complet de logo-uri cu persistență în baza de date PostgreSQL. Logo-urile se salvează ca base64 în coloana logoData și se afișează din DB. Eliminat textele generice "Kingston Player" și "kingston-hyperx-supercup" pentru un aspect mai curat.
- August 11, 2025: **KINGSTON_CLEAN_RESET** - Curățat complet turneul Kingston de toate datele vechi (echipe, meciuri, rezultate). Eliminat complet accesul admin prin secvența "mpl" de pe tot site-ul. Sistem complet funcțional pentru înregistrare publică echipe cu drag-and-drop upload logo.
- August 11, 2025: **KINGSTON_HYPERX_SECRET_PAGE** - Creat pagina secretă "Kingston x HyperX - Supercup Season 1" (rută: /events/kingston-hyperx-supercup). Format nou: 32 echipe, 3 etape (Grupe + Swiss + Double Elimination), 15 august - 28 septembrie 2025.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with a custom design system, utilizing Radix UI primitives and shadcn/ui for UI components.
- **Routing**: Wouter for client-side navigation.
- **State Management**: TanStack Query is used for managing server state and data synchronization.
- **Animations**: AOS (Animate On Scroll) and Framer Motion are integrated for visual effects.
- **Build Tool**: Vite is used for efficient development and production builds.
- **UI/UX Decisions**: Emphasis on clear visual hierarchy for tournament information, responsive layouts (e.g., Stage 4 bracket), consistent button styling, and user-friendly navigation. Tournament brackets (e.g., Stage 2, Stage 4 playoff) feature professional SVG connections and responsive designs.

### Backend
- **Runtime**: Node.js with TypeScript (using `tsx` for development).
- **Framework**: Express.js for API development.
- **Database ORM**: Drizzle ORM is used for interacting with the PostgreSQL database.
- **Database**: PostgreSQL, configured for Neon serverless.
- **Game Server Monitoring**: The GameDig library is integrated for real-time monitoring of CS2 server status.
- **Email Services**: SendGrid is used for handling contact form submissions.
- **Build Tool**: esbuild is used for production bundling of server code.

### Core Features and Design Patterns
- **Database Schema**: Includes tables for Users, Events, Players, CS Servers, Contact Submissions, FAQs, Site Content, and SEO Settings.
- **Game Server Integration**: Real-time CS2 server monitoring, including status tracking (online/offline, player count) and background scripts for checking server status.
- **Content Management**: Features an admin authentication system for dynamic content editing, event management, SEO settings management, and player ranking system management.
- **Tournament Management**:
    - Comprehensive system for managing multi-stage tournaments (e.g., Stage 1 groups, Stage 2 bracket, Stage 3 Swiss, Stage 4 playoff).
    - Real-time standings calculation based on match results.
    - Automatic progression logic for teams in playoff stages.
    - CRUD operations for managing matches, teams, and tournament stages through an admin interface.
    - Score validation and handling for technical wins.
    - Dynamic group configuration and team distribution.
- **Data Flow**: Frontend makes API calls to the Express backend, which processes business logic, interacts with the PostgreSQL database via Drizzle ORM, and integrates with external services like GameDig and SendGrid.
- **File Structure**: Organized into `client/` (React frontend), `server/` (Express backend), `shared/` (shared TypeScript schemas), and `public/` (static assets).

## External Dependencies

- **Database**: Neon serverless PostgreSQL
- **Game Server Monitoring**: GameDig library
- **Email Service**: SendGrid
- **Frontend Libraries**: React, Wouter, TanStack Query, Radix UI, shadcn/ui, AOS, Framer Motion
- **Backend Libraries**: Express.js, Drizzle ORM
- **Build Tools**: Vite, esbuild
- **Development Tools**: TypeScript