# Moldova Pro League (MPL) - Replit Guide

## Overview
Moldova Pro League (MPL) is a web application for a Moldovan esports organization, serving as a central hub for managing and showcasing esports events, with a primary focus on CS2 tournaments. The application provides features for game server monitoring, comprehensive event management (including tournament brackets and match results), player rankings, and dynamic content management, offering real-time updates and an engaging user experience for fans and participants.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preference: Eliminate all fire symbols (🔥) from the entire site for a clean, professional look.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with a custom design system, utilizing Radix UI primitives and shadcn/ui.
- **Routing**: Wouter for client-side navigation.
- **State Management**: TanStack Query for managing server state and data synchronization.
- **Animations**: AOS (Animate On Scroll) and Framer Motion for visual effects.
- **Build Tool**: Vite for development and production builds.
- **UI/UX Decisions**: Emphasizes clear visual hierarchy, responsive layouts, consistent button styling, and user-friendly navigation. Tournament brackets feature professional SVG connections and responsive designs.

### Backend
- **Runtime**: Node.js with TypeScript.
- **Framework**: Express.js for API development.
- **Database ORM**: Drizzle ORM for PostgreSQL interaction.
- **Database**: PostgreSQL.
- **Game Server Monitoring**: GameDig library for real-time CS2 server status.
- **Email Services**: SendGrid for contact form submissions.
- **Build Tool**: esbuild for production bundling.

### Core Features and Design Patterns
- **Database Schema**: Includes tables for Users, Events, Players, CS Servers, Contact Submissions, FAQs, Site Content, and SEO Settings.
- **Game Server Integration**: Real-time CS2 server monitoring and background status checks.
- **Content Management**: Admin authentication for dynamic content editing, event management, SEO settings, and player ranking.
- **Tournament Management**: Comprehensive system for multi-stage tournaments, real-time standings, automatic progression logic, CRUD operations for matches, teams, and stages, score validation, and dynamic group configuration.
- **Discord Integration**: Automated webhook notifications for team registrations, approvals, and rejections with rich embed formatting.
- **Data Flow**: Frontend communicates with the Express backend, which handles business logic, database interactions via Drizzle ORM, and external service integrations.
- **File Structure**: Organized into `client/`, `server/`, `shared/`, and `public/`.

## External Dependencies

- **Database**: Neon serverless PostgreSQL
- **Game Server Monitoring**: GameDig library
- **Email Service**: SendGrid
- **Discord Integration**: Discord Webhook API for team registration notifications
- **Frontend Libraries**: React, Wouter, TanStack Query, Radix UI, shadcn/ui, AOS, Framer Motion
- **Backend Libraries**: Express.js, Drizzle ORM
- **Build Tools**: Vite, esbuild
- **Development Tools**: TypeScript