# Application Flow Documentation
## Agentic AI-Powered Pharmacy Assistant

**Version**: 1.0  
**Last Updated**: February 15, 2026  
**Product**: Pharmacy Assistant Web Application

---

## 1. Entry Points

### Primary Entry Points

#### Direct URL: `https://pharmacyassistant.com`
- **Unauthenticated User**: 
  - Lands on homepage with hero section
  - Sees marketing copy: "Order medications in seconds, using just your voice or chat"
  - CTA buttons: "Sign Up" (primary), "Log In" (secondary)
  
- **Authenticated User**:
  - Automatically redirects to `/dashboard`
  - Shows personalized greeting: "Hi Sarah, how can I help you today?"
  - Chat interface immediately ready

#### Landing Page: Homepage
- **Hero Section**: 
  - Headline: "Your AI-Powered Pharmacy Assistant"
  - Subheadline: "Never run out of medication again. Order in seconds, get proactive reminders."
  - Demo video: 30-second chat ordering demonstration
  - CTA: "Start Ordering Now" → Leads to sign-up
  
- **Feature Cards**:
  - "Chat to Order" → Links to `/how-it-works`
  - "Automatic Refills" → Links to `/features/refills`
  - "Track Orders" → Links to `/features/tracking`
  
- **Trust Indicators**:
  - HIPAA compliant badge
  - Pharmacy partner logos
  - Customer testimonials

#### Deep Links

- **From Email Confirmation**: 
  - `https://pharmacyassistant.com/verify?token=abc123`
  - Auto-verifies account → Redirects to onboarding

- **From Refill Reminder Email**:
  - `https://pharmacyassistant.com/refill?order_id=12345&medication=metformin`
  - Pre-loads chat with: "Would you like to refill your Metformin 500mg?"
  - Requires login if not authenticated

- **From Order Confirmation Email**:
  - `https://pharmacyassistant.com/orders/12345`
  - Shows order tracking page

- **From WhatsApp Notification**:
  - Same as email deep links
  - Opens in mobile browser if WhatsApp in-app browser

- **From Marketing Campaign**:
  - `https://pharmacyassistant.com/?utm_source=facebook&utm_campaign=diabetes_care`
  - Tracks campaign attribution
  - Shows campaign-specific landing page variant

#### OAuth/Social Login
- **Supported Providers**: Google, Apple (future: Facebook)
- **Flow**:
  1. User clicks "Continue with Google" on login page
  2. Redirects to Google OAuth consent screen
  3. User approves
  4. Redirects back to `https://pharmacyassistant.com/auth/callback?provider=google&code=xyz`
  5. System creates/logs in user
  6. Redirects to onboarding (new user) or dashboard (returning user)

### Secondary Entry Points

#### Search Engine: SEO Landing Pages
- **Query**: "how to refill diabetes medication online"
- **Landing Page**: `https://pharmacyassistant.com/guides/refill-diabetes-medication`
  - SEO-optimized content
  - CTA at bottom: "Try Our AI Assistant" → Sign-up flow

#### Marketing Campaigns
- **Facebook Ad**: Click → `https://pharmacyassistant.com/campaign/diabetes-management`
  - Variant homepage highlighting diabetes-specific features
  - Special offer: "First order free delivery"
  - Tracking pixel for conversion

- **Google Ads**: Click → `https://pharmacyassistant.com/lp/quick-refills`
  - Minimal landing page focused on speed
  - Instant chat demo
  - "Start Ordering in 30 Seconds" CTA

---

## 2. Core User Flows

### Flow 1: User Registration (First-Time Patient)

**Goal**: Create account and complete initial setup  
**Entry Point**: "Sign Up" button on homepage  
**Frequency**: Once per user  
**Estimated Time**: 2-3 minutes

#### Happy Path

##### 1. Page: Landing Page
- **Elements**: 
  - Hero section with value proposition
  - "Sign Up" button (primary CTA, top-right and center)
  - "Log In" link (secondary)
  
- **User Action**: Clicks "Sign Up"
- **Trigger**: Navigate to `/signup`

##### 2. Page: Registration Form (`/signup`)
- **Elements**:
  - Email input field (required)
  - Password input field (required, with show/hide toggle)
  - Password strength indicator (weak/medium/strong)
  - "Sign up with Google" button (alternative)
  - "Already have an account? Log in" link
  - "Continue" button
  
- **User Actions**:
  - Enters email address
  - Enters password (8+ characters, 1 number, 1 letter minimum)
  - Password strength indicator updates in real-time
  
- **Validation**:
  - Email format check (regex: valid email structure)
  - Password requirements: 
    - Minimum 8 characters
    - At least 1 letter, 1 number
    - Visual feedback: Red (weak), Yellow (medium), Green (strong)
  - Checks if email already exists (on blur)
  
- **Trigger**: Clicks "Continue"
- **System Action**: 
  - Creates user account (status: unverified)
  - Sends verification email
  - Generates session token
  - Logs event: "user_registered"

##### 3. Page: Email Verification Prompt (`/verify-email`)
- **Elements**:
  - Success icon
  - Message: "Check your email! We sent a verification link to [email]"
  - "Resend Email" button (disabled for 60 seconds)
  - "Continue to Dashboard" button (disabled until verified)
  - "Change Email" link
  
- **User Action**: Leaves browser open, checks email
- **System Action**: Polls verification status every 5 seconds

##### 4. Email: Verification Link
- **Subject**: "Verify your Pharmacy Assistant account"
- **Content**:
  - Welcome message
  - CTA button: "Verify My Email" → `https://pharmacyassistant.com/verify?token=abc123`
  - Expiration notice: "Link expires in 24 hours"
  - Support contact
  
- **User Action**: Clicks verification link
- **Trigger**: Opens link in browser (new tab or same tab)

##### 5. Page: Email Verification Success (`/verify?token=abc123`)
- **System Actions**:
  - Validates token (checks expiration, user ID)
  - Marks user account as verified
  - Auto-logs in user (if not already)
  - Logs event: "email_verified"
  
- **Auto-redirect**: After 2 seconds → `/onboarding`

##### 6. Page: Onboarding - Profile Setup (`/onboarding`)
- **Elements**:
  - Progress indicator: Step 1 of 3
  - "Complete Your Profile" heading
  - Full name input (required)
  - Phone number input (optional, for SMS/WhatsApp)
  - "I agree to receive order updates via SMS/WhatsApp" checkbox
  - "Continue" button
  
- **User Actions**:
  - Enters full name
  - Enters phone number (optional)
  - Checks notification preferences
  
- **Validation**:
  - Name: 2-50 characters
  - Phone: Valid format (if provided)
  
- **Trigger**: Clicks "Continue"
- **System Action**: 
  - Saves profile data
  - Logs event: "onboarding_step_1_complete"
  - Navigate to `/onboarding/address`

##### 7. Page: Onboarding - Delivery Address (`/onboarding/address`)
- **Elements**:
  - Progress indicator: Step 2 of 3
  - "Where should we deliver?" heading
  - Address autocomplete input (Google Places API)
  - Street address input
  - Apartment/Unit input (optional)
  - City input (auto-filled)
  - State dropdown (auto-filled)
  - ZIP code input (auto-filled)
  - "Save as default address" checkbox (checked)
  - "Back" and "Continue" buttons
  
- **User Actions**:
  - Starts typing address
  - Selects from autocomplete dropdown
  - Form auto-fills city, state, ZIP
  - Adds apartment number if needed
  
- **Validation**:
  - Address must be within pharmacy service area (ZIP code validation)
  - All required fields completed
  
- **Trigger**: Clicks "Continue"
- **System Action**:
  - Validates service area
  - Saves address
  - Logs event: "onboarding_step_2_complete"
  - Navigate to `/onboarding/welcome`

##### 8. Page: Onboarding - Welcome Tutorial (`/onboarding/welcome`)
- **Elements**:
  - Progress indicator: Step 3 of 3
  - "You're all set! Let's show you around" heading
  - Interactive tutorial carousel:
    - Slide 1: "Chat naturally - no forms to fill"
    - Slide 2: "We'll remind you before you run out"
    - Slide 3: "Track your orders in real-time"
  - "Skip" button
  - "Next" button (last slide: "Start Ordering")
  
- **User Actions**:
  - Swipes through tutorial OR clicks "Next"
  - Can click "Skip" at any time
  
- **Trigger**: Clicks "Start Ordering"
- **System Action**:
  - Marks onboarding as complete
  - Logs event: "onboarding_complete"
  - Redirect to `/dashboard`

##### 9. Page: Dashboard - First Order Prompt (`/dashboard`)
- **Elements**:
  - Welcome message: "Hi [Name]! What medication do you need today?"
  - Chat interface (full-screen on mobile, right panel on desktop)
  - Sample prompts as clickable buttons:
    - "Refill my blood pressure medication"
    - "I need antibiotics"
    - "Order Metformin"
  - Empty state illustration
  
- **User Action**: Types or clicks sample prompt
- **Trigger**: Initiates conversation (see Flow 2: First Order Placement)
- **Success State**: User is onboarded and ready to order

#### Error States

##### Invalid Email Format
- **Trigger**: User enters "johngmail.com" (missing @)
- **Display**: 
  - Red border on email input
  - Inline error message: "Please enter a valid email address"
  - Error icon next to field
- **Action**: User corrects to "john@gmail.com" → Error clears immediately

##### Email Already Exists
- **Trigger**: User submits form with email that exists in database
- **Display**: 
  - Modal overlay
  - Heading: "Account exists"
  - Message: "An account with this email already exists. Would you like to log in instead?"
  - "Log In" button (primary)
  - "Try Different Email" button (secondary)
- **Actions**:
  - "Log In" → Navigate to `/login` with email pre-filled
  - "Try Different Email" → Close modal, clear email field, focus on email input

##### Weak Password
- **Trigger**: User types password that doesn't meet requirements
- **Display**: 
  - Password strength indicator shows "Weak" in red
  - Below input: "Password must be at least 8 characters with 1 letter and 1 number"
  - "Continue" button disabled (grayed out)
- **Action**: 
  - User strengthens password
  - Indicator changes to yellow ("Medium") or green ("Strong")
  - "Continue" button becomes enabled

##### Verification Email Not Received
- **Trigger**: User waits >2 minutes on verification page
- **Display**: 
  - Helpful message appears: "Haven't received the email?"
  - Troubleshooting tips: Check spam folder, verify email address
  - "Resend Email" button becomes enabled after 60 seconds
- **Actions**:
  - "Resend Email" → Sends new verification email, disables button for 60 seconds
  - "Change Email" → Returns to signup page with option to use different email

##### Service Area Not Supported
- **Trigger**: User enters ZIP code outside pharmacy delivery zone during onboarding
- **Display**:
  - Modal overlay
  - Heading: "Sorry, we don't deliver to this area yet"
  - Message: "We're working on expanding! Enter your email to be notified when we're available in [ZIP code]"
  - Email input (pre-filled with account email)
  - "Notify Me" button
  - "Go Back" link
- **Actions**:
  - "Notify Me" → Saves waitlist entry, shows confirmation, allows to continue with different address
  - "Go Back" → Returns to address input to try different address

#### Edge Cases

##### User Closes Browser Mid-Registration
- **Scenario**: User completes email/password but closes browser before verifying
- **Handling**:
  - Account remains in database with status: "unverified"
  - Next visit: If user tries to sign up again → "Email exists" error with "Resend verification" option
  - If user tries to log in → "Please verify your email first" message with "Resend" button

##### Email Verification Link Expires
- **Scenario**: User clicks verification link after 24 hours
- **Handling**:
  - Show page: "This verification link has expired"
  - "Request New Link" button
  - Clicking generates new token, sends fresh email
  - Logs event: "verification_link_expired"

##### User Registers But Doesn't Complete Onboarding
- **Scenario**: User verifies email but abandons during onboarding (address step)
- **Handling**:
  - On next login: Auto-redirects to last incomplete onboarding step
  - Progress saved: If address was partially filled, data persists
  - After 7 days: Send email reminder to complete setup
  - User can still access dashboard with "Complete Profile" banner at top

##### Multiple Devices During Registration
- **Scenario**: User starts signup on mobile, clicks verification link on desktop
- **Handling**:
  - Verification works on any device
  - After verification, mobile device auto-detects verified status (polling)
  - Desktop shows: "Continue to Dashboard" button
  - Mobile shows: "You verified your email on another device. Continue here?"

##### Duplicate Concurrent Signups
- **Scenario**: User opens signup in two tabs, submits both
- **Handling**:
  - Database constraint: Email is unique
  - Second submission fails silently
  - Both tabs receive same session token
  - Both tabs progress normally to verification

#### Exit Points

- **Success**: `/dashboard` (fully onboarded, logged in, ready to order)
- **Abandonment**: User closes browser/navigates away
  - Data saved: Email, password (account created)
  - Resume point: Email verification page (if unverified) or onboarding (if verified but incomplete)
- **Alternative Exit**: `/login` (if "Already have account" clicked)

---

### Flow 2: First Order Placement (Conversational)

**Goal**: Complete first medication order using chat interface  
**Entry Point**: Dashboard chat interface  
**Frequency**: Once per user (subsequent orders may be refills)  
**Estimated Time**: 1-3 minutes

#### Happy Path

##### 1. Page: Dashboard with Chat Interface (`/dashboard`)
- **Elements**:
  - Chat history panel (empty for first-time user)
  - Message input box (large, prominent)
  - Placeholder text: "Type or speak what medication you need..."
  - Voice input button (microphone icon)
  - Sample prompts as buttons:
    - "Refill my blood pressure medication"
    - "I need antibiotics"
    - "Order Metformin"
  
- **User Action**: Types "I need to refill my diabetes medicine"
- **Trigger**: Presses Enter or clicks Send button

##### 2. AI Response: Clarification Request
- **System Actions**:
  - Sends message to LLM API with conversation history
  - Entity extraction attempts: Identifies "diabetes medicine" (too general)
  - Queries user order history: No previous orders found
  - Logs: AI tool call to check history
  
- **Chat Display**:
  - AI message bubble: "I'd be happy to help! Can you tell me the specific name of your diabetes medication? For example, Metformin, Insulin, or Glipizide?"
  - Typing indicator shown for 1-2 seconds before message appears
  - Message timestamp

- **User Action**: Types "metformin 500mg"

##### 3. AI Response: Inventory Check & Confirmation
- **System Actions**:
  - Entity extraction: 
    - Drug: "Metformin"
    - Dosage: "500mg"
    - Quantity: Not specified (will ask)
  - API call: Check inventory for "Metformin 500mg"
  - Inventory result: In stock, 200 tablets available, prescription required
  - Logs: AI tool calls (entity extraction, inventory check)
  
- **Chat Display**:
  - AI message: "Great! I found Metformin 500mg tablets. We have them in stock. How many tablets would you like to order?"
  - Confidence score shown in observability dashboard: 98%

- **User Action**: Types "90 tablets"

##### 4. AI Response: Order Summary & Prescription Check
- **System Actions**:
  - Entity extraction: Quantity: 90 tablets
  - Calculates: 90 tablets × $0.15 = $13.50
  - Checks: Prescription required = true
  
- **Chat Display**:
  - AI message: "Perfect! Here's your order summary:
    - Metformin 500mg tablets
    - Quantity: 90 tablets
    - Price: $13.50
    
    This medication requires a prescription. Do you have a prescription you can upload, or should we contact your doctor?"
  - Two quick reply buttons:
    - "Upload Prescription"
    - "Contact My Doctor"

##### 5. User Action: Prescription Upload
- **User Clicks**: "Upload Prescription"
- **System Display**:
  - File upload modal appears
  - Accepted formats: JPG, PNG, PDF
  - Max size: 10MB
  - "Take Photo" option (mobile only)
  - "Choose File" button

- **User Action**: 
  - Selects prescription image from phone photos
  - Image preview appears in modal
  
- **Modal Elements**:
  - Image preview (cropped to fit)
  - "Use This Image" button
  - "Choose Different Image" link
  
- **User Clicks**: "Use This Image"

##### 6. System: Prescription Processing
- **System Actions**:
  - Uploads image to secure storage
  - Generates thumbnail
  - Creates record: Order ID generated, status = "pending_prescription_review"
  - Flags for manual pharmacist review (no OCR in MVP)
  - Logs: Prescription uploaded, order created
  
- **Chat Display**:
  - AI message: "Thank you! I've received your prescription. Our pharmacist will review it within 2 hours. Your order ID is #12345.
    
    Once approved, we'll prepare your medication and send it for delivery. You'll receive notifications via email and SMS at each step.
    
    Is there anything else I can help you with?"
  
- **System Triggers**:
  - n8n workflow: Order confirmation email sent
  - n8n workflow: SMS notification sent (if user opted in)
  - Admin dashboard: New order appears in "Pending Review" section

##### 7. User Action: Confirm Completion
- **User Types**: "No, that's all. Thanks!"
- **Chat Display**:
  - AI message: "You're welcome! We'll get that ready for you. Have a great day! 😊"
  
- **System Actions**:
  - Marks conversation as complete
  - Updates user's order history
  - Logs: Conversation ended successfully

##### 8. Page: Order Confirmation Display
- **System Auto-displays** (2 seconds after AI's final message):
  - Order summary card slides in below chat
  - Elements:
    - "Order #12345" heading
    - Medication: Metformin 500mg, 90 tablets
    - Status badge: "Prescription Review"
    - Price: $13.50
    - Estimated ready: 2-4 hours
    - "Track Order" button → Links to `/orders/12345`
  
- **Success State**: 
  - Order created and awaiting pharmacist review
  - User can track progress
  - Proactive notifications enabled

##### 9. Background: Pharmacist Review (Staff Flow)
- **Rita (Pharmacist) Dashboard**: 
  - New order alert appears
  - Opens order details: Sees prescription image
  - Reviews: Doctor name, medication, dosage, patient name match
  - Actions in admin panel:
    - "Approve" button (green)
    - "Reject" button (red) with reason field
    - "Contact Patient" button (opens chat)

- **Rita Clicks**: "Approve"

##### 10. System: Fulfillment Workflow Trigger
- **System Actions**:
  - Updates order status: "prescription_review" → "approved"
  - n8n workflow triggered:
    - Sends email to warehouse: "Prepare Order #12345"
    - Sends SMS to user: "Good news! Your prescription is approved. We're preparing your order now."
    - Updates order tracking page
  - Logs: Order approved by pharmacist (User ID logged)

##### 11. User Notification: Order Update
- **Email Received** (within 1 minute):
  - Subject: "Your prescription is approved! 🎉"
  - Body: Order details, next steps, tracking link
  
- **SMS Received** (if opted in):
  - "Good news! Your Metformin order is approved. We're preparing it now. Track: [link]"

- **User Experience**: 
  - User feels informed and confident
  - Can track order progress in real-time
  - First order experience complete

#### Error States

##### Medication Not in Inventory
- **Trigger**: User requests "Levothyroxine 75mcg" but it's out of stock
- **AI Response**: "I found Levothyroxine 75mcg, but unfortunately we're currently out of stock. We expect it back in stock on February 20th (5 days). I can:
  1. Notify you when it's available
  2. Check if we have a different dosage in stock
  3. Suggest a nearby pharmacy that has it
  
  What would you prefer?"
- **User Options**: Quick reply buttons for each choice
- **If User Selects** "Notify me":
  - System creates backorder alert
  - Sends notification when restocked

##### Unclear Medication Name
- **Trigger**: User types "I need my heart pills"
- **AI Response**: "I want to make sure I get this right. Can you tell me the name of your heart medication? It might be something like:
  - Lisinopril
  - Atorvastatin
  - Metoprolol
  - Or something else?
  
  You can also check your prescription bottle for the exact name."
- **Logs**: Low confidence entity extraction (35%)

##### Prescription Image Unreadable
- **Trigger**: User uploads blurry prescription photo
- **Pharmacist Review**: Rita sees prescription, can't read doctor's signature
- **Rita's Action**: Clicks "Contact Patient" in admin panel
- **System Opens**: Chat interface with pre-filled message template
- **Rita Sends**: "Hi! I received your prescription but the image is a bit blurry. Could you upload a clearer photo, or would you like me to contact Dr. [name] directly?"
- **User Receives**: Chat notification, responds in same conversation

##### Payment Declined (Future: When Payment Integrated)
- **Trigger**: User's card declined during checkout
- **Display**: 
  - Error message in chat: "Your payment was declined. Please update your payment method to complete this order."
  - "Update Payment" button → Opens payment method form
- **Recovery**: User updates card, order processing continues

##### Prescription Expired
- **Trigger**: Pharmacist sees prescription date is >1 year old
- **Rita's Action**: Clicks "Reject" with reason: "Prescription expired"
- **System Actions**:
  - Order status → "prescription_rejected"
  - AI sends message to user: "Unfortunately, your prescription is expired. Would you like me to help you contact Dr. [name] for a new one?"
  - Offers: "Contact My Doctor" button → Creates task for pharmacy to call doctor

#### Edge Cases

##### User Asks Multiple Questions Before Ordering
- **Scenario**: "Do you have Metformin? What's the price? Do you deliver? Are you open on weekends?"
- **AI Handling**:
  - Answers all questions in single response
  - Then asks: "Would you like to place an order for Metformin?"
  - Maintains conversational context throughout

##### User Switches Medications Mid-Conversation
- **Scenario**: 
  - User: "I need Metformin 500mg"
  - AI: "How many tablets?"
  - User: "Actually, I need Lisinopril instead"
- **AI Handling**:
  - Recognizes context switch
  - Abandons previous extraction
  - Starts fresh: "No problem! Let's order Lisinopril instead. What dosage do you need?"
  - Logs: Context switch detected

##### User Disconnects During Conversation
- **Scenario**: User's phone dies after uploading prescription but before confirming order
- **Handling**:
  - Conversation state saved to database every message
  - On return: User sees message history, can continue where left off
  - AI greets: "Welcome back! We were just finalizing your Metformin order. Should I proceed?"

##### Multiple Medications in Single Order
- **Scenario**: "I need to refill my Metformin and Lisinopril"
- **AI Handling**:
  - Extracts both medications
  - Asks for quantities separately: "Great! Let's start with Metformin. What dosage and how many tablets?"
  - After first is complete: "Got it. Now for Lisinopril, what dosage do you need?"
  - Creates single order with multiple line items
  - Single prescription upload request (both on same prescription)

##### User Provides Excess Information
- **Scenario**: "Hi my name is Sarah Johnson and I live at 123 Main St and I need to order my diabetes medication which is Metformin 500mg and I need 90 tablets and my doctor is Dr. Smith"
- **AI Handling**:
  - Extracts relevant entities only: Metformin 500mg, 90 tablets
  - Ignores unnecessary information
  - Responds focused on order: "Perfect! I have everything I need: Metformin 500mg, 90 tablets. This will be $13.50. Do you have a prescription to upload?"

#### Exit Points

- **Success**: Order created, awaiting pharmacist review → User can track via `/orders/12345`
- **Partial Success**: Order details collected but prescription not uploaded → AI sends reminder after 2 hours
- **Abandonment**: User stops responding mid-conversation → Conversation remains in history, can resume later
- **Redirect**: If user asks non-order questions → AI provides info, then asks "Would you like to place an order?"

---

### Flow 3: Proactive Refill Reminder (System-Initiated)

**Goal**: Convert predictive refill alert into completed order  
**Entry Point**: System-generated outreach (email, SMS, or WhatsApp)  
**Frequency**: Varies per patient (typically every 30-90 days)  
**Estimated Time**: 30 seconds to 2 minutes

#### Happy Path

##### 1. Background: Predictive Algorithm Runs
- **Scheduled**: Daily at 6:00 AM server time
- **System Actions**:
  - Queries Order History for all customers
  - For each customer's medication:
    - Calculates: Days since last order
    - Estimates: Days supply remaining (quantity ÷ typical daily dose)
    - Flags if: Estimated supply <7 days remaining
  - Generates refill alert list
  - Example: Sarah Johnson - Metformin 500mg - Last order: 28 days ago (90 tablets, ~3/day dosage = 30-day supply) → Estimated 2 days remaining
  - Logs: 24 refill alerts generated

##### 2. System: Batch Outreach Trigger
- **n8n Workflow Triggered**: "Daily Refill Outreach"
- **Input**: Array of 24 customer refill alerts
- **Processing**:
  - For each customer, determine preferred channel:
    - WhatsApp (if opted in and phone number valid)
    - SMS (if opted in but no WhatsApp)
    - Email (fallback)
  - Generate personalized message from template
  - Rate limit: 10 messages per minute (WhatsApp API limit)

##### 3. User: Receives WhatsApp Message
- **Message Received** (Sarah's phone, 8:30 AM):
  - Sender: "Pharmacy Assistant"
  - Message: "Hi Sarah! 👋 Our records show you might be running low on Metformin 500mg (last order: Feb 1). Would you like to refill it?
    
    Tap to reorder: [Link]"
  - Link: `https://pharmacyassistant.com/refill?order_id=12345&token=xyz`

- **User Action**: Taps link (opens in browser or in-app)

##### 4. Page: Refill Pre-Order Page (`/refill?order_id=12345&token=xyz`)
- **System Actions** (on page load):
  - Validates token (signed, expires in 7 days)
  - Fetches original order details from Order History
  - Checks user authentication:
    - If logged in: Proceed
    - If not logged in: Require login, then return to this page
  
- **Elements Displayed**:
  - Heading: "Refill Your Medication"
  - Order card pre-filled:
    - Medication: Metformin 500mg tablets
    - Quantity: 90 tablets (editable)
    - Price: $13.50
    - Note: "Same as your last order on Feb 1"
  - "Adjust Quantity" link (expands input field)
  - Prescription note: "We have your prescription on file"
  - Large "Confirm Refill" button (green, prominent)
  - "Not Now" link

##### 5. User Action: Quick Confirmation
- **User Reviews**: Pre-filled details look correct
- **User Clicks**: "Confirm Refill" (no edits needed)

##### 6. System: Order Creation
- **System Actions**:
  - Creates new order:
    - Order ID: #12401
    - Customer: Sarah Johnson
    - Medication: Metformin 500mg, 90 tablets
    - Price: $13.50
    - Prescription: Reference to original order #12345 (prescription on file)
    - Status: "approved" (skips prescription review since on file)
  - Logs:
    - Event: "refill_order_created"
    - Attribution: "refill_reminder_whatsapp"
    - Conversion time: 45 seconds from message sent
  - Triggers n8n workflows:
    - Order confirmation email
    - Warehouse fulfillment notification
    - SMS update (optional)

##### 7. Page: Order Confirmation (`/orders/12401`)
- **Auto-redirect**: From refill page to order tracking (after 1 second)
- **Elements**:
  - Success animation (checkmark)
  - Heading: "Order Confirmed! 🎉"
  - Order details card:
    - Order #12401
    - Metformin 500mg, 90 tablets
    - Status: "Preparing"
    - Estimated delivery: Feb 17-18
  - Timeline visual:
    - ✅ Order Placed (Feb 15, 8:31 AM)
    - 🔄 Preparing (Current)
    - 📦 Out for Delivery
    - ✅ Delivered
  - "Track Order" button (enabled)
  - "Chat with Support" button

##### 8. User Notification: Confirmation
- **Email Received** (within 30 seconds):
  - Subject: "Your Metformin refill is confirmed!"
  - Body: 
    - Order details
    - Tracking link
    - Estimated delivery
    - Support contact

- **SMS Received** (if opted in):
  - "Your Metformin refill is confirmed! Order #12401. We're preparing it now. Track: [link]"

##### 9. Admin Dashboard: Alert Status Update
- **Rita's Dashboard**:
  - Refill Alerts view updates in real-time
  - Sarah Johnson's alert status: "Pending" → "Converted"
  - Conversion metrics update:
    - Total alerts: 24
    - Responded: 8 (33%)
    - Converted: 7 (29% conversion rate)
    - No response: 16

##### 10. Success State
- **User Experience**:
  - Sarah never had to remember to refill
  - Order placed in <1 minute
  - No forms, no searching
  - Medication arrives before running out
  
- **Business Outcome**:
  - Automated refill conversion
  - Improved medication adherence
  - Customer retention strengthened

#### Error States

##### User Already Reordered Manually
- **Trigger**: User clicks refill link but already placed order yesterday
- **System Detection**: Checks for recent duplicate orders (same medication, <7 days)
- **Display**:
  - Info message: "Good news! You already have an active order for Metformin 500mg (Order #12398, placed Feb 14). Would you like to track that order instead?"
  - "Track Existing Order" button
  - "Place New Order Anyway" link (in case user wants extra supply)
- **Prevents**: Accidental duplicate orders

##### Prescription on File Expired
- **Trigger**: User confirms refill, but system checks prescription date → >1 year old
- **System Actions**:
  - Does NOT auto-approve order
  - Changes status to "pending_prescription_review"
  - Flags for pharmacist attention
- **Display**: 
  - Warning message: "Your prescription on file has expired. Our pharmacist will contact your doctor for a new one. We'll notify you once approved."
  - "View Order" button → Takes to order tracking page with status "Awaiting New Prescription"

##### Medication Out of Stock
- **Trigger**: User confirms refill, but inventory check shows 0 stock
- **Display**:
  - Error message: "Sorry, Metformin 500mg is currently out of stock. Expected restock: Feb 20. We can:
    1. Notify you when it's back (we'll send a message)
    2. Check if nearby pharmacy has it
    
    What would you prefer?"
  - Quick reply buttons for options
- **If User Selects** "Notify me":
  - Creates backorder
  - Sends notification when restocked
  - User can complete order then

##### Payment Method on File Declined/Missing
- **Trigger**: User confirms refill, but no payment method saved (future feature)
- **Display**:
  - Redirect to payment setup page
  - Message: "Please add a payment method to complete your refill"
  - Payment form (card details)
  - Security badges (SSL, PCI compliant)
- **After Payment Added**: Returns to refill confirmation, auto-submits

##### User Changed Address
- **Trigger**: User moved since last order, but refill uses old address
- **System Detection**: (Future enhancement: Prompt user to confirm address on refill page)
- **Current Handling**: Uses address on file
- **Future Enhancement**: "Is this address still correct?" confirmation step

#### Edge Cases

##### User Clicks "Not Now"
- **Trigger**: User opens refill page but clicks "Not Now" instead of confirming
- **System Actions**:
  - Logs: "refill_reminder_dismissed"
  - Updates alert status: "Responded - Declined"
  - Reschedules: Will send another reminder in 3 days (if still low)
- **Display**: "No problem! We'll check in again in a few days."

##### User Adjusts Quantity
- **Scenario**: Sarah wants 180 tablets instead of 90 (3-month supply)
- **Action**: Clicks "Adjust Quantity" link
- **Display**: Quantity input field becomes editable
- **User Changes**: 90 → 180
- **System Updates**: 
  - Price recalculates: $27.00
  - Prescription check: If quantity significantly higher, may require new prescription
- **Validation**: Max quantity per order: 360 tablets (for Metformin)

##### Multiple Medications Need Refill Simultaneously
- **Scenario**: Sarah needs both Metformin and Lisinopril
- **Outreach**: Two separate WhatsApp messages sent (could be combined in future)
- **User Experience**: Clicks first link, completes Metformin refill, then sees second message, clicks, completes Lisinopril refill
- **Future Enhancement**: "You have 2 medications ready to refill" with single consolidated page

##### User Ignores All Reminders
- **Outreach Schedule**:
  - Day 0: First WhatsApp/SMS sent
  - Day 3: Second reminder (if no response)
  - Day 5: Final reminder via email
  - Day 7: Alert marked "No Response" in admin dashboard
- **Pharmacist Follow-up**: Rita sees "No Response" alerts, may call high-risk patients manually

##### Token Expired or Invalid
- **Trigger**: User clicks refill link >7 days after sent, or token tampered with
- **Display**:
  - Error page: "This refill link has expired for security reasons."
  - "Request New Reminder" button
  - "Log In to Reorder" button → Takes to dashboard chat

#### Exit Points

- **Success**: Order placed → User redirected to order tracking page
- **Deferred**: User clicks "Not Now" → Alert rescheduled for 3 days later
- **Alternative Exit**: User logs into dashboard manually → Can still reorder via chat
- **Abandonment**: User ignores all reminders → Flags for manual follow-up

---

### Flow 4: Order Tracking (Returning User)

**Goal**: Check status of active order  
**Entry Point**: Email link, SMS link, or dashboard  
**Frequency**: 2-5 times per order  
**Estimated Time**: 10-30 seconds

#### Happy Path

##### 1. Entry: User Clicks Tracking Link
- **Source**: Email notification "Your order is out for delivery!"
- **Link**: `https://pharmacyassistant.com/orders/12401`
- **User Clicks**: Link opens in browser

##### 2. Page: Order Tracking (`/orders/12401`)
- **Authentication Check**:
  - If logged in: Display order details
  - If not logged in: Redirect to `/login?redirect=/orders/12401`
- **System Actions**:
  - Fetches order details from Order History API
  - Fetches latest status from n8n workflow state
  - Checks if order belongs to logged-in user (authorization)

- **Elements Displayed**:
  - Header: "Order #12401"
  - Status badge: "Out for Delivery" (yellow/orange, animated)
  - Progress timeline (visual):
    - ✅ Order Placed (Feb 15, 8:31 AM)
    - ✅ Prescription Approved (Feb 15, 9:15 AM)
    - ✅ Preparing (Feb 15, 11:00 AM)
    - 🚚 Out for Delivery (Feb 16, 2:30 PM) ← Current, highlighted
    - ⏳ Delivered (Estimated: Today by 6 PM)
  
  - Order Details Card:
    - Medication: Metformin 500mg tablets
    - Quantity: 90 tablets
    - Price: $13.50
    - Delivery Address: 123 Main St, Apt 4B
  
  - Delivery Info Card:
    - Estimated arrival: Today by 6 PM
    - Delivery partner: Local Pharmacy Delivery
    - Driver name: John (future enhancement)
    - "Track Live" button (opens map view - mock in MVP)
  
  - Actions:
    - "Contact Support" button
    - "View Invoice" link
    - "Reorder" button (quick refill)

##### 3. User Action: Checks Live Tracking (Optional)
- **User Clicks**: "Track Live" button
- **Display** (Mock Implementation):
  - Modal overlay with map
  - Simulated delivery route
  - "Your order will arrive by 6 PM" message
  - "Close" button

##### 4. Delivery Completion (Background Process)
- **Delivery Partner** (mock): Marks order as "Delivered" at 5:45 PM
- **n8n Workflow Triggered**:
  - Updates order status: "out_for_delivery" → "delivered"
  - Sends confirmation SMS: "Your Metformin has been delivered! 📦"
  - Sends confirmation email with invoice
  - Logs delivery timestamp

##### 5. Page Auto-Update (Real-Time)
- **If User Still Viewing** tracking page:
  - WebSocket or polling (every 30 seconds) detects status change
  - Timeline animates: "Delivered" step turns green with checkmark
  - Status badge changes: "Out for Delivery" → "Delivered ✅"
  - Confetti animation (optional, celebratory)
  - New section appears: "Rate Your Experience" (star rating)

##### 6. User Notification: Delivery Confirmed
- **Push Notification** (if app installed - future):
  - "Your Metformin has been delivered! 📦"
  - Tap to open: Links to order page

- **Email Received**:
  - Subject: "Delivered: Your Metformin order"
  - Body: Delivery confirmation, invoice attached (PDF)
  - "Reorder Anytime" CTA button

##### 7. User Action: Feedback (Optional)
- **User Sees**: "Rate Your Experience" section on tracking page
- **Elements**:
  - Star rating (1-5 stars)
  - Optional comment box
  - "Submit Feedback" button

- **User Rates**: 5 stars
- **System Actions**:
  - Saves feedback to database
  - Logs: "order_feedback_submitted"
  - Shows: "Thank you for your feedback!"

##### 8. Success State
- **User Experience**:
  - Full visibility into order status
  - Timely notifications at each step
  - Delivered on time
  - Positive experience reinforced

#### Error States

##### Order Not Found
- **Trigger**: User visits `/orders/99999` (invalid order ID)
- **Display**:
  - 404-style page: "Order not found"
  - Message: "We couldn't find this order. Please check the order number."
  - "View All Orders" button → Takes to `/orders` (order history)
  - "Contact Support" button

##### Order Belongs to Different User
- **Trigger**: User A tries to access User B's order URL
- **System Check**: Order's customer_id != logged-in user's ID
- **Display**:
  - Error page: "You don't have permission to view this order"
  - "View Your Orders" button → Takes to user's own order history

##### Delivery Delayed
- **Trigger**: Estimated delivery time passed, but order still "Out for Delivery"
- **System Detection**: Automated check at estimated delivery time + 2 hours
- **Actions**:
  - Status badge changes to "Delayed" (red)
  - Message appears: "Your order is running late. We're checking with our delivery partner."
  - n8n workflow: Sends alert to pharmacy staff
  - Automatic email to user: "We're looking into the delay and will update you shortly."

##### Delivery Failed/Undeliverable
- **Trigger**: Delivery partner marks "Unable to deliver" (e.g., no one home, address issue)
- **System Actions**:
  - Status changes to "Delivery Attempted"
  - n8n workflow: Alerts pharmacy staff
  - AI chat message sent to user: "We weren't able to deliver your order today. Would you like to:
    1. Reschedule delivery
    2. Pick up at pharmacy
    3. Update delivery address"
  - Quick reply buttons for each option

#### Edge Cases

##### User Tracks Order Before Fulfillment Starts
- **Scenario**: User clicks tracking link 5 minutes after placing order
- **Display**: 
  - Status: "Order Received"
  - Timeline shows only first step completed
  - Estimated timeline: "We'll start preparing your order within 2 hours"

##### Multiple Orders Simultaneously
- **Scenario**: User orders Metformin today, Lisinopril yesterday (both active)
- **Dashboard View** (`/orders`):
  - Lists both orders with separate tracking cards
  - Each card links to individual order tracking page
  - Sorted by date (newest first)

##### User Accesses Tracking Page Days After Delivery
- **Scenario**: User revisits `/orders/12401` a week later
- **Display**:
  - Status: "Delivered" (completed)
  - Delivery timestamp: Feb 16, 5:45 PM
  - "Reorder" button prominent
  - Order archived but still accessible

##### Order Cancelled
- **Scenario**: User or pharmacy cancels order before fulfillment
- **Display**:
  - Status badge: "Cancelled" (gray)
  - Cancellation reason: "Out of stock - Full refund issued"
  - Actions: "Reorder" or "Contact Support"

#### Exit Points

- **Success**: User informed of delivery status, can reorder easily
- **Support Required**: User contacts support via chat for issues
- **Reorder**: User clicks "Reorder" → Returns to refill flow

---

### Flow 5: Admin Dashboard - Order Management (Pharmacy Staff)

**Goal**: Monitor and manage active orders, handle exceptions  
**Entry Point**: Staff login → Dashboard  
**Frequency**: Multiple times daily  
**Estimated Time**: Variable (2-30 minutes depending on queue)

#### Happy Path

##### 1. Page: Staff Login (`/staff/login`)
- **Elements**:
  - Email input
  - Password input
  - "Remember this device" checkbox
  - "Log In" button
  - "Forgot password?" link
  
- **User (Rita) Action**: Enters credentials
- **System Actions**:
  - Validates credentials
  - Checks role: Must be "staff" or "admin"
  - Creates session with 24-hour expiration (staff sessions expire faster than patient sessions)
  - Logs: Staff login event

- **Redirect**: `/staff/dashboard`

##### 2. Page: Admin Dashboard (`/staff/dashboard`)
- **Navigation Tabs**:
  - 📦 Orders (active view)
  - 💊 Inventory
  - 🔔 Refill Alerts
  - 📊 Analytics (future)

- **Orders Tab - Elements**:
  - Summary Cards (top):
    - "Pending Review" (5) - Red badge
    - "Preparing" (12) - Yellow badge
    - "Out for Delivery" (8) - Green badge
    - "Delivered Today" (23) - Gray badge
  
  - Filters:
    - Status dropdown: All, Pending Review, Preparing, Out for Delivery, Delivered
    - Date range: Today, This Week, This Month, Custom
    - Search: Order ID, Customer Name, Medication
  
  - Orders Table:
    - Columns: Order ID, Customer, Medication(s), Status, Time, Actions
    - Rows sorted by urgency (Pending Review first, then by timestamp)
    - Pagination: 20 orders per page

##### 3. Rita's Workflow: Review Pending Orders
- **Rita Clicks**: "Pending Review" summary card (5 orders)
- **Table Filters**: Automatically to "Pending Review" status
- **First Order Row**:
  - Order #12401
  - Sarah Johnson
  - Metformin 500mg, 90 tablets
  - Status: "Pending Prescription Review" (red badge)
  - Time: "8 minutes ago"
  - Actions: "Review" button (blue)

- **Rita Clicks**: "Review" button

##### 4. Modal: Order Review Details
- **Modal Elements**:
  - Heading: "Order #12401 - Review Required"
  - Customer Info:
    - Name: Sarah Johnson
    - Phone: (555) 123-4567
    - Delivery Address: 123 Main St, Apt 4B
  
  - Order Details:
    - Medication: Metformin 500mg tablets
    - Quantity: 90 tablets
    - Price: $13.50
    - Prescription Required: Yes
  
  - Prescription Section:
    - Prescription image (large preview)
    - Zoom controls
    - "Download Original" link
    - Details extracted (manual entry for MVP):
      - Doctor Name: Dr. Smith
      - Prescription Date: Feb 10, 2026
      - Expiration: Feb 10, 2027
  
  - Action Buttons:
    - "Approve" (large, green)
    - "Reject" (red, with reason dropdown)
    - "Contact Customer" (gray)
    - "Cancel" (close modal)

##### 5. Rita's Action: Approve Order
- **Rita Reviews**: Prescription looks valid
  - Doctor signature present
  - Patient name matches
  - Medication and dosage match order
  - Date within valid range

- **Rita Clicks**: "Approve" button

- **System Actions**:
  - Updates order status: "pending_prescription_review" → "approved"
  - Records approval: Pharmacist ID, timestamp
  - Triggers n8n workflow: "Order Approved"
    - Sends SMS to customer: "Good news! Your prescription is approved..."
    - Sends email confirmation
    - Creates fulfillment task (mock: email to warehouse)
  - Logs: Order approved by Rita (Staff ID: 003)
  - Modal closes automatically

##### 6. Dashboard Update: Real-Time
- **Table Updates** (without page reload):
  - Order #12401 row disappears from "Pending Review" filter
  - "Pending Review" counter decreases: 5 → 4
  - If "All" filter active, order row status changes to "Approved"
  - Toast notification appears: "Order #12401 approved ✅"

- **Rita Continues**: Reviews next pending order (Order #12402)

##### 7. Edge Case: Rita Needs to Reject Order
- **Order #12403**: 
  - Prescription image is blurry, can't read doctor's name
  
- **Rita Clicks**: "Reject" button
- **Modal Expands**: 
  - "Reason for Rejection" dropdown appears:
    - Prescription expired
    - Prescription unreadable
    - Patient name mismatch
    - Dosage mismatch
    - Other (with text field)
  
- **Rita Selects**: "Prescription unreadable"
- **Optional**: Text field appears: "Additional notes for customer"
- **Rita Types**: "Hi Sarah, your prescription image is too blurry to read. Could you upload a clearer photo?"

- **Rita Clicks**: "Confirm Rejection"

- **System Actions**:
  - Updates order status: "pending_prescription_review" → "prescription_rejected"
  - Sends chat message to customer with Rita's note
  - Logs: Rejection reason and pharmacist ID
  - Order remains in system (not deleted), customer can re-upload

##### 8. Rita Switches to Inventory Tab
- **Rita Clicks**: "Inventory" tab

##### 9. Page: Inventory View (`/staff/dashboard/inventory`)
- **Elements**:
  - Search bar: "Search medications..."
  - Sort dropdown: Name, Stock Level, Category
  - Stock Level Filters: All, Low Stock (<10), Out of Stock (0)
  
  - Inventory Table:
    - Columns: Medication, Dosage, Stock Level, Unit Type, Status, Actions
    - Color-coded stock levels:
      - Green: >50 units
      - Yellow: 10-50 units
      - Red: <10 units
      - Gray: 0 units (out of stock)
  
  - Example Rows:
    - Metformin 500mg | 200 tablets | Green | In Stock | "Edit"
    - Lisinopril 10mg | 8 tablets | Red | Low Stock | "Edit" / "Reorder"
    - Levothyroxine 75mcg | 0 tablets | Gray | Out of Stock | "Update ETA"

- **Rita Reviews**: Scans for low stock items
- **Rita Clicks**: Filter "Low Stock" → Shows 3 medications

##### 10. Rita's Action: Update Stock Level
- **Rita Clicks**: "Edit" on Lisinopril 10mg row
- **Inline Edit** or **Modal** (depending on implementation):
  - Stock Level input: Current 8 → Rita changes to 50 (just restocked)
  - "Save" button

- **Rita Clicks**: "Save"

- **System Actions**:
  - Updates Medicine Master Excel/CSV via API
  - Logs: Stock update by Rita
  - Table row updates: Color changes green
  - Toast: "Stock updated for Lisinopril 10mg ✅"

##### 11. Rita Switches to Refill Alerts Tab
- **Rita Clicks**: "Refill Alerts" tab

##### 12. Page: Refill Alerts View (`/staff/dashboard/alerts`)
- **Elements**:
  - Summary Cards:
    - "Alerts Today" (24)
    - "Responded" (8) - 33%
    - "Converted to Orders" (7) - 29%
    - "Require Follow-up" (3) - Manual action needed
  
  - Filters:
    - Status: All, Pending, Responded, Converted, No Response, Dismissed
    - Urgency: Critical (<2 days), High (<5 days), Medium (<7 days)
    - Date: Today, This Week
  
  - Alerts Table:
    - Columns: Customer, Medication, Days Until Out, Last Order, Alert Sent, Status, Actions
    - Rows sorted by urgency (Critical first)
  
  - Example Rows:
    - Sarah Johnson | Lisinopril 10mg | 2 days | Jan 15 | 8:30 AM | Converted ✅ | "View Order"
    - Marcus Lee | Insulin | 3 days | Jan 18 | 8:31 AM | No Response ⚠️ | "Contact" / "Dismiss"
    - David Kim | Atorvastatin 40mg | 5 days | Jan 20 | 8:32 AM | Responded 📧 | "View Chat"

##### 13. Rita's Action: Manual Follow-up
- **Rita Identifies**: Marcus Lee - Insulin (critical medication, no response to 2 reminders)
- **Rita Clicks**: "Contact" button on Marcus's row

- **System Opens**: Chat interface with Marcus
- **Pre-filled Template** (Rita can edit):
  - "Hi Marcus, this is Rita from [Pharmacy]. We noticed you might be running low on your Insulin. This is important for your health. Can we help you reorder? Please let us know if you need anything."

- **Rita Reviews**: Edits message slightly
- **Rita Clicks**: "Send"

- **System Actions**:
  - Sends message via customer's preferred channel (WhatsApp/SMS)
  - Updates alert status: "no_response" → "manual_contact_sent"
  - Logs: Manual outreach by Rita
  - Alert row updates in dashboard

##### 14. Success State: Rita's Daily Review Complete
- **Rita's Summary View**:
  - 5 prescriptions reviewed (4 approved, 1 rejected with follow-up)
  - 1 inventory update completed
  - 3 critical refill alerts addressed
  - Total time: ~20 minutes

- **System Logs**: All actions recorded for audit trail

##### 15. Rita Logs Out
- **Rita Clicks**: Profile menu → "Log Out"
- **System Actions**:
  - Invalidates session token
  - Logs: Staff logout event
  - Redirects to `/staff/login`

#### Error States

##### Simultaneous Approval by Multiple Staff
- **Scenario**: Rita and another pharmacist both open same order for review
- **Handling**:
  - First approval locks the order
  - Second pharmacist sees: "This order was just approved by Rita" (toast notification)
  - Order disappears from their view
  - No duplicate actions possible

##### Stock Update Conflict
- **Scenario**: Rita updates stock to 50, but another staff member updated to 45 seconds ago
- **System Detection**: Optimistic locking with version numbers
- **Display**: "Stock level was updated by another user. Please refresh and try again."
- **Rita Clicks**: Refresh icon, sees latest value (45), can update from there

##### API Failure During Approval
- **Scenario**: Rita clicks "Approve" but API request times out
- **Display**: 
  - Error toast: "Failed to approve order. Please try again."
  - "Approve" button remains enabled
  - Order stays in "Pending Review"
- **Rita Action**: Clicks "Approve" again (retry)

#### Edge Cases

##### Rita Needs to Contact Customer Mid-Review
- **Scenario**: Prescription has minor issue, Rita wants clarification
- **Action**: Clicks "Contact Customer" button in review modal
- **Opens**: Chat interface in side panel (doesn't close review modal)
- **Rita Sends**: "Hi Sarah, is your prescription for 90 or 180 tablets? The handwriting is a bit unclear."
- **Waits**: For customer response
- **Returns**: To review modal once clarified, then approves

##### Pharmacy Closed - Orders Accumulate
- **Scenario**: Pharmacy closed overnight, 15 orders submitted by patients
- **Morning View**: Rita logs in, sees 15 "Pending Review" orders
- **Bulk Actions** (future enhancement):
  - Select multiple orders (checkboxes)
  - "Approve Selected" button
  - For MVP: Rita reviews each individually

##### Customer Deletes/Modifies Order While Rita Reviewing
- **Scenario**: Customer cancels order while Rita has review modal open
- **Detection**: WebSocket or polling detects order change
- **Display**: Modal grays out, "This order was cancelled by the customer" message appears
- **Rita Closes**: Modal, order no longer in queue

#### Exit Points

- **Success**: All pending orders reviewed, inventory updated, critical alerts addressed
- **Partial Complete**: Rita reviews some orders, remaining orders stay in queue for next shift
- **Logout**: Rita logs out, session ends securely

---

## 3. Navigation Map

### Primary Navigation Structure

```
Public (Unauthenticated)
├── Home (/)
│   ├── How It Works (/how-it-works)
│   ├── Features
│   │   ├── Chat Ordering (/features/chat)
│   │   ├── Proactive Refills (/features/refills)
│   │   └── Order Tracking (/features/tracking)
│   ├── Pricing (/pricing)
│   └── FAQ (/faq)
├── Sign Up (/signup)
│   └── Email Verification (/verify-email)
│       └── Verify Token (/verify?token=xxx)
└── Log In (/login)
    └── Forgot Password (/forgot-password)

Patient Portal (Authenticated - Patient)
├── Dashboard (/dashboard)
│   ├── Chat Interface (embedded)
│   └── Quick Actions Panel
│       ├── Track Orders → /orders
│       ├── View Prescriptions → /prescriptions
│       └── Account Settings → /account
├── Orders (/orders)
│   ├── Order History (list view)
│   └── Order Details (/orders/:id)
│       ├── Track Order (real-time status)
│       ├── Reorder Button → Returns to /dashboard chat
│       ├── View Invoice (/orders/:id/invoice)
│       └── Contact Support → Opens chat
├── Prescriptions (/prescriptions)
│   ├── Active Prescriptions (list)
│   ├── Expired Prescriptions (list)
│   └── Upload New (/prescriptions/upload)
├── Account (/account)
│   ├── Profile (/account/profile)
│   │   ├── Edit Name, Phone
│   │   └── Change Password
│   ├── Addresses (/account/addresses)
│   │   ├── Add New Address
│   │   └── Edit/Delete Existing
│   ├── Notifications (/account/notifications)
│   │   └── Preferences: Email, SMS, WhatsApp toggles
│   └── Payment Methods (/account/payment) - Future
└── Support (/support)
    ├── Help Center (FAQ)
    ├── Contact Us (opens chat)
    └── Chat History

Staff/Admin Portal (Authenticated - Staff/Admin)
├── Staff Login (/staff/login)
└── Staff Dashboard (/staff/dashboard)
    ├── Orders Tab (default)
    │   ├── Pending Review (filtered view)
    │   ├── All Orders (list)
    │   └── Order Review Modal
    │       ├── Approve Action → Updates order, closes modal
    │       ├── Reject Action → Reason form, contacts customer
    │       └── Contact Customer → Opens chat panel
    ├── Inventory Tab (/staff/dashboard/inventory)
    │   ├── All Medications (table)
    │   ├── Low Stock Filter
    │   ├── Out of Stock Filter
    │   └── Edit Stock Levels (inline or modal)
    ├── Refill Alerts Tab (/staff/dashboard/alerts)
    │   ├── All Alerts (table)
    │   ├── Require Follow-up Filter
    │   ├── Contact Customer Action → Opens chat
    │   └── View Converted Orders
    └── Analytics Tab (/staff/dashboard/analytics) - Future
        ├── Order Metrics
        ├── Conversion Rates
        └── Revenue Reports

Special Entry Points
├── Refill Link (/refill?order_id=xxx&token=yyy)
│   └── Pre-filled Order Page → /orders/:id (after confirmation)
├── Email Verify (/verify?token=xxx)
│   └── Success → /onboarding or /dashboard
├── Password Reset (/reset-password?token=xxx)
│   └── New Password Form → /login
└── Deep Link from Notifications
    └── Order Tracking (/orders/:id)
```

### Navigation Rules

#### Authentication Required
**Patient Pages**:
- `/dashboard` - Requires logged-in patient
- `/orders` and all sub-pages - Requires logged-in patient
- `/prescriptions` - Requires logged-in patient
- `/account` and all sub-pages - Requires logged-in patient
- Redirect logic: If not authenticated → `/login?redirect={current_url}`

**Staff Pages**:
- `/staff/dashboard` and all sub-pages - Requires logged-in staff/admin
- Redirect logic: If not authenticated OR wrong role → `/staff/login`
- Staff cannot access patient pages (separate authentication)

#### Redirect Logic

**After Login**:
- Patient login → `/dashboard` (or redirect URL if provided)
- Staff login → `/staff/dashboard`

**After Signup**:
- Patient signup → `/verify-email` → `/onboarding` → `/dashboard`

**Deep Link with Auth**:
- User clicks `/refill?order_id=123&token=abc` (not logged in)
- Redirect → `/login?redirect=/refill?order_id=123&token=abc`
- After login → Returns to refill page

**Onboarding Incomplete**:
- User verified but didn't complete onboarding
- Any login → Auto-redirect to last incomplete onboarding step
- Example: User stopped at address step → Redirect to `/onboarding/address`

#### Back Button Behavior

**Preserve State**:
- Chat interface: Back button doesn't clear conversation history
- Order tracking page: Back returns to `/orders` (list view)
- Admin dashboard: Back button cycles through tabs (Orders → Inventory → Alerts)

**Clear State**:
- Login page: Back button goes to homepage (clears login form)
- Payment pages (future): Back button prompts "Are you sure?" to prevent accidental exit

**Browser History**:
- Modal overlays: Do NOT create new history entries (closing modal = no back button needed)
- Tab switches in admin dashboard: Do NOT create new history entries

#### Mobile Navigation Differences
- **Mobile**: Hamburger menu for main nav (Home, Features, Pricing, FAQ)
- **Desktop**: Top horizontal nav bar
- **Patient Dashboard** (mobile): Bottom tab bar (Dashboard, Orders, Account)
- **Patient Dashboard** (desktop): Left sidebar navigation

---

## 4. Screen Inventory

### Screen: Landing Page (Home)

- **Route**: `/`
- **Access**: Public (unauthenticated)
- **Purpose**: Introduce product, drive signups
- **Key Elements**:
  - Hero section: Headline, subheadline, CTA buttons
  - Demo video (30 seconds)
  - Feature cards (3): Chat Ordering, Proactive Refills, Order Tracking
  - Trust badges: HIPAA compliant, pharmacy partner logos
  - Testimonials (3 customer quotes)
  - Footer: Links to How It Works, Features, Pricing, FAQ
- **Actions Available**:
  - "Sign Up" button → `/signup`
  - "Log In" link → `/login`
  - "Learn More" → `/how-it-works`
  - Feature card clicks → `/features/{chat|refills|tracking}`
- **State Variants**:
  - Default: Unauthenticated user view
  - Authenticated: "Go to Dashboard" button replaces signup CTA

---

### Screen: Sign Up Page

- **Route**: `/signup`
- **Access**: Public (unauthenticated)
- **Purpose**: Create new patient account
- **Key Elements**:
  - Email input field
  - Password input field (with strength indicator)
  - "Sign up with Google" button (OAuth alternative)
  - "Continue" button
  - "Already have an account? Log in" link
- **Actions Available**:
  - Submit form → POST `/api/auth/signup` → Navigate to `/verify-email`
  - "Sign up with Google" → OAuth flow → Navigate to `/onboarding` (if new) or `/dashboard` (if returning)
  - "Log in" link → Navigate to `/login`
- **State Variants**:
  - Default: Empty form
  - Validation errors: Inline error messages (red text, red borders)
  - Loading: "Continue" button disabled with spinner
  - Success: Auto-navigate to `/verify-email`

---

### Screen: Dashboard (Patient)

- **Route**: `/dashboard`
- **Access**: Authenticated (patient role)
- **Purpose**: Primary interface for ordering medications via chat
- **Key Elements**:
  - Welcome message: "Hi [Name], how can I help you today?"
  - Chat interface:
    - Message history (scrollable)
    - Message input box (large, auto-focus)
    - Send button
    - Voice input button (microphone icon)
  - Sample prompts (if no conversation history):
    - "Refill my blood pressure medication"
    - "I need antibiotics"
    - "Order Metformin"
  - Side panel (desktop) or bottom nav (mobile):
    - Quick actions: "Track Orders", "View Prescriptions"
    - Recent orders summary (last 3)
- **Actions Available**:
  - Type message → Send → AI response appears
  - Click sample prompt → Auto-fills input, sends
  - Voice input → Transcribes to text, sends
  - "Track Orders" → Navigate to `/orders`
  - "View Prescriptions" → Navigate to `/prescriptions`
  - Click recent order → Navigate to `/orders/:id`
- **State Variants**:
  - Empty (first visit): Sample prompts displayed, welcome message
  - Active conversation: Chat history visible, input ready
  - Loading AI response: Typing indicator (animated dots)
  - Error (AI failure): "Sorry, I'm having trouble right now. Please try again." with retry button

---

### Screen: Order Tracking Page

- **Route**: `/orders/:id`
- **Access**: Authenticated (patient role), must own order
- **Purpose**: View detailed order status and tracking information
- **Key Elements**:
  - Header: "Order #[ID]"
  - Status badge: Current status with color coding
  - Progress timeline (visual):
    - Order Placed ✅
    - Prescription Approved ✅
    - Preparing 🔄
    - Out for Delivery 📦
    - Delivered ✅
  - Order details card:
    - Medication name, dosage, quantity
    - Price
    - Delivery address
  - Delivery info card:
    - Estimated arrival
    - Delivery partner (if available)
    - "Track Live" button (opens map modal)
  - Actions:
    - "Reorder" button
    - "Contact Support" button
    - "View Invoice" link
- **Actions Available**:
  - "Reorder" → Pre-fills chat on `/dashboard` with order details
  - "Contact Support" → Opens chat interface
  - "Track Live" → Opens modal with map (mock in MVP)
  - "View Invoice" → Opens PDF in new tab
- **State Variants**:
  - Pending: Timeline shows only first step completed
  - In Progress: Some steps completed, current step highlighted
  - Delivered: All steps completed, confetti animation, feedback form
  - Delayed: Red warning banner, "We're checking on this" message
  - Cancelled: Gray status badge, cancellation reason displayed

---

### Screen: Admin Dashboard - Orders Tab

- **Route**: `/staff/dashboard` (default tab)
- **Access**: Authenticated (staff or admin role)
- **Purpose**: Monitor and manage patient orders, review prescriptions
- **Key Elements**:
  - Summary cards (top):
    - Pending Review (count)
    - Preparing (count)
    - Out for Delivery (count)
    - Delivered Today (count)
  - Filters:
    - Status dropdown
    - Date range selector
    - Search bar (order ID, customer name, medication)
  - Orders table:
    - Columns: Order ID, Customer, Medication(s), Status, Time, Actions
    - Rows: Each order (paginated, 20 per page)
  - Action buttons per row:
    - "Review" (for pending orders)
    - "View Details"
    - "Contact Customer"
- **Actions Available**:
  - Click summary card → Filters table by status
  - Change filter dropdown → Re-queries and updates table
  - Click "Review" → Opens order review modal
  - Click "Contact Customer" → Opens chat panel
  - Search → Filters table by search term
  - Pagination controls → Load next/previous page
- **State Variants**:
  - Loading: Skeleton rows, loading spinner
  - Empty (no orders): "No orders matching filters" message
  - Error (API failure): "Failed to load orders. Retry?" message with button
  - Success: Table populated with data

---

### Screen: Admin Dashboard - Inventory Tab

- **Route**: `/staff/dashboard/inventory`
- **Access**: Authenticated (staff or admin role)
- **Purpose**: Monitor and update medication stock levels
- **Key Elements**:
  - Search bar: "Search medications..."
  - Sort dropdown: Name, Stock Level, Category
  - Stock level filters: All, Low Stock, Out of Stock
  - Inventory table:
    - Columns: Medication, Dosage, Stock Level, Unit Type, Status, Actions
    - Rows: Color-coded by stock (green >50, yellow 10-50, red <10, gray 0)
  - Action buttons per row:
    - "Edit" (inline or modal)
    - "Reorder" (generates purchase order - future)
- **Actions Available**:
  - Search → Filters table by medication name
  - Sort dropdown → Re-sorts table
  - Filter by stock level → Shows only matching rows
  - Click "Edit" → Enables inline editing or opens modal
  - Update stock → Saves to Excel via API
- **State Variants**:
  - Loading: Skeleton rows
  - Empty: "No medications found" (shouldn't happen in practice)
  - Success: Table populated, color-coded
  - Editing: Row highlighted, input fields enabled
  - Save success: Toast notification, row updates

---

### Screen: Admin Dashboard - Refill Alerts Tab

- **Route**: `/staff/dashboard/alerts`
- **Access**: Authenticated (staff or admin role)
- **Purpose**: Review proactive refill alerts, follow up on non-responders
- **Key Elements**:
  - Summary cards:
    - Alerts Today (count)
    - Responded (count and %)
    - Converted to Orders (count and %)
    - Require Follow-up (count)
  - Filters:
    - Status: All, Pending, Responded, Converted, No Response
    - Urgency: Critical, High, Medium
  - Alerts table:
    - Columns: Customer, Medication, Days Until Out, Last Order, Alert Sent, Status, Actions
    - Rows: Sorted by urgency (Critical first)
  - Action buttons per row:
    - "Contact" (manual outreach)
    - "Dismiss" (ignore alert)
    - "View Chat" (if responded)
    - "View Order" (if converted)
- **Actions Available**:
  - Click summary card → Filters table
  - Filter by status/urgency → Updates table
  - Click "Contact" → Opens chat with pre-filled template
  - Click "Dismiss" → Marks alert as dismissed (hides from view)
  - Click "View Order" → Navigates to order tracking page
- **State Variants**:
  - Loading: Skeleton rows
  - Empty: "No alerts today" (good news!)
  - Success: Table populated, color-coded by urgency
  - Action in progress: Row grays out during contact/dismiss

---

## 5. Interaction Patterns

### Pattern: Form Submission (Authentication, Profile, Settings)

**Validation**:
- **Client-side**: 
  - Instant validation on blur (after user leaves field)
  - Format checks (email regex, password requirements)
  - Visual feedback: Green checkmark (valid), Red X (invalid)
- **Server-side**: 
  - On form submit
  - Additional checks (e.g., email uniqueness)
  - Business logic validation

**Loading State**:
- Submit button disabled (gray, cursor: not-allowed)
- Button text changes: "Continue" → "Processing..." with spinner icon
- Form inputs disabled to prevent changes

**Success**:
- Redirect to next page (e.g., signup → verify-email)
- OR inline success message (e.g., "Profile updated ✅") with green toast notification
- Form can remain on page if no redirect needed

**Error**:
- Inline error messages below each invalid field (red text)
- Keep all form data (user doesn't have to re-enter)
- Focus on first invalid field
- Top-level error banner for server errors: "Something went wrong. Please try again."

**Example**: Signup Form
1. User types invalid email: "johngmail.com"
2. On blur → Red X appears, "Please enter a valid email" message
3. User corrects to "john@gmail.com"
4. On blur → Green checkmark appears, error message disappears
5. User enters weak password: "123"
6. Password strength indicator: Red "Weak", tooltip: "Password must be at least 8 characters"
7. User strengthens to "john1234"
8. Indicator: Yellow "Medium", submit button enabled
9. User clicks "Continue"
10. Button: Disabled, "Processing..." with spinner
11. Server response: Email already exists
12. Error message appears: "An account with this email already exists. Log in instead?"
13. Button re-enabled, user can edit email or click "Log in" link

---

### Pattern: Chat Conversation (AI Interaction)

**User Input**:
- Text input: Type and press Enter or click Send button
- Voice input: Click microphone icon, speak, auto-transcribes and sends
- Quick replies: Click suggested button, message auto-sends

**AI Response**:
- Typing indicator: Animated dots (1-2 seconds)
- Message appears: Smooth slide-up animation
- Message bubble: Left-aligned, light gray background
- Timestamp: Small gray text below message

**Multi-turn Conversation**:
- All previous messages remain visible (scrollable history)
- New messages appear at bottom, auto-scroll
- User can scroll up to review history

**Context Awareness**:
- AI references previous messages: "Great! For the Metformin you mentioned..."
- AI maintains state (e.g., medication name, quantity) across turns

**Error Handling**:
- LLM timeout: "Sorry, I'm taking longer than usual. Let me try again..." (auto-retry once)
- LLM failure: "I'm having trouble right now. Please try again in a moment." (retry button provided)
- Network offline: "You're offline. Your message will send when you reconnect." (queued for later)

**Special Interactions**:
- File upload: Click "Upload Prescription" → File picker → Preview → Confirm
- Quick actions: "Reorder" button in message → One-click action
- External links: "Track your order here: [link]" → Opens order page

---

### Pattern: Infinite Scroll (Order History, Admin Tables)

**Trigger**: 
- User scrolls to 80% of page height
- OR user reaches last visible row in table

**Loading**:
- Skeleton rows appear at bottom (3-5 placeholder rows)
- No interruption to viewing current content
- Loading spinner at bottom of list

**Success**:
- Next 20 items load seamlessly
- Skeleton rows replaced with actual data
- User can continue scrolling

**End of Data**:
- No more items to load → Display message: "No more orders" or "You've reached the end"
- Disable further scroll triggers

**Error**:
- Failed to load more → Show retry button at bottom: "Failed to load more. Retry?"
- User can click to attempt load again
- Existing data remains visible

**Example**: Order History Page (`/orders`)
1. Page loads with 20 most recent orders
2. User scrolls down, views first 15 orders
3. At 80% scroll → Skeleton rows appear
4. Next 20 orders load, skeleton disappears
5. User continues scrolling through 40 total orders
6. At 80% again → Load next 20 (now 60 total)
7. User scrolls through all 65 orders they have
8. Reaches end → "You've reached the end" message, no more triggers

---

### Pattern: Real-Time Updates (Order Tracking, Admin Dashboard)

**Mechanism**:
- WebSocket connection (preferred) OR polling (fallback, every 30 seconds)
- Establishes connection on page load
- Listens for relevant events (order status changes, new orders)

**Update Behavior**:
- Data changes → Page updates without refresh
- Visual indicator: Brief highlight animation (e.g., yellow flash) on updated element
- Sound notification optional (e.g., "ding" for new order in admin dashboard)

**User Experience**:
- Seamless: User doesn't lose context or scroll position
- Non-intrusive: Updates appear smoothly, no jarring reloads
- Optional: Toast notification for significant changes ("Order delivered!")

**Example**: Patient viewing order tracking page
1. Page loads: Order status "Out for Delivery"
2. WebSocket connection established
3. Delivery partner marks delivered (backend event)
4. WebSocket pushes update to patient's browser
5. Status badge animates: "Out for Delivery" → "Delivered ✅"
6. Timeline step animates to green checkmark
7. Confetti animation plays briefly
8. Toast notification: "Your order has been delivered! 📦"
9. User sees update without refreshing page

---

### Pattern: Modal Overlays (Order Review, Confirmations)

**Open**:
- Triggered by button click (e.g., "Review" in admin dashboard)
- Slide-up animation (200ms)
- Background dims (semi-transparent overlay)
- Focus traps inside modal (can't tab to background elements)

**Content**:
- Heading: Clear title
- Body: Relevant information (order details, form, confirmation message)
- Actions: Primary button (e.g., "Approve"), secondary button (e.g., "Cancel")

**Close**:
- Click "Cancel" or "X" button → Modal slides down and disappears
- Click outside modal (on dimmed background) → Modal closes
- Press Escape key → Modal closes
- Submitting form (e.g., approving order) → Modal closes automatically after success

**Accessibility**:
- Focus on first interactive element when opened
- Tab navigation cycles within modal only
- Escape key always closes modal
- Screen reader announces modal content

**Example**: Admin reviewing prescription
1. Rita clicks "Review" on Order #12401
2. Modal slides up from bottom (mobile) or center (desktop)
3. Background dims, Rita can't interact with dashboard behind modal
4. Modal displays: Order details, prescription image, Approve/Reject buttons
5. Rita reviews, clicks "Approve"
6. Button shows loading spinner briefly
7. Success → Modal closes automatically, dashboard updates
8. Toast notification: "Order approved ✅"

---

## 6. Decision Points

### Decision: User Authentication Status

**Context**: Throughout application, many features require authentication

**Logic**:
```
IF user is NOT logged in
THEN
  - Show: "Sign Up" and "Log In" buttons in header
  - Disable: Dashboard, Orders, Prescriptions, Account pages
  - Allow: Homepage, Features pages, FAQ, Login/Signup pages
  - Redirect: If accessing protected page → `/login?redirect={url}`
  
ELSE IF user IS logged in as PATIENT
THEN
  - Show: User name and avatar in header, "Log Out" option
  - Enable: Dashboard, Orders, Prescriptions, Account pages
  - Hide: "Sign Up" and "Log In" buttons
  - Redirect: If accessing `/` while logged in → `/dashboard`
  
ELSE IF user IS logged in as STAFF/ADMIN
THEN
  - Show: Staff name and role badge in header
  - Enable: Staff Dashboard (Orders, Inventory, Alerts tabs)
  - Disable: Patient pages (cannot access patient dashboard)
  - Separate session: Staff login is separate from patient login
```

**Implementation**:
- Check: JWT token in localStorage or httpOnly cookie
- Validate: Token signature and expiration on every page load
- Refresh: Silently refresh token if expiring within 1 day

---

### Decision: Chat Response Strategy

**Context**: User sends message in chat, AI needs to determine appropriate response

**Logic**:
```
IF message contains ORDER INTENT (e.g., "I need...", "refill...", "order...")
THEN
  - Extract: Medication name, dosage, quantity (if mentioned)
  - Query: Inventory API to check stock
  - Respond: Confirm availability, ask for missing details
  - Goal: Complete order
  
ELSE IF message contains QUESTION (e.g., "Do you have...", "What's the price...")
THEN
  - Query: Relevant data (inventory, pricing, delivery info)
  - Respond: Answer question directly
  - Follow-up: "Would you like to order this?" (if appropriate)
  
ELSE IF message contains COMPLAINT or ISSUE (e.g., "My order is late", "Wrong medication")
THEN
  - Acknowledge: Express empathy
  - Gather: Details about the issue
  - Escalate: Offer to connect with staff or provide support contact
  - Log: Issue for staff review
  
ELSE IF message is GENERAL CONVERSATION (e.g., "Hello", "Thanks", "How are you")
THEN
  - Respond: Friendly, brief acknowledgment
  - Prompt: "How can I help you today?"
  - Don't: Engage in extended off-topic conversation
  
ELSE (message is UNCLEAR or AMBIGUOUS)
THEN
  - Clarify: Ask for more information
  - Suggest: Sample prompts to guide user
  - Example: "I'm not sure I understand. Are you looking to order medication, check an order status, or something else?"
```

---

### Decision: Cart State (Order In Progress)

**Context**: User is building an order in chat, system needs to track state

**Logic**:
```
IF no active order in session
THEN
  - Show: Welcome message, sample prompts
  - Enable: Start new conversation
  
ELSE IF active order exists BUT incomplete (missing details)
THEN
  - Show: Order summary card (partial details filled)
  - Prompt: Ask for missing information (e.g., quantity)
  - Allow: User to edit existing details
  
ELSE IF active order is complete (all details provided)
THEN
  - Show: Full order summary with price
  - Enable: "Confirm Order" button
  - Require: Prescription upload (if prescription_required = true)
  - Block: Order submission until prescription uploaded
  
ELSE IF order is confirmed and submitted
THEN
  - Show: "Order placed!" success message
  - Display: Order ID and tracking link
  - Clear: Active order from session
  - Enable: Start new order
```

---

### Decision: Refill Alert Timing

**Context**: System determines when to send proactive refill reminders

**Logic**:
```
FOR EACH customer medication:
  
  Calculate:
    days_since_last_order = today - last_order_date
    typical_days_supply = last_order_quantity / estimated_daily_dose
    estimated_days_remaining = typical_days_supply - days_since_last_order
  
  IF estimated_days_remaining <= 3 days (CRITICAL)
  THEN
    - Urgency: HIGH
    - Channel: WhatsApp (if available) > SMS > Email
    - Follow-up: If no response after 2 days, flag for manual call
    - Example: Insulin (critical medication)
  
  ELSE IF estimated_days_remaining <= 5 days (HIGH)
  THEN
    - Urgency: MEDIUM
    - Channel: WhatsApp > SMS > Email
    - Follow-up: If no response after 3 days, send reminder
  
  ELSE IF estimated_days_remaining <= 7 days (MEDIUM)
  THEN
    - Urgency: LOW
    - Channel: Email (less intrusive)
    - Follow-up: If no response after 5 days, send one reminder
  
  ELSE (estimated_days_remaining > 7 days)
  THEN
    - Action: NO ALERT (too early)
    - Re-check: Tomorrow
  
  AND
  
  IF customer has "do_not_contact" preference
  THEN
    - Skip: All automated outreach
    - Log: Alert for staff dashboard only (manual contact if critical)
  
  IF customer responded "Not now" to recent alert (<7 days ago)
  THEN
    - Skip: Duplicate alert
    - Re-check: In 3 days
```

---

### Decision: Prescription Review Requirement

**Context**: System determines if order needs manual pharmacist review

**Logic**:
```
IF medication.prescription_required == false (e.g., OTC medication)
THEN
  - Skip: Prescription review entirely
  - Status: "approved" immediately after order placed
  - Trigger: Fulfillment workflow immediately
  
ELSE IF prescription_on_file exists AND valid (not expired)
THEN
  - Skip: Manual review (auto-approve using existing prescription)
  - Status: "approved" immediately
  - Log: "Used prescription from Order #[previous_order_id]"
  
ELSE IF new prescription uploaded
THEN
  - Require: Manual pharmacist review
  - Status: "pending_prescription_review"
  - Wait: For pharmacist to approve/reject
  
ELSE (no prescription uploaded or available)
THEN
  - Block: Order from proceeding
  - Prompt: User to upload prescription
  - Status: "awaiting_prescription"
  - Reminder: Send after 2 hours if still not uploaded
```

---

## 7. Error Handling Flows

### 404 Not Found

**Trigger**: User navigates to non-existent URL (e.g., `/orders/99999`, `/nonexistent-page`)

**Display**:
- Custom 404 page (branded, friendly)
- Illustration: Friendly graphic (e.g., confused robot)
- Heading: "Oops! Page Not Found"
- Message: "The page you're looking for doesn't exist or has been moved."
- Actions:
  - "Go to Dashboard" button (if logged in)
  - "Go to Homepage" button (if not logged in)
  - Search bar: "Search for medications or orders"
  - Links to popular pages: Orders, FAQ, Support

**Logging**:
- Log 404 errors with: URL, referrer, user ID (if logged in)
- Monitor for patterns: Broken links, outdated URLs
- Alert if 404 rate spikes suddenly

---

### 500 Server Error

**Trigger**: Backend API failure, database connection error, unhandled exception

**Display**:
- Custom 500 error page (branded)
- Illustration: Server with "out of order" sign
- Heading: "Something Went Wrong"
- Message: "We're sorry, but something unexpected happened. Our team has been notified and we're working on it."
- Actions:
  - "Try Again" button (refreshes page)
  - "Contact Support" button (opens chat or email)
  - "Go to Dashboard" button (if logged in)

**Fallback - Save User's Work**:
- If in chat conversation: Auto-save conversation state to localStorage
- If in form: Auto-save form data to localStorage
- On recovery: Prompt user "We saved your work. Would you like to continue where you left off?"

**Logging**:
- Log full error stack trace to monitoring platform (Sentry, Datadog)
- Include: User ID, request details, timestamp
- Alert on-call engineer for critical errors (payment, prescription approval)

---

### Network Offline (User Loses Connection)

**Trigger**: User's device loses internet connection (detected via navigator.onLine or API request failure)

**Display**:
- Top banner: "You're offline. Some features may not work." (yellow/orange background)
- Icon: WiFi symbol with slash
- Sticky: Remains at top until connection restored

**Behavior**:
- Queue actions: Save any user actions (messages, form submissions) to localStorage
- Disable: Real-time features (order tracking updates)
- Enable: Viewing cached data (recent orders, prescriptions)
- Retry: Automatically retry queued actions when connection restored

**Recovery**:
- Connection restored → Banner changes: "You're back online!" (green background)
- Auto-send: Queued messages/actions
- Refresh: Data from server
- Banner disappears after 3 seconds

---

### Rate Limit Exceeded (API)

**Trigger**: User or system exceeds API rate limit (e.g., 100 requests per minute)

**Display**:
- Error message: "You're doing that too fast. Please wait a moment and try again."
- Countdown timer: "Try again in 30 seconds" (live countdown)
- Icon: Clock or hourglass

**User Actions**:
- Wait: User must wait for rate limit to reset
- Retry button: Disabled until timer expires, then enabled

**Prevention**:
- Client-side: Debounce rapid actions (e.g., search input)
- Server-side: Implement exponential backoff for retries
- Monitoring: Alert if rate limit hit frequently (potential abuse or bug)

---

### Payment Declined (Future Feature)

**Trigger**: User's payment method is declined during checkout

**Display**:
- Error modal or inline message: "Your payment was declined. Please update your payment method."
- Suggested actions:
  - "Try Different Card" → Opens payment form
  - "Contact Bank" (if likely insufficient funds)
  - "Use Saved Payment Method" (if multiple on file)

**Recovery**:
- Keep order in "pending_payment" status (don't cancel automatically)
- Allow user to update payment and retry
- Reminder email: After 24 hours if payment still pending

---

## 8. Responsive Behavior

### Mobile-Specific Flows (320px - 768px)

**Navigation**:
- **Hamburger Menu**: Icon in top-right, slides out full-screen menu
- **Bottom Tab Bar** (Patient Dashboard):
  - Icons: 🏠 Dashboard, 📦 Orders, 👤 Account
  - Active tab highlighted (colored icon + label)
- **Chat Interface**: Full-screen (no side panels)

**Forms**:
- **One Field Per Screen**: Long forms broken into multi-step (e.g., onboarding: Profile → Address → Welcome)
- **Large Touch Targets**: Buttons minimum 44x44 pixels
- **Auto-focus**: Next field auto-focused after completion
- **Keyboard Behavior**: Input fields scroll into view when keyboard appears

**Actions**:
- **Bottom Sheets**: For selections (e.g., refill quantity adjustment)
- **Swipe Gestures**: Swipe left on order row → Reveal "Reorder" button
- **Pull-to-Refresh**: Supported on order history, dashboard

**Chat**:
- **Voice Input**: Prominent microphone button (easier than typing on mobile)
- **Quick Replies**: Buttons stack vertically for better touch targets

---

### Desktop-Specific Flows (1024px+)

**Navigation**:
- **Top Nav Bar**: Horizontal menu (Dashboard, Orders, Account)
- **Sidebar** (Patient Dashboard): Left panel with navigation links, always visible
- **Chat Interface**: Right panel (60% of screen), leaves space for order summary

**Forms**:
- **Multi-Column Layouts**: E.g., address form has City, State, ZIP on same row
- **Inline Validation**: Error messages appear beside fields, not below

**Actions**:
- **Modals**: For confirmations, reviews (centered overlay)
- **Hover Effects**: Buttons darken on hover, tooltips appear
- **Keyboard Shortcuts**: 
  - `/` → Focus on search
  - `Cmd/Ctrl + K` → Open quick actions menu
  - `Esc` → Close modal

**Chat**:
- **Split View**: Chat on right, order summary or resources on left
- **Larger Context**: More message history visible (no need to scroll as much)

---

### Tablet-Specific Flows (768px - 1024px)

**Hybrid Approach**:
- **Navigation**: Top bar (like desktop) but collapsible sidebar
- **Forms**: Mix of single and multi-column (2 columns max)
- **Chat**: Full-screen option OR split view (user preference)

**Landscape vs Portrait**:
- **Landscape**: Closer to desktop layout (sidebar, split view)
- **Portrait**: Closer to mobile layout (bottom tabs, full-screen chat)

---

## 9. Animation & Transitions

### Page Transitions

**Navigation Between Pages**:
- **Fade In/Out**: 300ms ease-in-out
- **Forward navigation** (e.g., signup → verify-email): Slide left (current page exits left, new page enters from right)
- **Backward navigation** (e.g., back button): Slide right (current page exits right, previous page enters from left)

**Example**: Signup → Verify Email
1. User clicks "Continue" on signup page
2. Signup page slides left and fades out (300ms)
3. Verify-email page slides in from right and fades in (300ms)
4. Total transition: 300ms

---

### Modal Transitions

**Opening**:
- **Slide Up** (mobile): Modal slides up from bottom of screen (200ms ease-out)
- **Fade & Scale** (desktop): Modal fades in while scaling from 0.95 to 1.0 (200ms ease-out)
- **Background Dim**: Semi-transparent overlay fades in (150ms)

**Closing**:
- **Slide Down** (mobile): Reverse of opening (200ms ease-in)
- **Fade & Scale** (desktop): Fade out while scaling to 0.95 (200ms ease-in)
- **Background Undim**: Overlay fades out (150ms)

---

### Drawer Transitions

**Side Drawer** (e.g., mobile hamburger menu):
- **Opening**: Slides in from left or right edge (250ms ease-out)
- **Background**: Dim overlay fades in simultaneously
- **Closing**: Slides out to edge (250ms ease-in), overlay fades out

---

### Micro-interactions

**Button Click**:
- **Scale Down**: Button scales to 0.95 (100ms) on press
- **Ripple Effect**: Circular ripple expands from click point (300ms, material design style)
- **Scale Up**: Button returns to 1.0 (100ms) on release
- **Disabled State**: Button grays out, cursor changes to not-allowed

**Form Input Focus**:
- **Border Highlight**: Border color changes from gray to blue (150ms)
- **Border Width**: Increases from 1px to 2px (150ms)
- **Label Float**: If placeholder, label floats up and shrinks (200ms)

**Success Feedback**:
- **Checkmark Animation**: Checkmark draws in (SVG path animation, 400ms)
- **Color Change**: Element flashes green briefly (500ms)
- **Confetti** (for major success like delivery): Animated confetti falls from top (2 seconds)

**Loading Indicators**:
- **Spinner**: Rotating circle (1s loop, infinite)
- **Skeleton Screens**: Shimmer effect (1.5s loop, light to darker gray gradient)
- **Progress Bar**: Fills from left to right, animates smoothly (linear transition)

---

### Chat Message Animations

**User Message Sent**:
- **Slide Up**: Message bubble slides up from input box (200ms ease-out)
- **Fade In**: Simultaneously fades in from opacity 0 to 1

**AI Response Received**:
- **Typing Indicator**: Animated dots (3 dots bouncing, 600ms loop)
- **Slide Up**: When response ready, message slides up (250ms ease-out)
- **Fade In**: Fades in from opacity 0 to 1

**Quick Reply Buttons**:
- **Stagger In**: Buttons appear one by one with 50ms delay between each (staggered animation)

---

### Order Status Changes (Real-Time)

**Status Badge Update**:
- **Fade Out**: Old status fades out (150ms)
- **Scale & Fade In**: New status scales from 0.9 to 1.0 while fading in (200ms)
- **Color Change**: Badge color smoothly transitions (300ms)

**Timeline Progress**:
- **Checkmark Drawing**: When step completes, checkmark draws in (400ms)
- **Line Extension**: Connecting line to next step extends (300ms)
- **Color Fill**: Step circle fills with color (200ms)

---

### Loading States

**Page Load**:
- **Skeleton Screens**: Content areas show gray placeholder boxes with shimmer effect
- **Duration**: Until real data loads
- **Transition**: Skeleton fades out, real content fades in (300ms)

**Infinite Scroll Load**:
- **Spinner at Bottom**: Small spinner appears as user scrolls near end
- **New Rows**: Fade in as they load (200ms stagger)

---

### Error States

**Error Message Appearance**:
- **Slide Down**: Error banner slides down from top (250ms ease-out)
- **Shake**: Input field with error shakes horizontally (300ms, 3 shakes)

**Error Dismissal**:
- **Slide Up**: Banner slides back up (250ms ease-in)
- **Fade Out**: Error message fades out (200ms)

---

**End of Application Flow Documentation**
