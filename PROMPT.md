# Volunteer Management & Project Matching System - MyFundAction

## 1. PROJECT CONTEXT

### About MyFundAction
MyFundAction (Yayasan Kebajikan Muslim) is a youth-driven Malaysian NGO established in 2014, dedicated to helping low-income groups, underprivileged communities, and senior citizens. The organization operates globally across 5 countries with:
- **18,000+ active volunteers** (90% youth)
- **180 full-time staff members**
- **Global operations** in Malaysia, New Zealand, Egypt, Indonesia, Africa, and Japan
- **Islamic charity focus** including programs like Homeless Care, food distribution, shelter services, and more

### Problem Statement
MyFundAction manages **18,000+ volunteers** using spreadsheets and manual coordination. This creates significant challenges:
- **No centralized volunteer database**: Information scattered across multiple Excel files
- **Inefficient project matching**: Manual assignment of volunteers to projects
- **No gamification**: Cannot track volunteer hours, achievements, or motivate continued engagement
- **Limited networking**: Volunteers across locations cannot connect or collaborate
- **Poor mobile experience**: No mobile-friendly interface for volunteers in the field
- **Difficult reporting**: Cannot track volunteer engagement, retention, or impact

The organization needs a **comprehensive volunteer management system** with project matching capabilities, gamification features, and networking tools to engage and retain their massive volunteer base.

### Current State & Pain Points
- Volunteer data in multiple Excel spreadsheets
- Project assignments done manually via WhatsApp groups
- No tracking of volunteer hours or contributions
- No recognition system for high-performing volunteers
- Difficult to match volunteer skills with project needs
- No way for volunteers to discover available projects
- Limited visibility into volunteer engagement metrics
- No integration with beneficiary or project systems

### Success Metrics for MVP
- **Volunteer onboarding**: < 3 minutes per volunteer
- **Project matching**: Volunteers can browse and join projects in < 2 minutes
- **Mobile usage**: 80%+ of volunteers access via mobile
- **Engagement**: 30%+ increase in active volunteers within 90 days
- **Hours tracking**: 100% of volunteer hours logged automatically
- **Tier progression**: Volunteers achieve tier upgrades within 6 months
- **Networking**: 40%+ of volunteers connect with peers across locations

---

## 2. TECHNICAL ARCHITECTURE

### Tech Stack

**Frontend:**
- Next.js 15 (App Router) with React 19
- TypeScript (strict mode)
- Shadcn UI + Tailwind CSS + Radix UI
- React Hook Form + Zod validation
- next-intl (English + Bahasa Malaysia)

**Backend:**
- Next.js API Routes (serverless)
- Prisma ORM
- Vercel Postgres (development)
- Supabase PostgreSQL (production - cost-effective at scale)

**Authentication:**
- NextAuth v5 (Auth.js)
- Role-based access control (RBAC)
- Roles: Super Admin, Admin, Staff, Volunteer Coordinator, Volunteer

**File Storage:**
- Vercel Blob (development)
- Cloudinary (production - volunteer photos, certificates)

**Email/Notifications:**
- Resend for email notifications
- Web Push API for browser notifications
- WhatsApp Business API for project updates

**Real-time Features:**
- Pusher or Ably for real-time project updates
- Socket.io for live volunteer chat

**State Management:**
- Zustand for global UI state
- React Query for server state management

**Testing:**
- Vitest for unit/integration tests
- Playwright MCP for E2E testing

**Analytics & Monitoring:**
- Vercel Analytics
- Sentry for error tracking
- Posthog for user behavior analytics

### Suggested Prisma Schema

```prisma
// schema.prisma

model Volunteer {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Personal Information
  firstName     String
  lastName      String
  dateOfBirth   DateTime?
  gender        Gender?
  nationality   String?
  idNumber      String?  @unique // IC number or passport

  // Contact Information
  phone         String   @unique
  email         String   @unique
  whatsappNumber String?
  address       String?
  city          String?
  state         String?
  postcode      String?

  // Emergency Contact
  emergencyName     String?
  emergencyPhone    String?
  emergencyRelation String?

  // Volunteer Profile
  photoUrl      String?
  bio           String?  @db.Text
  skills        String[] // ["event_management", "first_aid", "teaching"]
  languages     String[] // ["english", "bahasa", "mandarin"]
  interests     String[] // ["homeless_care", "food_distribution", "education"]
  availability  Json?    // { "monday": ["morning", "evening"], "saturday": ["full_day"] }

  // Volunteer Status
  status        VolunteerStatus @default(ACTIVE)
  verified      Boolean  @default(false)
  verifiedAt    DateTime?
  tier          VolunteerTier @default(BRONZE)

  // Gamification
  totalHours    Decimal  @default(0) @db.Decimal(10, 2)
  points        Int      @default(0)
  badges        Badge[]
  achievements  Achievement[]

  // Relationships
  assignments   VolunteerAssignment[]
  attendances   VolunteerAttendance[]
  reviews       VolunteerReview[]
  connections   VolunteerConnection[] @relation("VolunteerConnections")
  connectedBy   VolunteerConnection[] @relation("ConnectedVolunteers")
  messages      Message[]

  // User Account
  user          User?    @relation(fields: [userId], references: [id])
  userId        String?  @unique

  // Metadata
  source        String?  // "website", "referral", "event"
  referredBy    Volunteer? @relation("VolunteerReferrals", fields: [referredById], references: [id])
  referredById  String?
  referrals     Volunteer[] @relation("VolunteerReferrals")

  @@index([status])
  @@index([tier])
  @@index([email])
  @@index([phone])
}

model Project {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Project Information
  title         String
  description   String   @db.Text
  type          ProjectType
  category      ProjectCategory
  location      String
  state         String?
  coordinates   Json?    // { lat, lng }

  // Dates & Capacity
  startDate     DateTime
  endDate       DateTime?
  isRecurring   Boolean  @default(false)
  recurringPattern String? // "weekly", "monthly"

  volunteersNeeded Int
  volunteersJoined Int @default(0)

  // Requirements
  minAge        Int?
  requiredSkills String[] // ["first_aid", "driving_license"]
  physicalDemand PhysicalDemand?

  // Status
  status        ProjectStatus @default(DRAFT)
  priority      Priority @default(MEDIUM)

  // Media
  imageUrl      String?
  images        String[]

  // Gamification
  pointsReward  Int @default(10)
  badgeReward   String? // Badge ID to award on completion

  // Relationships
  assignments   VolunteerAssignment[]
  attendances   VolunteerAttendance[]
  reviews       ProjectReview[]
  createdBy     User   @relation(fields: [createdById], references: [id])
  createdById   String

  @@index([status])
  @@index([type])
  @@index([startDate])
}

model VolunteerAssignment {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  volunteer     Volunteer @relation(fields: [volunteerId], references: [id], onDelete: Cascade)
  volunteerId   String

  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId     String

  // Assignment Details
  status        AssignmentStatus @default(PENDING)
  role          String? // "team_leader", "coordinator", "volunteer"
  assignedAt    DateTime @default(now())
  confirmedAt   DateTime?
  completedAt   DateTime?
  cancelledAt   DateTime?
  cancellationReason String?

  // Hours Tracking
  clockInTime   DateTime?
  clockOutTime  DateTime?
  hoursWorked   Decimal? @db.Decimal(10, 2)
  hoursApproved Decimal? @db.Decimal(10, 2)

  // Points & Rewards
  pointsEarned  Int @default(0)
  badgeAwarded  String?

  @@unique([volunteerId, projectId])
  @@index([volunteerId])
  @@index([projectId])
  @@index([status])
}

model VolunteerAttendance {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())

  volunteer     Volunteer @relation(fields: [volunteerId], references: [id], onDelete: Cascade)
  volunteerId   String

  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId     String

  // Check-in/Check-out
  checkInTime   DateTime
  checkOutTime  DateTime?
  location      Json?    // GPS coordinates
  photoUrl      String?  // Check-in photo

  // Hours
  hoursWorked   Decimal? @db.Decimal(10, 2)
  approved      Boolean  @default(false)
  approvedBy    User?    @relation(fields: [approvedById], references: [id])
  approvedById  String?
  approvedAt    DateTime?

  notes         String?

  @@index([volunteerId])
  @@index([projectId])
  @@index([checkInTime])
}

model VolunteerTier {
  tier          String   @id // "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"
  name          String
  minHours      Decimal  @db.Decimal(10, 2)
  minPoints     Int
  color         String
  icon          String
  benefits      Json     // { "priority_booking": true, "certificate": true }

  volunteers    Volunteer[] @relation(references: [tier])
}

model Badge {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())

  name          String
  description   String
  icon          String
  category      BadgeCategory
  rarity        BadgeRarity

  // Requirements to earn
  requirement   Json     // { "type": "hours", "value": 50 }

  volunteers    Volunteer[]

  @@index([category])
}

model Achievement {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())

  volunteer     Volunteer @relation(fields: [volunteerId], references: [id], onDelete: Cascade)
  volunteerId   String

  type          String   // "hours_milestone", "project_completed", "skill_earned"
  title         String
  description   String
  icon          String
  points        Int
  metadata      Json?

  @@index([volunteerId])
  @@index([type])
}

model VolunteerConnection {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())

  volunteer     Volunteer @relation("VolunteerConnections", fields: [volunteerId], references: [id], onDelete: Cascade)
  volunteerId   String

  connectedWith Volunteer @relation("ConnectedVolunteers", fields: [connectedWithId], references: [id], onDelete: Cascade)
  connectedWithId String

  status        ConnectionStatus @default(PENDING)
  message       String?

  @@unique([volunteerId, connectedWithId])
  @@index([volunteerId])
  @@index([connectedWithId])
}

model Message {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())

  sender        Volunteer @relation(fields: [senderId], references: [id], onDelete: Cascade)
  senderId      String

  recipientId   String?
  projectId     String?  // For project group chats

  content       String   @db.Text
  read          Boolean  @default(false)
  readAt        DateTime?

  @@index([senderId])
  @@index([recipientId])
  @@index([projectId])
}

model VolunteerReview {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())

  volunteer     Volunteer @relation(fields: [volunteerId], references: [id], onDelete: Cascade)
  volunteerId   String

  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId     String

  rating        Int      // 1-5
  comment       String?  @db.Text

  reviewedBy    User     @relation(fields: [reviewedById], references: [id])
  reviewedById  String

  @@index([volunteerId])
  @@index([projectId])
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  role          UserRole
  organization  String?

  // Relations
  volunteer     Volunteer?
  createdProjects Project[]
  approvedAttendances VolunteerAttendance[]
  reviews       VolunteerReview[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum VolunteerStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  ARCHIVED
}

enum VolunteerTier {
  BRONZE
  SILVER
  GOLD
  PLATINUM
  DIAMOND
}

enum ProjectType {
  ONE_TIME
  RECURRING
  CAMPAIGN
  EMERGENCY
}

enum ProjectCategory {
  HOMELESS_CARE
  FOOD_DISTRIBUTION
  EDUCATION
  HEALTHCARE
  DISASTER_RELIEF
  FUNDRAISING
  ADMIN_SUPPORT
  EVENT_MANAGEMENT
  OTHER
}

enum ProjectStatus {
  DRAFT
  PUBLISHED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum AssignmentStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum PhysicalDemand {
  LOW
  MEDIUM
  HIGH
}

enum BadgeCategory {
  HOURS
  PROJECTS
  SKILLS
  LEADERSHIP
  SPECIAL
}

enum BadgeRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}

enum ConnectionStatus {
  PENDING
  ACCEPTED
  REJECTED
  BLOCKED
}

enum UserRole {
  SUPER_ADMIN
  ADMIN
  STAFF
  VOLUNTEER_COORDINATOR
  VOLUNTEER
}
```

### Authentication & Authorization Strategy

**Roles & Permissions:**
- **Super Admin**: Full system access, manage all users and settings
- **Admin**: Manage volunteers, projects, approve hours, view all reports
- **Staff**: Create projects, manage assigned projects, view volunteer lists
- **Volunteer Coordinator**: Assign volunteers to projects, approve hours, manage teams
- **Volunteer**: View and join projects, track hours, connect with other volunteers

**Row-Level Security:**
- Volunteers can only see their own data and public volunteer profiles
- Coordinators can see volunteers assigned to their projects
- Admins can see all volunteer data
- Audit logs for all sensitive operations

### API Design Patterns

**RESTful API Routes:**
```
/api/volunteers
  GET    - List volunteers (paginated, filtered)
  POST   - Register new volunteer

/api/volunteers/[id]
  GET    - Get volunteer profile
  PATCH  - Update volunteer profile
  DELETE - Soft delete (archive)

/api/volunteers/[id]/assignments
  GET    - List volunteer's project assignments
  POST   - Join a project

/api/volunteers/[id]/hours
  GET    - Get volunteer hours summary

/api/volunteers/[id]/badges
  GET    - Get volunteer badges

/api/volunteers/[id]/connect
  POST   - Send connection request

/api/projects
  GET    - List available projects (filtered by location, type, date)
  POST   - Create new project

/api/projects/[id]
  GET    - Get project details
  PATCH  - Update project
  DELETE - Cancel project

/api/projects/[id]/join
  POST   - Join project as volunteer

/api/projects/[id]/volunteers
  GET    - List volunteers on project

/api/assignments/[id]/check-in
  POST   - Clock in to project

/api/assignments/[id]/check-out
  POST   - Clock out from project

/api/leaderboard
  GET    - Get volunteer leaderboard

/api/gamification/tiers
  GET    - Get tier information

/api/gamification/badges
  GET    - List all available badges
```

---

## 3. MVP FEATURE SPECIFICATION

### Must-Have (Phase 1 - MVP Demo)

**Volunteer Management:**
- ✅ Volunteer registration with profile creation
- ✅ Profile management (edit bio, skills, availability)
- ✅ Upload volunteer photo
- ✅ Skills and interests tagging
- ✅ View volunteer list (admin/coordinator view)
- ✅ Search and filter volunteers
- ✅ Volunteer verification (admin approval)

**Project Matching:**
- ✅ Create projects with detailed requirements
- ✅ Browse available projects (mobile-friendly cards)
- ✅ Filter projects (location, date, type, skills needed)
- ✅ Volunteer can join projects (self-assignment)
- ✅ Project capacity tracking (spots remaining)
- ✅ Project details page with volunteer list
- ✅ Confirm/cancel project attendance

**Hours Tracking:**
- ✅ Clock in/out system (GPS-enabled)
- ✅ Automatic hours calculation
- ✅ Hours approval workflow (coordinator → admin)
- ✅ Hours history per volunteer
- ✅ Bulk hours approval

**Gamification (Basic):**
- ✅ Volunteer tiers (Bronze → Diamond)
- ✅ Points system (hours = points)
- ✅ Hours milestones (10h, 50h, 100h, 500h, 1000h)
- ✅ Basic badges (First Project, 10 Projects, 100 Hours, etc.)
- ✅ Leaderboard (top volunteers by hours/points)
- ✅ Tier progression notifications

**Networking (Basic):**
- ✅ View other volunteer profiles (public info only)
- ✅ Send connection requests
- ✅ Accept/reject connections
- ✅ View connected volunteers list

**Mobile-Friendly:**
- ✅ Responsive design (mobile-first)
- ✅ Touch-friendly project cards
- ✅ Quick project join flow
- ✅ Mobile check-in/check-out

**Authentication:**
- ✅ Email/password registration and login
- ✅ Role-based access control
- ✅ Volunteer self-registration

### Should-Have (Phase 2 - Post-Demo)

- Advanced project matching algorithm (skills + interests + location + availability)
- In-app messaging between volunteers
- Project group chat
- WhatsApp integration for project notifications
- Advanced badges (skill-specific, leadership, teamwork)
- Certificate generation for volunteers
- QR code check-in/check-out
- Volunteer availability calendar
- Project recommendations based on volunteer profile
- Volunteer analytics dashboard (for admins)
- Email notifications for project updates
- Push notifications for project reminders
- Volunteer referral program
- Multi-location project support
- Team leader designation and permissions

### Could-Have (Future Enhancements)

- Mobile app (React Native/Capacitor)
- AI-powered project recommendations
- Volunteer skills assessment and training modules
- Volunteer mentorship program matching
- Social media integration (share achievements)
- Volunteer rewards marketplace (redeem points)
- Integration with beneficiary system (see impact)
- Integration with CRM (donor → volunteer conversion)
- Event calendar view
- Volunteer forums/community board
- Video testimonials
- Multi-language support (expand beyond English/Bahasa)
- Corporate volunteer program management
- Volunteer insurance and liability tracking

### Out of Scope

- Volunteer payment processing (all volunteers are unpaid)
- Inventory management (handled by logistics system)
- Donation tracking (CRM handles this)
- Fundraising features (separate system)
- HR/payroll for staff (separate system)

---

## 4. MCP SERVER UTILIZATION GUIDE

### sequential-thinking
**Use for:**
- Complex matching algorithms (volunteer → project matching)
- Gamification system design (points, tiers, badges logic)
- Networking graph optimization
- Database schema validation for relationships
- Performance optimization for 18,000+ volunteers

**Example:**
```
Use sequential-thinking to analyze: "What's the optimal algorithm for matching volunteers to projects based on skills, location, availability, and past performance?"
```

### filesystem
**Use for:**
- Reading multiple component files simultaneously
- Batch operations (creating gamification components)
- Project structure analysis
- Finding specific patterns across files

### fetch
**Use for:**
- Researching volunteer management best practices
- Finding React Hook Form + Zod patterns
- Looking up Shadcn UI component documentation
- Researching gamification systems
- WhatsApp Business API documentation

### deepwiki
**Use for:**
- Exploring OpenVolunteerPlatform repo (github.com/aerogear/OpenVolunteerPlatform)
- Studying rubyforgood/casa (volunteer management patterns)
- Understanding best practices from established projects

**Example repos to explore:**
- aerogear/OpenVolunteerPlatform - Volunteer platform patterns
- rubyforgood/casa - Case management with volunteer assignment
- 24pullrequests/24pullrequests - Gamification examples

### allpepper-memory-bank
**Use for:**
- Storing gamification rules and logic
- Documenting tier progression calculations
- Recording badge requirements
- Tracking matching algorithm decisions

**Files to create:**
- `gamification-rules.md` - Points, tiers, badges logic
- `matching-algorithm.md` - Project matching strategy
- `networking-features.md` - Volunteer connection rules
- `mobile-optimization.md` - Mobile-first design decisions

### playwright (MCP)
**Use for:**
- E2E testing critical user flows:
  - Volunteer registration
  - Project browsing and joining
  - Check-in/check-out workflow
  - Profile updates
  - Connection requests
- Testing mobile responsive design
- Screenshot generation for documentation

**Example test:**
```typescript
// Test volunteer registration and project join flow
test('volunteer can register and join project', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name="firstName"]', 'Test');
  await page.fill('[name="lastName"]', 'Volunteer');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="phone"]', '+60123456789');
  await page.click('button[type="submit"]');

  // Browse projects
  await page.goto('/projects');
  await page.click('.project-card:first-child .join-button');

  // Verify joined
  await expect(page.locator('.success-message')).toContainText('Successfully joined project');
});
```

### puppeteer
**Use for:**
- Browser automation for testing
- Generating PDF certificates for volunteers
- Screenshot capture for badges

---

## 5. REFERENCE IMPLEMENTATIONS

### GitHub Repositories to Clone/Reference

**Primary Reference:**
1. **OpenVolunteerPlatform** - https://github.com/aerogear/OpenVolunteerPlatform
   - Concepts: Volunteer management, project assignments, admin dashboard
   - Study their data model and workflow
   - **Note**: Node.js/GraphQL, adapt concepts to Next.js

2. **CASA (Court Appointed Special Advocates)** - https://github.com/rubyforgood/casa
   - Volunteer assignment patterns
   - Case management with volunteers
   - **Note**: Ruby on Rails, adapt concepts

**Next.js Templates:**
3. **TailAdmin Next.js** - https://github.com/TailAdmin/free-nextjs-admin-dashboard
   - Use as base template for admin dashboard
   - Table, charts, form patterns

4. **Next Shadcn Dashboard Starter** - https://github.com/Kiranism/next-shadcn-dashboard-starter
   - Modern Next.js 15 + Shadcn UI
   - Clean architecture patterns

**Gamification References:**
5. **24 Pull Requests** - https://github.com/24pullrequests/24pullrequests
   - Gamification patterns (badges, leaderboards)
   - User engagement strategies

**Form & Data Management:**
6. **Taxonomy** - https://github.com/shadcn-ui/taxonomy
   - Shadcn UI patterns
   - Form handling examples

### Similar Projects to Study

- **Be My Eyes** - Volunteer matching platform
- **Golden Volunteer** - Volunteer hour tracking and management
- **VolunteerMatch** - Project discovery and matching
- **Track It Forward** - Volunteer hour tracking

### Recommended Tutorials/Docs

- **Next.js 15 App Router**: https://nextjs.org/docs
- **Prisma with Next.js**: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql
- **NextAuth v5**: https://authjs.dev/getting-started/installation
- **Shadcn UI**: https://ui.shadcn.com/docs
- **React Hook Form + Zod**: https://react-hook-form.com/get-started#SchemaValidation
- **Geolocation API**: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- **Pusher Real-time**: https://pusher.com/docs

---

## 6. DATA MIGRATION & INTEGRATION

### Import Existing Volunteer Data

**Current Data Format:**
- Excel spreadsheets with volunteer information
- WhatsApp groups for coordination
- Manual tracking of hours in notebooks/sheets
- Estimated 18,000+ volunteers to migrate

**Migration Strategy:**

**Phase 1: Data Audit**
1. Export all volunteer Excel files
2. Standardize column names across files
3. Create mapping: Excel columns → Volunteer model
4. Identify duplicates (phone/email matching)
5. Clean data quality issues

**Phase 2: CSV Import Utility**
Create `/api/volunteers/import` endpoint with:
- CSV parsing (use `papaparse` library)
- Column mapping UI
- Data validation (Zod schemas)
- Duplicate detection
- Error reporting
- Preview mode
- Batch import (100 volunteers per batch)

**Example CSV Import Flow:**
```typescript
// lib/import/volunteer-csv-parser.ts
import Papa from 'papaparse';
import { volunteerSchema } from '@/lib/validation';

export async function parseVolunteerCSV(file: File) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const validated = results.data.map((row) => {
          return volunteerSchema.safeParse(mapCSVRow(row));
        });
        resolve(validated);
      },
      error: reject,
    });
  });
}

function mapCSVRow(row: any) {
  return {
    firstName: row['First Name'] || row['Name']?.split(' ')[0],
    lastName: row['Last Name'] || row['Name']?.split(' ').slice(1).join(' '),
    phone: formatMalaysianPhone(row['Phone'] || row['Contact']),
    email: row['Email'],
    skills: row['Skills']?.split(',').map((s: string) => s.trim()),
    // ... more mappings
  };
}
```

**Phase 3: Deduplication**
- Detect duplicates based on:
  - Phone number (primary)
  - Email address
  - Name + DOB combination
- Show duplicate candidates before import
- Merge or skip strategy
- Link duplicate accounts

**Data Validation Rules:**
- Required fields: firstName, lastName, phone, email
- Phone format: Malaysian (+60) validation
- Email: RFC 5322 validation
- Age: 16+ for volunteers
- Skills: Validate against predefined skill list

### Integration with Other MyFundAction Systems

**Beneficiary System Integration:**
- Volunteers can see beneficiaries they've helped (with permission)
- Track services provided by specific volunteers
- Link volunteer hours to beneficiary impact

**CRM Integration:**
- Volunteer → Donor conversion tracking
- Shared contact information
- Unified user profiles

**Project Dashboard Integration:**
- Real-time volunteer metrics on project dashboard
- Project progress updates based on volunteer hours
- Budget tracking (volunteer hours = in-kind value)

**Shared Data Models:**
```typescript
// types/shared.ts (shared across all 6 projects)
export interface Address {
  street?: string;
  city: string;
  state: string;
  postcode?: string;
  country: string;
}

export interface Contact {
  phone: string;
  email?: string;
  whatsappNumber?: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}

export interface AuditLog {
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: object;
}
```

---

## 7. GIT WORKTREE WORKFLOW

### Setting Up Worktree for Isolated Development

**Why Worktrees?**
- Develop all 6 projects simultaneously with separate Claude Code instances
- Keep main repository clean
- Switch between projects without stashing changes
- Easy testing of cross-project integrations

**Create Worktree:**
```bash
# From main repository root: /Users/khani/Desktop/projs/myfundaction-protos

# Create worktree for volunteer management system
git worktree add -b volunteer-mgmt/main ../myfundaction-worktrees/volunteer-mgmt volunteer-mgmt

# Navigate to worktree
cd ../myfundaction-worktrees/volunteer-mgmt

# Open in VS Code (or your editor)
code .

# Start Claude Code in this directory
claude-code
```

**Worktree Structure:**
```
myfundaction-protos/          (main repo)
├── volunteer-mgmt/           (this project)
├── beneficiary/
├── projs-dashboard/
└── ...

myfundaction-worktrees/       (worktrees)
├── volunteer-mgmt/           (isolated working tree)
├── beneficiary/
├── projs-dashboard/
└── ...
```

### Branch Naming Conventions

**Main branch per project:**
- `volunteer-mgmt/main`
- `beneficiary/main`
- `projs-dashboard/main`
- etc.

**Feature branches:**
- `volunteer-mgmt/feat/project-matching`
- `volunteer-mgmt/feat/gamification`
- `volunteer-mgmt/feat/networking`
- `volunteer-mgmt/fix/hours-calculation`
- `volunteer-mgmt/chore/update-deps`

**Conventional Commits:**
```bash
git commit -m "feat(volunteer-mgmt): add project matching algorithm"
git commit -m "feat(volunteer-mgmt): implement volunteer tier system"
git commit -m "fix(volunteer-mgmt): correct hours calculation for overnight projects"
git commit -m "docs(volunteer-mgmt): update gamification documentation"
git commit -m "test(volunteer-mgmt): add E2E tests for project join flow"
```

### Commit Strategy

**IMPORTANT: Commit frequently as you build!**

**After each significant change:**
```bash
# Add files
git add .

# Commit with descriptive message
git commit -m "feat(volunteer-mgmt): implement volunteer registration with skills tagging"

# Push to remote (for backup and collaboration)
git push origin volunteer-mgmt/main
```

**Commit Checklist:**
- ✅ After creating new components
- ✅ After implementing new features
- ✅ After writing tests
- ✅ After fixing bugs
- ✅ Before switching to another task
- ✅ At least 3-5 times per hour during active development

**Good commit messages:**
```
✅ "feat(volunteer-mgmt): add Prisma schema for volunteers and projects"
✅ "feat(volunteer-mgmt): create project browsing with filters"
✅ "feat(volunteer-mgmt): implement check-in/check-out with GPS"
✅ "fix(volunteer-mgmt): correct tier progression logic"
✅ "test(volunteer-mgmt): add unit tests for matching algorithm"
```

**Bad commit messages:**
```
❌ "update"
❌ "wip"
❌ "changes"
❌ "fix stuff"
```

### TodoWrite Tool Usage

**Use TodoWrite throughout development:**

```typescript
// Example: Breaking down project matching feature
TodoWrite([
  { content: "Create Prisma schema for Project and VolunteerAssignment", status: "completed", activeForm: "Creating Prisma schema" },
  { content: "Create project browsing page with filters", status: "in_progress", activeForm: "Creating project browsing page" },
  { content: "Implement project join functionality", status: "pending", activeForm: "Implementing project join functionality" },
  { content: "Add project capacity tracking", status: "pending", activeForm: "Adding project capacity tracking" },
  { content: "Create project detail page", status: "pending", activeForm: "Creating project detail page" },
  { content: "Write unit tests for project matching", status: "pending", activeForm: "Writing unit tests" },
]);
```

**Update todos as you progress** - mark completed, add new ones as discovered.

---

## 8. DEPLOYMENT STRATEGY

### Vercel Project Setup

**Create New Vercel Project:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from volunteer-mgmt directory
cd /path/to/worktree/volunteer-mgmt
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: myfundaction-volunteer-mgmt
# - Directory: ./
# - Build command: next build
# - Output directory: .next
# - Development command: next dev
```

**Vercel Project Settings:**
- **Framework Preset**: Next.js
- **Node Version**: 18.x or 20.x
- **Build Command**: `next build`
- **Install Command**: `npm install` or `yarn install`
- **Root Directory**: `./` (or `volunteer-mgmt/` if deploying from main repo)

### Environment Variables

**Required for Development (.env.local):**
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/volunteer_dev"
DIRECT_URL="postgresql://user:password@localhost:5432/volunteer_dev"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"

# Email (Resend)
RESEND_API_KEY="re_your_key_here"

# WhatsApp Business API
WHATSAPP_BUSINESS_ACCOUNT_ID="your_account_id"
WHATSAPP_ACCESS_TOKEN="your_access_token"

# Real-time (Pusher)
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
PUSHER_APP_ID="your_app_id"
PUSHER_SECRET="your_secret"

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_your_key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

**Required for Production (Vercel Dashboard):**
```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://volunteers.myfundaction.org"
NEXTAUTH_SECRET="strong-production-secret-here"

# Cloudinary (file storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Resend
RESEND_API_KEY="re_production_key"

# WhatsApp Business API
WHATSAPP_BUSINESS_ACCOUNT_ID="production_account_id"
WHATSAPP_ACCESS_TOKEN="production_access_token"

# Pusher
NEXT_PUBLIC_PUSHER_KEY="production_key"
NEXT_PUBLIC_PUSHER_CLUSTER="production_cluster"
PUSHER_APP_ID="production_app_id"
PUSHER_SECRET="production_secret"

# Sentry
SENTRY_DSN="https://xxx@yyy.ingest.sentry.io/zzz"

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="production_key"
```

### Database Migrations

**Local Development:**
```bash
# Create migration
npx prisma migrate dev --name add_volunteer_model

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

**Production (Vercel):**
```bash
# Add to package.json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

**Or use Vercel Build Command:**
```bash
prisma migrate deploy && prisma generate && next build
```

### Performance Optimization

**Next.js Configuration:**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // For photo uploads
    },
  },
};

module.exports = nextConfig;
```

**ISR (Incremental Static Regeneration):**
```typescript
// app/projects/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED' },
  });
  // ...
}
```

**Edge Functions for API Routes:**
```typescript
// app/api/projects/route.ts
export const runtime = 'edge'; // Deploy to edge

export async function GET(request: Request) {
  // ...
}
```

**Image Optimization:**
```typescript
import Image from 'next/image';

<Image
  src={volunteer.photoUrl}
  alt={volunteer.name}
  width={150}
  height={150}
  className="rounded-full"
  priority={false} // Lazy load
/>
```

### Custom Domain Configuration

**Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Add custom domain: `volunteers.myfundaction.org`
3. Configure DNS (CNAME or A record)
4. Automatic HTTPS via Let's Encrypt

**DNS Records (Cloudflare/Route53/etc.):**
```
Type: CNAME
Name: volunteers
Value: cname.vercel-dns.com
```

---

## 9. SECURITY & COMPLIANCE

### Data Encryption

**At Rest:**
- Vercel Postgres: Encrypted by default
- Supabase: AES-256 encryption
- Cloudinary: Encrypted storage

**In Transit:**
- HTTPS enforced (Vercel automatic)
- TLS 1.3 for database connections

**Sensitive Fields:**
```typescript
// Encrypt sensitive data before storing
import { encrypt, decrypt } from '@/lib/crypto';

// Store encrypted IC number
const encryptedIC = await encrypt(volunteer.idNumber);

// Prisma schema
model Volunteer {
  idNumberEncrypted String? // Store encrypted
}
```

### Role-Based Access Control (RBAC)

**Middleware Protection:**
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;

      if (path.startsWith('/admin')) {
        return token?.role === 'SUPER_ADMIN' || token?.role === 'ADMIN';
      }

      if (path.startsWith('/coordinator')) {
        return ['SUPER_ADMIN', 'ADMIN', 'VOLUNTEER_COORDINATOR'].includes(token?.role);
      }

      if (path.startsWith('/projects/create')) {
        return ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(token?.role);
      }

      return !!token; // Authenticated
    },
  },
});

export const config = {
  matcher: ['/admin/:path*', '/coordinator/:path*', '/profile/:path*', '/api/:path*'],
};
```

**API Route Protection:**
```typescript
// app/api/projects/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Proceed with project creation
}
```

### Audit Logging

**Track Critical Actions:**
```typescript
// lib/audit.ts
export async function logAudit(action: string, details: object) {
  await prisma.auditLog.create({
    data: {
      action,
      details,
      userId: session.user.id,
      ipAddress: req.headers.get('x-forwarded-for'),
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date(),
    },
  });
}

// Usage
await logAudit('VOLUNTEER_REGISTERED', { volunteerId: newVolunteer.id });
await logAudit('PROJECT_JOINED', { volunteerId, projectId });
await logAudit('HOURS_APPROVED', { volunteerId, hours: 8 });
```

**Audit Log Model:**
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  action      String
  details     Json
  userId      String
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime @default(now())

  @@index([userId])
  @@index([timestamp])
}
```

### GPS Location Security

**Validation:**
```typescript
// lib/location.ts
export function validateGPSCoordinates(lat: number, lng: number) {
  if (lat < -90 || lat > 90) {
    throw new Error('Invalid latitude');
  }
  if (lng < -180 || lng > 180) {
    throw new Error('Invalid longitude');
  }
  return true;
}

// Check if location is within project vicinity (500m radius)
export function isWithinProjectLocation(
  userLat: number,
  userLng: number,
  projectLat: number,
  projectLng: number,
  radiusMeters: number = 500
): boolean {
  const distance = calculateDistance(userLat, userLng, projectLat, projectLng);
  return distance <= radiusMeters;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Haversine formula
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
```

### File Upload Security

**Validation:**
```typescript
// lib/upload.ts
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageUpload(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WEBP allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum 5MB.');
  }

  return true;
}
```

### Rate Limiting

**API Routes:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '10 s'), // 20 requests per 10 seconds
});

// Usage in API route
export async function POST(req: Request) {
  const identifier = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  // Proceed
}
```

### GDPR/Data Privacy Compliance

**Right to be Forgotten:**
```typescript
// app/api/volunteers/[id]/anonymize/route.ts
export async function POST(req: Request, { params }) {
  await prisma.volunteer.update({
    where: { id: params.id },
    data: {
      firstName: 'ANONYMIZED',
      lastName: 'ANONYMIZED',
      phone: 'ANONYMIZED',
      email: null,
      address: null,
      photoUrl: null,
      bio: 'Data anonymized per user request',
    },
  });
}
```

**Data Export:**
```typescript
// app/api/volunteers/[id]/export/route.ts
export async function GET(req: Request, { params }) {
  const volunteer = await prisma.volunteer.findUnique({
    where: { id: params.id },
    include: {
      assignments: true,
      attendances: true,
      badges: true,
      achievements: true,
    },
  });

  return new Response(JSON.stringify(volunteer), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="volunteer-${params.id}.json"`,
    },
  });
}
```

---

## 10. TESTING APPROACH

### Unit Testing (Vitest)

**Setup:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Example Tests:**
```typescript
// __tests__/lib/gamification.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTier, calculatePoints } from '@/lib/gamification';

describe('Gamification System', () => {
  it('should calculate correct tier based on hours', () => {
    expect(calculateTier(5)).toBe('BRONZE');
    expect(calculateTier(50)).toBe('SILVER');
    expect(calculateTier(150)).toBe('GOLD');
    expect(calculateTier(500)).toBe('PLATINUM');
    expect(calculateTier(1000)).toBe('DIAMOND');
  });

  it('should award correct points for hours worked', () => {
    expect(calculatePoints(8)).toBe(80); // 10 points per hour
    expect(calculatePoints(0.5)).toBe(5); // Half hour
  });
});

// __tests__/lib/matching.test.ts
import { describe, it, expect } from 'vitest';
import { matchVolunteerToProject } from '@/lib/matching';

describe('Project Matching Algorithm', () => {
  it('should match volunteer with required skills', () => {
    const volunteer = {
      skills: ['first_aid', 'event_management'],
      location: 'Kuala Lumpur',
    };

    const project = {
      requiredSkills: ['first_aid'],
      location: 'Kuala Lumpur',
    };

    const score = matchVolunteerToProject(volunteer, project);
    expect(score).toBeGreaterThan(0.7); // Good match
  });
});
```

**Component Tests:**
```typescript
// __tests__/components/ProjectCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '@/components/ProjectCard';

describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    title: 'Food Distribution',
    location: 'Kuala Lumpur',
    volunteersNeeded: 10,
    volunteersJoined: 5,
    startDate: new Date('2025-11-01'),
  };

  it('should render project information', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Food Distribution')).toBeInTheDocument();
    expect(screen.getByText('5 / 10 volunteers')).toBeInTheDocument();
  });

  it('should handle join button click', async () => {
    const onJoin = vi.fn();
    render(<ProjectCard project={mockProject} onJoin={onJoin} />);

    fireEvent.click(screen.getByRole('button', { name: /join/i }));
    expect(onJoin).toHaveBeenCalledWith('1');
  });
});
```

### Integration Testing

**API Route Tests:**
```typescript
// __tests__/api/volunteers.test.ts
import { POST } from '@/app/api/volunteers/route';

describe('POST /api/volunteers', () => {
  it('should register a new volunteer', async () => {
    const req = new Request('http://localhost:3000/api/volunteers', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Volunteer',
        email: 'test@example.com',
        phone: '+60123456789',
        skills: ['event_management'],
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.firstName).toBe('Test');
    expect(data.tier).toBe('BRONZE');
  });
});

// __tests__/api/projects/join.test.ts
import { POST } from '@/app/api/projects/[id]/join/route';

describe('POST /api/projects/[id]/join', () => {
  it('should allow volunteer to join project', async () => {
    const req = new Request('http://localhost:3000/api/projects/123/join', {
      method: 'POST',
    });

    const response = await POST(req, { params: { id: '123' } });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('PENDING');
  });

  it('should reject if project is full', async () => {
    // Mock full project
    const response = await POST(req, { params: { id: 'full-project-id' } });
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: 'Project is full',
    });
  });
});
```

### E2E Testing with Playwright MCP

**Use the Playwright MCP server for E2E tests:**

```typescript
// tests/e2e/volunteer-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Volunteer Workflow', () => {
  test('complete volunteer registration and project join flow', async ({ page }) => {
    // Register as volunteer
    await page.goto('/register');
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Volunteer');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '+60123456789');
    await page.selectOption('[name="skills"]', ['event_management', 'first_aid']);
    await page.click('button[type="submit"]');

    // Verify redirect to profile
    await expect(page).toHaveURL(/\/profile/);

    // Browse projects
    await page.goto('/projects');

    // Filter by location
    await page.selectOption('[name="location"]', 'Kuala Lumpur');
    await expect(page.locator('.project-card')).toHaveCount(5);

    // Join a project
    await page.click('.project-card:first-child .join-button');
    await expect(page.locator('.success-message')).toContainText('Successfully joined');

    // Verify in "My Projects"
    await page.goto('/my-projects');
    await expect(page.locator('.my-project-card')).toHaveCount(1);
  });

  test('check-in/check-out workflow', async ({ page, context }) => {
    // Grant geolocation permissions
    await context.grantPermissions(['geolocation']);

    // Login as volunteer with project assignment
    await page.goto('/login');
    await page.fill('[name="email"]', 'volunteer@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Go to project
    await page.goto('/my-projects');
    await page.click('.project-card:first-child');

    // Check in
    await page.click('button:has-text("Check In")');

    // Verify GPS prompt
    await expect(page.locator('.gps-status')).toContainText('Location verified');

    // Verify checked in state
    await expect(page.locator('.check-in-status')).toContainText('Checked in at');

    // Wait some time (simulate working)
    await page.waitForTimeout(2000);

    // Check out
    await page.click('button:has-text("Check Out")');
    await expect(page.locator('.success-message')).toContainText('hours logged');
  });

  test('gamification - tier progression', async ({ page }) => {
    await page.goto('/profile');

    // Verify current tier
    await expect(page.locator('.tier-badge')).toContainText('Bronze');
    await expect(page.locator('.hours-count')).toContainText('15 hours');

    // Check progress to next tier
    const progress = page.locator('.tier-progress');
    await expect(progress).toBeVisible();
    await expect(progress).toContainText('35 hours to Silver');
  });
});

test.describe('Networking Features', () => {
  test('send and accept connection request', async ({ page, context }) => {
    // Login as volunteer 1
    await page.goto('/login');
    await page.fill('[name="email"]', 'volunteer1@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Browse volunteers
    await page.goto('/volunteers');
    await page.click('.volunteer-card:nth-child(2)'); // View another volunteer

    // Send connection request
    await page.click('button:has-text("Connect")');
    await page.fill('[name="message"]', 'Would love to collaborate!');
    await page.click('button:has-text("Send Request")');
    await expect(page.locator('.success-message')).toContainText('Connection request sent');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('button:has-text("Logout")');

    // Login as volunteer 2 (recipient)
    await page.goto('/login');
    await page.fill('[name="email"]', 'volunteer2@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Check notifications
    await page.click('[data-testid="notifications"]');
    await expect(page.locator('.notification-item')).toContainText('connection request');

    // Accept connection
    await page.click('.notification-item .accept-button');
    await expect(page.locator('.success-message')).toContainText('Connection accepted');

    // Verify in connections list
    await page.goto('/connections');
    await expect(page.locator('.connection-card')).toHaveCount(1);
  });
});
```

### Load Testing

**Considerations:**
- 18,000+ volunteers potentially accessing system
- Peak: Project launch announcements (100+ concurrent volunteer sign-ups)
- Test with k6 or Artillery

**Example Load Test (k6):**
```javascript
// tests/load/projects.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 500 }, // Ramp up to 500 volunteers
    { duration: '5m', target: 500 }, // Stay at 500
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
  },
};

export default function () {
  // Browse projects
  const projectsRes = http.get('https://volunteers.myfundaction.org/api/projects');
  check(projectsRes, {
    'projects list loaded': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // View project details
  const projectId = JSON.parse(projectsRes.body).data[0].id;
  const detailRes = http.get(`https://volunteers.myfundaction.org/api/projects/${projectId}`);
  check(detailRes, {
    'project details loaded': (r) => r.status === 200,
  });

  sleep(1);
}
```

---

## 11. MALAYSIAN CONTEXT

### i18n Setup (Bahasa Malaysia + English)

**Install next-intl:**
```bash
npm install next-intl
```

**Configuration:**
```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

**Messages:**
```json
// messages/en.json
{
  "volunteer": {
    "title": "Volunteers",
    "register": "Register as Volunteer",
    "profile": "Volunteer Profile",
    "skills": "Skills",
    "hours": "Hours Volunteered",
    "tier": "Volunteer Tier",
    "tiers": {
      "bronze": "Bronze",
      "silver": "Silver",
      "gold": "Gold",
      "platinum": "Platinum",
      "diamond": "Diamond"
    }
  },
  "project": {
    "title": "Projects",
    "browse": "Browse Projects",
    "join": "Join Project",
    "myProjects": "My Projects",
    "checkIn": "Check In",
    "checkOut": "Check Out",
    "volunteersNeeded": "{count} volunteers needed"
  }
}

// messages/ms.json
{
  "volunteer": {
    "title": "Sukarelawan",
    "register": "Daftar Sebagai Sukarelawan",
    "profile": "Profil Sukarelawan",
    "skills": "Kemahiran",
    "hours": "Jam Menyukarelawan",
    "tier": "Tahap Sukarelawan",
    "tiers": {
      "bronze": "Gangsa",
      "silver": "Perak",
      "gold": "Emas",
      "platinum": "Platinum",
      "diamond": "Berlian"
    }
  },
  "project": {
    "title": "Projek",
    "browse": "Cari Projek",
    "join": "Sertai Projek",
    "myProjects": "Projek Saya",
    "checkIn": "Daftar Masuk",
    "checkOut": "Daftar Keluar",
    "volunteersNeeded": "{count} sukarelawan diperlukan"
  }
}
```

**Usage:**
```typescript
import { useTranslations } from 'next-intl';

export default function VolunteerPage() {
  const t = useTranslations('volunteer');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('hours')}: 50</p>
    </div>
  );
}
```

### Malaysian Phone Number Format

**Validation:**
```typescript
// lib/validation.ts
import { z } from 'zod';

export const malaysianPhoneSchema = z
  .string()
  .regex(/^\+60\d{9,10}$/, 'Invalid Malaysian phone number. Format: +60123456789');

// Example usage
const volunteerSchema = z.object({
  phone: malaysianPhoneSchema,
  whatsappNumber: malaysianPhoneSchema.optional(),
});
```

**Formatting:**
```typescript
// lib/format.ts
export function formatMalaysianPhone(phone: string): string {
  // +60123456789 → +60 12-345 6789
  return phone.replace(/(\+60)(\d{2})(\d{3})(\d{4})/, '$1 $2-$3 $4');
}

export function cleanPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // Add +60 if not present
  if (!cleaned.startsWith('+60')) {
    if (cleaned.startsWith('60')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '+60' + cleaned.slice(1);
    } else {
      cleaned = '+60' + cleaned;
    }
  }

  return cleaned;
}
```

### Malaysian States and Cities

**List of Malaysian States:**
```typescript
// lib/constants/malaysia.ts
export const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
];

export const MAJOR_CITIES = [
  'Kuala Lumpur',
  'Johor Bahru',
  'Penang',
  'Ipoh',
  'Shah Alam',
  'Petaling Jaya',
  'Kuching',
  'Kota Kinabalu',
  'Malacca City',
  'Kuantan',
];
```

### WhatsApp Integration

**WhatsApp Business API Setup:**
```typescript
// lib/whatsapp.ts
export async function sendWhatsAppNotification(
  phone: string,
  message: string
) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace('+', ''),
        type: 'text',
        text: { body: message },
      }),
    }
  );

  return response.json();
}

// Usage: Notify volunteer about project updates
export async function notifyProjectUpdate(
  volunteerId: string,
  projectTitle: string,
  message: string
) {
  const volunteer = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
    select: { whatsappNumber: true, firstName: true },
  });

  if (volunteer?.whatsappNumber) {
    await sendWhatsAppNotification(
      volunteer.whatsappNumber,
      `Hi ${volunteer.firstName}! 📢\n\nUpdate for "${projectTitle}":\n${message}\n\n- MyFundAction`
    );
  }
}
```

**WhatsApp Click-to-Chat Button:**
```tsx
// components/WhatsAppButton.tsx
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton({ phone, message }: { phone: string; message?: string }) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  const url = `https://wa.me/${cleanPhone}${encodedMessage}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-green-600 hover:text-green-700"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp
    </a>
  );
}
```

### Islamic Calendar Integration

**For Ramadan volunteer programs, Qurbani timing:**
```bash
npm install moment-hijri
```

**Example:**
```typescript
import moment from 'moment-hijri';

// Check if current date is in Ramadan
export function isRamadan(): boolean {
  const hijriMonth = moment().iMonth() + 1; // iMonth() is 0-indexed
  return hijriMonth === 9; // Ramadan is 9th month
}

// Get next Eid al-Adha date
export function getNextEidAlAdha(): Date {
  const currentYear = moment().iYear();
  const eidDate = moment(`${currentYear}/12/10`, 'iYYYY/iM/iD');

  if (eidDate.isBefore(moment())) {
    // If this year's Eid has passed, get next year's
    return moment(`${currentYear + 1}/12/10`, 'iYYYY/iM/iD').toDate();
  }

  return eidDate.toDate();
}
```

---

## 12. MONITORING & ANALYTICS

### Vercel Analytics

**Install:**
```bash
npm install @vercel/analytics
```

**Setup:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Track Custom Events:**
```typescript
import { track } from '@vercel/analytics';

// Track volunteer registration
track('volunteer_registered', {
  tier: 'BRONZE',
  source: 'website',
});

// Track project join
track('project_joined', {
  projectType: project.type,
  volunteersNeeded: project.volunteersNeeded,
});

// Track tier progression
track('tier_upgraded', {
  fromTier: 'SILVER',
  toTier: 'GOLD',
  hoursWorked: volunteer.totalHours,
});

// Track check-in
track('volunteer_checked_in', {
  projectId: project.id,
  projectType: project.type,
});
```

### Sentry Error Tracking

**Install:**
```bash
npm install @sentry/nextjs
```

**Setup:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

**Custom Error Logging:**
```typescript
try {
  await joinProject(volunteerId, projectId);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'project_join' },
    user: { id: session.user.id },
    extra: { projectId, volunteerId },
  });
  throw error;
}
```

### Posthog User Behavior Analytics

**Install:**
```bash
npm install posthog-js
```

**Setup:**
```typescript
// lib/posthog.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export { posthog };
```

**Track Events:**
```typescript
import { posthog } from '@/lib/posthog';

// Track volunteer activity
posthog.capture('project_browsed', {
  filters: { location: 'Kuala Lumpur', type: 'ONE_TIME' },
  resultsCount: 15,
});

// Identify volunteer
posthog.identify(volunteer.id, {
  email: volunteer.email,
  tier: volunteer.tier,
  totalHours: volunteer.totalHours,
  skills: volunteer.skills,
});

// Track funnel
posthog.capture('onboarding_step_completed', {
  step: 'profile_creation',
  completionRate: 0.8,
});
```

### Custom Dashboards for Volunteer Metrics

**Key Metrics to Track:**
- Active volunteers (logged in last 30 days)
- New volunteer registrations (daily/weekly/monthly)
- Project participation rate
- Average hours per volunteer
- Tier distribution (Bronze/Silver/Gold/Platinum/Diamond)
- Retention rate (volunteers active after 6 months)
- Most popular project types
- Geographic distribution of volunteers
- Skills distribution

**Implementation:**
```typescript
// app/api/metrics/volunteers/route.ts
export async function GET(req: Request) {
  const [
    totalVolunteers,
    activeVolunteers,
    averageHours,
    tierDistribution,
  ] = await Promise.all([
    prisma.volunteer.count(),
    prisma.volunteer.count({
      where: {
        updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.volunteer.aggregate({
      _avg: { totalHours: true },
    }),
    prisma.volunteer.groupBy({
      by: ['tier'],
      _count: true,
    }),
  ]);

  return Response.json({
    totalVolunteers,
    activeVolunteers,
    averageHours: averageHours._avg.totalHours,
    tierDistribution,
  });
}

// app/api/metrics/projects/route.ts
export async function GET(req: Request) {
  const [projectsByType, upcomingProjects, completedThisMonth] = await Promise.all([
    prisma.project.groupBy({
      by: ['type'],
      _count: true,
    }),
    prisma.project.count({
      where: {
        status: 'PUBLISHED',
        startDate: { gte: new Date() },
      },
    }),
    prisma.project.count({
      where: {
        status: 'COMPLETED',
        endDate: {
          gte: new Date(new Date().setDate(1)), // Start of month
        },
      },
    }),
  ]);

  return Response.json({
    projectsByType,
    upcomingProjects,
    completedThisMonth,
  });
}
```

**Volunteer Engagement Dashboard:**
```typescript
// components/admin/VolunteerMetricsDashboard.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function VolunteerMetricsDashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['volunteer-metrics'],
    queryFn: async () => {
      const res = await fetch('/api/metrics/volunteers');
      return res.json();
    },
  });

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Volunteers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{metrics.totalVolunteers}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active (30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{metrics.activeVolunteers}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{metrics.averageHours?.toFixed(1)}</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Tier Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={800} height={300} data={metrics.tierDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tier" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="_count" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Uptime Monitoring

**Use UptimeRobot or Better Uptime:**
- Monitor `https://volunteers.myfundaction.org/api/health`
- Alert via Email, WhatsApp, Slack if downtime

**Health Check Endpoint:**
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis (if using for caching/rate limiting)
    // await redis.ping();

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
```

---

## FINAL INSTRUCTIONS

### Development Checklist

- [ ] Clone OpenVolunteerPlatform or start fresh with `npx create-next-app@latest`
- [ ] Set up Prisma with the suggested schema
- [ ] Implement NextAuth with RBAC
- [ ] Create volunteer registration and profile management
- [ ] Build project browsing and matching system
- [ ] Implement project join/leave functionality
- [ ] Add check-in/check-out with GPS tracking
- [ ] Implement hours tracking and approval workflow
- [ ] Build gamification system (tiers, badges, points, leaderboard)
- [ ] Create networking features (connections, messaging)
- [ ] Set up file uploads (photos, certificates)
- [ ] Implement notification system (email + WhatsApp)
- [ ] Create admin dashboard with metrics
- [ ] Write unit tests for gamification logic
- [ ] Write E2E tests with Playwright MCP
- [ ] Set up i18n (English + Bahasa Malaysia)
- [ ] Deploy to Vercel
- [ ] Configure production database (Supabase)
- [ ] Set up monitoring (Sentry, Posthog, Vercel Analytics)
- [ ] Test with real volunteer data import

### Remember:

1. **Commit frequently** - at least 3-5 times per hour
2. **Use TodoWrite** to track your progress
3. **Use MCP tools**:
   - sequential-thinking for complex algorithms (matching, gamification)
   - filesystem for multi-file operations
   - fetch/deepwiki for research
   - allpepper-memory-bank to document decisions
   - playwright for E2E testing
4. **Mobile-first design** - 90% of volunteers are youth using mobile
5. **Gamification is key** - engage and retain volunteers through rewards
6. **Test GPS functionality** - critical for check-in/check-out
7. **WhatsApp integration** - primary communication channel in Malaysia

Good luck building! This system will empower 18,000+ volunteers to make a real impact.
