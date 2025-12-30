# Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (https://render.com)
- MongoDB Atlas account (for cloud database)

## Step 1: Prepare Your Repository

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

## Step 2: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

## Step 3: Deploy Backend on Render

1. **Go to Render Dashboard** (https://dashboard.render.com)

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure Backend Service:**
   - **Name:** `ai-tutor-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave empty (or `.` for root)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   GROQ_API_KEY=your_groq_api_key
   PORT=5000
   ```

6. **Click "Create Web Service"**

7. **Copy your backend URL** (will be like: `https://ai-tutor-backend.onrender.com`)

## Step 4: Deploy Frontend on Render

1. **Click "New +" → "Static Site"**

2. **Connect the same GitHub repository**

3. **Configure Frontend Service:**
   - **Name:** `ai-tutor-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. **Add Environment Variable:**
   ```
   REACT_APP_API_URL=https://ai-tutor-backend.onrender.com
   ```

5. **Click "Create Static Site"**

## Step 5: Update Backend CORS

After frontend is deployed, update backend environment variables on Render:

1. Go to your backend service on Render
2. Click "Environment" tab
3. Add/Update:
   ```
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```
4. Save changes (service will automatically redeploy)

## Step 6: Test Your Application

1. Visit your frontend URL: `https://ai-tutor-frontend.onrender.com`
2. Try creating an account
3. Generate a topic and test all features

## Important Notes

### Free Tier Limitations:
- **Backend spins down after 15 minutes of inactivity**
- First request after idle will take 30-60 seconds
- 750 hours/month free (enough for one service)

### Troubleshooting:

**Backend not connecting to MongoDB:**
- Verify MongoDB Atlas connection string
- Ensure IP whitelist includes 0.0.0.0/0
- Check database user permissions

**Frontend can't reach backend:**
- Verify REACT_APP_API_URL is set correctly
- Check backend CORS settings include frontend URL
- Look at browser console for errors

**Build fails:**
- Check build logs on Render dashboard
- Verify all dependencies are in package.json
- Ensure Node version compatibility

### View Logs:
- Click on your service in Render dashboard
- Click "Logs" tab to see real-time logs
- Use for debugging errors

## Alternative: Deploy Both as Single Service

If you prefer a simpler setup, you can serve frontend from backend:

1. Build frontend locally: `cd frontend && npm run build`
2. Copy build folder to backend
3. Update backend server.js to serve static files
4. Deploy only backend service on Render

This approach uses only one Render service but requires more configuration.

## Environment Variables Reference

### Backend (.env):
```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_min_32_characters_long
GROQ_API_KEY=gsk_your_groq_api_key
PORT=5000
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Updating Your Application

When you push changes to GitHub:
- Render automatically detects changes
- Triggers new build and deployment
- Takes 2-5 minutes typically

## Cost Optimization

**Free tier includes:**
- 750 hours/month per service
- Automatic SSL certificates
- CDN for static sites
- Unlimited bandwidth

**To stay free:**
- Use only 2 services (frontend + backend)
- Services spin down after inactivity
- Consider MongoDB Atlas free tier

## Support

For issues:
- Check Render documentation: https://render.com/docs
- View service logs in Render dashboard
- Check MongoDB Atlas connection
- Verify all environment variables
