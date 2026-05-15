# API Specification

## Base URL

```
Production: https://api.example.com/api
Development: http://localhost:5000/api
```

---

## Authentication

Currently, no authentication is required. The API uses a YouTube API key configured on the backend.

---

## Endpoints

### 1. Get Playlist Details

Fetches complete playlist information including all videos and duration statistics.

**Endpoint:**
```
GET /api/playlist/:playlistId
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| playlistId | string | URL path | Yes | YouTube playlist ID (e.g., PLxxxxx) |

**Request Example:**
```bash
curl http://localhost:5000/api/playlist/PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "playlist": {
      "id": "PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
      "title": "Top 10 JavaScript Tips",
      "description": "Learn the best JavaScript practices",
      "thumbnail": "https://i.ytimg.com/vi/xxxxx/maxresdefault.jpg",
      "itemCount": 10,
      "publishedAt": "2023-01-15T10:30:00Z",
      "channelTitle": "Code Masters"
    },
    "videos": [
      {
        "id": "dQw4w9WgXcQ",
        "title": "Tips for Better Code",
        "duration": 480,
        "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
      },
      {
        "id": "9bZkp7q19f0",
        "title": "Advanced Techniques",
        "duration": 720,
        "thumbnail": "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg"
      }
    ],
    "statistics": {
      "totalVideos": 10,
      "totalDurationSeconds": 6000,
      "totalDurationFormatted": "1h 40m",
      "speedAdjusted": {
        "1x": "1h 40m",
        "1.25x": "1h 20m",
        "1.5x": "1h 7m",
        "2x": "50m"
      }
    }
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid playlist ID format:
```json
{
  "success": false,
  "error": "Invalid playlist ID format",
  "status": 400
}
```

**404 Not Found** - Playlist doesn't exist:
```json
{
  "success": false,
  "error": "Playlist not found",
  "status": 404
}
```

**403 Forbidden** - API key issues:
```json
{
  "success": false,
  "error": "Method doesn't allow unregistered callers. Please use API Key or other form of API consumer identity to call this API.",
  "status": 403
}
```

**429 Too Many Requests** - Rate limit exceeded:
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "status": 429
}
```

**500 Internal Server Error** - Server error:
```json
{
  "success": false,
  "error": "Internal server error. Please try again later.",
  "status": 500
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Whether request was successful |
| data | object | Contains playlist, videos, and statistics |
| data.playlist | object | Playlist metadata |
| data.videos | array | Array of video objects |
| data.statistics | object | Duration statistics and calculations |
| error | string | Error message (only on failure) |
| status | number | HTTP status code |

---

### 2. Health Check

Verifies backend is running.

**Endpoint:**
```
GET /health
```

**Success Response (200 OK):**
```json
{
  "status": "OK",
  "message": "Backend server is running"
}
```

---

## Request/Response Details

### Playlist Object
```javascript
{
  "id": string,              // YouTube playlist ID (PLxxxxx)
  "title": string,           // Playlist title
  "description": string,     // Playlist description (can be empty)
  "thumbnail": string,       // High-resolution thumbnail URL
  "itemCount": number,       // Total number of videos in playlist
  "publishedAt": string,     // ISO 8601 timestamp of publication
  "channelTitle": string     // Name of the channel that owns the playlist
}
```

### Video Object
```javascript
{
  "id": string,              // YouTube video ID
  "title": string,           // Video title
  "duration": number,        // Video duration in seconds
  "thumbnail": string        // Video thumbnail URL
}
```

### Statistics Object
```javascript
{
  "totalVideos": number,           // Count of videos in playlist
  "totalDurationSeconds": number,  // Total duration in seconds
  "totalDurationFormatted": string, // Formatted as "Xh Xm Xs" (e.g., "1h 40m")
  "speedAdjusted": {
    "1x": string,                  // Duration at normal speed
    "1.25x": string,               // Duration at 1.25x speed
    "1.5x": string,                // Duration at 1.5x speed
    "2x": string                   // Duration at 2x speed
  }
}
```

---

## Duration Calculation Formula

For a playlist with total duration `D` seconds:

- **1x speed**: D seconds
- **1.25x speed**: D / 1.25 = D × 0.8 seconds
- **1.5x speed**: D / 1.5 ≈ D × 0.667 seconds
- **2x speed**: D / 2 = D × 0.5 seconds

Example:
```
Total: 3600 seconds (1 hour)

1x:    3600 / 1    = 3600s = 1h 0m
1.25x: 3600 / 1.25 = 2880s = 48m
1.5x:  3600 / 1.5  = 2400s = 40m
2x:    3600 / 2    = 1800s = 30m
```

---

## Error Codes

| Code | Meaning | Resolution |
|------|---------|-----------|
| 400 | Bad Request | Check playlist ID format |
| 403 | Forbidden | Verify YouTube API key is configured |
| 404 | Not Found | Verify playlist ID is correct |
| 429 | Too Many Requests | Wait before retrying |
| 500 | Internal Server Error | Contact support or check backend logs |

---

## Rate Limiting

Currently no rate limiting implemented. Consider implementing:

```javascript
// Example: 100 requests per 15 minutes per IP
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api', limiter);
```

---

## CORS Configuration

**Allowed Origins:**
- `http://localhost:5173` (Development)
- `https://yourdomain.com` (Production)

**Allowed Methods:**
- `GET`
- `POST`
- `OPTIONS`

**Allowed Headers:**
- `Content-Type`
- `Authorization`

---

## Examples

### cURL
```bash
# Get playlist details
curl -X GET http://localhost:5000/api/playlist/PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf

# Check health
curl http://localhost:5000/health
```

### JavaScript/Fetch
```javascript
// Fetch playlist details
const response = await fetch(
  'http://localhost:5000/api/playlist/PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf'
);
const data = await response.json();
console.log(data);
```

### JavaScript/Axios
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000
});

// Fetch playlist
const { data } = await apiClient.get('/playlist/PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf');
console.log(data);
```

### Python
```python
import requests

url = 'http://localhost:5000/api/playlist/PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf'
response = requests.get(url)
data = response.json()
print(data)
```

---

## Testing

### Manual Testing
1. Start backend: `cd backend && npm run dev`
2. Test endpoint: `curl http://localhost:5000/api/playlist/PLxxxxx`
3. Use a real playlist ID from YouTube

### Automated Testing
```javascript
describe('Playlist API', () => {
  test('should return playlist details', async () => {
    const response = await fetch('/api/playlist/PLxxxxx');
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });
});
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial API release |
| 1.1.0 | TBD | Add authentication |
| 1.2.0 | TBD | Add rate limiting |

---

## Support

For issues or questions:
1. Check the error message and status code
2. Review this documentation
3. Check backend logs: `npm run dev`
4. Verify YouTube API key configuration
5. Contact support

---
