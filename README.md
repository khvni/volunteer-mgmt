# MyFundAction Volunteer Management System

A comprehensive volunteer management and project matching platform with gamification features, built for MyFundAction (Yayasan Kebajikan Muslim) to manage 18,000+ volunteers across 5 countries.

## Overview

This system addresses the challenges of managing a large volunteer base through:
- Centralized volunteer database
- Project matching and assignment
- Gamification (tiers, badges, points, leaderboard)
- GPS-enabled check-in/check-out for hours tracking
- Volunteer networking features
- Mobile-first responsive design

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** (RC)
- **TypeScript** (strict mode)
- **Tailwind CSS** + **Shadcn UI**
- **React Hook Form** + **Zod** validation

### Backend
- **Next.js API Routes** (serverless)
- **Prisma ORM** with PostgreSQL
- **NextAuth v5** for authentication (RBAC)

### Services
- **Vercel** for hosting and analytics
- **Vercel Postgres** (dev) / **Supabase** (production)
- **Vercel Blob** / **Cloudinary** for file storage
- **Resend** for email notifications
- **Pusher** for real-time features
- **Sentry** for error tracking
- **PostHog** for analytics

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd volunteer-mgmt
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your database credentials and API keys:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/volunteer_dev"
   DIRECT_URL="postgresql://user:password@localhost:5432/volunteer_dev"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Push Prisma schema to database
   npm run db:push

   # Or run migrations
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
volunteer-mgmt/
├── app/                      # Next.js App Router pages
│   ├── volunteers/          # Volunteer management pages
│   ├── projects/            # Project browsing and management
│   ├── leaderboard/         # Gamification leaderboard
│   ├── badges/              # Badge showcase
│   ├── register/            # Volunteer registration
│   ├── login/               # Authentication
│   ├── layout.tsx           # Root layout with navigation
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   └── navigation.tsx       # Main navigation bar
├── lib/                     # Utility functions
│   ├── prisma.ts           # Prisma client singleton
│   └── utils.ts            # Helper functions
├── prisma/                  # Database schema and migrations
│   └── schema.prisma       # Prisma schema definition
├── public/                  # Static assets
├── types/                   # TypeScript type definitions
└── package.json            # Dependencies and scripts
```

## Key Features

### MVP (Phase 1)

#### Volunteer Management
- ✅ Volunteer registration with profile creation
- ✅ Profile management (skills, interests, availability)
- ✅ Volunteer list and search (admin view)
- ✅ Volunteer verification workflow

#### Project Matching
- ✅ Browse available projects (mobile-friendly cards)
- ✅ Filter projects by location, date, type, skills
- ✅ Self-assignment to projects
- ✅ Project capacity tracking
- ✅ Confirm/cancel attendance

#### Hours Tracking
- GPS-enabled check-in/check-out
- Automatic hours calculation
- Hours approval workflow
- Hours history per volunteer

#### Gamification
- ✅ 5-tier system (Bronze → Diamond)
- ✅ Points system (10 points = 1 hour)
- ✅ Badge system (12+ badges)
- ✅ Leaderboard (top volunteers)
- Tier progression notifications

#### Networking
- View volunteer profiles
- Send/accept connection requests
- Connected volunteers list

## Database Schema

The Prisma schema includes:
- **Volunteer** - Volunteer profiles with skills, tier, points
- **Project** - Volunteer projects with requirements
- **VolunteerAssignment** - Project assignments
- **VolunteerAttendance** - Check-in/check-out records
- **Badge** - Achievement badges
- **Achievement** - Earned achievements
- **VolunteerConnection** - Networking connections
- **User** - Authentication and RBAC

See `prisma/schema.prisma` for the complete schema.

## Available Scripts

```bash
# Development
npm run dev              # Start development server

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data

# Production
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests with Playwright

# Code Quality
npm run lint             # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`

4. **Configure database migrations**
   Set build command to:
   ```bash
   prisma migrate deploy && prisma generate && next build
   ```

### Environment Variables for Production

Required for production deployment:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `NEXTAUTH_SECRET` - Production secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Production URL (e.g., `https://volunteers.myfundaction.org`)
- `CLOUDINARY_*` - Cloudinary credentials for file uploads
- `RESEND_API_KEY` - Resend API key for emails
- `WHATSAPP_*` - WhatsApp Business API credentials
- `PUSHER_*` - Pusher credentials for real-time features

## Gamification System

### Volunteer Tiers

| Tier | Required Hours | Benefits |
|------|----------------|----------|
| **Bronze** | 0 hours | Basic access |
| **Silver** | 50 hours | Priority project notifications |
| **Gold** | 150 hours | Certificate of appreciation |
| **Platinum** | 500 hours | Leadership opportunities |
| **Diamond** | 1000 hours | Exclusive events, mentorship |

### Badge Categories

- **Hours** - Time-based milestones (10h, 50h, 100h, 500h, 1000h)
- **Projects** - Project completion milestones
- **Skills** - Skill-specific achievements
- **Leadership** - Team leadership badges
- **Special** - Event-specific (Ramadan, global volunteer)

## Malaysian Context

### Internationalization
- English and Bahasa Malaysia support
- Malaysian phone number validation (+60)
- Malaysian states and cities
- Islamic calendar integration (Ramadan programs)

### WhatsApp Integration
- WhatsApp Business API for notifications
- Click-to-chat buttons for volunteer coordination

## Development Workflow

### Git Worktree (Recommended)

This project is part of a monorepo. Use git worktree for isolated development:

```bash
# From main repo
git worktree add -b volunteer-mgmt/main ../myfundaction-worktrees/volunteer-mgmt volunteer-mgmt

# Navigate to worktree
cd ../myfundaction-worktrees/volunteer-mgmt
```

### Commit Conventions

Use conventional commits:
```bash
git commit -m "feat(volunteer-mgmt): add project matching algorithm"
git commit -m "fix(volunteer-mgmt): correct hours calculation"
git commit -m "docs(volunteer-mgmt): update setup instructions"
```

### Branch Naming
- Main: `volunteer-mgmt/main`
- Features: `volunteer-mgmt/feat/feature-name`
- Fixes: `volunteer-mgmt/fix/bug-description`

## Testing

### Unit Tests (Vitest)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

Test critical user flows:
- Volunteer registration
- Project browsing and joining
- Check-in/check-out workflow
- Connection requests

## Monitoring & Analytics

### Vercel Analytics
Built-in web analytics for page views and performance.

### Sentry
Error tracking and performance monitoring.

### PostHog
User behavior analytics and feature flags.

## API Routes

Key API endpoints (to be implemented):

```
/api/volunteers          - Volunteer CRUD
/api/projects            - Project CRUD
/api/assignments         - Project assignments
/api/attendance          - Check-in/check-out
/api/gamification        - Tiers, badges, leaderboard
/api/connections         - Volunteer networking
```

## Security

- RBAC with 5 roles (Super Admin, Admin, Staff, Coordinator, Volunteer)
- Row-level security via Prisma middleware
- GPS validation for check-in/check-out
- File upload validation
- Rate limiting with Upstash Redis
- Audit logging for sensitive operations

## Contributing

This is an internal MyFundAction project. For questions or contributions, contact the development team.

## License

Proprietary - MyFundAction (Yayasan Kebajikan Muslim)

## Support

For technical support or questions:
- Email: tech@myfundaction.org
- Internal Slack: #volunteer-management

---

Built with ❤️ for 18,000+ volunteers making a difference worldwide.
