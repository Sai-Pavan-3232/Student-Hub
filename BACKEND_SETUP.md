# StudentHubConnect - Backend Setup Guide

This guide walks you through setting up the backend for StudentHubConnect, which uses **Express.js**, **Supabase** (PostgreSQL), and **Drizzle ORM**.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) installed
- **npm** or **yarn** package manager
- A **Supabase** account (free tier works fine)
- **Git** installed (for version control)

---

## 🚀 Step-by-Step Backend Setup

### Step 1: Install Dependencies

From the project root directory, install all required packages:

```bash
npm install
```

This will install:
- **Express.js** - Web framework for the API server
- **Supabase Client** - For database and authentication
- **Drizzle ORM** - Type-safe database ORM
- **TypeScript** - For type safety
- **Other dependencies** - Session management, validation, etc.

---

### Step 2: Create Environment Files

#### 2.1 Create `.env` file (Server-side configuration)

Copy the example environment file:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

#### 2.2 Configure `.env` with your Supabase credentials

Open `.env` and update the following values:

```env
# Database connection (Supabase Postgres)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Session secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-change-this

# Server port
PORT=5000

# Supabase public configuration (for client)
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]

# Supabase server configuration (PRIVATE - never commit!)
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Enable admin routes (optional, for development only)
ENABLE_ADMIN_ROUTES=true
```

---

### Step 3: Get Supabase Credentials

#### 3.1 Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: StudentHubConnect
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"** and wait for setup to complete

#### 3.2 Get API Keys

Once your project is ready:

1. Go to **Settings → API** in the Supabase dashboard
2. Copy the following values:

   - **Project URL** → Use for `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

#### 3.3 Get Database Connection String

1. Go to **Settings → Database** in Supabase dashboard
2. Scroll to **Connection String → URI**
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with your database password
5. Use this for `DATABASE_URL` in your `.env` file

---

### Step 4: Configure Client Environment

The client (frontend) needs its own environment file:

#### 4.1 Create `client/.env.local`

```bash
# Windows PowerShell
New-Item -Path "client\.env.local" -ItemType File -Force

# macOS/Linux
touch client/.env.local
```

#### 4.2 Add Supabase public credentials

Open `client/.env.local` and add:

```env
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

> ⚠️ **Important**: Never commit `.env` or `client/.env.local` to Git! They're already in `.gitignore`.

---

### Step 5: Verify Supabase Connection

Test if your backend can connect to Supabase:

```bash
npm run verify:supabase
```

**Expected output:**
```
✓ Supabase admin API reachable.
```

If you see an error:
- Double-check your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Ensure your Supabase project is active
- Check your internet connection

---

### Step 6: Set Up Database Schema (Drizzle Migrations)

#### 6.1 Check Current Migration Status

```bash
npm run migrate:status
```

#### 6.2 Generate Migrations (if needed)

If you've modified the schema in `shared/schema.ts`:

```bash
npm run migrate:generate -- --name initial_schema
```

#### 6.3 Push Migrations to Database

Apply migrations to your Supabase database:

```bash
npm run migrate:push
```

This will create all necessary tables in your Supabase PostgreSQL database.

---

### Step 7: Start the Backend Server

#### Option A: Run Backend Only

```bash
npm run dev:server
```

The server will start on **http://localhost:5000**

#### Option B: Run Backend + Frontend Together

```bash
npm run dev:all
```

This runs:
- **Frontend (Vite)**: http://localhost:5176
- **Backend (Express)**: http://localhost:5000

---

### Step 8: Test the Backend

#### 8.1 Test Health Endpoint

Open your browser or use curl:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-01T10:38:17.000Z"
}
```

#### 8.2 Test Admin Routes (if enabled)

If `ENABLE_ADMIN_ROUTES=true` in your `.env`:

```bash
# Get all users
curl http://localhost:5000/api/admin/users

# Get stats
curl http://localhost:5000/api/admin/stats
```

---

## 🗂️ Backend Architecture Overview

```
server/
├── index.ts           # Main server entry point
├── routes.ts          # API route definitions
├── db.ts              # Database connection (Drizzle)
├── supabase.ts        # Supabase client configuration
├── storage.ts         # File storage operations
├── seed.ts            # Database seeding scripts
├── static.ts          # Static file serving
└── vite.ts            # Vite integration for dev

shared/
└── schema.ts          # Drizzle database schema

migrations/
└── [timestamp]_*.sql  # Database migration files
```

---

## 🔧 Common Backend Commands

| Command | Description |
|---------|-------------|
| `npm run dev:server` | Start backend server only |
| `npm run dev:all` | Start both frontend and backend |
| `npm run verify:supabase` | Test Supabase connection |
| `npm run migrate:status` | Check migration status |
| `npm run migrate:generate` | Generate new migration |
| `npm run migrate:push` | Apply migrations to database |

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
- Verify `DATABASE_URL` is correct in `.env`
- Check if your Supabase project is active
- Ensure your IP is not blocked by Supabase (check dashboard)

### Issue: "SUPABASE_SERVICE_ROLE_KEY is not defined"

**Solution:**
- Make sure you've copied the service role key from Supabase dashboard
- Verify it's set in `.env` (not `.env.example`)
- Restart the server after updating `.env`

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Change port in .env
PORT=5001

# Or kill the process using port 5000
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# macOS/Linux
lsof -ti:5000 | xargs kill
```

### Issue: "Migration failed"

**Solution:**
- Check `DATABASE_URL` is correct
- Ensure database is accessible
- Try running migrations one at a time
- Check Supabase dashboard for error logs

### Issue: "Mock database mode"

If you see warnings about mock database:
```bash
# Disable mock mode by ensuring DATABASE_URL is set
# Remove or set USE_MOCK_DB=false
```

---

## 🔐 Security Best Practices

1. **Never commit secrets**
   - `.env` and `client/.env.local` are in `.gitignore`
   - Use `.env.example` as a template only

2. **Protect service role key**
   - Only use `SUPABASE_SERVICE_ROLE_KEY` on the server
   - Never expose it to the client/browser

3. **Rotate secrets regularly**
   - Change `SESSION_SECRET` periodically
   - Rotate Supabase keys if compromised

4. **Disable admin routes in production**
   - Set `ENABLE_ADMIN_ROUTES=false` in production
   - Admin routes expose sensitive data

5. **Use environment-specific configs**
   - Development: `.env.local`
   - Production: Use environment variables from hosting platform

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## ✅ Next Steps

After completing backend setup:

1. ✅ Backend server running on port 5000
2. ✅ Database connected to Supabase
3. ✅ Migrations applied
4. ✅ Environment variables configured

**You're ready to start developing!**

Run the full stack:
```bash
npm run dev:all
```

Then open **http://localhost:5176** in your browser.

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Verify all environment variables are set correctly
4. Check Supabase dashboard for database/API issues

Happy coding! 🚀
