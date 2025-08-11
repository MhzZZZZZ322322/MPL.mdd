# Moldova Pro League (MPL) - Replit Guide

## Overview
Moldova Pro League (MPL) is a web application for a Moldovan esports organization. It's a full-stack application designed to manage and showcase esports events, particularly focusing on CS2 tournaments. The application provides features for game server monitoring, comprehensive event management (including tournament brackets and match results), player rankings, and dynamic content management. Its purpose is to serve as a central hub for the organization's activities, offering real-time updates and an engaging user experience for fans and participants.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preference: Eliminate all fire symbols (🔥) from the entire site for a clean, professional look.

## Recent Changes  
- August 11, 2025: **BLOG_SYSTEM_ADVANCED_IMPLEMENTATION** - Extins schema blog cu câmpuri pentru alt text, caption, licență imagine, categorii (principală/secundare), programare automată, și token preview. Implementat Media Manager cu procesare imagini, categorii predefinite, autori multipli, tag-uri sugerite, și funcționalitate de scheduling pentru publicare automată.
- August 11, 2025: **BLOG_SYSTEM_STYLING_COMPLETE** - Integrat sistemul de blog în stilistica oficială a site-ului (fundal negru, efecte purple/blue, design consistent). Mutat blog management din interfața de turneu în panoul principal admin la `/admin/blog`. Rezolvat PayloadTooLargeError prin mărirea limitelor serverului la 50MB pentru încărcarea imaginilor mari în blog.
- August 11, 2025: **BLOG_SYSTEM_COMPLETE** - Implementat sistemul complet de blog/știri cu editor admin rich text, upload poze, stocare în PostgreSQL, afișare cronologică pe site. Inclus SEO metadata, tags, view counter și sistem complet CRUD.
- August 11, 2025: **KINGSTON_TEAM_EDITING_COMPLETE** - Implementat editarea completă echipelor înregistrate: nume, logo, membri cu toate detaliile (nickname, FACEIT, Discord, rol, poziție). Sistem de tranzacții pentru integritatea datelor.
- August 11, 2025: **KINGSTON_LOGO_SYSTEM_COMPLETE** - Implementat sistemul complet de logo-uri cu persistență în baza de date PostgreSQL. Logo-urile se salvează ca base64 în coloana logoData și se afișează din DB. Eliminat textele generice "Kingston Player" și "kingston-hyperx-supercup" pentru un aspect mai curat.
- August 11, 2025: **KINGSTON_CLEAN_RESET** - Curățat complet turneul Kingston de toate datele vechi (echipe, meciuri, rezultate). Dezactivat accesul admin prin secvența "mpl" pe pagina de înregistrare. Sistem complet funcțional pentru înregistrare publică echipe cu drag-and-drop upload logo.
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