# 🗄️ Database Setup Instructions

## Step 1: Get Your Supabase PostgreSQL Connection String

### Option A: From Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/ktwwwzcyebddkjgdskbd

2. **Navigate to Database Settings**
   - Click on **Settings** (⚙️ icon in left sidebar)
   - Click on **Database**

3. **Find Connection String**
   - Scroll down to **Connection string** section
   - Select **URI** tab (not Transaction or Session)
   - You'll see something like:
     ```
     postgresql://postgres.ktwwwzcyebddkjgdskbd:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```

4. **Copy the Connection String**
   - Click the **Copy** button
   - **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password
   - If you don't remember your password, you can reset it on the same page

### Option B: Construct It Manually

If you know your database password, the format is:
```
postgresql://postgres.ktwwwzcyebddkjgdskbd:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Replace `[YOUR-PASSWORD]` with your actual password.

---

## Step 2: Update Your .env File

Once you have the connection string, update your `.env` file:

### Current .env (needs update):
```env
DATABASE_URL=https://ktwwwzcyebddkjgdskbd.supabase.co
SUPABASE_URL=https://ktwwwzcyebddkjgdskbd.supabase.co
```

### Updated .env (with PostgreSQL connection):
```env
# PostgreSQL Connection (for database operations)
DATABASE_URL=postgresql://postgres.ktwwwzcyebddkjgdskbd:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Supabase API URL (for client-side)
SUPABASE_URL=https://ktwwwzcyebddkjgdskbd.supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Session Secret
SESSION_SECRET=your-secret-key-here

# Server Port
PORT=5000

# Use real database (not mock)
USE_MOCK_DB=false
```

---

## Step 3: Get Supabase API Keys

You also need the Supabase API keys:

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/ktwwwzcyebddkjgdskbd

2. **Navigate to API Settings**
   - Click on **Settings** → **API**

3. **Copy the Keys**
   - **Project URL**: Already have this (https://ktwwwzcyebddkjgdskbd.supabase.co)
   - **anon public**: Copy this for `SUPABASE_ANON_KEY`
   - **service_role**: Copy this for `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## Step 4: What to Do Next

### Once you provide the connection string, I will:

1. ✅ Update your `.env` file with the correct DATABASE_URL
2. ✅ Run database migrations to create all tables
3. ✅ Restart the backend server
4. ✅ Verify the database connection
5. ✅ Test data persistence

---

## 🔐 Security Notes

- **Never commit** `.env` file to Git (it's already in `.gitignore`)
- **Keep service_role key secret** - it has admin access
- **Use environment variables** in production
- **Rotate keys** if they're ever exposed

---

## 📋 What I Need From You

Please provide:

1. **PostgreSQL Connection String**
   ```
   postgresql://postgres.ktwwwzcyebddkjgdskbd:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

2. **Supabase Anon Key** (from Settings → API)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Supabase Service Role Key** (from Settings → API)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## ⚡ Quick Command Reference

Once configured, you'll run:

```bash
# Push database schema to Supabase
npm run migrate:push

# Check migration status
npm run migrate:status

# Restart backend server
# Stop current server (Ctrl+C)
npm run dev:server
```

---

## 🎯 Expected Result

After setup:
- ✅ Data persists across server restarts
- ✅ Real PostgreSQL database in use
- ✅ All tables created in Supabase
- ✅ Can view data in Supabase dashboard
- ✅ Production-ready setup

---

**Ready when you are! Please provide the connection string and API keys.**
