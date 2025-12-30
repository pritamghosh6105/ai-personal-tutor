# Quick Start Guide - Deploy to Render

## Step 1: Push to GitHub
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit - AI Personal Tutor"

# Create a new repository on GitHub at:
# https://github.com/pritamghosh6105?tab=repositories
# Then run:

git branch -M main
git remote add origin https://github.com/pritamghosh6105/ai-personal-tutor.git
git push -u origin main
```

## Step 2: Setup MongoDB Atlas (Free)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Copy connection string

## Step 3: Deploy Backend on Render
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   JWT_SECRET=make_this_very_long_and_random_32_characters_minimum
   GROQ_API_KEY=your_groq_api_key
   NODE_ENV=production
   ```
6. Click **"Create Web Service"**
7. **COPY YOUR BACKEND URL** (e.g., https://ai-tutor-backend.onrender.com)

## Step 4: Deploy Frontend on Render
1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=YOUR_BACKEND_URL_FROM_STEP_3
   ```
5. Click **"Create Static Site"**

## Step 5: Update Backend CORS
1. Go back to backend service
2. Add environment variable:
   ```
   FRONTEND_URL=YOUR_FRONTEND_URL
   ```
3. Save (auto-redeploys)

## Done! 🎉
Visit your frontend URL to use your app!

**Note:** Free tier services sleep after 15 min inactivity. First request takes ~30 seconds to wake up.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.
