# Moldova Pro League (MPL) - Replit Guide

## Overview

Moldova Pro League is a web application for a gaming esports organization from Moldova. It's a full-stack application built with React frontend and Express backend, featuring game server monitoring, event management, player rankings, and content management functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Animations**: AOS (Animate On Scroll) and Framer Motion
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript (using tsx for development)
- **Framework**: Express.js
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Game Server Monitoring**: GameDig library for CS2 server status
- **Email**: SendGrid integration for contact forms
- **File Processing**: esbuild for production bundling

## Key Components

### Database Schema
- **Users**: Authentication and user management
- **Events**: Tournament and event information
- **Players**: Player profiles and rankings
- **CS Servers**: Counter-Strike server monitoring
- **Contact Submissions**: Contact form data
- **FAQs**: Frequently asked questions
- **Site Content**: Dynamic content management
- **SEO Settings**: Search engine optimization data

### Game Server Integration
- Real-time CS2 server monitoring using GameDig
- Server status tracking (online/offline, player count)
- Background server checking scripts (CommonJS compatibility)
- JSON file-based status caching

### Content Management
- Admin authentication system
- Dynamic content editing
- Event management
- SEO settings management
- Player ranking system

## Data Flow

1. **Client Requests**: React frontend makes API calls to Express backend
2. **Server Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Game Server Monitoring**: Background scripts check CS2 server status
5. **Real-time Updates**: TanStack Query manages client-side data synchronization

## External Dependencies

### Core Dependencies
- React ecosystem (React, React DOM, React Router alternative)
- Express.js for backend API
- Drizzle ORM for database operations
- Neon serverless PostgreSQL
- GameDig for game server monitoring
- SendGrid for email services

### Development Tools
- TypeScript for type safety
- Vite for build tooling
- Tailwind CSS for styling
- Various Radix UI components

### Gaming-Specific
- CS2 server monitoring capabilities
- Tournament bracket management
- Player ranking systems

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Assets**: Static assets served from public directory

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- SendGrid API key for email functionality
- Production vs development environment handling

### Replit Deployment
- Configured for autoscale deployment target
- Port 5000 for local development, port 80 for external access
- PostgreSQL 16 module enabled
- Node.js 20 runtime

### File Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utilities and configuration
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── routes/             # API route handlers
│   └── storage.ts          # Database abstraction layer
├── shared/                 # Shared TypeScript schemas
└── public/                 # Static assets
```

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes  
- July 04, 2025: **UPDATED** - Actualizat Stage 3 Swiss cu echipele reale: 11 din grupe + 5 câștigătoare din Stage 2 (BaitMD, Muligambia, Killuminaty, Xtreme Players, Golden Five)
- July 04, 2025: **UPDATED** - Schimbat linkul de mulțumire din CsServerStatus către @faceofmadness (https://www.tiktok.com/@faceofmadness)
- July 04, 2025: **UPDATED** - Schimbat parola de admin din "Admin322" în "Admin322228" în toate bazele de date și storage-ul aplicației
- July 03, 2025: **UPDATED** - Schimbat numele jucătorului din echipa Xtreme Players: "enthys1astyl" → "enthusiastul" în baza de date PostgreSQL cu actualizarea linkului FACEIT
- July 03, 2025: **UPDATED** - Actualizat complet toate linkurile TikTok și @domnukrot către contul oficial @moldova.pro.league în Footer, Contact, SimpleContactForm, EventDetails și CsServerStatus
- July 03, 2025: **FIXED** - Admin interface acum afișează toate cele 6 runde Swiss (1-6) cu descrieri corecte pentru fiecare rundă
- July 03, 2025: **UPDATED** - Rundele Swiss System corecte: Runda 1 (0:0 BO1), Runda 2 (0:1 & 1:0 BO1), Runda 3 (1:1 BO1), Runda 4 (0:2 & 2:0 BO3), Runda 5 (1:2 & 2:1 BO3), Runda 6 (2:2 BO3)
- July 03, 2025: **VISUAL** - Logo cu cupa (🏆) se afișează lângă numele echipei câștigătoare în meciurile Stage 3
- July 03, 2025: **ENHANCED** - Readăugat explicațiile pentru rundele Swiss System (0-0, 1-0, 2-0, etc.) cu culori specifice
- July 03, 2025: **REALTIME** - Clasamentul Stage 3 Swiss se calculează în timp real din meciurile jucate (victorii, înfrângeri, runde)
- July 03, 2025: **STRICT** - Stage 3 Swiss afișează doar date din baza de date - fără meciuri = nimic afișat pe site
- July 03, 2025: **UPDATED** - Echipe reale calificate în Stage 3: LitEnergy, K9 Team, La Passion, XPlosion, VeryGoodTeam, Saponel, Wenzo, BobB3rs, Golden Five, Cadian Team, Into the Beach + 5 din Stage 2
- July 03, 2025: **COMPLETED** - Sistem automat pentru echipele calificate în Stage 3 (16 echipe) din rezultatele anterioare
- July 01, 2025: **SIMPLIFIED** - Eliminat tab-urile redundante din admin (Stage 3 Swiss, Swiss Bracket) - păstrat doar "Stage 3 Runde"
- July 01, 2025: **ADDED** - Manager admin pentru meciurile Stage 3 Swiss organizate pe runde cu interfață completă CRUD
- July 01, 2025: **INTEGRATED** - Conectat meciurile reale din baza de date la rundele Swiss System cu descrieri detaliate pentru fiecare rundă
- July 01, 2025: **ADDED** - Explicație completă rundelor Swiss System cu detalii pentru fiecare rundă (1-5) și rezultatele finale
- July 01, 2025: **ENHANCED** - Organizat meciurile Swiss System în funcție de tipul lor (0-0, 1-0, 2-0, etc.) pentru claritate
- July 01, 2025: **REMOVED** - Eliminată afișarea grafică Swiss Bracket din Stage 3 - păstrat doar clasamentul și statisticile
- July 01, 2025: **UPDATED** - Echipa "Lean Vision" înlocuită cu "LYSQ" în Stage 2 bracket conform cererii utilizatorului cu logo oficial
- July 01, 2025: **VISUAL** - Swiss Bracket acum are aspect identic cu imaginile CS2 Major cu linii de conectare SVG între coloane
- July 01, 2025: **INTEGRATED** - Swiss Bracket conectat la rezultatele din admin - calculează pozițiile echipelor în timp real din meciurile jucate
- July 01, 2025: **ENHANCED** - Adăugat SwissBracketManager în admin cu butoane W/L pentru gestionarea manuală a progresiei echipelor
- July 01, 2025: **REALTIME** - Standings calculate dinamic din meciurile Stage 3 cu afișarea rundei curente și progresului
- July 01, 2025: **OPTIMIZED** - Redus traficul API pentru Stage 3 Swiss prin eliminarea request-urilor duplicate și ajustarea intervalelor de refresh
- July 01, 2025: **COMPLETED** - Endpoints API pentru meciuri Stage 3 Swiss (POST/PUT/DELETE) implementate și funcționale în admin panel
- July 01, 2025: **FILTERED** - Dropdown-urile admin afișează doar echipele calificate în Stage 3 (16 echipe) în loc de toate echipele turneului
- July 01, 2025: **UPDATED** - Stage 3 Swiss System cu 16 echipe corecte: 11 calificate direct din grupe + 5 placeholder-uri pentru câștigătorii Stage 2
- July 01, 2025: **CORRECTED** - Schema vizuală Swiss System redesignată să corespundă exact cu imaginea furnizată de utilizator
- July 01, 2025: **FIXED** - Stage 3 nu mai improvizează rezultate - echipele se poziționează pe măsură ce rezultatele sunt introduse în admin
- June 30, 2025: **COMPLETED** - Stage 2 Tournament Bracket with professional SVG connections and real-time qualification tracking
- June 30, 2025: **VISUAL** - Created complete bracket visualization with matches → central hub → qualified teams flow
- June 30, 2025: **COMPLETED** - Stage 2 Bracket fully functional with simplified admin interface for editing results
- June 30, 2025: **FUNCTIONAL** - Added complete CRUD operations: create matches, edit results, delete matches and links
- June 30, 2025: **VISUAL** - Stage 2 Bracket displays exactly like site with cards but editable in admin panel
- June 30, 2025: **FIXED** - Resolved all parameter order issues in apiRequest calls (method, url, data sequence)
- June 30, 2025: **CORRECTED** - Fixed Select component value errors by using native HTML select elements
- June 30, 2025: **INTEGRATED** - Stage 2 Bracket shows real-time results on main site from admin panel updates
- June 24, 2025: **PRIORITIZED** - Changed ranking system: Points (wins) first priority, round difference second priority for proper tournament standings
- June 24, 2025: **SIMPLIFIED** - Eliminated "Eliminat" status completely - all teams now show only "Stage 2" or "Stage 3 Direct" qualification  
- June 24, 2025: **VISUAL** - Updated standings description to clarify sorting criteria: "1. Puncte, 2. Diferența de runde"
- June 24, 2025: **INTEGRATED** - Added comprehensive Overall Standings within "Grupe Turneu Stage 1" module showing all teams ranked properly
- June 24, 2025: **DYNAMIC** - Real-time standings calculation from database with automatic refresh every 5 seconds for faster updates
- June 24, 2025: **POSITIONED** - Overall Standings placed between tournament groups and Format Turneu for optimal user flow
- June 19, 2025: **UNIFIED** - Combined "Orar Turneu" and "Rezultate Meciuri" into single comprehensive schedule section with uniform layout
- June 19, 2025: **ENHANCED** - Made match scores clickable hyperlinks to Faceit instead of separate buttons for cleaner UX
- June 19, 2025: **OPTIMIZED** - Reorganized match display into uniform single-row layout with proper spacing and alignment
- June 19, 2025: **FIXED** - Match results now display exactly as entered in admin with correct team order and scores
- June 19, 2025: **CORRECTED** - Technical win points calculation now recognizes technicalWinner field instead of score comparison
- June 19, 2025: **VISUAL** - Added ⚙️ technical win icon next to winning team name in match results
- June 18, 2025: **ENHANCED** - Added technical winner selection system with radio buttons to clearly specify which team won technically
- June 18, 2025: **FLEXIBLE** - Removed all score validation restrictions - allows any score combination for technical wins and special cases
- June 17, 2025: **ENHANCED** - Updated score validation to allow scores higher than 13 and changed "Link Stream" to "Link" for flexible Faceit/stream URLs
- June 17, 2025: **INTEGRATED** - Combined "Orar Turneu" and "Rezultate Meciuri" into "Grupe Turneu Stage 1" module for unified Stage 1 management
- June 17, 2025: **RENAMED** - Changed button to "Grupe Turneu Stage 1" and section title to match for consistent tournament phase naming
- June 17, 2025: **UPDATED** - Tournament schedule data for groups A, B, C with official dates (19.06.2025, 20.06.2025, 21.06.2025) from organizer file 322_1750193697699.txt
- June 17, 2025: **IMPLEMENTED** - Complete link management system with dynamic updates and deletion functionality for match URLs
- June 17, 2025: **ADDED** - Red "Șterge" button for deleting match links in admin interface with real-time synchronization
- June 17, 2025: **COMPLETED** - Clickable match scores as hyperlinks to Faceit for statistics and demos - clean UX without extra buttons
- June 17, 2025: **COMPLETED** - Tournament schedule updated with official TXT data (June 2025, 7 days, 105 total matches, complete round-robin format per group)
- June 17, 2025: **ADDED** - Tournament schedule module between match results and groups with expandable interface showing complete match calendar
- June 17, 2025: **UPDATED** - Adapted tournament stage progression details with corrected Stage 2 format (11 direct + 5 from elimination = 16 total)
- June 17, 2025: **ORGANIZED** - Arranged tournament stages in separate horizontal row with responsive 4-column grid layout
- June 17, 2025: **SEPARATED** - Split tournament stages into individual modules, each stage now displays as its own card like tournament groups
- June 17, 2025: **REDESIGNED** - Reorganized tournament stage rules into 4 separate blocks using 2x2 grid layout matching group card design
- June 17, 2025: **ENHANCED** - Added complete 4-stage tournament format with detailed progression rules (42→21→16→8→1)
- June 17, 2025: **CORRECTED** - Fixed playoff calculation display to show correct 21 teams advancing (7 groups × 3 teams) instead of erroneous 22 teams
- June 17, 2025: **RECONFIGURED** - Eliminated RCBVR team and restructured tournament to 7 groups with 6 teams each (42 teams total, 21 advance to playoff)
- June 17, 2025: **STANDARDIZED** - Aligned all button chevron positions to the right side for perfect visual consistency across all 3 main buttons
- June 17, 2025: **FIXED** - Corrected TournamentGroups button styling to match all other buttons with border-primary/50 and outline variant
- June 17, 2025: **UNIFIED** - Applied consistent styling to all 5 buttons across the page with border-primary/50 and hover effects
- June 17, 2025: **TRANSLATED** - Added Russian translations for all 3 tournament buttons and unified styling with consistent border-primary/50 background
- June 17, 2025: **SECURED** - Fixed and tested duplicate match validation - teams cannot play twice against each other in any order within same group
- June 17, 2025: **FIXED** - Green qualification background now appears only for teams with points from played matches, not for 0-0 teams
- June 17, 2025: **UNIFIED** - Copied exact button styling from TournamentGroups for perfect visual consistency across both sync buttons
- June 17, 2025: **SYNCHRONIZED** - Updated MatchSchedule component to use dynamic group configuration from database instead of hardcoded team lists
- June 17, 2025: **INTEGRATED** - Added playoff rules section as a module in the same grid with groups, positioned after Group G with identical styling
- June 17, 2025: **FIXED** - Repaired synchronization system to force complete recalculation from PostgreSQL database - standings now perfectly reflect database state  
- June 17, 2025: **OPTIMIZED** - Removed title from match schedule and reorganized matches with played matches first, then upcoming matches
- June 17, 2025: **ELIMINATED** - Removed duplicate match results from tournament groups - results now show only in dedicated match schedule section
- June 17, 2025: **COMPLETED** - Added collapsible "Programul Meciurilor" section with toggle button matching groups design
- June 17, 2025: **ORGANIZED** - Match schedule displays by groups only (A, B, C, etc.) without day divisions as requested
- June 17, 2025: **INTEGRATED** - Match results automatically sync from PostgreSQL database with live score updates
- June 17, 2025: **COMPLETED** - All match results display perfectly in tournament groups with full PostgreSQL synchronization
- June 17, 2025: **VERIFIED** - Points, wins, losses, and round differences display correctly for all teams (Auratix 6pts, BPSP 3pts, Japon 3pts)
- June 17, 2025: Implemented auto-sync system ensuring all match statistics appear instantly in group standings
- June 17, 2025: Removed separate MatchResults module - results now display only within tournament groups structure
- June 17, 2025: Completed final integration of match results directly into TournamentGroups component
- June 17, 2025: Eliminated standalone MatchResults component and integrated all functionality into groups display
- June 17, 2025: Integrated match results from PostgreSQL database directly into tournament groups display - results now appear under each group automatically
- June 17, 2025: Completed full database integration - both group standings and match results pull from PostgreSQL in real-time
- June 17, 2025: Implemented compact match results display within tournament groups with live data synchronization
- June 17, 2025: Fixed team filtering in match results form - teams now display correctly filtered by selected group
- June 17, 2025: Added validation to prevent teams from playing against themselves in match results
- June 17, 2025: Created MatchResultsManager component with full CRUD operations for match results
- June 17, 2025: Migrated tournament system to PostgreSQL for complete data persistence - all match results, group configurations, and standings now saved permanently in database
- June 17, 2025: Implemented complete match validation system - teams can only play once against each other within same group, with CS2 BO1 scoring validation (minimum 13 rounds to win)
- June 17, 2025: Fixed CS2 BO1 display format - removed draws, now shows only W-L format (wins-losses) as CS2 cannot have ties
- June 17, 2025: Updated admin password to "Admin322" for all authentication systems
- June 17, 2025: Added "Gestionare Turneu" button in admin dashboard for easy access to tournament management
- June 17, 2025: Secured /admin/tournament with admin authentication (same as /admin)
- June 17, 2025: Updated playoff advancement rules - groups with 6 teams advance top 3, group with 7 teams advances top 4 (total 22 teams to playoff)
- June 17, 2025: Implemented complete manual group management system with team selection, distribution, and instant reflection on main page
- June 17, 2025: Added comprehensive admin interface with "Configurare Grupe" and "Rezultate Meciuri" tabs
- June 17, 2025: Removed team Crasat from tournament due to disqualification (now 43 teams total)
- June 17, 2025: Updated Kamikaze Clan captain name from "crititadon" to correct "critidaton" and fixed team configuration
- June 16, 2025: Added new team Kamikaze Clan with 5 members (critidaton captain, 4 main players) and authentic logo
- June 16, 2025: Updated Bloody team roster with 6 new authentic members (Nostoping captain, 5 main players)
- June 16, 2025: Updated Xtreme Players member enthys1astyl with correct nickname and FACEIT profile
- June 16, 2025: Updated Japon team roster with 9 new authentic members (CCLey captain, 5 main players, 3 reserves)
- June 16, 2025: Updated KostiujeniKlinik team roster with 6 new authentic members (PhXGON captain, 4 main players, 1 reserve)
- June 16, 2025: Added 4 new teams to database - Win Spirit, Xtreme Players, Saponel, BaitMD (now 43 teams total)
- June 16, 2025: Updated database to 262 total members with authentic tournament data
- June 16, 2025: Created PostgreSQL database with all 39 teams and 239 members exactly as shown on site
- June 16, 2025: Migrated from MemStorage to DatabaseStorage for teams and team members
- June 16, 2025: All team data now persisted in PostgreSQL with authentic logos and FACEIT profiles
- June 14, 2025: Updated XPlosion team positions - Gherman- is main player, P1oNeR-_- moved to reserve
- June 14, 2025: Corrected XPlosion captain to "Duke_0" with proper FACEIT profile link
- June 14, 2025: Completed alphabetical team mapping correction for all 39 teams
- June 14, 2025: Successfully integrated complete team rosters with 277 authentic players across 39 teams
- June 14, 2025: Processed official tournament files to extract real player data with captains and positions
- June 14, 2025: Updated all team member data with authentic nickname information from tournament organizers
- June 14, 2025: Corrected team name "Tigger" to "Trigger" - VeryGoodTeam remains unchanged
- June 14, 2025: Added VeryGoodTeam as 39th team in HATOR CS2 LEAGUE MOLDOVA
- June 14, 2025: Updated Cadian Team logo with official tournament branding
- June 14, 2025: Implemented neutral dark gray background for optimal logo visibility
- June 14, 2025: Integrated all tournament teams with authentic logos from organizer's archive
- June 14, 2025: Deployed complete HATOR CS2 LEAGUE MOLDOVA roster with real team data
- June 14, 2025: Finalized team card design with 280x280 pixel logos filling maximum space
- June 14, 2025: Optimized 3D flip card animation with horizontal member layout
- June 14, 2025: Enhanced team member system with position field (main/reserve)
- June 14, 2025: Updated tournament capacity planning for approximately 40 teams
- June 14, 2025: Added multilingual support for team member positions and roles

## Tournament Planning
- Expected participation: ~40 teams from Moldova and Romania
- Team structure: 5 main players + reserves per team
- Player positions: Main lineup and reserve players clearly indicated

## Changelog

Changelog:
- June 14, 2025. Initial setup