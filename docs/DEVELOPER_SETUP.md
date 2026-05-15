# Developer Setup Guide

## Complete Step-by-Step Setup

This guide will help you set up the YouTube Playlist Length Calculator for development.

---

## Prerequisites

Before you start, ensure you have:

- **Bun** ([Download](https://bun.sh)) - Fast JavaScript runtime & package manager
  ```bash
  # Check version
  bun --version           # Should show latest version
  ```

- **Git** ([Download](https://git-scm.com))
  ```bash
  git --version
  ```

- **Text Editor** (Recommended: [VS Code](https://code.visualstudio.com))

- **YouTube API Key** (Free from Google Cloud Console - see step below)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ytLength.git
cd ytLength
```

---

## Step 2: Set Up YouTube API Key

### Get Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Search for "YouTube Data API v3"
4. Click **Enable** button
5. Go to **Credentials** in the left sidebar
6. Click **+ Create Credentials** → **API Key**
7. Copy your API key
8. (Optional) Click on the key and:
   - Under **API restrictions** → Select **YouTube Data API v3**
   - Under **Application restrictions** → Select **None** (for development)
9. Save the key somewhere safe

---

## Step 3: Install Backend Dependencies

```bash
cd backend
bun install
```

Expected output shows all packages installing without errors.

### Create Backend `.env` File

```bash
# Copy template
cp .env.example .env

# Edit .env and add your YouTube API key
# Windows (Notepad)
notepad .env

# Mac/Linux (VS Code)
code .env
```

**Add your API key:**
```
YOUTUBE_API_KEY=your_actual_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Verify Backend Setup

```bash
# Run once to check
bun run dev

# Wait for message: "🚀 Server running on http://localhost:5000"
# Press Ctrl+C to stop
```

---

## Step 4: Install Frontend Dependencies

```bash
cd ../frontend
bun install
```

### Create Frontend `.env.local` File

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local
# Windows
notepad .env.local

# Mac/Linux
code .env.local
```

**Content:**
```
VITE_API_URL=/api
```

### Verify Frontend Setup

```bash
# Run once to check
bun run dev

# Wait for message about Vite listening on http://localhost:5173
# Press Ctrl+C to stop
```

---

## Step 5: Start Development Servers

Now you're ready to run the full application!

### Terminal 1: Backend

```bash
cd backend
bun run dev
```

Expected output:
```
> nodemon server.js
[nodemon] watching path(s): *.*
🚀 Server running on http://localhost:5000
```

### Terminal 2: Frontend

Open a **new terminal** in the project root:

```bash
cd frontend
bun run dev
```

Expected output:
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## Step 6: Open in Browser

Open your browser and go to:

```
http://localhost:5173
```

You should see the YouTube Playlist Length Calculator app!

---

## Testing the App

### Test with a Real Playlist

1. Open a YouTube playlist (any public playlist)
2. Copy the URL (e.g., `https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf`)
3. Paste into the app's input field
4. Click "Calculate"
5. Wait for results to load
6. See the total duration and speed adjustments

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Port 5000 already in use" | Kill Node process: `Get-Process -Name node \| Stop-Process -Force` |
| "Port 5173 already in use" | Vite auto-switches to next port (5174, 5175...) |
| "API Error 403" | Check YouTube API key in `backend/.env` |
| "Network Error" | Ensure both servers are running and communicating |
| Blank page on frontend | Check browser console (F12) for errors |

---

## Development Workflow

### Making Changes

**Frontend:**
```bash
# Make changes to files in frontend/src/
# Hot reload happens automatically
# Changes appear instantly in browser
```

**Backend:**
```bash
# Make changes to files in backend/
# Nodemon automatically restarts server
# Refresh browser to see changes
```

### Project Structure Quick Reference

```
Frontend entry:    frontend/src/main.jsx
Frontend root:     frontend/src/App.jsx
Main page:         frontend/src/pages/Dashboard.jsx
API client:        frontend/src/services/api.js
Custom hooks:      frontend/src/hooks/useCustom.js

Backend entry:     backend/server.js
API routes:        backend/routes/playlistRoutes.js
Controllers:       backend/controllers/playlistController.js
Services:          backend/services/youtubeService.js
```

---

## Available Commands

### Backend

```bash
cd backend

bun run dev      # Start with auto-reload (development)
bun start        # Run production build
bun test         # Run tests (if configured)
```

### Frontend

```bash
cd frontend

bun run dev      # Start Vite dev server
bun run build    # Build for production
bun run preview  # Preview production build locally
```

---

## Environment Variables Reference

### Backend (`.env`)

| Variable | Default | Purpose |
|----------|---------|---------|
| YOUTUBE_API_KEY | (required) | YouTube Data API key |
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment |
| CORS_ORIGIN | http://localhost:5173 | Allowed frontend origin |

### Frontend (`.env.local`)

| Variable | Default | Purpose |
|----------|---------|---------|
| VITE_API_URL | /api | Backend API base URL |

---

## VS Code Extensions (Recommended)

Install these for better development experience:

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **Prettier** - esbenp.prettier-vscode
- **ESLint** - dbaeumer.vscode-eslint

---

## Debugging Tips

### Frontend Debugging

1. Open Browser DevTools: **F12**
2. Check **Console** tab for errors
3. Use **Debugger** tab to add breakpoints
4. Check **Network** tab for API calls
5. Install React DevTools extension for component inspection

### Backend Debugging

1. Add console logs:
   ```javascript
   console.log('Debug info:', variable);
   ```
2. Check terminal output
3. Verify `.env` is correct
4. Check YouTube API quota on Google Cloud Console

### Testing API Directly

Use curl or browser DevTools Network tab:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test playlist endpoint
curl "http://localhost:5000/api/playlist/PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"
```

---

## Next Steps

1. **Read** `CONTRIBUTING.md` to understand development guidelines
2. **Explore** `docs/ARCHITECTURE.md` for technical details
3. **Check** `docs/API_SPEC.md` for API documentation
4. **Browse** the codebase in `backend/` and `frontend/`
5. **Make** a small change to test your setup

---

## Common Issues & Solutions

### "Cannot find module" Error

```bash
# Clear cache and reinstall
rm -rf node_modules
bun install
```

### Changes Not Appearing

**Frontend:**
- Hard refresh browser: **Ctrl+Shift+R** (or **Cmd+Shift+R** on Mac)
- Clear browser cache: DevTools → Settings → Clear site data

**Backend:**
- Check terminal for restart message
- Verify file was saved
- Look for syntax errors

### API Returns 403 Error

```bash
# Verify in Google Cloud Console
1. Go to Credentials
2. Click your API key
3. Check "API restrictions" is set to YouTube Data API v3
4. Check "Application restrictions" is "None" or includes your IP
5. Restart backend after changes
```

### Port Conflicts

```bash
# Find process using port
netstat -ano | findstr :5000    # Windows
lsof -i :5000                   # Mac/Linux

# Kill process
taskkill /PID <PID> /F          # Windows
kill -9 <PID>                   # Mac/Linux
```

---

## Getting Help

1. Check the error message carefully
2. Search in project documentation
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Review `.env` configuration
6. Ask in project discussions

---

## Performance Notes

- Playlists with 50+ videos use pagination
- Video batches are fetched 50 at a time
- All calculations happen client-side
- Frontend caches results in browser

---

## Next: Contributing

Once you're set up, check out `CONTRIBUTING.md` to start making contributions!

---

Happy coding! 🚀
