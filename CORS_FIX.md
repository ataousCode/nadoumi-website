# CORS Fix for Backend

## Problem
The backend CORS configuration has a trailing slash issue:
- Backend allows: `'https://nadoumi.com/'` (with trailing slash)
- Frontend origin: `'https://nadoumi.com'` (without trailing slash)
- These don't match, causing CORS errors

## Solution

In your backend repository, find the CORS configuration (usually in `index.js` or `server.js`). 

### Option 1: Remove Trailing Slash (Recommended)

Update the `FRONTEND_URL` environment variable in Render:
- **Current (WRONG)**: `https://nadoumi.com/`
- **Should be**: `https://nadoumi.com` (no trailing slash)

Then update your CORS configuration to normalize the origin:

```javascript
import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    // Normalize origin by removing trailing slash
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin;
    const allowedOrigin = process.env.FRONTEND_URL?.replace(/\/$/, '');
    
    if (!origin || normalizedOrigin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### Option 2: Allow Both With and Without Trailing Slash

```javascript
import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigin = process.env.FRONTEND_URL?.replace(/\/$/, '');
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin;
    
    // Allow both with and without trailing slash
    if (!origin || normalizedOrigin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### Option 3: Simple Fix - Just Remove Trailing Slash

If you're using a simple CORS configuration:

```javascript
import cors from 'cors';

// Remove trailing slash from FRONTEND_URL
const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '') || 'https://nadoumi.com';

app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Steps to Fix

1. **Update Render Environment Variable**:
   - Go to Render Dashboard → Your Backend Service → Environment
   - Find `FRONTEND_URL`
   - Change from `https://nadoumi.com/` to `https://nadoumi.com` (remove trailing slash)
   - Save and redeploy

2. **Update Backend Code** (if needed):
   - Use one of the options above to normalize the origin comparison
   - This ensures CORS works even if there's a trailing slash mismatch

3. **Redeploy Backend**:
   - After making changes, redeploy the backend service on Render

4. **Test**:
   - Try registering a new account again
   - Check browser console - CORS error should be gone

## Quick Check

After fixing, you can test the CORS configuration:

```bash
curl -H "Origin: https://nadoumi.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://nadoumibackend.onrender.com/api/students/register \
     -v
```

You should see `Access-Control-Allow-Origin: https://nadoumi.com` in the response headers (without trailing slash).

