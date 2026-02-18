# Implementation Plan
## Agentic AI-Powered Pharmacy Assistant - MVP

**Version**: 1.0  
**Last Updated**: February 17, 2026  
**Timeline**: 16 weeks (MVP)  
**Team**: 2 Full-Stack Devs, 1 AI/ML Engineer, 1 Product Manager

---

## Overview

This implementation plan breaks down the MVP development into 4 major phases across 16 weeks, following the PRD specifications. Each phase contains detailed steps with acceptance criteria, dependencies, and deliverables.

---

## Phase 1: Foundation & Infrastructure (Weeks 1-4)

### Week 1: Project Setup & Architecture

#### Step 1.1: Repository & Development Environment Setup
**Owner**: Full-Stack Dev 1  
**Duration**: 2 days

**Tasks**:
- [ ] Create GitHub repository (monorepo structure)
- [ ] Set up branch protection rules (main, develop)
- [ ] Configure ESLint, Prettier, TypeScript
- [ ] Create `.env.example` files
- [ ] Set up GitHub Actions workflows (PR checks)
- [ ] Initialize Next.js 14.2.0 project
- [ ] Initialize Express.js backend
- [ ] Configure pnpm workspaces

**Deliverables**:
- Working repository with CI/CD pipeline
- Development environment documentation

**Acceptance Criteria**:
- ✅ All team members can clone and run locally
- ✅ Linting and type-checking pass
- ✅ PR checks run automatically

---

#### Step 1.2: Database Setup (PostgreSQL + Prisma)
**Owner**: Full-Stack Dev 2  
**Duration**: 3 days

**Tasks**:
- [ ] Set up Supabase PostgreSQL instance
- [ ] Initialize Prisma ORM (v5.9.0)
- [ ] Create initial schema based on BACKEND_STRUCTURE.md:
  - `users` table
  - `medicines` table
  - `orders` table
  - `order_items` table
  - `prescriptions` table
  - `addresses` table
  - `sessions` table
  - `refill_alerts` table
  - `chat_messages` table
- [ ] Create seed data (20 sample medicines)
- [ ] Set up database migrations workflow
- [ ] Configure connection pooling (PgBouncer)

**Deliverables**:
- Complete Prisma schema file
- Migration files
- Seed script with sample data

**Acceptance Criteria**:
- ✅ `pnpm prisma migrate dev` runs successfully
- ✅ All tables created with correct relationships
- ✅ Seed data loads without errors
- ✅ Indexes created as per BACKEND_STRUCTURE.md

**Dependencies**: Step 1.1

---

#### Step 1.3: Authentication System (JWT)
**Owner**: Full-Stack Dev 1  
**Duration**: 3 days

**Tasks**:
- [ ] Install dependencies: `jsonwebtoken`, `bcrypt`
- [ ] Create auth utilities:
  - Password hashing (bcrypt, 12 rounds)
  - JWT token generation (access + refresh)
  - Token verification middleware
- [ ] Implement API endpoints:
  - `POST /api/v1/auth/signup`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/logout`
- [ ] Set up HTTP-only cookies for tokens
- [ ] Create session management in database
- [ ] Implement role-based access control (RBAC)

**Deliverables**:
- Auth API endpoints
- Auth middleware
- Unit tests for auth functions

**Acceptance Criteria**:
- ✅ User can sign up with email/password
- ✅ Password hashed with bcrypt (12 rounds)
- ✅ JWT tokens issued on login
- ✅ Refresh token flow works
- ✅ Protected routes reject unauthenticated requests
- ✅ 80%+ test coverage on auth logic

**Dependencies**: Step 1.2

---

#### Step 1.4: Redis Cache Setup
**Owner**: Full-Stack Dev 2  
**Duration**: 2 days

**Tasks**:
- [ ] Set up Upstash Redis instance
- [ ] Install `ioredis` client
- [ ] Create cache utility functions:
  - `get(key)`
  - `set(key, value, ttl)`
  - `del(key)`
  - `invalidate(pattern)`
- [ ] Implement caching for:
  - User sessions (7 days TTL)
  - Inventory list (10 min TTL)
  - User profiles (30 min TTL)
- [ ] Set up rate limiting with Redis

**Deliverables**:
- Redis connection utility
- Cache wrapper functions
- Rate limiting middleware

**Acceptance Criteria**:
- ✅ Redis connection established
- ✅ Cache hit/miss logged
- ✅ TTL expiration works correctly
- ✅ Rate limiting blocks excessive requests

**Dependencies**: Step 1.1

---

### Week 2: Core API & Frontend Foundation

#### Step 2.1: Medicine Inventory API
**Owner**: Full-Stack Dev 2  
**Duration**: 3 days

**Tasks**:
- [ ] Create API endpoints:
  - `GET /api/v1/medicines` (list all, with pagination)
  - `GET /api/v1/medicines/:id` (single medicine)
  - `GET /api/v1/medicines/search?q=` (search by name)
  - `POST /api/v1/medicines` (admin only)
  - `PATCH /api/v1/medicines/:id` (admin only)
  - `DELETE /api/v1/medicines/:id` (admin only)
- [ ] Implement filtering: by stock level, prescription required
- [ ] Add full-text search on medicine names
- [ ] Implement caching with Redis
- [ ] Create validation schemas (Zod)

**Deliverables**:
- Medicine CRUD API
- API documentation (Swagger)
- Integration tests

**Acceptance Criteria**:
- ✅ All endpoints return correct data
- ✅ Search returns relevant results
- ✅ Pagination works (limit, offset)
- ✅ Cache invalidation on updates
- ✅ Admin-only endpoints protected
- ✅ Response time < 300ms (95th percentile)

**Dependencies**: Step 1.2, Step 1.4

---

#### Step 2.2: Frontend Design System Setup
**Owner**: Full-Stack Dev 1  
**Duration**: 3 days

**Tasks**:
- [ ] Install Tailwind CSS 3.4.1
- [ ] Configure custom theme (FRONTEND_GUIDELINES.md):
  - Color palette (primary, neutral, success, warning, error)
  - Typography (Inter font)
  - Spacing scale
  - Border radius
  - Shadows
- [ ] Install shadcn/ui components:
  - Button
  - Input
  - Dialog
  - Toast
  - Dropdown Menu
  - Tabs
  - Badge
- [ ] Create reusable components:
  - `Button` (primary, secondary, outline, ghost, danger)
  - `Input` (text, email, password with toggle)
  - `Card`
  - `Badge` (status indicators)
- [ ] Set up Zustand stores:
  - `useAuthStore`
  - `useChatStore`
  - `useOrderStore`

**Deliverables**:
- Tailwind config with custom theme
- Component library (Storybook optional)
- Zustand stores

**Acceptance Criteria**:
- ✅ All design tokens match FRONTEND_GUIDELINES.md
- ✅ Components render correctly
- ✅ Dark mode support (future-ready)
- ✅ Responsive on mobile/tablet/desktop
- ✅ Accessibility: keyboard navigation, ARIA labels

**Dependencies**: Step 1.1

---

#### Step 2.3: Authentication UI (Login/Signup)
**Owner**: Full-Stack Dev 1  
**Duration**: 2 days

**Tasks**:
- [ ] Create pages:
  - `/login` - Login form
  - `/signup` - Registration form
  - `/verify-email` - Email verification prompt
- [ ] Implement forms with React Hook Form + Zod
- [ ] Add password strength indicator
- [ ] Implement email validation
- [ ] Connect to auth API endpoints
- [ ] Add error handling and toast notifications
- [ ] Create protected route middleware

**Deliverables**:
- Login/Signup pages
- Email verification flow
- Protected route wrapper

**Acceptance Criteria**:
- ✅ User can sign up and log in
- ✅ Form validation works (client + server)
- ✅ Password strength indicator updates
- ✅ Error messages clear and actionable
- ✅ Successful login redirects to dashboard
- ✅ Protected routes redirect to login

**Dependencies**: Step 1.3, Step 2.2

---

### Week 3: Order Management System

#### Step 3.1: Order API Endpoints
**Owner**: Full-Stack Dev 2  
**Duration**: 4 days

**Tasks**:
- [ ] Create order endpoints:
  - `POST /api/v1/orders` (create order)
  - `GET /api/v1/orders` (list user's orders)
  - `GET /api/v1/orders/:id` (single order)
  - `PATCH /api/v1/orders/:id` (update status)
  - `DELETE /api/v1/orders/:id` (cancel order)
- [ ] Implement order creation logic:
  - Validate medicine availability
  - Check stock levels
  - Calculate totals (subtotal, tax, shipping)
  - Create order items
  - Generate order number
- [ ] Add order status transitions:
  - pending_prescription → approved → preparing → out_for_delivery → delivered
- [ ] Implement inventory deduction on order approval
- [ ] Create order history tracking

**Deliverables**:
- Order CRUD API
- Order validation logic
- Status transition workflow

**Acceptance Criteria**:
- ✅ Order created with correct totals
- ✅ Stock levels updated on approval
- ✅ Cannot order out-of-stock items
- ✅ Order status transitions follow rules
- ✅ Order history retrievable
- ✅ Prescription-required flag enforced

**Dependencies**: Step 2.1, Step 1.2

---

#### Step 3.2: Prescription Upload System
**Owner**: Full-Stack Dev 1  
**Duration**: 3 days

**Tasks**:
- [ ] Set up AWS S3 bucket for prescriptions
- [ ] Install `@aws-sdk/client-s3`
- [ ] Create upload API:
  - `POST /api/v1/prescriptions/upload`
  - Generate pre-signed URLs
  - Validate file type (JPEG, PNG, PDF)
  - Validate file size (< 10MB)
- [ ] Create prescription table records
- [ ] Link prescriptions to orders
- [ ] Implement file deletion on order cancellation
- [ ] Add prescription status tracking

**Deliverables**:
- Prescription upload API
- S3 integration
- File validation

**Acceptance Criteria**:
- ✅ Files upload to S3 successfully
- ✅ Pre-signed URLs expire after 1 hour
- ✅ Only allowed file types accepted
- ✅ Files > 10MB rejected
- ✅ Prescription linked to order
- ✅ Secure URLs (not publicly accessible)

**Dependencies**: Step 3.1

---

### Week 4: User Profile & Address Management

#### Step 4.1: User Profile API
**Owner**: Full-Stack Dev 2  
**Duration**: 2 days

**Tasks**:
- [ ] Create profile endpoints:
  - `GET /api/v1/users/me` (current user)
  - `PATCH /api/v1/users/me` (update profile)
  - `PATCH /api/v1/users/me/password` (change password)
- [ ] Implement profile updates:
  - Full name
  - Phone number
  - SMS/WhatsApp opt-in preferences
- [ ] Add password change with old password verification
- [ ] Implement email change with re-verification

**Deliverables**:
- User profile API
- Password change flow

**Acceptance Criteria**:
- ✅ User can view profile
- ✅ User can update profile fields
- ✅ Password change requires old password
- ✅ Email change triggers verification
- ✅ Cache invalidation on updates

**Dependencies**: Step 1.3

---

#### Step 4.2: Address Management System
**Owner**: Full-Stack Dev 1  
**Duration**: 3 days

**Tasks**:
- [ ] Create address endpoints:
  - `GET /api/v1/addresses` (list user addresses)
  - `POST /api/v1/addresses` (add address)
  - `PATCH /api/v1/addresses/:id` (update address)
  - `DELETE /api/v1/addresses/:id` (delete address)
  - `PATCH /api/v1/addresses/:id/set-default` (set as default)
- [ ] Implement address validation:
  - ZIP code format validation
  - Service area check
  - Phone number E.164 format
- [ ] Integrate Google Places API for autocomplete
- [ ] Ensure only one default address per user
- [ ] Create address UI components:
  - Address form with autocomplete
  - Address list with edit/delete
  - Address selector for orders

**Deliverables**:
- Address CRUD API
- Address form UI
- Google Places integration

**Acceptance Criteria**:
- ✅ User can add/edit/delete addresses
- ✅ Address autocomplete works
- ✅ ZIP code validation prevents invalid entries
- ✅ Only one default address per user
- ✅ Service area validation blocks unsupported ZIPs
- ✅ Address selector shows in order flow

**Dependencies**: Step 3.1, Step 2.2

---

## Phase 2: AI Agent & Chat Interface (Weeks 5-8)

### Week 5: LLM Integration & Observability

#### Step 5.1: Anthropic Claude Integration
**Owner**: AI/ML Engineer  
**Duration**: 3 days

**Tasks**:
- [ ] Install `@anthropic-ai/sdk`
- [ ] Set up API key and environment variables
- [ ] Create LLM service wrapper:
  - Chat completion function
  - Streaming support
  - Error handling and retries
  - Token counting
- [ ] Implement conversation context management
- [ ] Define system prompts for pharmacy assistant
- [ ] Create fallback to OpenAI GPT-4 if Claude unavailable

**Deliverables**:
- LLM service module
- System prompts
- Fallback mechanism

**Acceptance Criteria**:
- ✅ Claude API responds successfully
- ✅ Conversation context maintained
- ✅ Token usage tracked
- ✅ Fallback to GPT-4 works
- ✅ Response time < 2 seconds

**Dependencies**: Step 1.1

---

#### Step 5.2: Langfuse Observability Setup
**Owner**: AI/ML Engineer  
**Duration**: 2 days

**Tasks**:
- [ ] Set up Langfuse Cloud account
- [ ] Install `langfuse` SDK
- [ ] Implement tracing for:
  - All LLM requests/responses
  - Tool calls
  - Agent reasoning chains
  - User feedback
- [ ] Create public dashboard
- [ ] Set up alerts for errors and high latency
- [ ] Log token usage and costs

**Deliverables**:
- Langfuse integration
- Public observability dashboard
- Logging configuration

**Acceptance Criteria**:
- ✅ All LLM calls logged to Langfuse
- ✅ Public dashboard accessible
- ✅ Traces include full conversation history
- ✅ Tool calls visible in traces
- ✅ Token usage tracked per conversation

**Dependencies**: Step 5.1

---

#### Step 5.3: AI Tools Definition
**Owner**: AI/ML Engineer  
**Duration**: 3 days

**Tasks**:
- [ ] Define AI tools (function calling):
  - `check_inventory(medication, dosage)` - Check stock
  - `create_order(medications[], userId)` - Create order
  - `get_order_history(userId)` - Retrieve past orders
  - `search_medicine(query)` - Search medicine database
  - `check_prescription_required(medicineId)` - Check if Rx needed
- [ ] Implement tool execution handlers
- [ ] Add tool result formatting for LLM
- [ ] Create tool validation and error handling
- [ ] Test each tool independently

**Deliverables**:
- AI tool definitions
- Tool execution handlers
- Tool tests

**Acceptance Criteria**:
- ✅ All tools execute correctly
- ✅ Tool results formatted for LLM consumption
- ✅ Errors handled gracefully
- ✅ Tools logged in Langfuse
- ✅ 90%+ tool execution success rate

**Dependencies**: Step 5.1, Step 2.1, Step 3.1

---

### Week 6: Chat Interface Development

#### Step 6.1: Chat UI Components
**Owner**: Full-Stack Dev 1  
**Duration**: 4 days

**Tasks**:
- [ ] Create chat components:
  - `ChatContainer` - Full chat layout
  - `MessageList` - Scrollable message area
  - `MessageBubble` - Individual messages (user/AI)
  - `ChatInput` - Message input with send button
  - `TypingIndicator` - AI thinking animation
  - `QuickReply` - Suggested action buttons
- [ ] Implement auto-scroll to latest message
- [ ] Add timestamp display
- [ ] Create loading states
- [ ] Implement error message display
- [ ] Add message retry functionality
- [ ] Style according to FRONTEND_GUIDELINES.md

**Deliverables**:
- Chat UI components
- Chat layout page

**Acceptance Criteria**:
- ✅ Messages display correctly (user vs AI)
- ✅ Auto-scroll works smoothly
- ✅ Typing indicator shows during AI response
- ✅ Quick reply buttons functional
- ✅ Mobile responsive
- ✅ Accessible (keyboard navigation, screen readers)

**Dependencies**: Step 2.2

---

#### Step 6.2: Chat API & WebSocket
**Owner**: Full-Stack Dev 2  
**Duration**: 3 days

**Tasks**:
- [ ] Install Socket.IO (`socket.io`, `socket.io-client`)
- [ ] Set up WebSocket server
- [ ] Create chat endpoints:
  - `POST /api/v1/chat/message` - Send message
  - WebSocket: Real-time message streaming
- [ ] Implement conversation storage in database
- [ ] Create conversation session management
- [ ] Add message history retrieval
- [ ] Implement typing indicators via WebSocket

**Deliverables**:
- Chat API endpoints
- WebSocket server
- Conversation storage

**Acceptance Criteria**:
- ✅ Messages sent and received in real-time
- ✅ Conversation history persisted
- ✅ Multiple users can chat simultaneously
- ✅ WebSocket reconnection works
- ✅ Message delivery confirmed

**Dependencies**: Step 1.2, Step 5.1

---

### Week 7: Entity Extraction & Order Flow

#### Step 7.1: Entity Extraction from Natural Language
**Owner**: AI/ML Engineer  
**Duration**: 4 days

**Tasks**:
- [ ] Implement entity extraction logic:
  - Medicine name (with fuzzy matching)
  - Dosage (e.g., "500mg", "10ml")
  - Quantity (number of units)
  - Frequency (e.g., "twice daily")
- [ ] Create confidence scoring for extractions
- [ ] Implement validation against medicine database
- [ ] Handle common misspellings and variations
- [ ] Add clarification prompts for low confidence
- [ ] Test with 50+ sample conversations

**Deliverables**:
- Entity extraction module
- Validation logic
- Test dataset with results

**Acceptance Criteria**:
- ✅ 95%+ accuracy on test dataset
- ✅ Fuzzy matching handles misspellings
- ✅ Low confidence triggers clarification
- ✅ Extracted entities validated against database
- ✅ Handles multi-medication orders

**Dependencies**: Step 5.3, Step 2.1

---

#### Step 7.2: Conversational Order Placement Flow
**Owner**: AI/ML Engineer + Full-Stack Dev 1  
**Duration**: 3 days

**Tasks**:
- [ ] Implement multi-turn conversation flow:
  1. User states need
  2. AI extracts entities
  3. AI checks inventory
  4. AI asks for missing information
  5. AI confirms order details
  6. User approves
  7. Order created
- [ ] Add order summary display in chat
- [ ] Implement prescription upload prompt
- [ ] Create order confirmation message
- [ ] Add ability to edit order before confirmation
- [ ] Handle order cancellation mid-conversation

**Deliverables**:
- Complete order flow in chat
- Order summary UI
- Conversation state machine

**Acceptance Criteria**:
- ✅ User can complete order via chat
- ✅ All order details confirmed before creation
- ✅ Prescription prompt shows for Rx-required meds
- ✅ Order summary accurate
- ✅ User can edit quantities before confirming
- ✅ < 2 minute average order time

**Dependencies**: Step 7.1, Step 6.1, Step 6.2, Step 3.1

---

### Week 8: Testing & Refinement

#### Step 8.1: Integration Testing
**Owner**: All Developers  
**Duration**: 3 days

**Tasks**:
- [ ] Write integration tests:
  - Complete signup → login → order flow
  - Chat conversation → order creation
  - Prescription upload → order approval
  - Address management in order flow
- [ ] Test error scenarios:
  - Out of stock items
  - Invalid prescriptions
  - Network failures
  - API timeouts
- [ ] Load testing with 50 concurrent users
- [ ] Test on multiple browsers and devices

**Deliverables**:
- Integration test suite
- Load test results
- Bug reports and fixes

**Acceptance Criteria**:
- ✅ All happy paths work end-to-end
- ✅ Error scenarios handled gracefully
- ✅ System handles 50 concurrent users
- ✅ No critical bugs
- ✅ 80%+ test coverage

**Dependencies**: All previous steps

---

#### Step 8.2: Prompt Engineering & Optimization
**Owner**: AI/ML Engineer  
**Duration**: 2 days

**Tasks**:
- [ ] Optimize system prompts for:
  - Clarity and conciseness
  - Medical terminology accuracy
  - Friendly, professional tone
  - Error handling
- [ ] Test with edge cases:
  - Ambiguous requests
  - Multiple medications
  - Complex dosing schedules
  - User confusion
- [ ] Reduce token usage where possible
- [ ] Improve response time
- [ ] A/B test different prompt variations

**Deliverables**:
- Optimized system prompts
- Performance improvements
- A/B test results

**Acceptance Criteria**:
- ✅ Response time < 2 seconds (95th percentile)
- ✅ Token usage reduced by 20%
- ✅ Conversation completion rate > 85%
- ✅ User satisfaction score > 4/5

**Dependencies**: Step 7.2, Step 8.1

---

## Phase 3: Admin Dashboard & Workflows (Weeks 9-12)

### Week 9: Admin Dashboard Foundation

#### Step 9.1: Admin Layout & Navigation
**Owner**: Full-Stack Dev 1  
**Duration**: 2 days

**Tasks**:
- [ ] Create admin dashboard layout:
  - Sidebar navigation
  - Top bar with search and profile
  - Main content area
- [ ] Implement navigation:
  - Dashboard (overview)
  - Orders
  - Inventory
  - Refill Alerts
  - Users (future)
- [ ] Add role-based access control (staff/admin only)
- [ ] Create admin login page
- [ ] Style according to FRONTEND_GUIDELINES.md

**Deliverables**:
- Admin dashboard layout
- Navigation system
- Access control

**Acceptance Criteria**:
- ✅ Only staff/admin can access
- ✅ Navigation works smoothly
- ✅ Responsive on desktop/tablet
- ✅ Consistent with design system

**Dependencies**: Step 2.2, Step 1.3

---

#### Step 9.2: Orders Management View
**Owner**: Full-Stack Dev 1  
**Duration**: 3 days

**Tasks**:
- [ ] Create orders list view:
  - Table with: Order #, Customer, Medications, Status, Date
  - Filters: Status, Date range
  - Search by order number or customer name
  - Pagination
- [ ] Create order detail modal:
  - Full order information
  - Customer details
  - Prescription image viewer
  - Status update buttons
  - Action buttons: Approve, Reject, Contact Customer
- [ ] Implement real-time updates (Socket.IO)
- [ ] Add order status transition UI
- [ ] Create prescription review interface

**Deliverables**:
- Orders list view
- Order detail modal
- Prescription review UI

**Acceptance Criteria**:
- ✅ All orders displayed correctly
- ✅ Filters and search work
- ✅ Staff can approve/reject prescriptions
- ✅ Status updates in real-time
- ✅ Prescription images viewable
- ✅ Action buttons functional

**Dependencies**: Step 9.1, Step 3.1, Step 3.2

---

#### Step 9.3: Inventory Management View
**Owner**: Full-Stack Dev 2  
**Duration**: 3 days

**Tasks**:
- [ ] Create inventory list view:
  - Table with: Medicine Name, Dosage, Stock Level, Price
  - Color coding: Green (>50), Yellow (10-50), Red (<10)
  - Sortable columns
  - Search by medicine name
  - Filter by: Low stock, Prescription required
- [ ] Create medicine edit modal:
  - Update stock level
  - Update price
  - Toggle active status
- [ ] Add bulk stock update (CSV import)
- [ ] Implement auto-refresh every 30 seconds
- [ ] Add low stock alerts

**Deliverables**:
- Inventory list view
- Medicine edit functionality
- CSV import feature

**Acceptance Criteria**:
- ✅ Inventory displays with color coding
- ✅ Stock levels updatable
- ✅ CSV import works correctly
- ✅ Auto-refresh updates data
- ✅ Low stock items highlighted

**Dependencies**: Step 9.1, Step 2.1

---

### Week 10: n8n Workflow Automation

#### Step 10.1: n8n Setup & Configuration
**Owner**: Full-Stack Dev 2  
**Duration**: 2 days

**Tasks**:
- [ ] Set up n8n Cloud account
- [ ] Create webhook endpoints in backend:
  - `/webhooks/order-created`
  - `/webhooks/order-approved`
  - `/webhooks/prescription-rejected`
- [ ] Configure n8n credentials:
  - Resend (email)
  - Twilio (SMS/WhatsApp)
  - Database connection
- [ ] Set up error handling and retry logic
- [ ] Create monitoring dashboard

**Deliverables**:
- n8n workspace configured
- Webhook endpoints
- Credentials setup

**Acceptance Criteria**:
- ✅ Webhooks receive events from backend
- ✅ n8n can connect to all services
- ✅ Error handling configured
- ✅ Logs accessible

**Dependencies**: Step 3.1

---

#### Step 10.2: Order Confirmation Workflow
**Owner**: Full-Stack Dev 2  
**Duration**: 2 days

**Tasks**:
- [ ] Create n8n workflow:
  1. Trigger: Webhook (order created)
  2. Validate order data
  3. Send confirmation email (Resend)
  4. Send SMS if opted in (Twilio)
  5. Log success/failure
- [ ] Create email template (React Email):
  - Order details
  - Tracking link
  - Support contact
- [ ] Create SMS template
- [ ] Test workflow end-to-end
- [ ] Add retry logic (3 attempts)

**Deliverables**:
- Order confirmation workflow
- Email and SMS templates
- Workflow tests

**Acceptance Criteria**:
- ✅ Email sent on order creation
- ✅ SMS sent if user opted in
- ✅ Templates render correctly
- ✅ Retry logic works on failure
- ✅ 98%+ success rate

**Dependencies**: Step 10.1

---

#### Step 10.3: Email Service Integration (Resend)
**Owner**: Full-Stack Dev 1  
**Duration**: 2 days

**Tasks**:
- [ ] Set up Resend account
- [ ] Install `resend` and `react-email`
- [ ] Create email templates:
  - Verification email
  - Order confirmation
  - Prescription approved
  - Prescription rejected
  - Refill reminder (future)
- [ ] Implement email sending utility
- [ ] Add email tracking (opens, clicks)
- [ ] Test all email templates

**Deliverables**:
- Email templates
- Email sending utility
- Template tests

**Acceptance Criteria**:
- ✅ All emails render correctly
- ✅ Links work in emails
- ✅ Mobile-responsive templates
- ✅ Deliverability > 99%
- ✅ Tracking data captured

**Dependencies**: Step 10.1

---

### Week 11: Refill Prediction System

#### Step 11.1: Refill Prediction Algorithm
**Owner**: AI/ML Engineer  
**Duration**: 4 days

**Tasks**:
- [ ] Implement prediction algorithm:
  - Calculate days since last order
  - Estimate daily dose from quantity and frequency
  - Calculate days until out: (quantity ÷ daily_dose) - days_since_order
  - Flag if estimated days remaining < 7
- [ ] Handle variable dosing (e.g., "as needed")
- [ ] Account for historical refill patterns
- [ ] Avoid duplicate alerts (14-day cooldown)
- [ ] Create batch job to run daily at 6 AM
- [ ] Test with historical data (6 months)

**Deliverables**:
- Prediction algorithm
- Daily batch job
- Test results on historical data

**Acceptance Criteria**:
- ✅ Algorithm calculates days remaining accurately
- ✅ Alerts generated for patients < 7 days supply
- ✅ False positive rate < 15%
- ✅ Batch job runs successfully daily
- ✅ Handles edge cases (variable dosing)

**Dependencies**: Step 3.1, Step 1.2

---

#### Step 11.2: Refill Alerts Database & API
**Owner**: Full-Stack Dev 2  
**Duration**: 2 days

**Tasks**:
- [ ] Create refill alerts API:
  - `GET /api/v1/refill-alerts` (list alerts)
  - `PATCH /api/v1/refill-alerts/:id` (update status)
  - `POST /api/v1/refill-alerts/:id/dismiss` (dismiss alert)
  - `POST /api/v1/refill-alerts/:id/contact` (trigger outreach)
- [ ] Implement alert status tracking:
  - pending → contacted → responded → converted
- [ ] Link alerts to resulting orders
- [ ] Add filtering and sorting
- [ ] Create alert metrics endpoint

**Deliverables**:
- Refill alerts API
- Status tracking
- Metrics endpoint

**Acceptance Criteria**:
- ✅ Alerts retrievable via API
- ✅ Status updates persist
- ✅ Converted alerts link to orders
- ✅ Metrics calculate correctly

**Dependencies**: Step 11.1, Step 1.2

---

### Week 12: Proactive Outreach System

#### Step 12.1: Refill Alerts Admin View
**Owner**: Full-Stack Dev 1  
**Duration**: 3 days

**Tasks**:
- [ ] Create refill alerts view in admin dashboard:
  - Table: Customer, Medication, Days Until Out, Last Order, Status
  - Sort by urgency (days remaining)
  - Filter by status
  - Color coding: Red (<3 days), Yellow (3-5), Green (5-7)
- [ ] Add action buttons:
  - Contact Customer (manual outreach)
  - Dismiss Alert
  - View Order History
- [ ] Show conversion metrics:
  - Total alerts
  - Response rate
  - Conversion rate
- [ ] Implement real-time updates

**Deliverables**:
- Refill alerts admin view
- Metrics dashboard
- Action buttons

**Acceptance Criteria**:
- ✅ Alerts displayed with urgency indicators
- ✅ Staff can manually trigger outreach
- ✅ Metrics accurate
- ✅ Real-time updates work
- ✅ Sortable and filterable

**Dependencies**: Step 11.2, Step 9.1

---

#### Step 12.2: Automated Refill Outreach Workflow
**Owner**: Full-Stack Dev 2  
**Duration**: 3 days

**Tasks**:
- [ ] Create n8n workflow for daily refill outreach:
  1. Trigger: Scheduled (daily 8 AM)
  2. Query refill alerts (status: pending)
  3. For each alert:
     - Determine preferred channel (WhatsApp > SMS > Email)
     - Generate personalized message
     - Send via appropriate channel
     - Update alert status to "contacted"
     - Log result
  4. Rate limit: 10 messages/minute
- [ ] Create message templates:
  - WhatsApp template
  - SMS template
  - Email template
- [ ] Implement deep links to pre-filled refill page
- [ ] Add retry logic for failed sends
- [ ] Respect opt-out preferences

**Deliverables**:
- Automated outreach workflow
- Message templates
- Deep link generation

**Acceptance Criteria**:
- ✅ Workflow runs daily at 8 AM
- ✅ Messages personalized with customer name, medication
- ✅ Deep links work correctly
- ✅ Respects opt-out preferences
- ✅ 98%+ delivery success rate
- ✅ Rate limiting prevents API throttling

**Dependencies**: Step 12.1, Step 10.1, Step 11.2

---

#### Step 12.3: Refill Landing Page
**Owner**: Full-Stack Dev 1  
**Duration**: 2 days

**Tasks**:
- [ ] Create refill page: `/refill?order_id=xxx&token=yyy`
- [ ] Pre-fill order details from last order:
  - Medication name and dosage
  - Quantity (editable)
  - Price
- [ ] Add "Confirm Refill" button
- [ ] Show "Prescription on file" if available
- [ ] Handle token validation and expiration
- [ ] Require login if not authenticated
- [ ] Create order on confirmation
- [ ] Redirect to order tracking page

**Deliverables**:
- Refill landing page
- Token validation
- Order creation flow

**Acceptance Criteria**:
- ✅ Page loads with pre-filled data
- ✅ User can adjust quantity
- ✅ Token validation works
- ✅ Order created on confirmation
- ✅ Redirects to tracking page
- ✅ Mobile responsive

**Dependencies**: Step 12.2, Step 3.1

---

## Phase 4: Polish & Launch Prep (Weeks 13-16)

### Week 13: Order Tracking & Notifications

#### Step 13.1: Order Tracking Page
**Owner**: Full-Stack Dev 1  
**Duration**: 3 days

**Tasks**:
- [ ] Create order tracking page: `/orders/:id`
- [ ] Display order timeline:
  - Order Placed
  - Prescription Review (if applicable)
  - Approved
  - Preparing
  - Out for Delivery
  - Delivered
- [ ] Show current status with visual indicator
- [ ] Display estimated delivery date
- [ ] Add order details summary
- [ ] Show prescription status
- [ ] Add "Contact Support" button
- [ ] Implement real-time status updates (Socket.IO)

**Deliverables**:
- Order tracking page
- Timeline component
- Real-time updates

**Acceptance Criteria**:
- ✅ Timeline shows correct status
- ✅ Status updates in real-time
- ✅ Estimated delivery date displayed
- ✅ Mobile responsive
- ✅ Accessible

**Dependencies**: Step 3.1, Step 6.2

---

#### Step 13.2: Order Status Update Workflow
**Owner**: Full-Stack Dev 2  
**Duration**: 2 days

**Tasks**:
- [ ] Create n8n workflow for status updates:
  1. Trigger: Webhook (order status changed)
  2. Send notification based on new status:
     - Approved: "Prescription approved!"
     - Preparing: "We're preparing your order"
     - Out for Delivery: "Your order is on the way"
     - Delivered: "Order delivered!"
  3. Send via email + SMS (if opted in)
  4. Update order tracking page via WebSocket
- [ ] Create notification templates
- [ ] Test all status transitions
- [ ] Add notification preferences

**Deliverables**:
- Status update workflow
- Notification templates
- WebSocket integration

**Acceptance Criteria**:
- ✅ Notifications sent on status change
- ✅ Templates accurate for each status
- ✅ WebSocket updates tracking page
- ✅ Users can opt out of notifications

**Dependencies**: Step 13.1, Step 10.1

---

### Week 14: Testing & Bug Fixes

#### Step 14.1: End-to-End Testing
**Owner**: All Developers  
**Duration**: 3 days

**Tasks**:
- [ ] Test complete user journeys:
  - New user signup → order → delivery
  - Returning user refill
  - Admin prescription review
  - Refill alert → conversion
- [ ] Test on multiple devices:
  - Desktop (Chrome, Firefox, Safari, Edge)
  - Mobile (iOS Safari, Android Chrome)
  - Tablet
- [ ] Test error scenarios:
  - Network failures
  - API timeouts
  - Invalid data
  - Edge cases
- [ ] Performance testing:
  - 100 concurrent users
  - Large order volumes
  - Database query optimization
- [ ] Security testing:
  - SQL injection attempts
  - XSS attempts
  - CSRF protection
  - Authentication bypass attempts

**Deliverables**:
- Test results report
- Bug list with priorities
- Performance benchmarks

**Acceptance Criteria**:
- ✅ All critical bugs fixed
- ✅ System handles 100 concurrent users
- ✅ Response times meet targets
- ✅ No security vulnerabilities
- ✅ Cross-browser compatibility

**Dependencies**: All previous steps

---

#### Step 14.2: Bug Fixes & Optimization
**Owner**: All Developers  
**Duration**: 2 days

**Tasks**:
- [ ] Fix all critical and high-priority bugs
- [ ] Optimize slow database queries
- [ ] Reduce bundle size (code splitting)
- [ ] Optimize images and assets
- [ ] Improve LLM response time
- [ ] Reduce token usage
- [ ] Fix accessibility issues
- [ ] Improve error messages

**Deliverables**:
- Bug fixes
- Performance improvements
- Optimization report

**Acceptance Criteria**:
- ✅ Zero critical bugs
- ✅ API response time < 500ms (95th percentile)
- ✅ Page load time < 3s on 3G
- ✅ Bundle size reduced by 20%
- ✅ WCAG 2.1 AA compliant

**Dependencies**: Step 14.1

---

### Week 15: Documentation & Training

#### Step 15.1: Technical Documentation
**Owner**: Full-Stack Dev 2  
**Duration**: 2 days

**Tasks**:
- [ ] Write API documentation (Swagger/OpenAPI)
- [ ] Create architecture diagrams
- [ ] Document database schema
- [ ] Write deployment guide
- [ ] Create runbooks for common issues
- [ ] Document environment variables
- [ ] Write contribution guidelines
- [ ] Create changelog

**Deliverables**:
- API documentation
- Architecture diagrams
- Deployment guide
- Runbooks

**Acceptance Criteria**:
- ✅ API docs complete and accurate
- ✅ Diagrams clear and up-to-date
- ✅ Deployment guide tested
- ✅ Runbooks cover common scenarios

**Dependencies**: All previous steps

---

#### Step 15.2: User Documentation & Help Center
**Owner**: Full-Stack Dev 1 + Product Manager  
**Duration**: 3 days

**Tasks**:
- [ ] Create user guides:
  - How to place an order
  - How to upload a prescription
  - How to track an order
  - How to manage addresses
  - How to update profile
- [ ] Create FAQ page
- [ ] Write troubleshooting guides
- [ ] Create video tutorials (optional)
- [ ] Add in-app help tooltips
- [ ] Create onboarding tutorial

**Deliverables**:
- User guides
- FAQ page
- Help tooltips
- Onboarding tutorial

**Acceptance Criteria**:
- ✅ Guides cover all major features
- ✅ FAQ answers common questions
- ✅ Help tooltips contextual
- ✅ Onboarding tutorial clear

**Dependencies**: All previous steps

---

#### Step 15.3: Staff Training Materials
**Owner**: Product Manager  
**Duration**: 2 days

**Tasks**:
- [ ] Create staff training guide:
  - Admin dashboard overview
  - How to review prescriptions
  - How to manage inventory
  - How to handle refill alerts
  - How to contact customers
- [ ] Create video walkthrough
- [ ] Prepare training session agenda
- [ ] Create quick reference cards
- [ ] Set up support channels (Slack, email)

**Deliverables**:
- Staff training guide
- Video walkthrough
- Quick reference cards

**Acceptance Criteria**:
- ✅ Guide covers all admin features
- ✅ Video clear and comprehensive
- ✅ Quick reference cards helpful

**Dependencies**: Step 9.2, Step 9.3, Step 12.1

---

### Week 16: Deployment & Launch Prep

#### Step 16.1: Production Deployment
**Owner**: Full-Stack Dev 2  
**Duration**: 2 days

**Tasks**:
- [ ] Set up production environment:
  - Vercel (frontend)
  - Railway (backend)
  - Supabase (database)
  - Upstash (Redis)
  - AWS S3 (file storage)
- [ ] Configure environment variables
- [ ] Set up custom domain and SSL
- [ ] Configure CDN (CloudFront)
- [ ] Run database migrations
- [ ] Seed production database
- [ ] Set up monitoring (Sentry, Vercel Analytics)
- [ ] Configure backup strategy
- [ ] Test production deployment

**Deliverables**:
- Production environment
- Monitoring setup
- Backup configuration

**Acceptance Criteria**:
- ✅ Application accessible via custom domain
- ✅ SSL certificate valid
- ✅ Database migrated successfully
- ✅ Monitoring active
- ✅ Backups configured

**Dependencies**: Step 14.2

---

#### Step 16.2: Security Audit & HIPAA Compliance
**Owner**: Full-Stack Dev 1 + External Consultant  
**Duration**: 2 days

**Tasks**:
- [ ] Conduct security audit:
  - Penetration testing
  - Vulnerability scanning
  - Code review for security issues
- [ ] HIPAA compliance checklist:
  - Encryption at rest and in transit
  - Access controls
  - Audit logging
  - BAAs with vendors
  - Data retention policies
- [ ] Fix identified security issues
- [ ] Document compliance measures
- [ ] Get legal review

**Deliverables**:
- Security audit report
- HIPAA compliance documentation
- Legal approval

**Acceptance Criteria**:
- ✅ No critical security vulnerabilities
- ✅ HIPAA requirements met
- ✅ Legal approval obtained
- ✅ BAAs signed with vendors

**Dependencies**: Step 16.1

---

#### Step 16.3: Beta Launch Preparation
**Owner**: Product Manager + All Developers  
**Duration**: 3 days

**Tasks**:
- [ ] Identify beta pharmacy partner
- [ ] Set up beta user accounts
- [ ] Create beta feedback form
- [ ] Set up analytics tracking:
  - User signups
  - Order completion rate
  - Chat abandonment rate
  - Refill alert conversion
  - Average order time
- [ ] Prepare launch checklist
- [ ] Create incident response plan
- [ ] Set up on-call rotation
- [ ] Schedule launch date
- [ ] Prepare announcement materials

**Deliverables**:
- Beta user accounts
- Analytics dashboard
- Launch checklist
- Incident response plan

**Acceptance Criteria**:
- ✅ Beta pharmacy onboarded
- ✅ Analytics tracking all key metrics
- ✅ Launch checklist complete
- ✅ Team ready for launch

**Dependencies**: Step 16.1, Step 16.2

---

## Success Criteria (MVP Completion)

### Functional Requirements
- ✅ Users can sign up and log in
- ✅ Users can order medications via chat
- ✅ AI agent extracts entities with 95%+ accuracy
- ✅ Orders created and tracked
- ✅ Prescriptions uploaded and reviewed
- ✅ Admin dashboard functional
- ✅ Refill alerts generated and sent
- ✅ n8n workflows operational
- ✅ All P0 features from PRD implemented

### Performance Requirements
- ✅ Chat response time < 2 seconds (95th percentile)
- ✅ API response time < 500ms (95th percentile)
- ✅ Page load time < 3 seconds on 3G
- ✅ System handles 100 concurrent users
- ✅ 99.5%+ uptime

### Quality Requirements
- ✅ 80%+ test coverage
- ✅ Zero critical bugs
- ✅ WCAG 2.1 AA compliant
- ✅ HIPAA compliant
- ✅ Cross-browser compatible

### Business Requirements
- ✅ 10+ test orders processed successfully
- ✅ Refill alert conversion rate tracked
- ✅ Observability dashboard public
- ✅ Staff trained and comfortable
- ✅ Beta pharmacy approved for launch

---

## Risk Mitigation

### High-Risk Items
1. **AI Accuracy**: Continuous testing and prompt optimization
2. **HIPAA Compliance**: Legal review and security audit
3. **n8n Reliability**: Retry logic and monitoring
4. **Staff Adoption**: Training and support

### Contingency Plans
- **LLM Failure**: Fallback to form-based ordering
- **n8n Failure**: Manual notification process
- **Database Issues**: Automated backups every 6 hours
- **API Outages**: Graceful degradation and error messages

---

## Post-MVP Roadmap (P1 Features)

### Phase 5: Enhancements (Weeks 17-22)
- Voice interface (Web Speech API)
- Prescription OCR (Tesseract.js or cloud service)
- Multi-language support (Spanish, Hindi)
- Drug interaction warnings (DrugBank API)
- Insurance verification
- Delivery tracking integration
- Mobile app (React Native)

---

## Team Responsibilities

### Full-Stack Developer 1
- Frontend development (Next.js, React, Tailwind)
- UI/UX implementation
- Chat interface
- User-facing features

### Full-Stack Developer 2
- Backend development (Express.js, Prisma)
- API endpoints
- Database management
- n8n workflows
- DevOps and deployment

### AI/ML Engineer
- LLM integration (Claude, GPT-4)
- Entity extraction
- Prompt engineering
- Observability (Langfuse)
- Refill prediction algorithm

### Product Manager
- Requirements clarification
- Stakeholder communication
- User testing coordination
- Documentation review
- Launch planning

---

## Weekly Sync Schedule

### Monday: Sprint Planning
- Review previous week
- Plan current week tasks
- Assign responsibilities
- Identify blockers

### Wednesday: Mid-Week Check-in
- Progress updates
- Blocker resolution
- Technical discussions

### Friday: Demo & Retrospective
- Demo completed features
- Retrospective
- Update documentation

---

## Tools & Communication

### Development
- **Code**: GitHub
- **Project Management**: GitHub Projects
- **Documentation**: Markdown in repo
- **Design**: Figma (optional)

### Communication
- **Chat**: Slack
- **Video**: Google Meet
- **Async**: GitHub Discussions

### Monitoring
- **Errors**: Sentry
- **Analytics**: Vercel Analytics
- **LLM**: Langfuse
- **Uptime**: Better Uptime

---

**End of Implementation Plan**

*This plan is a living document and will be updated as the project progresses.*
