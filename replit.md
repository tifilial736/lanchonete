# Overview

This is a full-stack restaurant ordering system called "Snacks Chicken" built with React, Express.js, and PostgreSQL. The application provides a customer-facing menu interface where users can browse products, add items to cart, and place orders, along with an admin dashboard for managing products and viewing order statistics. The system integrates with Replit's authentication system and supports PIX payment processing for Brazilian customers.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with two main routes (home and admin)
- **State Management**: TanStack Query for server state management and React Context for cart state
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Framework**: Express.js server with TypeScript
- **API Design**: RESTful API structure with separate route handlers for products, orders, authentication, and statistics
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Authentication**: Replit's OpenID Connect (OIDC) authentication system with session management
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

## Database Design
- **ORM**: Drizzle with schema-first approach for type safety
- **Tables**: Users, products, orders, order items, and sessions tables
- **Schema Location**: Shared schema definitions in `/shared/schema.ts` for type consistency between frontend and backend
- **Migrations**: Drizzle Kit for database schema migrations

## Authentication & Authorization
- **Provider**: Replit Auth using OpenID Connect protocol
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Protected Routes**: Admin dashboard requires authentication, public menu accessible to all users
- **User Management**: Automatic user creation/update on authentication

## Key Features
- **Product Management**: CRUD operations for menu items with categories (burgers, combos)
- **Shopping Cart**: Client-side cart state with localStorage persistence
- **Order Processing**: Complete order workflow with customer details and payment method selection
- **PIX Integration**: Brazilian payment system with QR code generation
- **Admin Dashboard**: Statistics tracking, product management, and order monitoring
- **Responsive Design**: Mobile-first design with Tailwind CSS

# External Dependencies

## Database
- **Neon Database**: PostgreSQL database with serverless connection pooling
- **Connection**: Uses @neondatabase/serverless package with WebSocket support

## Authentication
- **Replit Auth**: OpenID Connect authentication provider
- **Session Store**: PostgreSQL session storage with automatic cleanup

## Payment Processing
- **PIX**: Brazilian instant payment system integration
- **QR Code**: Generated PIX codes for mobile payment apps

## UI Components
- **Radix UI**: Headless component library for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Development environment optimizations and error handling