# Technology Stack Documentation
## Agentic AI-Powered Pharmacy Assistant

**Last Updated**: February 15, 2026  
**Version**: 1.0  
**Product Type**: Healthcare SaaS Web Application  
**Team Size**: 3-4 developers (2 full-stack, 1 AI/ML specialist, 1 product manager)  
**Timeline**: 16-week MVP, 22-week V1.0

---

## 1. Stack Overview

### Architecture Pattern
- **Type**: Modular Monolith (transitioning to Microservices post-MVP)
- **Pattern**: Client-Server with Event-Driven Workflows
- **Deployment**: Cloud-Native (Multi-Region)
- **Data Flow**: 
  - Frontend ↔ Backend API ↔ Database
  - Backend → n8n Workflows → External Services
  - LLM API ↔ Backend (for AI agent)

### Architecture Justification

**Why Modular Monolith for MVP?**
- Faster development velocity (single deployment unit)
- Easier debugging and testing
- Lower operational complexity for small team
- Single database simplifies transactions
- Can extract microservices later if needed

**Post-MVP Migration Path**:
- Extract Order Service (high traffic)
- Extract AI Agent Service (independent scaling)
- Extract Notification Service (async workflows)

**Why Cloud-Native?**
- HIPAA compliance easier with managed services
- Auto-scaling for variable load (refill alerts batch at 6 AM)
- Geographic redundancy for high availability
- Cost-effective for MVP (pay-as-you-grow)

---

## 2. Frontend Stack

### Core Framework
- **Framework**: Next.js
- **Version**: 14.2.0
- **Reason**: 
  - Server-Side Rendering (SSR) for SEO (landing pages, marketing content)
  - App Router with React Server Components (better performance)
  - Built-in API routes for BFF (Backend-for-Frontend) pattern
  - Image optimization (prescription uploads)
  - File-based routing (easy to navigate codebase)
- **Documentation**: https://nextjs.org/docs
- **License**: MIT
- **Alternatives Considered**:
  - Create React App (rejected: no SSR, deprecated)
  - Remix (rejected: smaller ecosystem, team unfamiliar)
  - Vite + React (rejected: need SSR for SEO)

### UI Library
- **Library**: React
- **Version**: 18.2.0
- **Reason**: 
  - Component-based architecture (reusable chat bubbles, order cards)
  - Concurrent rendering (smooth chat experience)
  - Largest ecosystem (many AI chat UI libraries)
  - Team expertise
- **Documentation**: https://react.dev
- **License**: MIT

### State Management
- **Library**: Zustand
- **Version**: 4.5.0
- **Reason**: 
  - Lightweight (1.5KB) - critical for chat interface performance
  - TypeScript-first (type-safe state)
  - Minimal boilerplate (faster development)
  - No Provider hell (unlike Context API)
  - Built-in devtools
- **Documentation**: https://github.com/pmndrs/zustand
- **License**: MIT
- **Stores**:
  - `useAuthStore` (user session, token)
  - `useChatStore` (conversation history, active order)
  - `useOrderStore` (order tracking state)
  - `useAdminStore` (staff dashboard filters)
- **Alternatives Considered**:
  - Redux Toolkit (rejected: too verbose for small team)
  - Jotai (rejected: less mature)
  - Context API (rejected: re-render performance issues)

### Real-Time Communication
- **Library**: Socket.IO Client
- **Version**: 4.7.2
- **Reason**:
  - Bidirectional real-time updates (order status, admin dashboard)
  - Automatic reconnection (handles network drops)
  - Room-based subscriptions (user-specific order updates)
  - Fallback to polling (if WebSocket blocked)
- **Documentation**: https://socket.io/docs/v4/client-api/
- **License**: MIT

### Styling
- **Framework**: Tailwind CSS
- **Version**: 3.4.1
- **Configuration**: Custom config at `tailwind.config.ts`
- **Custom Theme**:
  - Primary: Blue (#2563EB) - Trust, healthcare
  - Success: Green (#10B981) - Order confirmations
  - Warning: Yellow (#F59E0B) - Low stock alerts
  - Error: Red (#EF4444) - Prescription issues
- **Reason**: 
  - Utility-first (rapid prototyping for MVP)
  - Consistent design system
  - Purged CSS (small bundle size)
  - Dark mode built-in (future feature)
  - Mobile-first responsive design
- **Documentation**: https://tailwindcss.com/docs
- **License**: MIT
- **Plugins**:
  - @tailwindcss/forms 0.5.7 (styled form inputs)
  - @tailwindcss/typography 0.5.10 (markdown content)

### UI Component Library
- **Library**: shadcn/ui
- **Version**: Latest (copied components, not package)
- **Components Used**:
  - Dialog (modals for prescription review)
  - Toast (notifications)
  - Dropdown Menu (admin actions)
  - Tabs (admin dashboard)
  - Badge (order status)
- **Reason**:
  - Copy-paste components (full customization)
  - Built on Radix UI (accessible)
  - Tailwind-based (consistent with stack)
  - TypeScript support
- **Documentation**: https://ui.shadcn.com
- **License**: MIT
- **Alternatives Considered**:
  - Material-UI (rejected: heavy bundle, opinionated design)
  - Chakra UI (rejected: runtime CSS-in-JS performance)
  - Ant Design (rejected: not medical-friendly aesthetics)

### Type Safety
- **Language**: TypeScript
- **Version**: 5.3.3
- **tsconfig**: Strict mode enabled
- **Reason**: 
  - Type safety (catch errors at compile time)
  - Better IDE autocomplete (faster development)
  - Self-documenting code (easier onboarding)
  - Essential for AI agent (typed tool calls)
- **Documentation**: https://www.typescriptlang.org/docs/
- **License**: Apache-2.0
- **Configuration**:
  ```json
  {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "esModuleInterop": true
  }
  ```

### Form Handling
- **Library**: React Hook Form
- **Version**: 7.50.0
- **Validation**: Zod 3.22.4
- **Reason**: 
  - Performance (minimal re-renders on input change)
  - TypeScript integration (type-safe validation)
  - Zod schema reuse (backend validation)
  - Small bundle size (important for mobile)
- **Documentation**: https://react-hook-form.com
- **License**: MIT
- **Example Schemas**:
  - `signupSchema` (email, password)
  - `addressSchema` (delivery address validation)
  - `prescriptionUploadSchema` (file type, size limits)
- **Alternatives Considered**:
  - Formik (rejected: larger bundle, slower performance)
  - Native HTML validation (rejected: poor UX)

### HTTP Client
- **Library**: Axios
- **Version**: 1.6.7
- **Interceptors**: 
  - Request: Inject JWT token from Zustand store
  - Response: Handle 401 (refresh token), 500 (toast error)
- **Reason**: 
  - Request/response interceptors (centralized auth)
  - Better error handling than fetch
  - Request cancellation (prevents race conditions in chat)
  - Progress tracking (prescription upload)
  - Timeout configuration
- **Documentation**: https://axios-http.com/docs/intro
- **License**: MIT
- **Configuration**:
  ```typescript
  baseURL: process.env.NEXT_PUBLIC_API_URL
  timeout: 10000
  withCredentials: true
  ```

### Data Fetching & Caching
- **Library**: TanStack Query (React Query)
- **Version**: 5.18.0
- **Reason**:
  - Automatic caching (reduces API calls)
  - Background refetching (fresh data)
  - Optimistic updates (instant UI feedback)
  - Infinite scroll support (order history)
  - Built-in loading/error states
- **Documentation**: https://tanstack.com/query/latest
- **License**: MIT
- **Query Keys**:
  - `['orders', userId]` (user's order history)
  - `['order', orderId]` (single order tracking)
  - `['inventory']` (medicine master list)
  - `['refill-alerts']` (admin dashboard)
- **Cache Times**:
  - Orders: 5 minutes
  - Inventory: 10 minutes
  - User profile: 30 minutes

### Routing
- **Built-in**: Next.js App Router
- **Version**: 14.2.0 (Next.js version)
- **Structure**: File-based routing with server components
- **Middleware**: `middleware.ts` for auth checks
- **Routes**:
  ```
  /app
    /(auth)
      /login
      /signup
      /verify-email
    /(dashboard)
      /dashboard
      /orders
        /[id]
      /prescriptions
      /account
    /staff
      /login
      /dashboard
  ```
- **Protected Routes**: Middleware redirects unauthenticated users

### File Upload
- **Library**: react-dropzone
- **Version**: 14.2.3
- **Reason**:
  - Drag-and-drop support (better UX)
  - File type validation
  - Image preview
  - Mobile camera access
- **Documentation**: https://react-dropzone.js.org
- **License**: MIT
- **Max File Size**: 10MB (prescription images)
- **Accepted Types**: image/jpeg, image/png, application/pdf

### Date Handling
- **Library**: date-fns
- **Version**: 3.3.0
- **Reason**:
  - Modular (import only needed functions)
  - Immutable (no mutation bugs)
  - TypeScript support
  - Locale support (future internationalization)
  - Smaller than moment.js
- **Documentation**: https://date-fns.org/docs/
- **License**: MIT
- **Common Uses**:
  - `formatDistanceToNow()` (order timestamps)
  - `addDays()` (refill predictions)
  - `isAfter()` (prescription expiration checks)

### Icons
- **Library**: lucide-react
- **Version**: 0.323.0
- **Reason**:
  - Tree-shakeable (only bundle used icons)
  - Consistent design
  - React components (easy to style)
  - 1000+ icons
- **Documentation**: https://lucide.dev/guide/packages/lucide-react
- **License**: ISC
- **Common Icons**: MessageSquare, Pill, Package, Bell, User, Settings

### Charts & Visualizations (Admin Analytics - Future)
- **Library**: Recharts
- **Version**: 2.12.0
- **Reason**:
  - React-based (consistent with stack)
  - Declarative API
  - Responsive
  - No canvas dependencies (better accessibility)
- **Documentation**: https://recharts.org/en-US/
- **License**: MIT
- **Usage**: Order volume charts, refill conversion funnels

---

## 3. Backend Stack

### Runtime
- **Platform**: Node.js
- **Version**: 20.11.0 LTS
- **Package Manager**: pnpm 8.15.1
- **Reason**: 
  - LTS (long-term support until April 2026)
  - Performance improvements over v18
  - Built-in fetch API (no node-fetch needed)
  - Native test runner (future: replace some vitest tests)
  - Team JavaScript expertise (no new language to learn)
- **Documentation**: https://nodejs.org/docs/latest-v20.x/api/
- **License**: MIT

### Framework
- **Framework**: Express.js
- **Version**: 4.18.2
- **Middleware Stack**: 
  - cors 2.8.5 (cross-origin requests)
  - helmet 7.1.0 (security headers)
  - morgan 1.10.0 (HTTP logging)
  - express-rate-limit 7.1.5 (DDoS protection)
  - compression 1.7.4 (gzip responses)
  - express-validator 7.0.1 (input validation)
- **Reason**: 
  - Mature (12+ years), stable
  - Flexible (not opinionated)
  - Large ecosystem (many middleware options)
  - Team familiarity
  - Easy to integrate with n8n webhooks
- **Documentation**: https://expressjs.com
- **License**: MIT
- **Alternatives Considered**:
  - Fastify (rejected: less middleware available)
  - NestJS (rejected: too much boilerplate for MVP)
  - Hono (rejected: too new, small community)

### API Structure
- **Pattern**: RESTful API
- **Versioning**: URL-based (`/api/v1/...`)
- **Response Format**: JSON
- **Error Format**: RFC 7807 Problem Details
- **Endpoints**:
  ```
  POST   /api/v1/auth/signup
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh
  GET    /api/v1/orders
  POST   /api/v1/orders
  GET    /api/v1/orders/:id
  PATCH  /api/v1/orders/:id
  GET    /api/v1/inventory
  PATCH  /api/v1/inventory/:id
  POST   /api/v1/chat/message
  GET    /api/v1/refill-alerts
  ```

### Database
- **Primary**: PostgreSQL
- **Version**: 16.1
- **Hosting**: Supabase (managed PostgreSQL)
- **ORM**: Prisma 5.9.0
- **Connection Pooling**: PgBouncer (built-in with Supabase)
- **Reason**: 
  - ACID compliance (critical for orders, payments)
  - JSON/JSONB support (store conversation history, LLM traces)
  - Full-text search (medicine name search)
  - Excellent TypeScript support (Prisma)
  - Row-level security (RLS) for multi-tenancy (future)
  - HIPAA-compliant hosting available
- **Documentation**: 
  - PostgreSQL: https://www.postgresql.org/docs/16/
  - Prisma: https://www.prisma.io/docs
- **License**: PostgreSQL License (permissive)
- **Alternatives Considered**:
  - MongoDB (rejected: need ACID transactions)
  - MySQL (rejected: inferior JSON support)
  - SQLite (rejected: not suitable for production scale)

#### Schema Management
- **Migrations**: Prisma Migrate
- **Command**: `pnpm prisma migrate dev`
- **Workflow**: 
  1. Edit `schema.prisma`
  2. Run migrate command
  3. Commit migration SQL file
  4. CI/CD runs migration on deploy
- **Seeding**: Prisma Seed scripts (`prisma/seed.ts`)
- **Backup Strategy**: 
  - Supabase automated daily backups (7-day retention)
  - Weekly manual backups to S3 (90-day retention)
- **Schema Overview**:
  ```prisma
  model User {
    id            String   @id @default(cuid())
    email         String   @unique
    passwordHash  String
    role          Role     @default(PATIENT)
    orders        Order[]
    prescriptions Prescription[]
  }
  
  model Order {
    id          String      @id @default(cuid())
    userId      String
    user        User        @relation(...)
    status      OrderStatus
    medications Json        // Array of {name, dosage, quantity}
    totalPrice  Decimal
    createdAt   DateTime    @default(now())
  }
  
  model Medicine {
    id                  String  @id @default(cuid())
    name                String
    genericName         String?
    dosage              String
    stockLevel          Int
    unitType            String
    prescriptionRequired Boolean
    price               Decimal
  }
  
  model RefillAlert {
    id             String   @id @default(cuid())
    userId         String
    medicationName String
    daysUntilOut   Int
    status         AlertStatus
    createdAt      DateTime @default(now())
  }
  ```

### Caching
- **System**: Redis
- **Version**: 7.2.4
- **Hosting**: Upstash (serverless Redis)
- **Client**: ioredis 5.3.2
- **Use Cases**: 
  - Session storage (user sessions)
  - API response caching (inventory list)
  - Rate limiting counters (login attempts)
  - Queue for n8n webhook retry (future)
- **TTL Strategy**: 
  - Sessions: 7 days
  - Inventory cache: 10 minutes
  - Rate limit counters: 15 minutes (rolling window)
- **Documentation**: https://redis.io/docs/
- **License**: Redis Source Available License 2.0
- **Reason**:
  - Fast (sub-millisecond latency)
  - Data structures (lists, sets for queues)
  - Pub/Sub (real-time notifications)
  - TTL support (automatic expiration)
- **Alternatives Considered**:
  - Memcached (rejected: no data structures, no persistence)
  - In-memory (rejected: lost on restart, not scalable)

### Authentication
- **Strategy**: JWT (JSON Web Tokens)
- **Library**: jsonwebtoken 9.0.2
- **Hashing**: bcrypt 5.1.1
- **Hash Rounds**: 12 (OWASP recommendation)
- **Token Types**:
  - Access Token: 15 minutes expiry, stored in httpOnly cookie
  - Refresh Token: 7 days expiry, stored in httpOnly cookie
- **Reason**: 
  - Stateless (no server-side session storage)
  - Scalable (works across multiple servers)
  - Claims-based (store user role, ID in token)
- **Documentation**: https://jwt.io/introduction
- **License**: MIT
- **Token Payload**:
  ```typescript
  {
    sub: userId,
    email: string,
    role: 'patient' | 'staff' | 'admin',
    iat: number,
    exp: number
  }
  ```
- **Alternatives Considered**:
  - Session-based (rejected: not scalable, requires Redis for every request)
  - OAuth (future: for Google/Apple login)

### LLM Integration
- **Provider**: Anthropic Claude
- **Model**: Claude 3.5 Sonnet
- **API Version**: 2023-06-01
- **Library**: @anthropic-ai/sdk 0.17.0
- **Reason**:
  - Long context window (200K tokens) - full conversation history
  - Function calling (tool use for inventory checks)
  - Safety guardrails (HIPAA-appropriate responses)
  - Low hallucination rate (critical for medication names)
  - Fast response time (<2s for typical chat)
- **Documentation**: https://docs.anthropic.com/claude/reference/getting-started-with-the-api
- **License**: Proprietary (API terms)
- **Fallback**: OpenAI GPT-4 Turbo (if Claude unavailable)
- **Token Budgets**:
  - Max tokens per request: 1024
  - Average conversation: ~500 tokens
  - Estimated cost: $0.015 per conversation
- **Tools Defined**:
  ```typescript
  {
    name: "check_inventory",
    description: "Check if medication is in stock",
    parameters: { medication: string, dosage: string }
  }
  {
    name: "create_order",
    description: "Create a new medication order",
    parameters: { medications: array, userId: string }
  }
  {
    name: "get_order_history",
    description: "Retrieve user's past orders",
    parameters: { userId: string }
  }
  ```

### Observability - LLM Tracing
- **Platform**: Langfuse
- **Version**: langfuse 3.0.0 (SDK)
- **Reason**:
  - Open-source (can self-host if needed)
  - Public traces (required for demo/judges)
  - Built-in analytics (token usage, latency)
  - LangChain integration (future: if we use LangChain)
  - Prompt versioning
- **Documentation**: https://langfuse.com/docs
- **License**: MIT
- **Hosted**: Langfuse Cloud (free tier for MVP)
- **Logged Data**:
  - Every LLM request/response
  - Tool calls and results
  - User feedback (thumbs up/down on responses)
  - Latency metrics
  - Token usage
- **Alternatives Considered**:
  - LangSmith (rejected: closed-source, expensive)
  - Custom logging (rejected: too much dev time)

### File Storage
- **Service**: AWS S3
- **SDK**: @aws-sdk/client-s3 3.515.0
- **CDN**: CloudFront (image delivery)
- **Bucket Structure**:
  - `prescriptions/` (private, signed URLs)
  - `profile-images/` (public, cached)
- **Reason**: 
  - Industry standard, reliable
  - Cost-effective ($0.023/GB/month)
  - Scalable (unlimited storage)
  - CloudFront integration (fast delivery)
  - S3 Event Notifications (future: OCR trigger)
- **Documentation**: https://docs.aws.amazon.com/s3/
- **License**: Proprietary (AWS terms)
- **Security**:
  - Prescriptions: Private, pre-signed URLs (1-hour expiry)
  - Encryption at rest (AES-256)
  - Bucket policies restrict public access
- **Alternatives Considered**:
  - Cloudinary (rejected: expensive for high volume)
  - Local filesystem (rejected: not scalable)

### Email Service
- **Provider**: Resend
- **Library**: resend 3.0.0
- **Templates**: React Email 2.0.0
- **Reason**: 
  - Developer-friendly API
  - React-based templates (consistent with stack)
  - High deliverability (99%+)
  - Affordable ($0.10 per 1,000 emails)
  - Email tracking (opens, clicks)
- **Documentation**: 
  - Resend: https://resend.com/docs
  - React Email: https://react.email/docs
- **License**: Proprietary (Resend terms)
- **Email Types**:
  - Verification emails
  - Order confirmations
  - Refill reminders
  - Prescription issues
- **Templates**:
  ```
  /emails
    /verification-email.tsx
    /order-confirmation.tsx
    /refill-reminder.tsx
  ```
- **Alternatives Considered**:
  - SendGrid (rejected: more expensive)
  - AWS SES (rejected: complex setup, warmup required)
  - Nodemailer (rejected: need managed infrastructure)

### SMS & WhatsApp
- **Provider**: Twilio
- **Library**: twilio 5.0.0
- **Services**:
  - SMS: Programmable Messaging
  - WhatsApp: WhatsApp Business API
- **Reason**:
  - Single provider for both channels
  - Reliable delivery (99.95% uptime)
  - Two-way messaging (users can reply)
  - Rich media (order confirmations with images)
  - Compliance tools (opt-in/opt-out management)
- **Documentation**: https://www.twilio.com/docs
- **License**: Proprietary (Twilio terms)
- **Costs**:
  - SMS: $0.0075 per message (US)
  - WhatsApp: $0.005 per conversation (24-hour window)
- **Approval**: WhatsApp Business Account (2-week approval process)
- **Alternatives Considered**:
  - AWS SNS (rejected: no WhatsApp support)
  - Direct WhatsApp API (rejected: requires $100K+ message volume)

### Workflow Automation
- **Platform**: n8n
- **Version**: 1.27.0
- **Hosting**: n8n Cloud (managed hosting)
- **Reason**:
  - Visual workflow builder (easy for non-devs)
  - Open-source (can self-host later)
  - 400+ integrations (email, SMS, webhooks)
  - Webhook triggers (from our backend)
  - Error handling & retry logic
  - Conditional branching (if prescription approved → send email)
- **Documentation**: https://docs.n8n.io
- **License**: Fair-code (n8n Sustainable Use License)
- **Key Workflows**:
  1. **Order Confirmation Flow**:
     - Trigger: Webhook from backend (order created)
     - Actions: Send confirmation email, SMS, update CRM
  2. **Refill Reminder Flow**:
     - Trigger: Scheduled (daily 6 AM)
     - Actions: Query database, send WhatsApp/email, log results
  3. **Prescription Rejected Flow**:
     - Trigger: Webhook (pharmacist rejected)
     - Actions: Send chat message to user, email notification
- **Alternatives Considered**:
  - Zapier (rejected: expensive, closed-source)
  - Custom code (rejected: too much dev time for MVP)
  - Temporal (rejected: overkill for simple workflows)

### API Documentation
- **Tool**: Swagger / OpenAPI 3.0
- **Library**: swagger-jsdoc 6.2.8, swagger-ui-express 5.0.0
- **Reason**:
  - Industry standard
  - Interactive API explorer
  - Auto-generated from JSDoc comments
  - Client SDK generation (future)
- **Endpoint**: `/api-docs`
- **Documentation**: https://swagger.io/docs/
- **License**: Apache-2.0

---

## 4. DevOps & Infrastructure

### Version Control
- **System**: Git
- **Platform**: GitHub
- **Repository Structure**: Monorepo (frontend + backend + docs)
- **Branch Strategy**: 
  - `main` → Production (auto-deploy to prod)
  - `develop` → Staging (auto-deploy to staging)
  - `feature/*` → Feature branches (PR to develop)
  - `hotfix/*` → Urgent production fixes (PR to main)
- **Branch Protection**:
  - Require PR reviews (1 approval)
  - Require status checks (tests, lint)
  - No direct pushes to main/develop
- **Commit Convention**: Conventional Commits
  - `feat:` (new features)
  - `fix:` (bug fixes)
  - `docs:` (documentation)
  - `chore:` (maintenance)

### CI/CD
- **Platform**: GitHub Actions
- **Workflows**: 
  1. **Pull Request Checks** (`.github/workflows/pr-checks.yml`):
     - Lint (ESLint, Prettier)
     - Type-check (TypeScript)
     - Unit tests (Vitest)
     - Build test
     - Runs on: Every PR
  2. **Deploy Staging** (`.github/workflows/deploy-staging.yml`):
     - Run tests
     - Build frontend & backend
     - Deploy to Vercel (frontend) & Railway (backend)
     - Run smoke tests
     - Runs on: Merge to develop
  3. **Deploy Production** (`.github/workflows/deploy-production.yml`):
     - Run full test suite
     - Build with production optimizations
     - Database migration (Prisma migrate deploy)
     - Deploy to Vercel & Railway
     - Smoke tests
     - Notify team (Slack)
     - Runs on: Merge to main
- **Secrets Management**: GitHub Secrets (encrypted)
- **Build Cache**: Actions cache (speeds up installs)

### Hosting

#### Frontend
- **Platform**: Vercel
- **Plan**: Pro ($20/month)
- **Features Used**:
  - Edge network (low latency globally)
  - Automatic HTTPS
  - Preview deployments (every PR)
  - Environment variables per environment
  - Web Analytics (built-in)
- **Reason**:
  - Best Next.js performance (same company)
  - Zero-config deployment
  - Instant rollbacks
  - Built-in CDN
- **Documentation**: https://vercel.com/docs
- **Alternatives Considered**:
  - Netlify (rejected: slower build times)
  - AWS Amplify (rejected: more complex setup)

#### Backend
- **Platform**: Railway
- **Plan**: Developer ($5 + usage)
- **Services**:
  - API server (Node.js)
  - PostgreSQL database (managed)
  - Redis (managed)
- **Features Used**:
  - Automatic deployments from GitHub
  - Private networking (database not public)
  - Environment variables
  - Health checks
  - Logs & metrics
- **Reason**:
  - Simple setup (5 minutes to deploy)
  - Affordable for MVP
  - Built-in database & Redis
  - Auto-scaling
- **Documentation**: https://docs.railway.app
- **Alternatives Considered**:
  - Render (rejected: slower cold starts)
  - Fly.io (rejected: more complex)
  - AWS ECS (rejected: overkill for MVP)

#### Database
- **Platform**: Supabase
- **Plan**: Pro ($25/month)
- **Database**: Managed PostgreSQL 16.1
- **Features Used**:
  - Automatic backups (daily)
  - Connection pooling (PgBouncer)
  - Database UI (for debugging)
  - Point-in-time recovery (7 days)
  - SSL required
- **Reason**:
  - HIPAA-compliant tier available (future)
  - Better PostgreSQL management than Railway
  - Built-in auth (not using for MVP, but future option)
  - Real-time subscriptions (future: order updates)
- **Documentation**: https://supabase.com/docs
- **Alternatives Considered**:
  - Railway Postgres (using for staging only)
  - AWS RDS (rejected: expensive, complex)
  - Neon (rejected: newer, less proven)

### Monitoring

#### Error Tracking
- **Platform**: Sentry
- **Version**: @sentry/nextjs 7.100.0, @sentry/node 7.100.0
- **Features Used**:
  - Error grouping (deduplicate similar errors)
  - Source maps (readable stack traces)
  - User context (which user hit error)
  - Breadcrumbs (actions leading to error)
  - Release tracking (know which deploy caused issue)
- **Reason**:
  - Industry standard
  - Great Next.js integration
  - Alerts to Slack
  - Free tier sufficient for MVP
- **Documentation**: https://docs.sentry.io
- **License**: BSL 1.1 (open-source with restrictions)
- **Alert Rules**:
  - New error type → Slack notification
  - >10 errors/minute → Page on-call
  - Payment errors → Immediate alert

#### Application Monitoring
- **Platform**: Vercel Analytics (frontend)
- **Platform**: Railway Metrics (backend)
- **Metrics Tracked**:
  - Response time (p50, p95, p99)
  - Request rate (requests/minute)
  - Error rate (errors/total requests)
  - Database query performance
  - Memory usage
  - CPU usage
- **Custom Metrics**:
  - Chat response time (LLM latency)
  - Order completion rate
  - Refill alert conversion rate

#### Logging
- **Library**: pino 8.17.2 (backend)
- **Format**: JSON (structured logging)
- **Levels**: debug, info, warn, error, fatal
- **Destination**: 
  - Development: Console (pretty-printed)
  - Production: Railway logs → Aggregated in Railway dashboard
- **Reason**:
  - Fast (benchmarked fastest Node logger)
  - Structured (searchable, parseable)
  - Low overhead
- **Documentation**: https://getpino.io
- **License**: MIT
- **Log Retention**: 7 days (Railway free tier)
- **Future**: Ship logs to Datadog or Logtail for longer retention

#### Uptime Monitoring
- **Service**: Better Uptime (by Betterstack)
- **Plan**: Free (10 monitors)
- **Monitors**:
  - API health endpoint (`/health`) - 1 minute interval
  - Frontend homepage - 1 minute interval
  - Database connection - 5 minute interval
- **Alerts**: Email, Slack
- **Status Page**: Public status page (status.pharmacyassistant.com)
- **Documentation**: https://betteruptime.com/docs
- **Alternatives Considered**:
  - Pingdom (rejected: expensive)
  - UptimeRobot (rejected: less reliable)

### Testing

#### Unit Tests
- **Framework**: Vitest
- **Version**: 1.2.2
- **Coverage**: vitest/coverage-v8 1.2.2
- **Reason**:
  - Fast (Vite-powered, faster than Jest)
  - Compatible with Jest API (easy migration)
  - TypeScript support out-of-box
  - ESM support
  - Watch mode (TDD workflow)
- **Documentation**: https://vitest.dev
- **License**: MIT
- **Coverage Target**: 80% overall
- **Run Command**: `pnpm test`
- **CI**: Runs on every PR
- **Alternatives Considered**:
  - Jest (rejected: slower, more config)

#### Integration Tests
- **Framework**: Supertest
- **Version**: 6.3.4
- **Reason**:
  - Test Express routes end-to-end
  - No need to start server
  - Chai-like assertions
- **Documentation**: https://github.com/ladjs/supertest
- **License**: MIT
- **Example Tests**:
  - POST /api/v1/auth/login (with valid/invalid credentials)
  - GET /api/v1/orders (with/without auth)
  - POST /api/v1/orders (create order flow)

#### End-to-End Tests
- **Framework**: Playwright
- **Version**: 1.41.2
- **Reason**:
  - Cross-browser (Chromium, Firefox, Safari)
  - Fast parallel execution
  - Auto-wait (no flaky tests)
  - Built-in trace viewer (debug failures)
  - Network interception (mock APIs)
- **Documentation**: https://playwright.dev
- **License**: Apache-2.0
- **Test Scenarios**:
  - User signup flow
  - Order placement (full chat conversation)
  - Admin prescription review
  - Order tracking
- **Run Command**: `pnpm test:e2e`
- **CI**: Runs on merge to develop (not every PR, too slow)
- **Alternatives Considered**:
  - Cypress (rejected: slower, worse TypeScript support)

#### API Testing
- **Tool**: Postman / Insomnia
- **Collections**: Exported in `/tests/api-collections/`
- **Usage**: Manual testing during development
- **Future**: Convert to automated tests with Newman

---

## 5. Development Tools

### Code Quality

#### Linter
- **Tool**: ESLint
- **Version**: 8.56.0
- **Config**: eslint-config-next 14.2.0
- **Plugins**:
  - @typescript-eslint/eslint-plugin 6.19.0
  - eslint-plugin-react-hooks 4.6.0
- **Rules**: 
  - Extend next/core-web-vitals
  - No console.log in production
  - Enforce TypeScript types
- **Run**: `pnpm lint`
- **Fix**: `pnpm lint:fix`
- **Documentation**: https://eslint.org/docs/latest/
- **License**: MIT

#### Formatter
- **Tool**: Prettier
- **Version**: 3.2.5
- **Config**: `.prettierrc.json`
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2
  }
  ```
- **Run**: `pnpm format`
- **Documentation**: https://prettier.io/docs/
- **License**: MIT
- **Integrations**: ESLint (via eslint-config-prettier)

#### Git Hooks
- **Tool**: Husky
- **Version**: 9.0.10
- **Hooks**:
  - **pre-commit**: 
    - Lint staged files (lint-staged 15.2.0)
    - Format staged files
    - Type-check
  - **pre-push**: 
    - Run unit tests
    - Check for TODO comments with FIXME tag
- **Configuration**: `.husky/`
- **Documentation**: https://typicode.github.io/husky/
- **License**: MIT
- **Reason**: Prevent bad code from being committed

#### Import Sorting
- **Tool**: eslint-plugin-import
- **Version**: 2.29.1
- **Rules**: Auto-sort imports alphabetically
- **Groups**: React → External → Internal → Relative

### IDE Recommendations

#### Editor
- **Recommended**: Visual Studio Code
- **Version**: Latest stable
- **Reason**: Best TypeScript support, large extension ecosystem

#### Required Extensions
- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Prisma** (Prisma.prisma)
- **GitLens** (eamodio.gitlens)

#### Workspace Settings (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## 6. Environment Variables

### Frontend (.env.local)
```bash
# API Endpoint
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"

# Feature Flags
NEXT_PUBLIC_ENABLE_VOICE="false"
NEXT_PUBLIC_ENABLE_OCR="false"

# Analytics
NEXT_PUBLIC_SENTRY_DSN="https://..."

# App Info
NEXT_PUBLIC_APP_NAME="Pharmacy Assistant"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Backend (.env)
```bash
# Node Environment
NODE_ENV="development" # development | production | test

# Server
PORT="3001"
FRONTEND_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pharmacy_assistant"
DIRECT_DATABASE_URL="postgresql://..." # For Prisma migrations

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-token-secret-min-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# LLM Provider
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..." # Fallback provider

# Observability
LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_HOST="https://cloud.langfuse.com"

# AWS S3
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="pharmacy-assistant-prod"
AWS_CLOUDFRONT_URL="https://d111111abcdef8.cloudfront.net"

# Email (Resend)
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@pharmacyassistant.com"
SUPPORT_EMAIL="support@pharmacyassistant.com"

# SMS & WhatsApp (Twilio)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+15551234567"
TWILIO_WHATSAPP_NUMBER="whatsapp:+15551234567"

# n8n Webhooks
N8N_WEBHOOK_ORDER_CONFIRMATION="https://your-n8n.app/webhook/order-confirmation"
N8N_WEBHOOK_REFILL_REMINDER="https://your-n8n.app/webhook/refill-reminder"

# Monitoring
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="..." # For uploading source maps

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000" # 15 minutes
RATE_LIMIT_MAX_REQUESTS="100"

# Feature Flags
ENABLE_REFILL_REMINDERS="true"
ENABLE_PRESCRIPTION_OCR="false"
```

### Environment-Specific
- **Development**: `.env.local` (not committed)
- **Staging**: Set in Railway/Vercel dashboard
- **Production**: Set in Railway/Vercel dashboard (encrypted)

### Secret Management
- **Local**: `.env.local` (git-ignored)
- **CI/CD**: GitHub Secrets
- **Production**: Railway/Vercel environment variables
- **Rotation**: Quarterly for production secrets

---

## 7. Package.json Scripts

### Root (Monorepo)
```json
{
  "scripts": {
    "dev": "pnpm --parallel dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend dev",
    
    "build": "pnpm --recursive build",
    "build:frontend": "pnpm --filter frontend build",
    "build:backend": "pnpm --filter backend build",
    
    "lint": "pnpm --recursive lint",
    "lint:fix": "pnpm --recursive lint:fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "pnpm --recursive type-check",
    
    "test": "pnpm --recursive test",
    "test:watch": "pnpm --recursive test:watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    
    "prepare": "husky install"
  }
}
```

### Frontend (packages/frontend/package.json)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Backend (packages/backend/package.json)
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc && tsc-alias",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    
    "prisma:format": "prisma format"
  }
}
```

---

## 8. Dependencies Lock

### Frontend Dependencies (packages/frontend/package.json)
```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",
    "tailwindcss": "3.4.1",
    "autoprefixer": "10.4.17",
    "postcss": "8.4.33",
    
    "zustand": "4.5.0",
    "axios": "1.6.7",
    "@tanstack/react-query": "5.18.0",
    "socket.io-client": "4.7.2",
    
    "react-hook-form": "7.50.0",
    "zod": "3.22.4",
    "@hookform/resolvers": "3.3.4",
    
    "date-fns": "3.3.0",
    "lucide-react": "0.323.0",
    "react-dropzone": "14.2.3",
    
    "@radix-ui/react-dialog": "1.0.5",
    "@radix-ui/react-dropdown-menu": "2.0.6",
    "@radix-ui/react-tabs": "1.0.4",
    "@radix-ui/react-toast": "1.1.5",
    
    "class-variance-authority": "0.7.0",
    "clsx": "2.1.0",
    "tailwind-merge": "2.2.1",
    
    "@sentry/nextjs": "7.100.0"
  },
  "devDependencies": {
    "@types/node": "20.11.16",
    "@types/react": "18.2.52",
    "@types/react-dom": "18.2.18",
    
    "eslint": "8.56.0",
    "eslint-config-next": "14.2.0",
    "@typescript-eslint/eslint-plugin": "6.19.0",
    
    "prettier": "3.2.5",
    "prettier-plugin-tailwindcss": "0.5.11",
    
    "vitest": "1.2.2",
    "@vitest/ui": "1.2.2",
    "@testing-library/react": "14.2.0",
    "@testing-library/jest-dom": "6.2.0"
  }
}
```

### Backend Dependencies (packages/backend/package.json)
```json
{
  "dependencies": {
    "express": "4.18.2",
    "@types/express": "4.17.21",
    
    "typescript": "5.3.3",
    "tsx": "4.7.0",
    "tsc-alias": "1.8.8",
    
    "@prisma/client": "5.9.0",
    "prisma": "5.9.0",
    
    "jsonwebtoken": "9.0.2",
    "@types/jsonwebtoken": "9.0.5",
    "bcrypt": "5.1.1",
    "@types/bcrypt": "5.0.2",
    
    "cors": "2.8.5",
    "@types/cors": "2.8.17",
    "helmet": "7.1.0",
    "morgan": "1.10.0",
    "@types/morgan": "1.9.9",
    "compression": "1.7.4",
    "@types/compression": "1.7.5",
    "express-rate-limit": "7.1.5",
    "express-validator": "7.0.1",
    
    "ioredis": "5.3.2",
    "@types/ioredis": "5.0.0",
    
    "@anthropic-ai/sdk": "0.17.0",
    "openai": "4.28.0",
    "langfuse": "3.0.0",
    
    "@aws-sdk/client-s3": "3.515.0",
    "@aws-sdk/s3-request-presigner": "3.515.0",
    
    "resend": "3.0.0",
    "@react-email/components": "0.0.14",
    "react-email": "2.0.0",
    
    "twilio": "5.0.0",
    
    "socket.io": "4.7.2",
    
    "zod": "3.22.4",
    "dotenv": "16.4.1",
    "pino": "8.17.2",
    "pino-pretty": "10.3.1",
    
    "@sentry/node": "7.100.0"
  },
  "devDependencies": {
    "@types/node": "20.11.16",
    
    "eslint": "8.56.0",
    "@typescript-eslint/eslint-plugin": "6.19.0",
    "@typescript-eslint/parser": "6.19.0",
    
    "prettier": "3.2.5",
    
    "vitest": "1.2.2",
    "supertest": "6.3.4",
    "@types/supertest": "6.0.2",
    
    "husky": "9.0.10",
    "lint-staged": "15.2.0"
  }
}
```

### Shared Dependencies (for future extraction)
```json
{
  "dependencies": {
    "zod": "3.22.4",
    "typescript": "5.3.3"
  }
}
```

---

## 9. Security Considerations

### Authentication & Authorization
- **JWT Tokens**: 
  - Short expiry (15 min access, 7 days refresh)
  - httpOnly cookies (prevent XSS theft)
  - Signed with HS256 (32-char secret minimum)
- **Password Hashing**: 
  - bcrypt with 12 rounds (OWASP recommendation)
  - Passwords never logged or exposed
- **HTTPS Only**: 
  - Production enforces HTTPS (Vercel/Railway default)
  - Cookies have `secure: true` flag in production
- **CORS**: 
  - Restricted to frontend domain only
  - Credentials: true (allow cookies)
  - No wildcard origins in production

### Data Protection
- **Encryption at Rest**: 
  - Database: PostgreSQL encryption via Supabase
  - File storage: S3 server-side encryption (AES-256)
  - Backups: Encrypted
- **Encryption in Transit**: 
  - All APIs: TLS 1.3
  - Database connections: SSL required
  - Redis: TLS enabled in production
- **PII/PHI Handling**: 
  - Prescriptions stored in private S3 bucket
  - Pre-signed URLs for temporary access (1-hour expiry)
  - Order history: User IDs hashed in logs
  - Chat history: No PHI in Langfuse traces (masked)
- **SQL Injection**: 
  - Prisma ORM (parameterized queries)
  - No raw SQL in application code
- **XSS Protection**: 
  - React auto-escapes user input
  - Helmet.js sets security headers
  - Content-Security-Policy header configured

### Rate Limiting
- **Login Attempts**: 
  - 5 attempts per 15 minutes per IP
  - Lock account after 5 failed attempts (unlock via email)
- **API Requests**: 
  - 100 requests per minute per IP (general)
  - 10 requests per minute for file uploads
  - 20 requests per minute for chat (LLM calls)
- **Password Reset**: 
  - 3 requests per hour per email
- **Implementation**: 
  - express-rate-limit with Redis store
  - Separate limits per endpoint category

### Input Validation
- **All Inputs Validated**: 
  - Frontend: Zod schemas (React Hook Form)
  - Backend: express-validator + Zod
  - Double validation (frontend + backend)
- **File Uploads**: 
  - Type validation: image/jpeg, image/png, application/pdf only
  - Size limit: 10MB max
  - Virus scanning (future: ClamAV integration)
- **Sanitization**: 
  - Strip HTML from user inputs
  - Validate email formats
  - URL validation for redirects

### Session Management
- **Token Storage**: 
  - httpOnly cookies (not accessible to JavaScript)
  - SameSite: Strict (CSRF protection)
- **Refresh Token Rotation**: 
  - New refresh token issued on each use
  - Old refresh tokens invalidated
- **Logout**: 
  - Clear cookies
  - Invalidate refresh token in database
- **Session Timeout**: 
  - Auto-logout after 7 days inactivity

### Security Headers (Helmet.js)
```javascript
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // For Next.js
      styleSrc: ["'self'", "'unsafe-inline'"],  // For Tailwind
      imgSrc: ["'self'", "data:", "https://d111111abcdef8.cloudfront.net"],
      connectSrc: ["'self'", "https://api.pharmacyassistant.com"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}
```

### Secrets Management
- **Never Commit Secrets**: 
  - `.env*` files in `.gitignore`
  - Use environment variables
- **Secret Rotation**: 
  - JWT secrets rotated quarterly
  - API keys rotated semi-annually
  - Database passwords rotated annually
- **Access Control**: 
  - Production secrets only accessible to 2 senior engineers
  - Staging/dev secrets separate from production

### Compliance (HIPAA Preparation)
- **PHI Handling**: 
  - Prescriptions marked as PHI
  - Access logged (user ID, timestamp, action)
  - Minimum necessary principle enforced
- **Audit Logs**: 
  - All PHI access logged
  - Logs retained 7 years (HIPAA requirement)
  - Immutable logs (append-only)
- **Business Associate Agreements**: 
  - BAAs signed with: Supabase, AWS, Twilio, Resend
  - Anthropic, Langfuse (ensure BAA available)
- **Data Breach Plan**: 
  - Incident response documented
  - Notification process defined (60 days per HIPAA)
  - Contact: security@pharmacyassistant.com

---

## 10. Version Upgrade Policy

### Major Version Updates
- **Frequency**: Quarterly review (every 3 months)
- **Process**: 
  1. Test in isolated branch
  2. Deploy to staging
  3. Run full test suite
  4. Soak test for 1 week
  5. Backwards compatibility check
  6. Rollback plan documented
  7. Deploy to production (non-peak hours)
- **Approval Required**: Technical lead + product manager
- **Communication**: 
  - Team notified 1 week in advance
  - Update CHANGELOG.md
  - Update all related docs

### Minor/Patch Updates
- **Frequency**: Monthly (first Monday of month)
- **Security Patches**: 
  - Applied within 7 days of release (critical)
  - Applied within 30 days (moderate)
- **Automated Updates**: 
  - Dependabot creates PRs weekly
  - Non-breaking updates auto-merged (after CI passes)
  - Breaking updates require manual review
- **Review Process**: 
  - Engineer reviews Dependabot PR
  - Merge to develop
  - Test in staging
  - Deploy to production next cycle

### Breaking Changes
- **Documentation**: 
  - Document in CHANGELOG.md
  - Update migration guide
  - Update API docs (if backend)
- **Communication**: 
  - Team meeting discussing changes
  - Email notification to stakeholders
  - Update README.md
- **Deprecation Period**: 
  - Old API endpoints: 3 months deprecation
  - Old features: 1 month warning

### Rollback Procedures
- **Database Rollback**: 
  - Prisma migrations are reversible
  - Backup before migration
  - Rollback SQL script ready
- **Code Rollback**: 
  - Railway: Deploy previous version (1-click)
  - Vercel: Revert to previous deployment (1-click)
  - Max rollback time: 5 minutes
- **When to Rollback**: 
  - >5% error rate increase
  - >20% performance degradation
  - Critical feature broken
  - Database connection issues

### Version Tracking
- **Semantic Versioning**: MAJOR.MINOR.PATCH (e.g., 1.0.0)
  - MAJOR: Breaking changes
  - MINOR: New features (backwards compatible)
  - PATCH: Bug fixes
- **Git Tags**: Tag releases (e.g., `v1.0.0`)
- **CHANGELOG.md**: Document all changes
- **Package Versions**: Lock exact versions in package.json (no `^` or `~`)

### LTS Strategy (Long-Term Support)
- **Node.js**: Only use LTS versions (even-numbered: 18, 20, 22)
- **PostgreSQL**: Upgrade within 6 months of new major release
- **Next.js**: Upgrade within 2 months of new major release
- **React**: Upgrade within 3 months (wait for ecosystem compatibility)

### Deprecation Policy
- **Announce Early**: 
  - Deprecation warnings in logs (dev mode)
  - Email notification 3 months before removal
- **Grace Period**: 
  - API endpoints: 6 months
  - Features: 3 months
  - Internal APIs: 1 month
- **Documentation**: 
  - Strike-through in docs
  - Suggest replacement
  - Provide migration guide

---

## 11. Development Workflow

### Local Development Setup

#### Prerequisites
- Node.js 20.11.0 LTS
- pnpm 8.15.1
- Docker Desktop (for PostgreSQL & Redis locally)
- Git

#### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/pharmacy/assistant.git
cd assistant

# 2. Install dependencies
pnpm install

# 3. Start local database & Redis (Docker)
docker-compose up -d

# 4. Copy environment variables
cp .env.example .env.local

# 5. Run database migrations
pnpm db:migrate

# 6. Seed database with test data
pnpm db:seed

# 7. Start development servers
pnpm dev
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Prisma Studio: pnpm db:studio (http://localhost:5555)
```

### Adding New Features

#### Feature Branch Workflow
```bash
# 1. Create feature branch from develop
git checkout develop
git pull
git checkout -b feature/chat-voice-input

# 2. Develop & commit frequently
git add .
git commit -m "feat: add voice input to chat"

# 3. Push & create PR
git push origin feature/chat-voice-input
# Open PR on GitHub: feature/chat-voice-input → develop

# 4. Address review comments, merge
# After merge, delete feature branch
```

#### Database Schema Changes
```bash
# 1. Edit schema.prisma
# 2. Create migration
pnpm db:migrate
# Names migration (e.g., "add_refill_alerts_table")

# 3. Test migration
pnpm db:reset  # Drops & recreates (dev only)

# 4. Commit migration file
git add prisma/migrations
git commit -m "feat: add refill alerts table"
```

### Testing Workflow

#### Running Tests
```bash
# Unit tests (watch mode)
pnpm test:watch

# All tests
pnpm test

# Coverage report
pnpm test:coverage

# E2E tests
pnpm test:e2e

# E2E with UI (debug mode)
pnpm test:e2e:ui
```

#### Writing Tests
- **Unit Tests**: Every utility function, hook
- **Integration Tests**: Every API endpoint
- **E2E Tests**: Every critical user flow (signup, order, admin)

### Code Review Checklist
- [ ] Code follows style guide (ESLint passes)
- [ ] TypeScript types correct (no `any`)
- [ ] Tests added/updated (coverage maintained)
- [ ] Documentation updated (if API/feature change)
- [ ] No hardcoded secrets
- [ ] Performance considered (no N+1 queries)
- [ ] Security considered (input validation)
- [ ] Accessibility checked (keyboard nav, ARIA)

---

## 12. Performance Optimization

### Frontend Optimizations
- **Code Splitting**: 
  - Dynamic imports for heavy components
  - Route-based splitting (Next.js automatic)
  - Example: `const AdminDashboard = dynamic(() => import('./AdminDashboard'))`
- **Image Optimization**: 
  - Next.js Image component (auto WebP, lazy loading)
  - Prescription thumbnails generated on upload
  - CloudFront CDN for fast delivery
- **Bundle Size**: 
  - Target: <200KB initial JS bundle
  - Analyze with: `pnpm build --analyze`
  - Tree-shaking enabled (production builds)
- **Caching Strategy**: 
  - React Query cache (5-30 min)
  - Service Worker (future: offline support)
  - CDN cache headers (immutable assets)

### Backend Optimizations
- **Database Indexing**: 
  - Indexes on: `userId`, `orderId`, `email`, `medicationName`
  - Composite index: `(userId, createdAt)` for order history
- **Query Optimization**: 
  - Prisma select (only fetch needed fields)
  - Pagination (limit 20 per page)
  - Avoid N+1 queries (Prisma `include` carefully)
- **Redis Caching**: 
  - Cache medicine list (10 min TTL)
  - Cache user profile (30 min TTL)
  - Cache hit rate target: >80%
- **Connection Pooling**: 
  - PgBouncer max connections: 100
  - Prisma connection pool: 10
- **Compression**: 
  - Gzip for API responses (compression middleware)
  - Brotli for static assets (Vercel/Railway default)

### LLM Optimizations
- **Streaming Responses**: 
  - Stream chat responses (server-sent events)
  - Show typing indicator during generation
- **Token Management**: 
  - Truncate old conversation history (keep last 10 messages)
  - Summarize long conversations (>5K tokens)
- **Caching**: 
  - Cache common queries (e.g., "Do you have aspirin?")
  - Cache tool definitions (don't send every request)

### Performance Targets
- **Lighthouse Score**: 90+ (mobile & desktop)
- **Time to Interactive (TTI)**: <3 seconds
- **Largest Contentful Paint (LCP)**: <2.5 seconds
- **Cumulative Layout Shift (CLS)**: <0.1
- **API Response Time**: 
  - p50: <200ms
  - p95: <500ms
  - p99: <1000ms
- **Chat Response Time**: <2 seconds (including LLM)

---

## 13. Disaster Recovery Plan

### Backup Strategy
- **Database**: 
  - Automated daily backups (Supabase, 7-day retention)
  - Weekly manual backups to S3 (90-day retention)
  - Point-in-time recovery available (7 days)
- **File Storage**: 
  - S3 versioning enabled (deleted files recoverable for 30 days)
  - S3 Cross-Region Replication to us-west-2 (disaster recovery)
- **Code**: 
  - Git repository (GitHub, 3 copies: local, GitHub, GitHub Arctic Vault)
- **Secrets**: 
  - 1Password team vault (encrypted backup)

### Recovery Time Objectives (RTO)
- **Database Failure**: 4 hours (restore from backup)
- **API Server Failure**: 15 minutes (redeploy to Railway)
- **Frontend Failure**: 5 minutes (rollback on Vercel)
- **Total System Failure**: 6 hours (rebuild from backups)

### Recovery Point Objectives (RPO)
- **Database**: 24 hours (last daily backup)
- **File Uploads**: 0 hours (S3 highly durable)
- **Code**: 0 hours (Git version control)

### Incident Response
1. **Detect**: Monitoring alerts (Sentry, Better Uptime)
2. **Assess**: On-call engineer investigates
3. **Communicate**: Status page updated, team notified
4. **Resolve**: Fix or rollback
5. **Post-Mortem**: Document incident, prevent recurrence

---

## 14. Future Technology Considerations

### Potential Upgrades (Post-MVP)
- **Database**: 
  - Add read replicas (scale reads)
  - Implement database sharding (>1M users)
- **Caching**: 
  - Add Cloudflare cache (edge caching)
  - Implement Redis Cluster (high availability)
- **Search**: 
  - Add Elasticsearch (advanced medicine search)
  - Full-text search with autocomplete
- **Real-Time**: 
  - Upgrade to dedicated WebSocket server (Socket.IO cluster)
  - Add message queue (RabbitMQ, SQS)
- **AI**: 
  - Fine-tune model on pharmacy conversations
  - Add voice-to-text (Deepgram, Assembly AI)
  - Add OCR for prescriptions (Textract, Azure Form Recognizer)
- **Mobile**: 
  - React Native app (code reuse with web)
  - Push notifications (Firebase Cloud Messaging)
- **Analytics**: 
  - Add data warehouse (Snowflake, BigQuery)
  - Business intelligence dashboard (Metabase, Looker)

### Migration Paths
- **Microservices**: 
  - Extract AI Agent Service (independent scaling)
  - Extract Notification Service (async processing)
  - Use API Gateway (Kong, Ambassador)
- **Event-Driven**: 
  - Add event bus (Kafka, EventBridge)
  - Publish order events, refill alerts
  - Enables audit logs, analytics

---

**Document Version**: 1.0  
**Last Updated**: February 15, 2026  
**Next Review**: May 15, 2026 (quarterly)  
**Maintained By**: Engineering Team  
**Contact**: tech@pharmacyassistant.com
