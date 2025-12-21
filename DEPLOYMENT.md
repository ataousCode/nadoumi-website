# Deployment Guide for Nadoumi

## Overview
- **Frontend**: Vercel (https://nadoumi.com/)
- **Backend**: Render (https://nadoumibackend.onrender.com)
- **Database**: MongoDB (MongoDB Atlas recommended)
- **Note**: Frontend and Backend are in **separate GitHub repositories**

## Repository Structure

### Frontend Repository
- Contains: React frontend application
- Location: Root of frontend repository
- Build output: `dist/` directory

### Backend Repository
- Contains: Express.js backend server
- Location: Root of backend repository
- Entry point: `index.js`

## Environment Variables

### Backend (Render)

Create a `.env` file or set environment variables in Render dashboard:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database
MONGODB_URI=your-mongodb-connection-string

# Frontend URL
FRONTEND_URL=https://nadoumi.com

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=almouslecka@gmail.com
SMTP_PASS=avmf qyyo vzsk ghdp
EMAIL_FROM=Nadoumi <almouslecka@gmail.com>
ADMIN_EMAIL=almouslecka@gmail.com

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-production-jwt-secret-here
STUDENT_JWT_SECRET=your-production-student-jwt-secret-here
```

### Frontend (Vercel)

Set environment variables in Vercel dashboard:

```env
VITE_API_BASE_URL=https://nadoumibackend.onrender.com/api
VITE_WHATSAPP_NUMBER=8615520576024
VITE_WECHAT_QR_CODE=/wechat-qr.png
```

## Deployment Steps

### 1. Backend Deployment (Render)

1. **Create a new Web Service on Render**
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your **backend GitHub repository**
   - Render will auto-detect Node.js

2. **Configure Service Settings**
   - **Name**: `nadoumi-backend` (or your preferred name)
   - **Root Directory**: `.` (root of backend repository)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` or `node index.js`
   - **Plan**: Choose your plan (Free tier available)

3. **Set Environment Variables**
   - Click on "Environment" tab
   - Add all backend environment variables listed above
   - Make sure `MONGODB_URI` points to your production database
   - Set `FRONTEND_URL` to `https://nadoumi.com`
   - **Important**: Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - **Backend URL**: `https://nadoumibackend.onrender.com`

5. **Verify Email Service**
   - Check server logs for: `📧 Email service configured for Gmail SMTP`
   - Test email sending by submitting a test application

### 2. Frontend Deployment (Vercel)

1. **Import Project**
   - Go to Vercel dashboard
   - Click "Add New..." → "Project"
   - Import your **frontend GitHub repository**
   - Vercel will auto-detect it's a Vite project

2. **Configure Project Settings**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `.` (root of frontend repository)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**
   - Click on "Settings" → "Environment Variables"
   - Add the following:
     - `VITE_API_BASE_URL`: `https://nadoumibackend.onrender.com/api`
     - `VITE_WHATSAPP_NUMBER`: `8615520576024`
     - `VITE_WECHAT_QR_CODE`: `/wechat-qr.png`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Your site will be available at a Vercel URL (e.g., `https://nadoumi.vercel.app`)

5. **Configure Custom Domain**
   - Go to "Settings" → "Domains"
   - Add your custom domain: `nadoumi.com`
   - Follow Vercel's DNS configuration instructions
   - Update DNS records as instructed

### 3. Database Setup

1. **MongoDB Atlas** (Recommended)
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier available)
   - Go to "Database Access" → Create a database user
   - Go to "Network Access" → Add IP address `0.0.0.0/0` (or Render's IPs)
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in Render environment variables

2. **Run Initial Setup**
   - Option 1: Run locally (recommended)
     ```bash
     cd backend-repository
     npm install
     npm run create-admin
     ```
   - Option 2: Use Render Shell
     - Go to Render dashboard → Your service → "Shell"
     - Run: `npm run create-admin`

### 4. File Uploads

1. **Static Files**
   - Render serves static files from `/uploads` directory
   - Make sure `uploads` directory is created and writable
   - For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

2. **WeChat QR Code**
   - Place `wechat-qr.png` in `public/` folder of frontend repository
   - It will be served at `https://nadoumi.com/wechat-qr.png`

## 404 Page in Production

### How It Works

For Single Page Applications (SPAs) like this React app, the 404 page works differently in production:

1. **Client-Side Routing**: React Router handles all routing on the client side
2. **Server Configuration**: The server needs to serve `index.html` for all routes
3. **Vercel Configuration**: The `vercel.json` file already includes rewrite rules

### Current Configuration

The `vercel.json` file in the frontend repository is configured with:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that:
- All routes (including non-existent ones) serve `index.html`
- React Router loads and handles the routing
- The 404 page (`NotFound.jsx`) displays for unmatched routes

### Testing the 404 Page

1. **In Development**: Visit any non-existent route like `http://localhost:5173/random-page`
2. **In Production**: Visit `https://nadoumi.com/random-page` after deployment

The 404 page will automatically display because:
- The route doesn't match any defined routes in `App.jsx`
- React Router's catch-all route (`path="*"`) catches it
- The `NotFound` component is rendered

### Troubleshooting

If the 404 page doesn't work in production:
1. Verify `vercel.json` is in the root of frontend repository
2. Check that the rewrite rule is correct
3. Ensure the build output includes `index.html`
4. Clear Vercel cache and redeploy

## Post-Deployment Checklist

- [ ] Backend is running on Render
- [ ] Frontend is deployed on Vercel
- [ ] Database connection is working
- [ ] Environment variables are set correctly in both Render and Vercel
- [ ] Email notifications are working (test with application submission)
- [ ] Admin can login at `https://nadoumi.com/admin/login`
- [ ] Students can register and login
- [ ] File uploads are working
- [ ] Static files are being served correctly
- [ ] CORS is configured correctly (check `FRONTEND_URL` in backend)
- [ ] Custom domain (nadoumi.com) is configured
- [ ] 404 page works for non-existent routes
- [ ] SSL certificates are active (automatic with Vercel and Render)

## Troubleshooting

### Email Not Sending
- Verify Gmail app password is correct in Render environment variables
- Check if "Less secure app access" is enabled (if needed)
- Check Render logs for email errors
- Verify SMTP environment variables are set correctly
- Test email configuration: Check logs for `📧 Email service configured for Gmail SMTP`

### CORS Errors
- Ensure `FRONTEND_URL` in backend (Render) matches your Vercel domain
- Check CORS configuration in your backend server (typically in the main entry file like `index.js` or `server.js`)
- Verify the frontend URL includes protocol: `https://nadoumi.com` (not just `nadoumi.com`)

### File Upload Issues
- Verify `uploads` directory exists in backend repository
- Check file permissions on Render
- Consider using cloud storage for production (AWS S3, Cloudinary, etc.)
- Check Render logs for upload errors

### API Connection Issues
- Verify `VITE_API_BASE_URL` in Vercel is set to: `https://nadoumibackend.onrender.com/api`
- Ensure backend URL includes `/api` at the end
- Check Render service is running and not sleeping (free tier sleeps after inactivity)
- Test API endpoint directly: `https://nadoumibackend.onrender.com/api/health` (if you have a health check)

### Build Failures

**Frontend (Vercel)**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (check `engines` in `package.json`)

**Backend (Render)**:
- Check build logs in Render dashboard
- Verify `package.json` has correct `start` script
- Ensure all dependencies are listed in `package.json`

## Support

For issues, check:
- **Render logs**: Dashboard → Your Service → Logs
- **Vercel logs**: Dashboard → Your Project → Deployments → View Logs
- **Server logs**: Check application logs in Render
- **Browser console**: Check for frontend errors

## Important Notes

1. **Separate Repositories**: Frontend and backend are in different GitHub repositories
2. **Environment Variables**: Must be set separately in Render (backend) and Vercel (frontend)
3. **API URL**: Frontend must point to the correct backend URL in `VITE_API_BASE_URL`
4. **CORS**: Backend must allow requests from frontend domain (set in `FRONTEND_URL`)
5. **Free Tier Limitations**: 
   - Render free tier services sleep after 15 minutes of inactivity
   - First request after sleep may take longer (cold start)
   - Consider upgrading for production use
