Here are your two separate files: the human-written `README.md` and the complete database initialization script featuring full schema declarations, email synchronization triggers, and Row Level Security (RLS) policies.

---

### File 1: `README.md`

````markdown
# Volunteer & Job Board Platform

Hey there! 👋 This is my complete submission for the Volunteer & Job Board take-home project[cite: 1].

I focused heavily on getting the fundamentals right—securing authentication, enforcing backend roles strictly, designing robust database schemas with Row Level Security, and adding a clean, searchable public listings interface—while keeping the codebase clean and maintainable.

---

## Tech Stack & Why I Chose Them

- **Framework:** **Next.js (App Router)** — Excellent for full-stack React applications. It allows secure server-side mutations using Server Actions and fast server component rendering without needing a separate backend server.
- **Database & Auth:** **Supabase (PostgreSQL)** — Handles secure authentication out-of-the-box with password hashing and integrates smoothly with PostgreSQL row-level security.
- **Styling:** **Tailwind CSS** — Perfect for quickly designing a modern, responsive, accessible, and clean user interface.
- **Icons:** **Lucide React** — Lightweight and crisp icons used throughout the admin dashboard and public boards.

---

## Running Locally (Under 10 Minutes)

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <project-folder>
   ```
````

2. **Install dependencies:**

```bash
npm install

```

3. **Set up your environment variables:**
   Create a `.env.local` file in the root directory and configure your Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

```

4. **Initialize the Database:**
   Copy the contents of the `schema.sql` file provided in this repository and run it inside your Supabase project's SQL Editor.
5. **Run the development server:**

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scaling to 100k Listings & 50k Users

At that size, standard queries start to lag, so here is exactly how I would handle the scaling:
Optimizing Search & Indexes: I would immediately add proper indexes to high-traffic filter columns like location and created_at. For searching titles and descriptions, I’d ditch basic text matching and set up PostgreSQL’s native tsvector full-text search to keep searches lightning-fast.
Switching to Cursor Pagination: Relying on standard offset pagination (range()) becomes incredibly inefficient the deeper a user scrolls. Swapping this out for cursor-based pagination ensures that querying page 100 takes the exact same fraction of a second as page 1.
Caching the Heavy Hitters: Since job and volunteer boards are usually read-heavy, I’d introduce a caching layer. Implementing Redis or leveraging Next.js Incremental Static Regeneration (ISR) for public pages would shield our primary Postgres database from repetitive, unnecessary read loads.

---

## Tradeoffs & What's Next

- **Automated Tests:** I didn't include comprehensive Jest or Cypress automated test suites for this prototype; instead, I focused on manually validating backend authorization boundaries and direct security controls.
- **Rich Text Formatting:** Listings use plain text inputs rather than a rich markdown editor to keep things lightweight.

**What I'd do next with more time:**

- Add an application tracking view so users can review the status of jobs they've applied for.
- Implement brute-force protection and rate-limiting on authentication endpoints.
