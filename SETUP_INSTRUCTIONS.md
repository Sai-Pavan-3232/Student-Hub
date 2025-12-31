# Student-Hub Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Your `.env.local` file is already created with Supabase credentials.

### 3. Start Dev Server
```bash
npm run dev
```

The site will automatically open at **http://localhost:5176**

### 4. Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

## Fallback: If Vite Doesn't Work

Run the Node.js server instead:
```bash
node server.js
```

Then open **http://localhost:3000** in your browser.

## Supabase Configuration

Your `.env.local` already contains:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

**Do NOT commit `.env.local` to git** — it's protected in `.gitignore`.

## Project Structure

```
.
├── index.html              # Main entry point
├── src/
│   ├── js/
│   │   ├── auth.js        # Authentication logic
│   │   ├── db.js          # Database operations
│   │   └── storage.js     # Storage operations
│   └── css/               # Stylesheets
├── .env.local             # (Local only, not committed)
├── .env.example           # (Public template)
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
└── server.js              # Fallback Node.js server
```

## Troubleshooting

**Port 5176 already in use?**
- Edit `vite.config.js` and change `port: 5176` to a different port

**Supabase not connecting?**
- Verify `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check browser console (F12) for errors

**Vite not starting?**
- Use fallback: `node server.js` on port 3000

## Support

- Vite Docs: https://vitejs.dev/
- Supabase Docs: https://supabase.com/docs
