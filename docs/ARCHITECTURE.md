# Architecture Documentation

## Project Overview

YouTube Playlist Length Calculator is a full-stack web application that helps users quickly calculate the total duration of YouTube playlists and see how long they would take to watch at different playback speeds.

## High-Level Architecture

### Three-Tier Architecture

```
Presentation Layer (Frontend)
    ↓ (HTTP/JSON)
Business Logic Layer (Backend API)
    ↓ (HTTP/REST)
External Service Layer (YouTube API)
```

## Frontend Architecture

### Technology Stack
- **React 18.2.0** - Component-based UI framework
- **Vite 5.4.21** - Modern build tool with fast dev server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios 1.6.0** - Promise-based HTTP client

### Component Hierarchy

```
App (Root)
├── Header
│   ├── Logo
│   └── DarkModeToggle
├── Dashboard (Main Page)
│   ├── PlaylistInput (Form)
│   ├── Results (Display)
│   │   ├── PlaylistHeader
│   │   ├── StatCard (x5)
│   │   └── DurationCard
│   └── PlaylistHistory (Sidebar)
├── Footer
└── ToastContainer (Global)
```

### State Management

**Global State:**
- Dark mode preference (via `useDarkMode` hook + localStorage)
- Toast notifications (via `useToast` hook)
- Search history (via `usePlaylistHistory` hook + localStorage)

**Component Local State:**
- Loading, error, results (in Dashboard)
- Form input validation (in PlaylistInput)

### Key Features

| Feature | Location | How it Works |
|---------|----------|-------------|
| URL Input | PlaylistInput | Validates YouTube playlist URLs |
| ID Extraction | helpers.js | Regex extraction from URL |
| Dark Mode | useDarkMode | CSS class toggle + localStorage |
| History | usePlaylistHistory | localStorage persistence (max 10) |
| Toast Notifications | useToast | Auto-dismiss after 3s |
| Loading State | CardSkeleton | Shimmer effect while loading |
| Error Handling | Dashboard | Shows toast on error |

---

## Backend Architecture

### Technology Stack
- **Node.js v24.12.0** - JavaScript runtime
- **Express 4.18.2** - Minimalist web framework
- **Axios 1.6.0** - HTTP client for API calls
- **dotenv 16.3.1** - Environment variable management
- **Nodemon 3.1.14** - Auto-restart on file changes

### Request Flow

```
HTTP Request
    ↓
[CORS Middleware]
    ↓
[Router] - playlistRoutes.js
    ↓
[Controller] - playlistController.js
    ↓
[Service] - youtubeService.js
    ↓
[YouTube API] - googleapis.com
    ↓
[Service] - Data processing
    ↓
[Controller] - Response formatting
    ↓
HTTP Response
```

### Layer Responsibilities

#### Router Layer (`playlistRoutes.js`)
- Defines HTTP endpoints
- Routes requests to controllers
- Minimal business logic

#### Controller Layer (`playlistController.js`)
- Validates incoming requests
- Calls service functions
- Formats responses
- Handles errors

#### Service Layer (`youtubeService.js`)
- YouTube API integration
- Data fetching and processing
- Complex business logic
- Pagination handling

#### Utility Layer
- `durationParser.js` - ISO 8601 duration conversion
- `helpers.js` - Reusable utility functions

### Key Processes

#### 1. Fetch Playlist Details
```
Input: Playlist ID (PLxxxxx)
    ↓
Fetch playlist metadata (title, thumbnail, channel)
    ↓
Fetch all playlist items (with pagination)
    ↓
Extract video IDs
    ↓
Fetch video details in batches of 50
    ↓
Parse durations (ISO 8601 → seconds)
    ↓
Calculate statistics (total, speeds)
    ↓
Output: Complete playlist data
```

#### 2. Pagination Strategy
- YouTube API returns max 50 items per request
- Use `nextPageToken` to fetch remaining items
- Combine all results
- Batch video details requests

#### 3. Duration Calculation
- YouTube provides durations in ISO 8601 format (e.g., PT1H20M33S)
- Convert to seconds: 3600 + 1200 + 33 = 4833
- Calculate speeds: seconds / speed_multiplier
- Format back to readable format

---

## Communication Flow

### 1. URL Input → Backend

```
User: https://www.youtube.com/playlist?list=PLxxxxx
    ↓
[Extraction] → Extract "PLxxxxx"
    ↓
[Validation] → Verify it's a valid format
    ↓
[API Call] → POST to backend
```

### 2. Backend → YouTube API

```
Request: GET https://www.googleapis.com/youtube/v3/playlists
  Params:
    - part: "snippet,contentDetails"
    - id: "PLxxxxx"
    - key: YOUTUBE_API_KEY
    ↓
[Response] → Playlist data + itemCount
```

### 3. Backend → Frontend

```
Response JSON:
{
  "playlist": {...},
  "videos": [...],
  "statistics": {
    "totalVideos": 25,
    "totalDurationSeconds": 7500,
    "speedAdjusted": {...}
  }
}
```

---

## Data Models

### Playlist Object
```javascript
{
  id: string,              // PLxxxxx
  title: string,           // Playlist name
  description: string,     // Optional
  thumbnail: string,       // High-res image URL
  itemCount: number,       // Total videos
  publishedAt: string,     // ISO 8601 date
  channelTitle: string     // Channel name
}
```

### Video Object
```javascript
{
  id: string,              // video_id
  title: string,           // Video title
  duration: number,        // Seconds
  thumbnail: string        // Video thumbnail URL
}
```

### Statistics Object
```javascript
{
  totalVideos: number,
  totalDurationSeconds: number,
  totalDurationFormatted: string,  // "2h 5m 33s"
  speedAdjusted: {
    "1x": string,
    "1.25x": string,
    "1.5x": string,
    "2x": string
  }
}
```

---

## Error Handling

### Frontend
- Try-catch blocks in API calls
- Toast notifications for errors
- Loading state management
- User-friendly error messages

### Backend
- Input validation
- YouTube API error handling
- HTTP status codes
- Structured error responses

### Common Errors
| Error | Cause | Solution |
|-------|-------|----------|
| 403 Forbidden | Invalid/missing API key | Add valid API key to .env |
| 404 Not Found | Playlist doesn't exist | Verify playlist URL |
| 400 Bad Request | Invalid input | Validate URL format |
| 429 Too Many Requests | Rate limit exceeded | Implement backoff |

---

## Security Considerations

### API Key Protection
- Never expose in frontend
- Stored only in backend `.env`
- Should have API restrictions enabled
- Implement rate limiting if public

### CORS Policy
- Only allow frontend origin
- Restrict HTTP methods (GET, POST)
- No credentials in browser

### Input Validation
- Validate URL format
- Validate playlist ID format
- Sanitize any user input

---

## Performance Optimization

### Frontend
- Lazy loading with React.lazy (if needed)
- Memoization with useMemo/useCallback
- Image optimization
- CSS minification (Tailwind)

### Backend
- Batch API requests (50 videos at a time)
- Pagination for large playlists
- HTTP response compression
- Caching YouTube metadata

### Network
- API proxy through Vite dev server
- Gzip compression
- Minimize JSON payload

---

## Deployment Considerations

### Frontend
- Build: `npm run build` → produces optimized bundle
- Host on: Vercel, Netlify, GitHub Pages, AWS S3
- Environment: `VITE_API_URL` points to backend URL

### Backend
- Host on: Heroku, Railway, DigitalOcean, AWS EC2
- Environment: `.env` with YouTube API key
- Process manager: PM2 or systemd
- Port: Configurable via `PORT` env var

### Database/Storage
- No database (stateless)
- All data comes from YouTube API
- Frontend uses localStorage for history only

---

## Future Enhancements

- [ ] User authentication (login/register)
- [ ] Save favorite playlists
- [ ] Export duration reports
- [ ] Support for YouTube channels
- [ ] Multi-language support
- [ ] Caching layer (Redis)
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Webhook notifications
- [ ] Mobile app (React Native)

---
