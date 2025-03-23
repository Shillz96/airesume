# Database Schema Documentation

This document outlines the database schema for the AIreHire application, including all tables, their relationships, and data types.

## Schema Overview

The application uses PostgreSQL with Drizzle ORM for database operations. The schema is defined in `shared/schema.ts`.

## Tables

### Users

Stores user account information.

```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Unique user identifier |
| username | text | NOT NULL, UNIQUE | User's username/email |
| password | text | NOT NULL | Hashed password |
| isAdmin | boolean | NOT NULL, DEFAULT false | Admin privileges flag |

### Resumes

Stores user resumes.

```typescript
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  template: text("template").notNull().default("professional"),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Unique resume identifier |
| userId | integer | NOT NULL, FOREIGN KEY | Reference to users.id |
| title | text | NOT NULL | Resume title |
| template | text | NOT NULL, DEFAULT "professional" | Template used for resume |
| content | jsonb | NOT NULL | Resume content in JSON format |
| createdAt | timestamp | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updatedAt | timestamp | NOT NULL, DEFAULT NOW() | Last update timestamp |

The `content` jsonb column contains structured resume data including:
- personalInfo (name, contact details, summary)
- experience (work history)
- education
- skills
- projects

### Jobs

Stores job listings.

```typescript
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  skills: text("skills").array().notNull(),
  postedAt: timestamp("posted_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  applyUrl: text("apply_url").notNull(),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Unique job identifier |
| title | text | NOT NULL | Job title |
| company | text | NOT NULL | Company name |
| location | text | NOT NULL | Job location |
| type | text | NOT NULL | Job type (Full-time, Part-time, etc.) |
| description | text | NOT NULL | Job description |
| skills | text[] | NOT NULL | Array of required skills |
| postedAt | timestamp | NOT NULL, DEFAULT NOW() | Posting date |
| expiresAt | timestamp | | Expiration date |
| applyUrl | text | NOT NULL | Application URL |

Note: The `Job` type in TypeScript extends this table with additional calculated fields:
```typescript
export type Job = typeof jobs.$inferSelect & {
  match?: number;       // Match percentage with user's resume
  isNew?: boolean;      // Whether the job is recent
  saved?: boolean;      // Whether the job is saved by the user
  salary?: string;      // Salary information from Adzuna API
};
```

### Saved Jobs

Tracks jobs saved by users.

```typescript
export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Unique saved job identifier |
| userId | integer | NOT NULL, FOREIGN KEY | Reference to users.id |
| jobId | integer | NOT NULL, FOREIGN KEY | Reference to jobs.id |
| savedAt | timestamp | NOT NULL, DEFAULT NOW() | When job was saved |

### Applications

Tracks job applications submitted by users.

```typescript
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  resumeId: integer("resume_id").notNull().references(() => resumes.id),
  status: text("status").notNull().default("applied"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  notes: text("notes"),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Unique application identifier |
| userId | integer | NOT NULL, FOREIGN KEY | Reference to users.id |
| jobId | integer | NOT NULL, FOREIGN KEY | Reference to jobs.id |
| resumeId | integer | NOT NULL, FOREIGN KEY | Reference to resumes.id |
| status | text | NOT NULL, DEFAULT "applied" | Application status |
| appliedAt | timestamp | NOT NULL, DEFAULT NOW() | Application date |
| notes | text | | Additional notes |

### Subscriptions

Manages user subscription plans.

```typescript
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planType: text("plan_type").notNull(), // "free", "starter", "pro", "career_builder" 
  status: text("status").notNull(), // "active", "cancelled", "expired"
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  paymentMethod: text("payment_method"), // "stripe", "crypto", etc.
  autoRenew: boolean("auto_renew").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Unique subscription identifier |
| userId | integer | NOT NULL, FOREIGN KEY, ON DELETE CASCADE | Reference to users.id |
| planType | text | NOT NULL | Subscription type |
| status | text | NOT NULL | Subscription status |
| startDate | timestamp | NOT NULL, DEFAULT NOW() | Start date |
| endDate | timestamp | | End date |
| paymentMethod | text | | Payment method used |
| autoRenew | boolean | NOT NULL, DEFAULT true | Whether it auto-renews |
| createdAt | timestamp | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updatedAt | timestamp | NOT NULL, DEFAULT NOW() | Last update timestamp |

### Addons

Tracks add-on features purchased by users.

```typescript
export const addons = pgTable("addons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  addonType: text("addon_type").notNull(), // "cover_letter_pack", "interview_prep", "linkedin_import", "premium_filters"
  quantity: integer("quantity").notNull().default(1),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Unique addon identifier |
| userId | integer | NOT NULL, FOREIGN KEY, ON DELETE CASCADE | Reference to users.id |
| addonType | text | NOT NULL | Type of addon |
| quantity | integer | NOT NULL, DEFAULT 1 | Quantity purchased |
| expiresAt | timestamp | | Expiration date |
| createdAt | timestamp | NOT NULL, DEFAULT NOW() | Purchase date |

### Payments

Records payment transactions.

```typescript
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentMethod: text("payment_method").notNull(), // "stripe", "crypto", etc.
  status: text("status").notNull(), // "pending", "completed", "failed", "refunded"
  transactionId: text("transaction_id"), // External payment provider's transaction ID
  itemType: text("item_type").notNull(), // "subscription", "addon"
  itemId: integer("item_id"), // ID of the subscription or addon
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Unique payment identifier |
| userId | integer | NOT NULL, FOREIGN KEY, ON DELETE CASCADE | Reference to users.id |
| amount | decimal | NOT NULL | Payment amount |
| currency | text | NOT NULL, DEFAULT "USD" | Currency code |
| paymentMethod | text | NOT NULL | Payment method |
| status | text | NOT NULL | Payment status |
| transactionId | text | | External transaction ID |
| itemType | text | NOT NULL | What was purchased |
| itemId | integer | | Reference to purchased item |
| createdAt | timestamp | NOT NULL, DEFAULT NOW() | Transaction date |

## Entity Relationship Diagram

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  users   │◄─────────┤  resumes │          │   jobs   │
├──────────┤  1     n ├──────────┤          ├──────────┤
│ id       │          │ id       │          │ id       │
│ username │          │ userId   │          │ title    │
│ password │          │ title    │          │ company  │
│ isAdmin  │          │ template │          │ location │
└──────────┘          │ content  │          │ type     │
      ▲               │ createdAt│          │ skills   │
      │               │ updatedAt│          │ postedAt │
      │               └──────────┘          │ expiresAt│
      │                                     │ applyUrl │
      │               ┌────────────┐        └──────────┘
      │             n │ savedJobs  │      n      ▲
      │    ┌──────────┤            │◄─────────┐  │
      │    │          │ id         │          │  │
      └────┤    userId │          │ jobId     │──┘
           │          └────────────┘
      ┌────┤                                 ┌──────────┐
      │    │            ┌────────────┐       │ payments │
      │    │         n  │applications│       ├──────────┤
      │    └───────────►│            │       │ id       │
      │                 │ id         │       │ userId   │◄──┐
      │                 │ userId     │       │ amount   │   │
      │                 │ jobId      │◄┐     │ currency │   │
      │                 │ resumeId   │ │     │ method   │   │
      │                 │ status     │ │     │ status   │   │
      │                 │ appliedAt  │ │     │ itemType │   │
      │                 │ notes      │ │     │ itemId   │   │
      │                 └────────────┘ │     │ createdAt│   │
      │                                │     └──────────┘   │
      │                                │                    │
      │    ┌────────────┐              │                    │
      │    │ addons     │              │                    │
      └───►│            │              │                    │
           │ id         │              │                    │
           │ userId     │              │                    │
           │ addonType  │              │                    │
           │ quantity   │              │                    │
           │ expiresAt  │              │                    │
           │ createdAt  │              │                    │
           └────────────┘              │                    │
                                       │                    │
           ┌────────────┐              │                    │
           │subscriptions│             │                    │
      ┌───►│            │              │                    │
      │    │ id         │              │                    │
      │    │ userId     │              │                    │
      │    │ planType   │              │                    │
      │    │ status     │              │                    │
      │    │ startDate  │              │                    │
      │    │ endDate    │              │                    │
      │    │ autoRenew  │              │                    │
      │    │ createdAt  │              │                    │
      └────┴────────────┘              │                    │
                                       │                    │
                                       └────────────────────┘
```

## Database Connection

The application connects to PostgreSQL using the connection string in the `DATABASE_URL` environment variable:

```typescript
// server/db.ts
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

## Storage Interface

The application provides a storage interface with two implementations:

1. `MemStorage`: In-memory storage for development/testing
2. `DatabaseStorage`: Actual PostgreSQL implementation

Both implement the `IStorage` interface defined in `server/storage.ts`.

## Database Migrations

Database schema changes should be managed using Drizzle Kit. The project uses the `drizzle-orm` and `drizzle-zod` packages for schema definition and validation.

To update the database schema:

1. Modify the schema in `shared/schema.ts`
2. Run `npm run db:push` to push schema changes to the database

## Schema Types

For each table, the schema defines several TypeScript types:

1. Insert schema (using `createInsertSchema` from drizzle-zod)
2. Insert type (using `z.infer<typeof insertSchema>`)
3. Select type (using `typeof table.$inferSelect`)

Example:

```typescript
export const resumeSchema = createInsertSchema(resumes).pick({
  title: true,
  template: true,
  content: true,
});

export type InsertResume = z.infer<typeof resumeSchema>;
export type Resume = typeof resumes.$inferSelect;
```

## Data Validation

Input validation is performed using Zod schemas derived from the Drizzle schema, ensuring type safety between the API and database layers.

## Session Storage

The application uses Express sessions with PostgreSQL as the session store:

```typescript
constructor() {
  // Initialize session store with PostgreSQL
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  this.sessionStore = new PostgresSessionStore({
    pool,
    createTableIfMissing: true,
  });
}
```

This creates a `session` table to store user sessions.