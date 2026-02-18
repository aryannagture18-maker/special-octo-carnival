# Backend Architecture & Database Structure
## Agentic AI-Powered Pharmacy Assistant

**Version**: 1.0  
**Last Updated**: February 15, 2026  
**Database**: PostgreSQL 16.1  
**ORM**: Prisma 5.9.0  
**API Pattern**: RESTful API with JWT Authentication

---

## 1. Architecture Overview

### System Architecture

**Pattern**: RESTful API with Server-Side Rendering (Next.js API routes + Express.js)

**Architecture Type**: Modular Monolith (MVP) → Microservices (Future)

**Data Flow**:
```
┌─────────────┐      ┌──────────────┐      ┌───────────────┐
│   Client    │─────▶│  API Gateway │─────▶│   Business    │
│  (Next.js)  │      │  (Express)   │      │     Logic     │
└─────────────┘      └──────────────┘      └───────────────┘
                              │                     │
                              ▼                     ▼
                     ┌──────────────┐      ┌───────────────┐
                     │    Redis     │      │  PostgreSQL   │
                     │   (Cache)    │      │  (Database)   │
                     └──────────────┘      └───────────────┘
                              │
                              ▼
                     ┌──────────────┐      ┌───────────────┐
                     │    n8n       │─────▶│   External    │
                     │  (Workflows) │      │   Services    │
                     └──────────────┘      └───────────────┘
                                                  │
                                       ┌──────────┴───────────┐
                                       │                      │
                                  ┌────▼────┐        ┌───────▼────┐
                                  │  Twilio │        │  Resend    │
                                  │ (SMS/WA)│        │  (Email)   │
                                  └─────────┘        └────────────┘
                                       │
                                  ┌────▼────┐
                                  │   AWS   │
                                  │   S3    │
                                  └─────────┘
```

### Authentication Strategy

**Method**: JWT (JSON Web Tokens)
- **Access Token**: 15 minutes expiry (for API requests)
- **Refresh Token**: 7 days expiry (for token renewal)
- **Storage**: HTTP-only cookies (XSS protection)
- **Hashing**: bcrypt with 12 rounds

**Flow**:
1. User logs in → Server validates credentials
2. Server generates access + refresh tokens
3. Tokens stored in HTTP-only cookies
4. Client includes cookies in subsequent requests
5. Server validates token on each request
6. Token refresh before access token expiry

### Caching Strategy

**Cache Layer**: Redis 7.2.4 (Upstash)

**What Gets Cached**:
- User sessions (7 days TTL)
- Inventory list (10 minutes TTL)
- User profiles (30 minutes TTL)
- Rate limit counters (15 minutes rolling window)
- LLM conversation history (session-based)

**Cache Invalidation**:
- **On CREATE**: Invalidate list caches (e.g., `medicines:list`)
- **On UPDATE**: Invalidate specific item cache (e.g., `medicine:{id}`) + list caches
- **On DELETE**: Remove from cache + invalidate list caches
- **Manual**: Admin can clear cache via dashboard

---

## 2. Database Schema

### Database Information
- **DBMS**: PostgreSQL 16.1
- **ORM**: Prisma 5.9.0
- **Naming Convention**: snake_case for tables/columns
- **Timestamps**: All tables have `created_at`, `updated_at`
- **IDs**: CUID (Collision-resistant Unique Identifier) via Prisma

### Entity Relationship Diagram (ASCII)

```
┌──────────────┐
│    users     │
│──────────────│
│ id (PK)      │──┐
│ email        │  │
│ password_hash│  │
│ role         │  │
└──────────────┘  │
                  │
     ┌────────────┼────────────┬─────────────────┐
     │            │            │                 │
     ▼            ▼            ▼                 ▼
┌─────────┐  ┌─────────┐  ┌──────────────┐  ┌──────────────┐
│ orders  │  │sessions │  │prescriptions │  │  addresses   │
│─────────│  │─────────│  │──────────────│  │──────────────│
│id (PK)  │  │id (PK)  │  │id (PK)       │  │id (PK)       │
│user_id  │  │user_id  │  │user_id       │  │user_id       │
│status   │  │token    │  │medicine_name │  │street        │
└─────────┘  └─────────┘  └──────────────┘  │city          │
     │                          │            └──────────────┘
     │                          │
     ▼                          │
┌──────────────┐                │
│ order_items  │                │
│──────────────│                │
│ id (PK)      │                │
│ order_id     │                │
│ medicine_id  │◀───────────────┘
│ quantity     │
└──────────────┘
     │
     ▼
┌──────────────┐
│  medicines   │
│──────────────│
│ id (PK)      │
│ name         │
│ stock_level  │
│ price        │
└──────────────┘

┌────────────────┐
│ refill_alerts  │
│────────────────│
│ id (PK)        │
│ user_id ───────┘ (FK to users)
│ medicine_name  │
│ status         │
└────────────────┘

┌─────────────────┐
│ chat_messages   │
│─────────────────│
│ id (PK)         │
│ user_id ────────┘ (FK to users)
│ role            │
│ content         │
└─────────────────┘
```

---

## 3. Tables & Relationships

### Table: `users`

**Purpose**: Stores all user accounts (patients and pharmacy staff)

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier (CUID) |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email (login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password (12 rounds) |
| `full_name` | VARCHAR(255) | NOT NULL | User's full name |
| `phone_number` | VARCHAR(20) | NULL | Phone for SMS/WhatsApp (E.164 format) |
| `role` | ENUM('patient', 'staff', 'admin') | DEFAULT 'patient', NOT NULL | User role |
| `email_verified` | BOOLEAN | DEFAULT FALSE, NOT NULL | Email verification status |
| `sms_opt_in` | BOOLEAN | DEFAULT FALSE, NOT NULL | Opted in for SMS notifications |
| `whatsapp_opt_in` | BOOLEAN | DEFAULT FALSE, NOT NULL | Opted in for WhatsApp |
| `last_login_at` | TIMESTAMP | NULL | Last successful login |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Account creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last update timestamp |

#### Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

#### Constraints

- `email` must be valid format (validated in application: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- `password_hash` must be bcrypt with 12 rounds
- `phone_number` must be E.164 format if provided: `+1234567890`

#### Relationships

- One user has many orders (`orders.user_id`)
- One user has many sessions (`sessions.user_id`)
- One user has many prescriptions (`prescriptions.user_id`)
- One user has many addresses (`addresses.user_id`)
- One user has many chat messages (`chat_messages.user_id`)
- One user has many refill alerts (`refill_alerts.user_id`)

#### Prisma Schema

```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  passwordHash    String   @map("password_hash")
  fullName        String   @map("full_name")
  phoneNumber     String?  @map("phone_number")
  role            Role     @default(PATIENT)
  emailVerified   Boolean  @default(false) @map("email_verified")
  smsOptIn        Boolean  @default(false) @map("sms_opt_in")
  whatsappOptIn   Boolean  @default(false) @map("whatsapp_opt_in")
  lastLoginAt     DateTime? @map("last_login_at")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  orders          Order[]
  sessions        Session[]
  prescriptions   Prescription[]
  addresses       Address[]
  chatMessages    ChatMessage[]
  refillAlerts    RefillAlert[]

  @@index([email])
  @@index([role])
  @@map("users")
}

enum Role {
  PATIENT
  STAFF
  ADMIN
}
```

---

### Table: `medicines`

**Purpose**: Stores medicine inventory (master data)

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Brand or generic name |
| `generic_name` | VARCHAR(255) | NULL | Generic name if brand |
| `dosage` | VARCHAR(100) | NOT NULL | Dosage strength (e.g., "500mg") |
| `form` | VARCHAR(50) | NOT NULL | Form: tablet, capsule, liquid, etc. |
| `unit_type` | VARCHAR(50) | NOT NULL | Unit: tablets, ml, bottles |
| `stock_level` | INTEGER | DEFAULT 0, NOT NULL | Current stock quantity |
| `reorder_level` | INTEGER | DEFAULT 10, NOT NULL | Alert when stock below this |
| `price_per_unit` | DECIMAL(10,2) | NOT NULL | Price per unit in USD |
| `prescription_required` | BOOLEAN | DEFAULT FALSE, NOT NULL | Requires prescription? |
| `manufacturer` | VARCHAR(255) | NULL | Manufacturer name |
| `ndc_code` | VARCHAR(20) | NULL | National Drug Code (US) |
| `description` | TEXT | NULL | Description or usage notes |
| `image_url` | TEXT | NULL | S3 URL to medicine image |
| `is_active` | BOOLEAN | DEFAULT TRUE, NOT NULL | Active in catalog? |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last update |

#### Indexes

```sql
CREATE INDEX idx_medicines_name ON medicines(name);
CREATE INDEX idx_medicines_generic_name ON medicines(generic_name);
CREATE INDEX idx_medicines_stock_level ON medicines(stock_level);
CREATE INDEX idx_medicines_is_active ON medicines(is_active);
CREATE INDEX idx_medicines_prescription_required ON medicines(prescription_required);
CREATE UNIQUE INDEX idx_medicines_name_dosage_form ON medicines(name, dosage, form);
```

#### Constraints

- Unique combination of `name` + `dosage` + `form` (prevents duplicate entries)
- `stock_level` must be >= 0
- `price_per_unit` must be > 0

#### Relationships

- One medicine has many order items (`order_items.medicine_id`)

#### Prisma Schema

```prisma
model Medicine {
  id                    String   @id @default(cuid())
  name                  String
  genericName           String?  @map("generic_name")
  dosage                String
  form                  String
  unitType              String   @map("unit_type")
  stockLevel            Int      @default(0) @map("stock_level")
  reorderLevel          Int      @default(10) @map("reorder_level")
  pricePerUnit          Decimal  @db.Decimal(10, 2) @map("price_per_unit")
  prescriptionRequired  Boolean  @default(false) @map("prescription_required")
  manufacturer          String?
  ndcCode               String?  @map("ndc_code")
  description           String?  @db.Text
  imageUrl              String?  @map("image_url")
  isActive              Boolean  @default(true) @map("is_active")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  orderItems            OrderItem[]

  @@unique([name, dosage, form])
  @@index([name])
  @@index([genericName])
  @@index([stockLevel])
  @@index([isActive])
  @@map("medicines")
}
```

---

### Table: `orders`

**Purpose**: Stores customer orders

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `user_id` | TEXT | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Customer who placed order |
| `order_number` | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable order number (e.g., "ORD-20260215-001") |
| `status` | ENUM | DEFAULT 'pending_prescription', NOT NULL | Order status |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Sum of all items before tax |
| `tax` | DECIMAL(10,2) | DEFAULT 0.00, NOT NULL | Tax amount |
| `shipping_cost` | DECIMAL(10,2) | DEFAULT 0.00, NOT NULL | Shipping/delivery cost |
| `total` | DECIMAL(10,2) | NOT NULL | Final total amount |
| `payment_status` | ENUM | DEFAULT 'pending', NOT NULL | Payment status |
| `payment_method` | VARCHAR(50) | NULL | Payment method used |
| `delivery_method` | ENUM | DEFAULT 'delivery', NOT NULL | Delivery or pickup |
| `delivery_address_id` | TEXT | FOREIGN KEY → addresses(id), NULL | Delivery address if delivery |
| `estimated_delivery_date` | DATE | NULL | Estimated delivery date |
| `delivered_at` | TIMESTAMP | NULL | Actual delivery timestamp |
| `notes` | TEXT | NULL | Special instructions |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Order placed date |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last status update |

**Status ENUM Values**:
- `pending_prescription` - Waiting for prescription upload/review
- `prescription_rejected` - Prescription rejected by pharmacist
- `approved` - Prescription approved, ready to prepare
- `preparing` - Being prepared by pharmacy
- `out_for_delivery` - Out for delivery
- `delivered` - Delivered to customer
- `cancelled` - Order cancelled
- `refunded` - Order refunded

**Payment Status ENUM Values**:
- `pending` - Payment not yet processed
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

**Delivery Method ENUM Values**:
- `delivery` - Home delivery
- `pickup` - Pharmacy pickup

#### Indexes

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

#### Constraints

- `subtotal`, `tax`, `shipping_cost`, `total` must be >= 0
- `total` = `subtotal` + `tax` + `shipping_cost` (enforced in application)

#### Relationships

- `user_id` → users.id (many-to-one)
- One order has many order items (`order_items.order_id`)
- One order has many prescriptions (`prescriptions.order_id`)
- `delivery_address_id` → addresses.id (many-to-one, optional)

#### Prisma Schema

```prisma
model Order {
  id                    String         @id @default(cuid())
  userId                String         @map("user_id")
  orderNumber           String         @unique @map("order_number")
  status                OrderStatus    @default(PENDING_PRESCRIPTION)
  subtotal              Decimal        @db.Decimal(10, 2)
  tax                   Decimal        @default(0.00) @db.Decimal(10, 2)
  shippingCost          Decimal        @default(0.00) @db.Decimal(10, 2) @map("shipping_cost")
  total                 Decimal        @db.Decimal(10, 2)
  paymentStatus         PaymentStatus  @default(PENDING) @map("payment_status")
  paymentMethod         String?        @map("payment_method")
  deliveryMethod        DeliveryMethod @default(DELIVERY) @map("delivery_method")
  deliveryAddressId     String?        @map("delivery_address_id")
  estimatedDeliveryDate DateTime?      @db.Date @map("estimated_delivery_date")
  deliveredAt           DateTime?      @map("delivered_at")
  notes                 String?        @db.Text
  createdAt             DateTime       @default(now()) @map("created_at")
  updatedAt             DateTime       @updatedAt @map("updated_at")

  user                  User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  deliveryAddress       Address?       @relation(fields: [deliveryAddressId], references: [id])
  items                 OrderItem[]
  prescriptions         Prescription[]

  @@index([userId])
  @@index([orderNumber])
  @@index([status])
  @@index([createdAt])
  @@index([userId, status])
  @@map("orders")
}

enum OrderStatus {
  PENDING_PRESCRIPTION
  PRESCRIPTION_REJECTED
  APPROVED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum DeliveryMethod {
  DELIVERY
  PICKUP
}
```

---

### Table: `order_items`

**Purpose**: Stores individual items within an order (junction table)

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `order_id` | TEXT | FOREIGN KEY → orders(id) ON DELETE CASCADE, NOT NULL | Parent order |
| `medicine_id` | TEXT | FOREIGN KEY → medicines(id) ON DELETE RESTRICT, NOT NULL | Ordered medicine |
| `medicine_name` | VARCHAR(255) | NOT NULL | Snapshot of medicine name at time of order |
| `dosage` | VARCHAR(100) | NOT NULL | Snapshot of dosage |
| `quantity` | INTEGER | NOT NULL | Quantity ordered |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Price per unit at time of order |
| `total_price` | DECIMAL(10,2) | NOT NULL | quantity × unit_price |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last update |

#### Indexes

```sql
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_medicine_id ON order_items(medicine_id);
```

#### Constraints

- `quantity` must be > 0
- `unit_price` must be >= 0
- `total_price` = `quantity` × `unit_price` (enforced in application)

#### Relationships

- `order_id` → orders.id (many-to-one, cascade delete)
- `medicine_id` → medicines.id (many-to-one, restrict delete to preserve order history)

#### Prisma Schema

```prisma
model OrderItem {
  id            String   @id @default(cuid())
  orderId       String   @map("order_id")
  medicineId    String   @map("medicine_id")
  medicineName  String   @map("medicine_name")
  dosage        String
  quantity      Int
  unitPrice     Decimal  @db.Decimal(10, 2) @map("unit_price")
  totalPrice    Decimal  @db.Decimal(10, 2) @map("total_price")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  order         Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  medicine      Medicine @relation(fields: [medicineId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([medicineId])
  @@map("order_items")
}
```

---

### Table: `prescriptions`

**Purpose**: Stores uploaded prescription images and verification status

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `user_id` | TEXT | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Patient who uploaded |
| `order_id` | TEXT | FOREIGN KEY → orders(id) ON DELETE CASCADE, NULL | Associated order (if linked) |
| `file_url` | TEXT | NOT NULL | S3 URL to prescription image |
| `file_name` | VARCHAR(255) | NOT NULL | Original filename |
| `file_size` | INTEGER | NOT NULL | File size in bytes |
| `mime_type` | VARCHAR(100) | NOT NULL | MIME type (image/jpeg, application/pdf) |
| `status` | ENUM | DEFAULT 'pending', NOT NULL | Verification status |
| `doctor_name` | VARCHAR(255) | NULL | Extracted doctor name |
| `prescription_date` | DATE | NULL | Prescription date |
| `expiration_date` | DATE | NULL | Prescription expiration (1 year from date) |
| `medications` | JSONB | NULL | Array of medications on prescription |
| `reviewed_by` | TEXT | FOREIGN KEY → users(id), NULL | Staff who reviewed |
| `reviewed_at` | TIMESTAMP | NULL | Review timestamp |
| `rejection_reason` | TEXT | NULL | Reason if rejected |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Upload timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last update |

**Status ENUM Values**:
- `pending` - Awaiting pharmacist review
- `approved` - Approved by pharmacist
- `rejected` - Rejected by pharmacist
- `expired` - Prescription expired

#### Indexes

```sql
CREATE INDEX idx_prescriptions_user_id ON prescriptions(user_id);
CREATE INDEX idx_prescriptions_order_id ON prescriptions(order_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_expiration_date ON prescriptions(expiration_date);
CREATE INDEX idx_prescriptions_created_at ON prescriptions(created_at DESC);
```

#### Constraints

- `file_size` must be <= 10485760 (10MB)
- `mime_type` must be in: `image/jpeg`, `image/png`, `application/pdf`
- `expiration_date` must be >= `prescription_date`

#### Relationships

- `user_id` → users.id (many-to-one, cascade delete)
- `order_id` → orders.id (many-to-one, cascade delete, optional)
- `reviewed_by` → users.id (many-to-one, optional)

#### Prisma Schema

```prisma
model Prescription {
  id               String              @id @default(cuid())
  userId           String              @map("user_id")
  orderId          String?             @map("order_id")
  fileUrl          String              @map("file_url")
  fileName         String              @map("file_name")
  fileSize         Int                 @map("file_size")
  mimeType         String              @map("mime_type")
  status           PrescriptionStatus  @default(PENDING)
  doctorName       String?             @map("doctor_name")
  prescriptionDate DateTime?           @db.Date @map("prescription_date")
  expirationDate   DateTime?           @db.Date @map("expiration_date")
  medications      Json?
  reviewedBy       String?             @map("reviewed_by")
  reviewedAt       DateTime?           @map("reviewed_at")
  rejectionReason  String?             @db.Text @map("rejection_reason")
  createdAt        DateTime            @default(now()) @map("created_at")
  updatedAt        DateTime            @updatedAt @map("updated_at")

  user             User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  order            Order?              @relation(fields: [orderId], references: [id], onDelete: Cascade)
  reviewer         User?               @relation("PrescriptionReviewer", fields: [reviewedBy], references: [id])

  @@index([userId])
  @@index([orderId])
  @@index([status])
  @@index([expirationDate])
  @@index([createdAt])
  @@map("prescriptions")
}

enum PrescriptionStatus {
  PENDING
  APPROVED
  REJECTED
  EXPIRED
}
```

---

### Table: `addresses`

**Purpose**: Stores user delivery addresses

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `user_id` | TEXT | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Address owner |
| `label` | VARCHAR(50) | NULL | Label: "Home", "Work", etc. |
| `full_name` | VARCHAR(255) | NOT NULL | Recipient name |
| `phone_number` | VARCHAR(20) | NOT NULL | Contact phone (E.164) |
| `street_address` | VARCHAR(255) | NOT NULL | Street address line 1 |
| `apartment` | VARCHAR(100) | NULL | Apt, suite, unit number |
| `city` | VARCHAR(100) | NOT NULL | City |
| `state` | VARCHAR(50) | NOT NULL | State/province |
| `zip_code` | VARCHAR(20) | NOT NULL | ZIP/postal code |
| `country` | VARCHAR(2) | DEFAULT 'US', NOT NULL | ISO 3166-1 alpha-2 code |
| `is_default` | BOOLEAN | DEFAULT FALSE, NOT NULL | Default address? |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last update |

#### Indexes

```sql
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);
```

#### Constraints

- Only one `is_default` = TRUE per user (enforced in application)
- `zip_code` must match US ZIP format: `\d{5}(-\d{4})?`

#### Relationships

- `user_id` → users.id (many-to-one, cascade delete)
- One address can be used in many orders (`orders.delivery_address_id`)

#### Prisma Schema

```prisma
model Address {
  id            String   @id @default(cuid())
  userId        String   @map("user_id")
  label         String?
  fullName      String   @map("full_name")
  phoneNumber   String   @map("phone_number")
  streetAddress String   @map("street_address")
  apartment     String?
  city          String
  state         String
  zipCode       String   @map("zip_code")
  country       String   @default("US")
  isDefault     Boolean  @default(false) @map("is_default")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders        Order[]

  @@index([userId])
  @@index([isDefault])
  @@map("addresses")
}
```

---

### Table: `sessions`

**Purpose**: Track active user sessions for JWT refresh tokens

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `user_id` | TEXT | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Session owner |
| `refresh_token_hash` | VARCHAR(255) | UNIQUE, NOT NULL | Hashed refresh token |
| `user_agent` | TEXT | NULL | Browser/device info |
| `ip_address` | VARCHAR(45) | NULL | IP address (IPv4 or IPv6) |
| `expires_at` | TIMESTAMP | NOT NULL | Token expiration |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Session start |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last refresh |

#### Indexes

```sql
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token_hash ON sessions(refresh_token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

#### Cleanup

- Cron job runs daily at 2 AM to delete expired sessions: `DELETE FROM sessions WHERE expires_at < NOW()`

#### Relationships

- `user_id` → users.id (many-to-one, cascade delete)

#### Prisma Schema

```prisma
model Session {
  id               String   @id @default(cuid())
  userId           String   @map("user_id")
  refreshTokenHash String   @unique @map("refresh_token_hash")
  userAgent        String?  @db.Text @map("user_agent")
  ipAddress        String?  @map("ip_address")
  expiresAt        DateTime @map("expires_at")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([refreshTokenHash])
  @@index([expiresAt])
  @@map("sessions")
}
```

---

### Table: `refill_alerts`

**Purpose**: Track proactive refill reminder alerts

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `user_id` | TEXT | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Patient |
| `medicine_name` | VARCHAR(255) | NOT NULL | Medication name |
| `dosage` | VARCHAR(100) | NOT NULL | Dosage |
| `last_order_date` | DATE | NOT NULL | Date of last order |
| `last_order_quantity` | INTEGER | NOT NULL | Quantity in last order |
| `estimated_daily_dose` | DECIMAL(5,2) | NOT NULL | Estimated daily dose |
| `estimated_days_remaining` | INTEGER | NOT NULL | Calculated days until out |
| `status` | ENUM | DEFAULT 'pending', NOT NULL | Alert status |
| `outreach_channel` | VARCHAR(50) | NULL | Channel used: sms, whatsapp, email |
| `contacted_at` | TIMESTAMP | NULL | When alert was sent |
| `responded_at` | TIMESTAMP | NULL | When customer responded |
| `converted_order_id` | TEXT | FOREIGN KEY → orders(id), NULL | Order if converted |
| `dismissed_at` | TIMESTAMP | NULL | Manually dismissed by staff |
| `dismissed_by` | TEXT | FOREIGN KEY → users(id), NULL | Staff who dismissed |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Alert generation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last status update |

**Status ENUM Values**:
- `pending` - Alert generated, not yet sent
- `contacted` - Outreach sent to customer
- `responded` - Customer responded
- `converted` - Customer placed order
- `dismissed` - Manually dismissed by staff
- `expired` - Alert expired without action

#### Indexes

```sql
CREATE INDEX idx_refill_alerts_user_id ON refill_alerts(user_id);
CREATE INDEX idx_refill_alerts_status ON refill_alerts(status);
CREATE INDEX idx_refill_alerts_estimated_days_remaining ON refill_alerts(estimated_days_remaining);
CREATE INDEX idx_refill_alerts_created_at ON refill_alerts(created_at DESC);
```

#### Relationships

- `user_id` → users.id (many-to-one, cascade delete)
- `converted_order_id` → orders.id (many-to-one, optional)
- `dismissed_by` → users.id (many-to-one, optional)

#### Prisma Schema

```prisma
model RefillAlert {
  id                     String            @id @default(cuid())
  userId                 String            @map("user_id")
  medicineName           String            @map("medicine_name")
  dosage                 String
  lastOrderDate          DateTime          @db.Date @map("last_order_date")
  lastOrderQuantity      Int               @map("last_order_quantity")
  estimatedDailyDose     Decimal           @db.Decimal(5, 2) @map("estimated_daily_dose")
  estimatedDaysRemaining Int               @map("estimated_days_remaining")
  status                 RefillAlertStatus @default(PENDING)
  outreachChannel        String?           @map("outreach_channel")
  contactedAt            DateTime?         @map("contacted_at")
  respondedAt            DateTime?         @map("responded_at")
  convertedOrderId       String?           @map("converted_order_id")
  dismissedAt            DateTime?         @map("dismissed_at")
  dismissedBy            String?           @map("dismissed_by")
  createdAt              DateTime          @default(now()) @map("created_at")
  updatedAt              DateTime          @updatedAt @map("updated_at")

  user                   User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  convertedOrder         Order?            @relation("RefillAlertOrder", fields: [convertedOrderId], references: [id])
  dismisser              User?             @relation("RefillAlertDismisser", fields: [dismissedBy], references: [id])

  @@index([userId])
  @@index([status])
  @@index([estimatedDaysRemaining])
  @@index([createdAt])
  @@map("refill_alerts")
}

enum RefillAlertStatus {
  PENDING
  CONTACTED
  RESPONDED
  CONVERTED
  DISMISSED
  EXPIRED
}
```

---

### Table: `chat_messages`

**Purpose**: Store chat conversation history between user and AI

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `user_id` | TEXT | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Conversation owner |
| `conversation_id` | TEXT | NOT NULL | Groups messages in same conversation |
| `role` | ENUM('user', 'assistant', 'system') | NOT NULL | Message sender |
| `content` | TEXT | NOT NULL | Message text |
| `metadata` | JSONB | NULL | LLM metadata (tokens, tools used, etc.) |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Message timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Last update |

#### Indexes

```sql
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
```

#### Constraints

- `conversation_id` is generated per session (UUID)

#### Relationships

- `user_id` → users.id (many-to-one, cascade delete)

#### Prisma Schema

```prisma
model ChatMessage {
  id             String   @id @default(cuid())
  userId         String   @map("user_id")
  conversationId String   @map("conversation_id")
  role           ChatRole
  content        String   @db.Text
  metadata       Json?
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([conversationId])
  @@index([createdAt])
  @@map("chat_messages")
}

enum ChatRole {
  USER
  ASSISTANT
  SYSTEM
}
```

---

### Table: `audit_logs`

**Purpose**: Track important system events and changes (compliance, debugging)

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY, DEFAULT cuid() | Unique identifier |
| `user_id` | TEXT | FOREIGN KEY → users(id) ON DELETE SET NULL, NULL | User who performed action |
| `action` | VARCHAR(100) | NOT NULL | Action type: user_login, order_created, etc. |
| `entity_type` | VARCHAR(50) | NOT NULL | Entity affected: user, order, prescription |
| `entity_id` | TEXT | NULL | ID of affected entity |
| `changes` | JSONB | NULL | Before/after values for updates |
| `ip_address` | VARCHAR(45) | NULL | IP address |
| `user_agent` | TEXT | NULL | Browser/device info |
| `created_at` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Event timestamp |

#### Indexes

```sql
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

#### Retention

- Audit logs retained for 7 years (HIPAA compliance)
- Archived to S3 after 1 year in database

#### Prisma Schema

```prisma
model AuditLog {
  id         String   @id @default(cuid())
  userId     String?  @map("user_id")
  action     String
  entityType String   @map("entity_type")
  entityId   String?  @map("entity_id")
  changes    Json?
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @db.Text @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")

  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([action])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## 4. API Endpoints

### Authentication Endpoints

#### `POST /api/v1/auth/register`

**Purpose**: Create new patient account

**Authentication**: None (public)

**Request Body**:
```json
{
  "email": "sarah@example.com",
  "password": "SecurePass123!",
  "fullName": "Sarah Johnson",
  "phoneNumber": "+15551234567"
}
```

**Validation Rules**:
- `email`: Valid format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), max 255 chars, unique
- `password`: Min 8 chars, max 128 chars, must contain:
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (!@#$%^&*)
  - Not in common passwords list (top 10,000)
- `fullName`: 2-255 characters
- `phoneNumber`: E.164 format (`/^\+[1-9]\d{1,14}$/`), optional

**Response (201)**:
```json
{
  "message": "Account created successfully. Please verify your email.",
  "user": {
    "id": "clrh6y3im0000356o2s9v8g4m",
    "email": "sarah@example.com",
    "fullName": "Sarah Johnson",
    "role": "patient",
    "emailVerified": false
  }
}
```

**Errors**:
- `400 VALIDATION_ERROR`: Invalid input
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Validation failed",
      "details": [
        {
          "field": "password",
          "message": "Password must contain at least 1 uppercase letter"
        }
      ]
    }
  }
  ```
- `409 CONFLICT`: Email already exists
  ```json
  {
    "error": {
      "code": "CONFLICT",
      "message": "An account with this email already exists"
    }
  }
  ```

**Side Effects**:
- Creates user in `users` table
- Sends verification email via Resend
- Logs event: `user_registered` in `audit_logs`

---

#### `POST /api/v1/auth/login`

**Purpose**: Authenticate user and return JWT tokens

**Authentication**: None (public)

**Request Body**:
```json
{
  "email": "sarah@example.com",
  "password": "SecurePass123!"
}
```

**Response (200)**:
```json
{
  "user": {
    "id": "clrh6y3im0000356o2s9v8g4m",
    "email": "sarah@example.com",
    "fullName": "Sarah Johnson",
    "role": "patient",
    "emailVerified": true
  }
}
```

**Cookies Set** (HTTP-only, Secure, SameSite=Strict):
```
access_token=eyJhbGciOiJIUzI1...; Max-Age=900; HttpOnly; Secure; SameSite=Strict
refresh_token=eyJhbGciOiJIUzI1...; Max-Age=604800; HttpOnly; Secure; SameSite=Strict
```

**Errors**:
- `401 UNAUTHORIZED`: Invalid credentials
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid email or password"
    }
  }
  ```
- `403 FORBIDDEN`: Email not verified
  ```json
  {
    "error": {
      "code": "FORBIDDEN",
      "message": "Please verify your email before logging in"
    }
  }
  ```
- `429 RATE_LIMITED`: Too many attempts
  ```json
  {
    "error": {
      "code": "RATE_LIMITED",
      "message": "Too many login attempts. Please try again in 15 minutes",
      "retryAfter": 900
    }
  }
  ```

**Side Effects**:
- Updates `users.last_login_at`
- Creates session in `sessions` table
- Logs event: `user_login` in `audit_logs`

**Rate Limiting**: 5 attempts per 15 minutes per IP

---

#### `POST /api/v1/auth/refresh`

**Purpose**: Get new access token using refresh token

**Authentication**: Refresh token (cookie)

**Request**: No body, uses `refresh_token` cookie

**Response (200)**:
```json
{
  "message": "Token refreshed successfully"
}
```

**Cookies Set**:
```
access_token=eyJhbGciOiJIUzI1...; Max-Age=900; HttpOnly; Secure; SameSite=Strict
```

**Errors**:
- `401 UNAUTHORIZED`: Invalid or expired refresh token
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid or expired refresh token"
    }
  }
  ```

**Side Effects**:
- Updates `sessions.updated_at`
- Logs event: `token_refreshed` in `audit_logs`

---

#### `POST /api/v1/auth/logout`

**Purpose**: Invalidate current session

**Authentication**: Required (access token)

**Request**: No body

**Response (200)**:
```json
{
  "message": "Logged out successfully"
}
```

**Cookies Cleared**:
```
access_token=; Max-Age=0
refresh_token=; Max-Age=0
```

**Side Effects**:
- Deletes session from `sessions` table
- Logs event: `user_logout` in `audit_logs`

---

### Medicine Endpoints

#### `GET /api/v1/medicines`

**Purpose**: List all active medicines (for inventory search)

**Authentication**: Optional (public with limited data, authenticated for full data)

**Query Parameters**:
- `search`: Search by name or generic name (string, optional)
- `prescriptionRequired`: Filter by prescription requirement (boolean, optional)
- `inStock`: Filter by stock availability (boolean, optional, default: true)
- `page`: Page number (integer, default: 1)
- `limit`: Items per page (integer, max: 100, default: 20)

**Response (200)**:
```json
{
  "medicines": [
    {
      "id": "clrh7x2jk0001356o7w3k5n8p",
      "name": "Metformin",
      "genericName": "Metformin Hydrochloride",
      "dosage": "500mg",
      "form": "tablet",
      "unitType": "tablets",
      "stockLevel": 200,
      "pricePerUnit": 0.15,
      "prescriptionRequired": false,
      "manufacturer": "Teva Pharmaceuticals",
      "description": "Used to treat type 2 diabetes",
      "imageUrl": "https://cdn.pharmacyassistant.com/medicines/metformin-500mg.jpg",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Caching**:
- Cache key: `medicines:list:page:{page}:search:{search}:stock:{inStock}`
- TTL: 10 minutes
- Invalidate on: Medicine created/updated/deleted

**Errors**:
- `400 VALIDATION_ERROR`: Invalid query parameters

---

#### `GET /api/v1/medicines/:id`

**Purpose**: Get single medicine details

**Authentication**: Optional

**Response (200)**:
```json
{
  "medicine": {
    "id": "clrh7x2jk0001356o7w3k5n8p",
    "name": "Metformin",
    "genericName": "Metformin Hydrochloride",
    "dosage": "500mg",
    "form": "tablet",
    "unitType": "tablets",
    "stockLevel": 200,
    "pricePerUnit": 0.15,
    "prescriptionRequired": false,
    "manufacturer": "Teva Pharmaceuticals",
    "ndcCode": "00093-1234-56",
    "description": "Used to treat type 2 diabetes. Take with meals.",
    "imageUrl": "https://cdn.pharmacyassistant.com/medicines/metformin-500mg.jpg",
    "isActive": true,
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-02-15T14:30:00Z"
  }
}
```

**Caching**:
- Cache key: `medicine:{id}`
- TTL: 10 minutes

**Errors**:
- `404 NOT_FOUND`: Medicine not found

---

#### `PATCH /api/v1/medicines/:id` (Staff Only)

**Purpose**: Update medicine details (stock level, price, etc.)

**Authentication**: Required (role: staff or admin)

**Request Body**:
```json
{
  "stockLevel": 150,
  "pricePerUnit": 0.18,
  "isActive": true
}
```

**Validation**:
- `stockLevel`: Integer >= 0
- `pricePerUnit`: Decimal > 0
- `isActive`: Boolean

**Response (200)**:
```json
{
  "medicine": {
    "id": "clrh7x2jk0001356o7w3k5n8p",
    "name": "Metformin",
    "stockLevel": 150,
    "pricePerUnit": 0.18,
    "isActive": true,
    "updatedAt": "2026-02-15T15:00:00Z"
  }
}
```

**Errors**:
- `401 UNAUTHORIZED`: Not authenticated
- `403 FORBIDDEN`: Not staff/admin
- `404 NOT_FOUND`: Medicine not found
- `400 VALIDATION_ERROR`: Invalid input

**Side Effects**:
- Updates medicine in `medicines` table
- Invalidates cache: `medicine:{id}`, `medicines:list:*`
- Logs event: `medicine_updated` in `audit_logs`

---

### Order Endpoints

#### `POST /api/v1/orders`

**Purpose**: Create new order (from chat or direct form)

**Authentication**: Required

**Request Body**:
```json
{
  "items": [
    {
      "medicineId": "clrh7x2jk0001356o7w3k5n8p",
      "quantity": 90
    }
  ],
  "deliveryMethod": "delivery",
  "deliveryAddressId": "clrh8z4mn0002356p9x5m7q2s",
  "notes": "Please call before delivery"
}
```

**Validation**:
- `items`: Array with at least 1 item
  - `medicineId`: Valid medicine ID
  - `quantity`: Integer > 0, <= stock level
- `deliveryMethod`: enum ('delivery', 'pickup')
- `deliveryAddressId`: Required if deliveryMethod = 'delivery'
- `notes`: Max 1000 characters, optional

**Response (201)**:
```json
{
  "order": {
    "id": "clrh9a5op0003356q1y6n8r3t",
    "orderNumber": "ORD-20260215-001",
    "userId": "clrh6y3im0000356o2s9v8g4m",
    "status": "pending_prescription",
    "subtotal": 13.50,
    "tax": 1.08,
    "shippingCost": 0.00,
    "total": 14.58,
    "paymentStatus": "pending",
    "deliveryMethod": "delivery",
    "items": [
      {
        "id": "clrh9b6pq0004356r2z7o9s4u",
        "medicineName": "Metformin",
        "dosage": "500mg",
        "quantity": 90,
        "unitPrice": 0.15,
        "totalPrice": 13.50
      }
    ],
    "createdAt": "2026-02-15T15:30:00Z"
  },
  "requiresPrescription": true
}
```

**Errors**:
- `400 VALIDATION_ERROR`: Invalid input
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Validation failed",
      "details": [
        {
          "field": "items[0].quantity",
          "message": "Insufficient stock. Available: 50, Requested: 90"
        }
      ]
    }
  }
  ```
- `401 UNAUTHORIZED`: Not authenticated

**Side Effects**:
- Creates order in `orders` table
- Creates order items in `order_items` table
- Decrements `medicines.stock_level` (reserved)
- Triggers n8n webhook: `order_created`
- Logs event: `order_created` in `audit_logs`

---

#### `GET /api/v1/orders`

**Purpose**: List user's orders

**Authentication**: Required

**Query Parameters**:
- `status`: Filter by status (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (max: 50, default: 20)

**Response (200)**:
```json
{
  "orders": [
    {
      "id": "clrh9a5op0003356q1y6n8r3t",
      "orderNumber": "ORD-20260215-001",
      "status": "delivered",
      "total": 14.58,
      "deliveryMethod": "delivery",
      "itemCount": 1,
      "createdAt": "2026-02-15T15:30:00Z",
      "deliveredAt": "2026-02-16T17:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

**Caching**:
- Cache key: `orders:user:{userId}:page:{page}:status:{status}`
- TTL: 5 minutes
- Invalidate on: Order created/updated

---

#### `GET /api/v1/orders/:id`

**Purpose**: Get single order details

**Authentication**: Required (must own order or be staff/admin)

**Response (200)**:
```json
{
  "order": {
    "id": "clrh9a5op0003356q1y6n8r3t",
    "orderNumber": "ORD-20260215-001",
    "status": "delivered",
    "subtotal": 13.50,
    "tax": 1.08,
    "shippingCost": 0.00,
    "total": 14.58,
    "paymentStatus": "completed",
    "paymentMethod": "credit_card",
    "deliveryMethod": "delivery",
    "estimatedDeliveryDate": "2026-02-17",
    "deliveredAt": "2026-02-16T17:45:00Z",
    "items": [
      {
        "id": "clrh9b6pq0004356r2z7o9s4u",
        "medicineName": "Metformin",
        "dosage": "500mg",
        "quantity": 90,
        "unitPrice": 0.15,
        "totalPrice": 13.50
      }
    ],
    "deliveryAddress": {
      "fullName": "Sarah Johnson",
      "streetAddress": "123 Main St",
      "apartment": "Apt 4B",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62701"
    },
    "statusHistory": [
      {
        "status": "pending_prescription",
        "timestamp": "2026-02-15T15:30:00Z"
      },
      {
        "status": "approved",
        "timestamp": "2026-02-15T16:15:00Z"
      },
      {
        "status": "preparing",
        "timestamp": "2026-02-15T17:00:00Z"
      },
      {
        "status": "out_for_delivery",
        "timestamp": "2026-02-16T14:30:00Z"
      },
      {
        "status": "delivered",
        "timestamp": "2026-02-16T17:45:00Z"
      }
    ],
    "createdAt": "2026-02-15T15:30:00Z",
    "updatedAt": "2026-02-16T17:45:00Z"
  }
}
```

**Caching**:
- Cache key: `order:{id}`
- TTL: 5 minutes

**Errors**:
- `401 UNAUTHORIZED`: Not authenticated
- `403 FORBIDDEN`: Not owner and not staff
- `404 NOT_FOUND`: Order not found

---

#### `PATCH /api/v1/orders/:id/status` (Staff Only)

**Purpose**: Update order status (approve, ship, deliver, etc.)

**Authentication**: Required (role: staff or admin)

**Request Body**:
```json
{
  "status": "approved",
  "notes": "Prescription verified by pharmacist"
}
```

**Validation**:
- `status`: Must be valid OrderStatus enum value
- Valid status transitions:
  - `pending_prescription` → `approved` | `prescription_rejected`
  - `approved` → `preparing` | `cancelled`
  - `preparing` → `out_for_delivery` | `cancelled`
  - `out_for_delivery` → `delivered`

**Response (200)**:
```json
{
  "order": {
    "id": "clrh9a5op0003356q1y6n8r3t",
    "orderNumber": "ORD-20260215-001",
    "status": "approved",
    "updatedAt": "2026-02-15T16:15:00Z"
  }
}
```

**Errors**:
- `400 VALIDATION_ERROR`: Invalid status transition
- `401 UNAUTHORIZED`: Not authenticated
- `403 FORBIDDEN`: Not staff/admin
- `404 NOT_FOUND`: Order not found

**Side Effects**:
- Updates order status in `orders` table
- Invalidates cache: `order:{id}`, `orders:*`
- Triggers n8n webhook: `order_status_changed`
- Sends notification to customer (email/SMS)
- Logs event: `order_status_updated` in `audit_logs`

---

### Prescription Endpoints

#### `POST /api/v1/prescriptions`

**Purpose**: Upload prescription image

**Authentication**: Required

**Request**: Multipart form data
```
file: [binary image data]
orderId: "clrh9a5op0003356q1y6n8r3t" (optional)
```

**Validation**:
- `file`: Required, max 10MB
- MIME type: `image/jpeg`, `image/png`, `application/pdf`
- `orderId`: Optional, valid order ID if provided

**Response (201)**:
```json
{
  "prescription": {
    "id": "clrhac7qs0005356s3a8p1t5v",
    "userId": "clrh6y3im0000356o2s9v8g4m",
    "orderId": "clrh9a5op0003356q1y6n8r3t",
    "fileUrl": "https://prescriptions.pharmacyassistant.com/clrhac7qs0005356s3a8p1t5v.jpg",
    "fileName": "prescription-20260215.jpg",
    "fileSize": 2456789,
    "mimeType": "image/jpeg",
    "status": "pending",
    "createdAt": "2026-02-15T15:45:00Z"
  }
}
```

**Errors**:
- `400 VALIDATION_ERROR`: Invalid file (too large, wrong type)
- `401 UNAUTHORIZED`: Not authenticated

**Side Effects**:
- Uploads file to S3 with encryption
- Creates prescription record in `prescriptions` table
- If `orderId` provided, updates order status if needed
- Notifies staff of new prescription to review
- Logs event: `prescription_uploaded` in `audit_logs`

---

#### `GET /api/v1/prescriptions`

**Purpose**: List user's prescriptions

**Authentication**: Required

**Query Parameters**:
- `status`: Filter by status (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (max: 50, default: 20)

**Response (200)**:
```json
{
  "prescriptions": [
    {
      "id": "clrhac7qs0005356s3a8p1t5v",
      "orderId": "clrh9a5op0003356q1y6n8r3t",
      "fileUrl": "https://prescriptions.pharmacyassistant.com/clrhac7qs0005356s3a8p1t5v.jpg",
      "status": "approved",
      "doctorName": "Dr. Smith",
      "prescriptionDate": "2026-02-10",
      "expirationDate": "2027-02-10",
      "medications": [
        "Metformin 500mg"
      ],
      "reviewedAt": "2026-02-15T16:00:00Z",
      "createdAt": "2026-02-15T15:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "pages": 1
  }
}
```

---

#### `PATCH /api/v1/prescriptions/:id/review` (Staff Only)

**Purpose**: Approve or reject prescription

**Authentication**: Required (role: staff or admin)

**Request Body**:
```json
{
  "status": "approved",
  "doctorName": "Dr. Emily Smith",
  "prescriptionDate": "2026-02-10",
  "expirationDate": "2027-02-10",
  "medications": ["Metformin 500mg", "Lisinopril 10mg"]
}
```

OR

```json
{
  "status": "rejected",
  "rejectionReason": "Prescription image is too blurry to read. Please upload a clearer photo."
}
```

**Response (200)**:
```json
{
  "prescription": {
    "id": "clrhac7qs0005356s3a8p1t5v",
    "status": "approved",
    "reviewedBy": "clrh6y3im0000356o2s9v8g4m",
    "reviewedAt": "2026-02-15T16:00:00Z",
    "updatedAt": "2026-02-15T16:00:00Z"
  }
}
```

**Errors**:
- `400 VALIDATION_ERROR`: Invalid status or missing required fields
- `401 UNAUTHORIZED`: Not authenticated
- `403 FORBIDDEN`: Not staff/admin
- `404 NOT_FOUND`: Prescription not found

**Side Effects**:
- Updates prescription in `prescriptions` table
- If approved and linked to order, updates order status to `approved`
- If rejected, sends notification to customer with rejection reason
- Triggers n8n webhook: `prescription_reviewed`
- Logs event: `prescription_reviewed` in `audit_logs`

---

### Refill Alert Endpoints

#### `GET /api/v1/refill-alerts` (Staff Only)

**Purpose**: List refill alerts for admin dashboard

**Authentication**: Required (role: staff or admin)

**Query Parameters**:
- `status`: Filter by status (optional)
- `urgency`: Filter by urgency (critical: <3 days, high: <5 days, medium: <7 days)
- `page`: Page number (default: 1)
- `limit`: Items per page (max: 100, default: 50)

**Response (200)**:
```json
{
  "alerts": [
    {
      "id": "clrhbd8rt0006356t4b9q2u6w",
      "user": {
        "id": "clrh6y3im0000356o2s9v8g4m",
        "fullName": "Sarah Johnson",
        "phoneNumber": "+15551234567",
        "email": "sarah@example.com"
      },
      "medicineName": "Metformin",
      "dosage": "500mg",
      "lastOrderDate": "2026-01-15",
      "estimatedDaysRemaining": 3,
      "status": "pending",
      "createdAt": "2026-02-15T06:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 24,
    "pages": 1
  },
  "summary": {
    "total": 24,
    "critical": 5,
    "high": 10,
    "medium": 9,
    "contacted": 8,
    "converted": 7,
    "responseRate": 0.33,
    "conversionRate": 0.29
  }
}
```

---

#### `POST /api/v1/refill-alerts/:id/contact` (Staff Only)

**Purpose**: Manually trigger refill reminder for specific alert

**Authentication**: Required (role: staff or admin)

**Request Body**:
```json
{
  "channel": "whatsapp",
  "message": "Custom message (optional)"
}
```

**Response (200)**:
```json
{
  "alert": {
    "id": "clrhbd8rt0006356t4b9q2u6w",
    "status": "contacted",
    "outreachChannel": "whatsapp",
    "contactedAt": "2026-02-15T16:30:00Z"
  }
}
```

**Side Effects**:
- Updates alert status to `contacted`
- Triggers n8n webhook to send message
- Logs event: `refill_alert_manual_contact` in `audit_logs`

---

#### `PATCH /api/v1/refill-alerts/:id/dismiss` (Staff Only)

**Purpose**: Dismiss refill alert

**Authentication**: Required (role: staff or admin)

**Request Body**:
```json
{
  "reason": "Customer switched pharmacies"
}
```

**Response (200)**:
```json
{
  "alert": {
    "id": "clrhbd8rt0006356t4b9q2u6w",
    "status": "dismissed",
    "dismissedAt": "2026-02-15T16:35:00Z",
    "dismissedBy": "clrh6y3im0000356o2s9v8g4m"
  }
}
```

---

### Chat Endpoints

#### `POST /api/v1/chat/message`

**Purpose**: Send message to AI assistant and get response

**Authentication**: Required

**Request Body**:
```json
{
  "conversationId": "clrhce9su0007356u5c0r3v7x",
  "message": "I need to refill my blood pressure medication"
}
```

**Validation**:
- `conversationId`: UUID (generated client-side on first message)
- `message`: 1-2000 characters

**Response (200)**:
```json
{
  "conversationId": "clrhce9su0007356u5c0r3v7x",
  "userMessage": {
    "id": "clrhcfatv0008356v6d1s4w8y",
    "role": "user",
    "content": "I need to refill my blood pressure medication",
    "createdAt": "2026-02-15T16:40:00Z"
  },
  "assistantMessage": {
    "id": "clrhcgbuv0009356w7e2t5x9z",
    "role": "assistant",
    "content": "I'd be happy to help! Can you tell me the name of your blood pressure medication?",
    "createdAt": "2026-02-15T16:40:02Z"
  },
  "metadata": {
    "tokensUsed": 150,
    "latency": 1850,
    "toolsUsed": []
  }
}
```

**Side Effects**:
- Saves both messages to `chat_messages` table
- Sends request to Anthropic Claude API
- Logs LLM interaction to Langfuse
- If order created during conversation, returns `orderId`
- Logs event: `chat_message_sent` in `audit_logs`

---

### Address Endpoints

#### `POST /api/v1/addresses`

**Purpose**: Add new delivery address

**Authentication**: Required

**Request Body**:
```json
{
  "label": "Home",
  "fullName": "Sarah Johnson",
  "phoneNumber": "+15551234567",
  "streetAddress": "123 Main St",
  "apartment": "Apt 4B",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62701",
  "isDefault": true
}
```

**Response (201)**:
```json
{
  "address": {
    "id": "clrh8z4mn0002356p9x5m7q2s",
    "label": "Home",
    "fullName": "Sarah Johnson",
    "streetAddress": "123 Main St",
    "apartment": "Apt 4B",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "isDefault": true,
    "createdAt": "2026-02-15T16:50:00Z"
  }
}
```

**Side Effects**:
- If `isDefault` = true, sets all other user addresses to `isDefault` = false
- Logs event: `address_created` in `audit_logs`

---

## 5. Authentication & Authorization

### JWT Token Structure

#### Access Token (15 minute expiry)
```json
{
  "sub": "clrh6y3im0000356o2s9v8g4m",
  "email": "sarah@example.com",
  "role": "patient",
  "iat": 1707998400,
  "exp": 1707999300
}
```

**Signing Algorithm**: HS256  
**Secret**: `JWT_SECRET` environment variable (min 32 characters)

#### Refresh Token (7 day expiry)
```json
{
  "sub": "clrh6y3im0000356o2s9v8g4m",
  "sessionId": "clrhchasw000a356x8f3u6y0a",
  "iat": 1707998400,
  "exp": 1708603200
}
```

**Signing Algorithm**: HS256  
**Secret**: `JWT_REFRESH_SECRET` environment variable

### Authorization Levels

#### Public Routes (No auth required)
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/medicines` (limited data)
- `GET /api/v1/medicines/:id` (limited data)

#### Patient Routes (Valid access token, role: patient)
- `GET /api/v1/orders` (own orders only)
- `POST /api/v1/orders`
- `GET /api/v1/orders/:id` (own orders only)
- `POST /api/v1/prescriptions`
- `GET /api/v1/prescriptions` (own prescriptions only)
- `POST /api/v1/chat/message`
- `POST /api/v1/addresses`
- `GET /api/v1/addresses` (own addresses only)

#### Staff Routes (Valid access token, role: staff or admin)
- All patient routes (for any user)
- `PATCH /api/v1/medicines/:id`
- `PATCH /api/v1/orders/:id/status`
- `PATCH /api/v1/prescriptions/:id/review`
- `GET /api/v1/refill-alerts`
- `POST /api/v1/refill-alerts/:id/contact`
- `PATCH /api/v1/refill-alerts/:id/dismiss`

#### Admin Routes (Valid access token, role: admin)
- All staff routes
- `DELETE /api/v1/users/:id` (future)
- `GET /api/v1/audit-logs` (future)

### Password Security

**Hashing**: bcrypt with 12 rounds (cost factor)

```typescript
import bcrypt from 'bcrypt';

// Hash password on registration
const passwordHash = await bcrypt.hash(password, 12);

// Verify password on login
const isValid = await bcrypt.compare(password, user.passwordHash);
```

**Requirements**:
- Never stored in plain text
- Never returned in API responses
- Never logged or sent in error messages
- Reset via email verification only (secure token)

**Password Reset Flow**:
1. User requests password reset (`POST /api/v1/auth/forgot-password`)
2. Server generates secure token (32 bytes, random)
3. Token stored in database with 1-hour expiration
4. Email sent with reset link
5. User clicks link, enters new password
6. Server validates token, updates password hash
7. All sessions invalidated (logout everywhere)

---

## 6. Data Validation Rules

### Email Validation

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
  if (!email || email.length > 255) return false;
  if (!emailRegex.test(email)) return false;
  
  // Additional checks
  const disposableD domains = ['tempmail.com', 'guerrillamail.com', ...];
  const domain = email.split('@')[1];
  if (disposableDomains.includes(domain)) return false;
  
  return true;
}
```

### Password Requirements

```typescript
function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least 1 uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least 1 lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least 1 number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least 1 special character (!@#$%^&*)');
  }
  
  // Check against common passwords list (top 10,000)
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a stronger password');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### Content Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content (for notes, messages)
function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all HTML
    ALLOWED_ATTR: []
  });
}

// Sanitize for storage
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, MAX_LENGTH); // Enforce max length
}
```

### File Upload Validation

```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf'
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: 'File type not allowed. Please upload JPG, PNG, or PDF'
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB'
    };
  }
  
  return { valid: true };
}
```

---

## 7. Error Handling

### Standardized Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "fieldName",
        "message": "Field-specific error"
      }
    ],
    "timestamp": "2026-02-15T17:00:00Z",
    "path": "/api/v1/orders",
    "requestId": "clrhcibtx000b356y9g4v7z1b"
  }
}
```

### Error Codes & HTTP Status Mapping

| Error Code | HTTP Status | Description | Example |
|------------|-------------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Invalid input data | Missing required field |
| `UNAUTHORIZED` | 401 | Not authenticated | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions | Patient accessing staff route |
| `NOT_FOUND` | 404 | Resource not found | Order ID doesn't exist |
| `CONFLICT` | 409 | Resource conflict | Email already registered |
| `RATE_LIMITED` | 429 | Too many requests | Exceeded rate limit |
| `SERVER_ERROR` | 500 | Internal server error | Database connection failed |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable | LLM API down |

### Error Handler Implementation

```typescript
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any[];
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = req.id || generateRequestId();
  
  // Log error (Sentry, CloudWatch, etc.)
  logger.error({
    error: err,
    requestId,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });
  
  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Unique constraint violation
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'A resource with this value already exists',
          details: err.meta,
          timestamp: new Date().toISOString(),
          path: req.path,
          requestId
        }
      });
    }
  }
  
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        })),
        timestamp: new Date().toISOString(),
        path: req.path,
        requestId
      }
    });
  }
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const code = err.code || 'SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';
  
  res.status(statusCode).json({
    error: {
      code,
      message,
      details: err.details || [],
      timestamp: new Date().toISOString(),
      path: req.path,
      requestId
    }
  });
}
```

---

## 8. Caching Strategy

### Cache Layers

#### Redis (Primary Cache)
- **Purpose**: Fast key-value storage for frequently accessed data
- **Provider**: Upstash (serverless Redis)
- **Connection**: TLS-encrypted
- **Eviction Policy**: LRU (Least Recently Used)

### What Gets Cached

| Data Type | Cache Key Format | TTL | Invalidation Trigger |
|-----------|------------------|-----|---------------------|
| User sessions | `session:{refreshTokenHash}` | 7 days | Logout, password change |
| User profile | `user:{userId}` | 30 minutes | Profile update |
| Medicine list | `medicines:list:page:{page}:search:{search}` | 10 minutes | Medicine create/update/delete |
| Single medicine | `medicine:{id}` | 10 minutes | Medicine update |
| Order list | `orders:user:{userId}:page:{page}:status:{status}` | 5 minutes | Order create/update |
| Single order | `order:{id}` | 5 minutes | Order update |
| API rate limits | `ratelimit:{ip}:{endpoint}` | 15 minutes | TTL expiration |
| Refill alerts | `refill:alerts:date:{date}` | 1 hour | Daily regeneration |

### Cache Implementation

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Get with fallback to database
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number // seconds
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }
  
  // Fetch from database
  const data = await fetcher();
  
  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}

// Invalidate cache
export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Example usage
export async function getMedicine(id: string) {
  return getCached(
    `medicine:${id}`,
    () => prisma.medicine.findUnique({ where: { id } }),
    600 // 10 minutes
  );
}
```

### Cache Invalidation Logic

```typescript
// After updating medicine
await prisma.medicine.update({ where: { id }, data });
await invalidateCache(`medicine:${id}`);
await invalidateCache('medicines:list:*');

// After creating order
const order = await prisma.order.create({ data });
await invalidateCache(`orders:user:${userId}:*`);
await invalidateCache(`refill:alerts:*`); // May affect refill predictions
```

---

## 9. Rate Limiting

### Limits by Endpoint

| Endpoint | Limit | Window | Identifier |
|----------|-------|--------|------------|
| `POST /api/v1/auth/login` | 5 requests | 15 minutes | IP address |
| `POST /api/v1/auth/register` | 3 requests | 1 hour | IP address |
| `POST /api/v1/auth/forgot-password` | 3 requests | 1 hour | IP address |
| `POST /api/v1/prescriptions` | 10 requests | 1 hour | User ID |
| `POST /api/v1/orders` | 20 requests | 1 hour | User ID |
| `POST /api/v1/chat/message` | 60 requests | 1 hour | User ID |
| API (authenticated) | 100 requests | 1 minute | User ID |
| API (public) | 50 requests | 1 minute | IP address |

### Implementation (Sliding Window)

```typescript
import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const createRateLimiter = (
  limit: number,
  windowMs: number,
  keyGenerator?: (req: Request) => string
) => {
  return rateLimit({
    windowMs,
    max: limit,
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    store: new RedisStore({
      client: redis,
      prefix: 'ratelimit:'
    }),
    keyGenerator: keyGenerator || ((req) => req.ip),
    handler: (req, res) => {
      res.status(429).json({
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(windowMs / 1000),
          timestamp: new Date().toISOString(),
          path: req.path
        }
      });
    }
  });
};

// Usage
app.post(
  '/api/v1/auth/login',
  createRateLimiter(5, 15 * 60 * 1000), // 5 per 15 min
  loginHandler
);

app.post(
  '/api/v1/orders',
  authenticate,
  createRateLimiter(20, 60 * 60 * 1000, (req) => req.user.id), // 20 per hour per user
  createOrderHandler
);
```

### Rate Limit Response Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707999600
Retry-After: 60
```

---

## 10. Database Migrations

### Migration Strategy

**Tool**: Prisma Migrate

**Process**:
1. **Development**: Create migration with `prisma migrate dev`
2. **Staging**: Deploy with `prisma migrate deploy`
3. **Production**: Deploy with `prisma migrate deploy` (after staging verification)

**Never**:
- Edit existing migrations after deployment
- Delete migrations that have been deployed
- Manually modify the database schema (always use Prisma)

### Migration Commands

```bash
# 1. Create new migration (development)
pnpm prisma migrate dev --name add_refill_alerts_table

# 2. Apply migrations (staging/production)
pnpm prisma migrate deploy

# 3. Reset database (development only!)
pnpm prisma migrate reset

# 4. Check migration status
pnpm prisma migrate status

# 5. Resolve migration issues
pnpm prisma migrate resolve --applied "20260215_add_refill_alerts"
```

### Migration Example

```prisma
// prisma/migrations/20260215_add_refill_alerts/migration.sql

-- CreateEnum
CREATE TYPE "RefillAlertStatus" AS ENUM ('PENDING', 'CONTACTED', 'RESPONDED', 'CONVERTED', 'DISMISSED', 'EXPIRED');

-- CreateTable
CREATE TABLE "refill_alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "medicine_name" VARCHAR(255) NOT NULL,
    "dosage" VARCHAR(100) NOT NULL,
    "last_order_date" DATE NOT NULL,
    "last_order_quantity" INTEGER NOT NULL,
    "estimated_daily_dose" DECIMAL(5,2) NOT NULL,
    "estimated_days_remaining" INTEGER NOT NULL,
    "status" "RefillAlertStatus" NOT NULL DEFAULT 'PENDING',
    "outreach_channel" VARCHAR(50),
    "contacted_at" TIMESTAMP(3),
    "responded_at" TIMESTAMP(3),
    "converted_order_id" TEXT,
    "dismissed_at" TIMESTAMP(3),
    "dismissed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refill_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_refill_alerts_user_id" ON "refill_alerts"("user_id");
CREATE INDEX "idx_refill_alerts_status" ON "refill_alerts"("status");
CREATE INDEX "idx_refill_alerts_estimated_days_remaining" ON "refill_alerts"("estimated_days_remaining");
CREATE INDEX "idx_refill_alerts_created_at" ON "refill_alerts"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "refill_alerts" ADD CONSTRAINT "refill_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refill_alerts" ADD CONSTRAINT "refill_alerts_converted_order_id_fkey" FOREIGN KEY ("converted_order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refill_alerts" ADD CONSTRAINT "refill_alerts_dismissed_by_fkey" FOREIGN KEY ("dismissed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

### Rollback Strategy

**Prisma does not support automatic rollback.** Manual rollback required:

1. Create a new migration that reverses the changes
2. Or restore database from backup

```sql
-- Manual rollback migration
DROP TABLE "refill_alerts";
DROP TYPE "RefillAlertStatus";
```

---

## 11. Backup & Recovery

### Backup Strategy

**Frequency**: Daily automated backups at 2:00 AM UTC

**Retention**:
- **Daily backups**: 7 days
- **Weekly backups**: 4 weeks
- **Monthly backups**: 12 months

**Location**: AWS S3 with server-side encryption (AES-256)

**Type**: Full database dump + Write-Ahead Log (WAL) archiving

### Backup Implementation

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="pharmacy_assistant_$DATE.sql"
S3_BUCKET="s3://pharmacy-assistant-backups"

# Create database dump
pg_dump $DATABASE_URL > /tmp/$BACKUP_FILE

# Compress
gzip /tmp/$BACKUP_FILE

# Upload to S3
aws s3 cp /tmp/$BACKUP_FILE.gz $S3_BUCKET/daily/ --sse AES256

# Clean up
rm /tmp/$BACKUP_FILE.gz

# Delete backups older than retention period
aws s3 ls $S3_BUCKET/daily/ | while read -r line; do
  createDate=$(echo $line | awk {'print $1" "$2'})
  createDate=$(date -d"$createDate" +%s)
  olderThan=$(date -d"-7 days" +%s)
  if [[ $createDate -lt $olderThan ]]; then
    fileName=$(echo $line | awk {'print $4'})
    aws s3 rm $S3_BUCKET/daily/$fileName
  fi
done
```

### Recovery Procedure

**Step 1**: Identify backup timestamp
```bash
aws s3 ls s3://pharmacy-assistant-backups/daily/
```

**Step 2**: Download backup
```bash
aws s3 cp s3://pharmacy-assistant-backups/daily/pharmacy_assistant_20260215_020000.sql.gz /tmp/
gunzip /tmp/pharmacy_assistant_20260215_020000.sql.gz
```

**Step 3**: Restore database
```bash
# WARNING: This will replace all data

# Drop existing database (if needed)
dropdb pharmacy_assistant

# Create new database
createdb pharmacy_assistant

# Restore from backup
psql pharmacy_assistant < /tmp/pharmacy_assistant_20260215_020000.sql
```

**Step 4**: Verify data integrity
```sql
-- Check table counts
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'medicines', COUNT(*) FROM medicines;

-- Check latest order
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```

**Step 5**: Update application config (if needed)
- Update connection strings
- Clear Redis cache
- Restart application servers

**Step 6**: Test critical paths
- User login
- Order placement
- Prescription upload
- Admin dashboard

**Recovery Time Objective (RTO)**: 4 hours  
**Recovery Point Objective (RPO)**: 24 hours (last daily backup)

---

## 12. API Versioning

### Current Version: v1

**Base URL**: `https://api.pharmacyassistant.com/api/v1`

### Versioning Strategy

**Method**: URL-based versioning

**Structure**:
```
/api/v1/orders    ← Version in URL
/api/v2/orders    ← Future version
```

**Backwards Compatibility**:
- Maintain old API version for minimum 6 months after new version release
- Additive changes (new fields, new endpoints) do NOT require new version
- Breaking changes (remove fields, change behavior) DO require new version

### Breaking vs Non-Breaking Changes

**Non-Breaking (Can add to existing version)**:
- Adding new endpoints
- Adding new optional fields to request
- Adding new fields to response
- Adding new query parameters (optional)
- Adding new HTTP methods to existing endpoints

**Breaking (Require new version)**:
- Removing endpoints
- Removing fields from response
- Changing field types or formats
- Making optional fields required
- Changing error response format
- Renaming fields

### Deprecation Process

**Timeline**:
1. **T-90 days**: Announce deprecation
   - Add `Deprecation` header to responses
   - Update API documentation
   - Email notification to API consumers
2. **T-60 days**: Add warning logs
   - Log all requests to deprecated endpoints
3. **T-30 days**: Final reminder
   - Email reminder
   - Dashboard warning
4. **T-0 days**: Shut down deprecated version
   - Return 410 Gone for all requests
   - Redirect to new version documentation

**Example Headers**:
```http
Deprecation: Sun, 15 Aug 2026 23:59:59 GMT
Sunset: Sun, 15 Aug 2026 23:59:59 GMT
Link: </api/v2/orders>; rel="successor-version"
```

---

## 13. Database Performance Optimization

### Indexing Strategy

**Already Indexed** (see table definitions above):
- All foreign keys
- All frequently queried fields
- Created_at timestamps (for sorting)

**Composite Index Examples**:
```sql
-- For filtering orders by user and status
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- For searching medicines by name and availability
CREATE INDEX idx_medicines_name_active ON medicines(name, is_active);
```

### Query Optimization

**Use Prisma's `select` and `include` carefully**:
```typescript
// ❌ Bad: Fetches all fields + all relations
const orders = await prisma.order.findMany({
  include: {
    user: true,
    items: true,
    prescriptions: true,
    deliveryAddress: true
  }
});

// ✅ Good: Only fetch needed fields
const orders = await prisma.order.findMany({
  select: {
    id: true,
    orderNumber: true,
    status: true,
    total: true,
    createdAt: true,
    user: {
      select: {
        fullName: true
      }
    },
    items: {
      select: {
        medicineName: true,
        quantity: true
      }
    }
  }
});
```

### Connection Pooling

**Prisma Connection Pool** (configured in `schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // Connection pool settings
  // connection_limit = 10 (default for Prisma)
  // pool_timeout = 10 (seconds)
}
```

**PgBouncer** (managed by Supabase):
- Max connections: 100
- Pool mode: Transaction
- Default pool size: 20

---

## 14. Security Hardening

### SQL Injection Prevention

**Prisma ORM** automatically parameterizes all queries:
```typescript
// ❌ Vulnerable (raw SQL with string concatenation)
await prisma.$executeRawUnsafe(
  `SELECT * FROM users WHERE email = '${email}'`
);

// ✅ Safe (Prisma parameterizes automatically)
await prisma.user.findUnique({
  where: { email }
});

// ✅ Safe (raw query with parameters)
await prisma.$executeRaw`
  SELECT * FROM users WHERE email = ${email}
`;
```

### XSS Prevention

**Input Sanitization**:
- Strip HTML from all user inputs (except markdown in post content)
- Use DOMPurify for sanitizing rich text
- React automatically escapes JSX content

**Content Security Policy** (set via Helmet.js):
```typescript
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"], // For Tailwind
    imgSrc: ["'self'", "https://cdn.pharmacyassistant.com"],
    connectSrc: ["'self'", "https://api.pharmacyassistant.com"],
  }
}));
```

### CSRF Protection

**Not needed** for API with JWT in cookies:
- `SameSite=Strict` on cookies prevents CSRF
- No session-based authentication

### HTTPS Only

**Enforced in production**:
```typescript
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
```

### Secrets Management

**Environment Variables**:
- Never commit `.env` files
- Use Railway/Vercel secret management for production
- Rotate secrets quarterly

**Encryption Keys**:
```env
# Minimum 32 characters
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-random-string
JWT_REFRESH_SECRET=your-refresh-token-secret-different-from-jwt
DATABASE_URL=postgresql://encrypted-connection-string
```

---

**Document Version**: 1.0  
**Last Updated**: February 15, 2026  
**Next Review**: May 15, 2026 (quarterly)  
**Maintained By**: Backend Engineering Team  
**Contact**: backend@pharmacyassistant.com

---

**End of Backend Architecture & Database Structure Documentation**
