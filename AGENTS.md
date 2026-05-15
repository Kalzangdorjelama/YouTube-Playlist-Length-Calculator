# YouTube Playlist Length Calculator - Project Architecture

A full-stack web application that calculates the total duration of YouTube playlists with playback speed adjustments.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 18.2.0 |
| **Vite** | Build Tool & Dev Server | 5.4.21 |
| **Tailwind CSS** | Styling | 3.3.6 |
| **Axios** | HTTP Client | 1.6.0 |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime | v24.12.0 |
| **Express** | Web Framework | 4.18.2 |
| **Axios** | HTTP Client | 1.6.0 |
| **dotenv** | Environment Variables | 16.3.1 |
| **Nodemon** | Dev Auto-reload | 3.1.14 |

### External APIs
| Service | Purpose |
|---------|---------|
| **YouTube Data API v3** | Fetch playlist & video metadata |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Bun** | Package Manager & Runtime |
| **Git** | Version Control |

---

## 📁 Folder Structure

```
ytLength/
├── backend/                              # Node.js + Express API Server
│   ├── routes/
│   │   └── playlistRoutes.js            # API endpoint definitions
│   ├── controllers/
│   │   └── playlistController.js        # Request handlers
│   ├── services/
│   │   └── youtubeService.js            # YouTube API integration logic
│   ├── utils/
│   │   ├── durationParser.js            # Duration conversion utilities
│   │   └── helpers.js                   # Helper functions
│   ├── server.js                        # Express app initialization
│   ├── .env                             # Environment variables (DO NOT COMMIT)
│   ├── .env.example                     # Environment template
│   ├── package.json                     # Backend dependencies
│   └── README.md                        # Backend documentation
│
├── frontend/                             # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlaylistInput.jsx        # URL input form
│   │   │   ├── Results.jsx              # Results display
│   │   │   ├── Toast.jsx                # Toast notifications
│   │   │   ├── Loading.jsx              # Loading skeletons
│   │   │   ├── Layout.jsx               # Page layout wrapper
│   │   │   └── Utils.jsx                # Utility components
│   │   ├── pages/
│   │   │   └── Dashboard.jsx            # Main page
│   │   ├── hooks/
│   │   │   └── useCustom.js             # Custom React hooks
│   │   ├── services/
│   │   │   └── api.js                   # API client
│   │   ├── utils/
│   │   │   └── helpers.js               # Utility functions
│   │   ├── App.jsx                      # Root component
│   │   ├── main.jsx                     # React entry point
│   │   └── index.css                    # Global styles
│   ├── public/                          # Static assets
│   ├── .env.local                       # Frontend env variables
│   ├── .env.example                     # Env template
│   ├── vite.config.js                   # Vite configuration
│   ├── tailwind.config.js               # Tailwind CSS config
│   ├── postcss.config.js                # PostCSS config
│   ├── package.json                     # Frontend dependencies
│   └── README.md                        # Frontend documentation
│
├── docs/                                 # Project documentation
│   ├── ARCHITECTURE.md                  # Architecture overview
│   ├── API_SPEC.md                      # API endpoints
│   └── SETUP_GUIDE.md                   # Detailed setup
│
├── README.md                             # Project overview
├── SETUP.md                              # Quick setup guide
├── QUICKSTART.md                         # Quick start guide
├── DEPLOY.md                             # Deployment guide
├── .gitignore                            # Git ignore rules
└── setup.sh / setup.bat                 # Setup scripts
```

---

## 🏗️ Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        React SPA (React 18 + Vite)                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Dashboard  │  │  Input     │  │  Results   │    │  │
│  │  │   Page     │  │   Form     │  │  Display   │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Axios HTTP Client (port 5173)              │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        HTTP/CORS      │ /api/playlist/:playlistId
                       ▼
┌──────────────────────────────────────────────────────────────┐
│              BACKEND SERVER (Express)                        │
│              Port 5000                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                        │  │
│  │  GET /api/playlist/:playlistId                      │  │
│  └───────────────┬────────────────────────────────────┘  │
│                  │                                         │
│  ┌───────────────▼────────────────────────────────────┐  │
│  │  Controller Layer                                  │  │
│  │  - Request validation                              │  │
│  │  - Error handling                                  │  │
│  └───────────────┬────────────────────────────────────┘  │
│                  │                                         │
│  ┌───────────────▼────────────────────────────────────┐  │
│  │  Service Layer (youtubeService.js)                │  │
│  │  - Fetch playlist metadata                         │  │
│  │  - Fetch all video IDs (pagination)                │  │
│  │  - Fetch video durations (batch)                   │  │
│  │  - Calculate statistics                            │  │
│  └───────────────┬────────────────────────────────────┘  │
│                  │                                         │
│  ┌───────────────▼────────────────────────────────────┐  │
│  │  YouTube Data API v3                              │  │
│  │  - googleapis.com/youtube/v3/playlists            │  │
│  │  - googleapis.com/youtube/v3/playlistItems        │  │
│  │  - googleapis.com/youtube/v3/videos               │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → Paste YouTube playlist URL
2. **Extract ID** → Parse `list=PLxxxxx` from URL
3. **API Request** → POST to backend `/api/playlist/:playlistId`
4. **Fetch Metadata** → Get playlist title, thumbnail, channel
5. **Fetch Videos** → Get all video IDs with pagination
6. **Fetch Durations** → Batch fetch video durations (50 per request)
7. **Calculate Stats** → Compute total time and speed adjustments
8. **Response** → Return data to frontend
9. **Display Results** → Render on UI with formatters

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** v24.12.0 or higher
- **npm** 10.0.0 or higher
- **YouTube API Key** (free from Google Cloud Console)

### Quick Start

#### 1. Clone & Install
```bash
# Backend
cd backend
bun install

# Frontend
cd frontend
bun install
```

#### 2. Configure YouTube API Key
```bash
# Get API key from: https://console.cloud.google.com
# 1. Create project
# 2. Enable "YouTube Data API v3"
# 3. Create API Key (Credentials → API Key)
# 4. Remove API restrictions (set to "Unrestricted" or specific to YouTube API v3)
```

#### 3. Set Environment Variables

**Backend** (`backend/.env`):
```
YOUTUBE_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend/.env.local`):
```
VITE_API_URL=/api
```

#### 4. Run Servers
```bash
# Terminal 1: Backend (port 5000)
cd backend && bun run dev

# Terminal 2: Frontend (port 5173)
cd frontend && bun run dev
```

#### 5. Open App
```
http://localhost:5173
```

---

## 🚀 Development Commands

### Backend
```bash
cd backend

bun run dev              # Start with auto-reload (Nodemon)
bun run build            # Build for production
bun start                # Run production build
bun test                 # Run tests (if configured)
```

### Frontend
```bash
cd frontend

bun run dev              # Start dev server (Vite)
bun run build            # Production build
bun run preview          # Preview production build
```

---

## 📡 API Specification

### Endpoint: Get Playlist Details

**Request:**
```
GET /api/playlist/:playlistId
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "playlist": {
      "id": "PLxxxxx",
      "title": "My Awesome Playlist",
      "description": "Description here",
      "thumbnail": "https://...",
      "itemCount": 25,
      "publishedAt": "2023-01-01T00:00:00Z",
      "channelTitle": "Channel Name"
    },
    "videos": [
      {
        "id": "video_id_1",
        "title": "Video Title",
        "duration": 300,
        "thumbnail": "https://..."
      }
    ],
    "statistics": {
      "totalVideos": 25,
      "totalDurationSeconds": 7500,
      "totalDurationFormatted": "2h 5m",
      "speedAdjusted": {
        "1x": "2h 5m",
        "1.25x": "1h 40m",
        "1.5x": "1h 24m",
        "2x": "1h 2m"
      }
    }
  }
}
```

**Error Response (400/403/500):**
```json
{
  "success": false,
  "error": "Error message here",
  "status": 400
}
```

---

## 🎯 Key Features

- ✅ Paste YouTube playlist URL
- ✅ Extract playlist ID automatically
- ✅ Fetch all videos with pagination support
- ✅ Calculate total duration
- ✅ Show durations at different playback speeds (1x, 1.25x, 1.5x, 2x)
- ✅ Save search history in localStorage
- ✅ Dark mode toggle
- ✅ Responsive mobile UI
- ✅ Loading skeletons
- ✅ Error handling with toast notifications
- ✅ Glassmorphism design

---

## 🛡️ Code Standards

### React Components
- **File naming**: `PascalCase.jsx` (e.g., `PlaylistInput.jsx`)
- **Components**: Functional with hooks only
- **Props**: Typed with JSDoc comments
- **No side effects**: Keep components pure when possible

### Node.js/Express
- **File naming**: `camelCase.js`
- **Modules**: ES6 imports/exports
- **Error handling**: Try-catch with meaningful messages
- **Async**: Always await async operations

### CSS/Tailwind
- Use semantic tokens: `bg-background`, `text-muted-foreground`
- Use `gap-*` for spacing, never `space-x-*`/`space-y-*`
- Dark mode automatic with `dark:` variants
- No hardcoded colors unless necessary

---

## 📚 Project Structure Benefits

| Aspect | Benefit |
|--------|---------|
| **Separated Backend/Frontend** | Independent scaling, deployment flexibility |
| **Service Layer** | Reusable business logic, easy testing |
| **Controller Layer** | Clean HTTP request handling, validation |
| **Hooks Abstraction** | Reusable component logic, state management |
| **Utility Functions** | DRY principle, consistent formatting |
| **Environment Variables** | Secure configuration, dev/prod separation |

---

## 🔍 File Responsibilities

| File | Responsibility |
|------|-----------------|
| `server.js` | Express app initialization, middleware setup |
| `playlistRoutes.js` | HTTP route definitions |
| `playlistController.js` | Request handling, validation |
| `youtubeService.js` | YouTube API calls, data orchestration |
| `durationParser.js` | ISO 8601 ↔ seconds conversion |
| `Dashboard.jsx` | Main page logic, state management |
| `PlaylistInput.jsx` | Form input, URL validation |
| `Results.jsx` | Results display, formatting |
| `useCustom.js` | Shared hooks (toasts, dark mode, history) |
| `api.js` | Axios instance, API calls |

---

## 🚨 Common Issues & Solutions

### Issue: API Key Error (403 Forbidden)
**Solution**: 
- Go to Google Cloud Console
- Click on API key
- Remove "API restrictions" or set to "YouTube Data API v3"
- Remove "Application restrictions"
- Restart backend

### Issue: CORS Error
**Solution**:
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check frontend `.env.local` has correct `VITE_API_URL`

### Issue: Port Already in Use
**Solution**:
```bash
# Windows
Get-Process -Name node | Stop-Process -Force

# Mac/Linux
pkill -f node
```

---

## 📖 For New Developers

1. **Read** this file first
2. **Read** `README.md` for project overview
3. **Read** `SETUP.md` for installation
4. **Check** `backend/README.md` and `frontend/README.md`
5. **Run** `bun run dev` in both directories
6. **Test** with a YouTube playlist URL

---

## 🔐 Security Notes

- ⚠️ **Never commit** `.env` files
- ⚠️ **Never expose** API keys in frontend code
- ⚠️ **Validate** all user inputs on backend
- ✅ **Use** environment variables for secrets
- ✅ **Enable** CORS properly (not `*` in production)

---

## 📝 Maintenance

- Keep dependencies updated: `bun update`
- Review logs for errors
- Monitor API quota usage
- Clear cache if stuck: Delete `node_modules`, `package-lock.json`, reinstall

---

