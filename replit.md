# AgroBagual - Agricultural Management Application

## Overview

AgroBagual is a comprehensive agricultural management platform designed to help farmers and agricultural producers manage their operations efficiently. The application provides a dashboard with weather information, livestock management, AI-powered agricultural assistance (SemeIA), GPS tools for field management, and a marketplace for agricultural products. Built as a full-stack web application, it combines modern web technologies with agricultural domain expertise to deliver practical farming solutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript, utilizing a component-based architecture with shadcn/ui components for the UI layer. The frontend implements a mobile-first responsive design with a bottom navigation tab system for easy access to different sections (Home, Livestock, SemeIA, GPS, Market). React Query is used for server state management and data fetching, while Wouter handles client-side routing. The application uses a custom theming system with CSS variables for consistent styling across agricultural-themed color schemes.

### Backend Architecture
The server is built on Express.js with TypeScript, implementing a RESTful API architecture. The application uses session-based authentication through Replit's OAuth system with PostgreSQL session storage. API routes are organized by feature domains (animals, reminders, notes, market, GPS, weather, AI chat). The server includes middleware for request logging, error handling, and authentication checks. File uploads are handled through multer middleware for animal photos and other attachments.

### Database Layer
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes core entities for users, animals, vaccinations, reminders, notes, market listings, and GPS routes. Database migrations are managed through Drizzle Kit, and the connection is established using Neon's serverless PostgreSQL driver with WebSocket support for optimal performance.

### Authentication System
Authentication is implemented using Replit's OpenID Connect (OIDC) system with Passport.js strategy. User sessions are stored in PostgreSQL using connect-pg-simple, providing secure session management. The system maintains user profiles with agricultural-specific information like role and farm details. Protected routes require authentication middleware that validates session tokens.

### AI Integration
The application integrates OpenAI's GPT-5 model for the SemeIA agricultural assistant feature. This provides both text-based chat functionality for agricultural questions and image analysis capabilities for crop/livestock assessment. The AI system is specifically prompted for agricultural expertise, covering topics like crop management, livestock care, market trends, and farming technology.

### Weather Service Integration
Weather functionality is provided through OpenWeatherMap API integration, offering current conditions and 3-day forecasts. The service is localized for Brazilian locations and provides agricultural-relevant data including precipitation, wind speed, and temperature information crucial for farming decisions.

## External Dependencies

### Database and Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL database with WebSocket support for optimal connection management
- **Replit Authentication**: OAuth-based authentication system using OpenID Connect protocol

### Third-party APIs
- **OpenAI API**: Powers the SemeIA agricultural assistant with GPT-5 model for chat and image analysis capabilities
- **OpenWeatherMap API**: Provides weather data including current conditions and forecasts for agricultural planning

### UI and Frontend Libraries
- **shadcn/ui**: Complete component library built on Radix UI primitives for consistent, accessible interface components
- **Radix UI**: Low-level UI primitives providing the foundation for form controls, dialogs, and interactive elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design and custom agricultural theming
- **React Query**: Server state management for efficient data fetching, caching, and synchronization

### Development and Build Tools
- **Vite**: Frontend build tool and development server with hot module replacement
- **Drizzle ORM**: Type-safe database ORM with migration management through Drizzle Kit
- **TypeScript**: Static typing for both client and server code
- **ESBuild**: Fast JavaScript bundler for production builds

### File Handling and Utilities
- **Multer**: Middleware for handling multipart/form-data and file uploads
- **Date-fns**: Date manipulation library for handling agricultural schedules and reminders
- **Wouter**: Lightweight client-side routing library for React