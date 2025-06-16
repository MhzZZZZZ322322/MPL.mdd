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