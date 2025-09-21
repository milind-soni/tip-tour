# Supabase Waitlist Setup

## Current Status
- ✅ Supabase integration is ready
- ✅ API route created at `/api/waitlist`
- ✅ Waitlist form component with proper error handling
- ✅ Uses SAME environment variables as your index.html
- ✅ Will work with your existing Netlify deployment setup

## Environment Variables (Same as index.html)

The Next.js app uses the **exact same environment variables** as your `index.html`:

```bash
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### For Local Development (Optional)
Create `.env.local` in `apps/website/` directory:

```bash
# apps/website/.env.local
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Netlify Deployment
Since this uses the same environment variables as your `index.html`, it will automatically work with your existing Netlify deployment! Just make sure your Netlify environment variables are set to:

- `VITE_SUPABASE_URL` 
- `VITE_SUPABASE_ANON_KEY`

## Database Table (Already Exists)
The code uses the same `waitlist` table as your `index.html`:
- `email` (text, unique)
- `source` (text) - will show "nextjs_landing_page" vs "landing_page"
- `metadata` (jsonb)
- `created_at` (timestamp, default now())

## Benefits Over index.html
✅ **Same database** - pushes to identical waitlist table
✅ **Same credentials** - uses your existing environment variables  
✅ **Better UX** - loading states, proper error handling
✅ **TypeScript** - type safety and better development experience
✅ **Modern stack** - Next.js, React, Tailwind CSS
✅ **No deployment changes** - works with existing Netlify setup

## Demo Mode
Without Supabase credentials, the form will:
- Still accept email submissions
- Show success message: "Thanks for your interest! (Demo mode)"
- Log emails to console for testing
