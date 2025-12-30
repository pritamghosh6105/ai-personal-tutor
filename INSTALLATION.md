# ✅ Installation & Verification Guide

This step-by-step guide will help you install and verify that your AI Personal Tutor application is working correctly.

---

## 📋 Pre-Installation Checklist

### Required Software
- [ ] **Node.js** (v16+) - [Download](https://nodejs.org/)
- [ ] **MongoDB** - Local or [Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] **OpenAI API Key** - [Get here](https://platform.openai.com/)
- [ ] **PowerShell** or **Command Prompt** (Windows)
- [ ] **Code Editor** (VS Code recommended)

### Verify Node.js Installation
```powershell
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
```

If not installed:
1. Go to https://nodejs.org/
2. Download LTS version
3. Run installer
4. Restart terminal

---

## 🚀 Step-by-Step Installation

### Step 1: Navigate to Project Directory
```powershell
cd "e:\drive\Pritam\OneDrive\Desktop\AI Personal Tutor"
```

### Step 2: Run Quick Setup Script (Recommended)
```powershell
.\setup.ps1
```

This script will:
- Check Node.js installation
- Create `.env` file from template
- Install backend dependencies
- Install frontend dependencies

**OR** Follow Manual Installation Below:

---

## 🔧 Manual Installation Steps

### Step 3: Create Environment File
```powershell
# Copy template
Copy-Item .env.example .env

# Open in editor
notepad .env
```

### Step 4: Configure Environment Variables

Edit `.env` file with these values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration (Choose one option)
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-personal-tutor

# Option 2: MongoDB Atlas (Recommended)
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-personal-tutor

# JWT Secret (Generate random string)
JWT_SECRET=your_very_secure_secret_key_min_32_chars

# OpenAI API Key (Get from platform.openai.com)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 5: Install Backend Dependencies
```powershell
npm install
```

**Expected Output:**
```
added 150+ packages in 30s
```

**Verify Installation:**
```powershell
npm list express mongoose openai
```

### Step 6: Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

**Expected Output:**
```
added 1500+ packages in 60s
```

---

## 🧪 Verification Steps

### Verification 1: Check File Structure

Run this command to verify all files exist:
```powershell
Get-ChildItem -Recurse -Depth 2 | Select-Object FullName
```

**Expected Structure:**
```
✅ backend/
   ✅ config/db.js
   ✅ models/ (6 files)
   ✅ controllers/ (5 files)
   ✅ routes/ (5 files)
   ✅ services/ (2 files)
   ✅ middleware/ (2 files)
   ✅ server.js

✅ frontend/
   ✅ public/index.html
   ✅ src/
      ✅ components/ (4 files)
      ✅ pages/ (5 files)
      ✅ context/AuthContext.js
      ✅ services/api.js
      ✅ App.js
      ✅ index.js

✅ Configuration Files
   ✅ .env
   ✅ .gitignore
   ✅ package.json
   ✅ frontend/package.json
```

### Verification 2: Check Dependencies

**Backend Dependencies:**
```powershell
npm list --depth=0
```

Should include:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- openai
- cors
- dotenv

**Frontend Dependencies:**
```powershell
cd frontend
npm list --depth=0
cd ..
```

Should include:
- react
- react-dom
- react-router-dom
- axios
- lucide-react

### Verification 3: Environment Variables Check

```powershell
# Check if .env exists
Test-Path .env

# View .env content (careful with secrets!)
Get-Content .env
```

**Verify:**
- [ ] MONGODB_URI is set
- [ ] OPENAI_API_KEY starts with "sk-"
- [ ] JWT_SECRET is at least 32 characters
- [ ] PORT is 5000
- [ ] FRONTEND_URL is http://localhost:3000

---

## 🚀 Starting the Application

### Method 1: Two Separate Terminals (Recommended for First Run)

**Terminal 1 - Backend:**
```powershell
npm run dev
```

**Expected Output:**
```
> ai-personal-tutor@1.0.0 dev
> nodemon backend/server.js

[nodemon] starting `node backend/server.js`
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📚 Environment: development
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view ai-tutor-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

webpack compiled with 0 warnings
```

### Method 2: Concurrent (After First Verification)

```powershell
npm run dev:full
```

---

## ✅ Post-Installation Tests

### Test 1: Backend Health Check

**Open browser or use curl:**
```powershell
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "AI Personal Tutor API is running",
  "timestamp": "2024-12-10T..."
}
```

### Test 2: Frontend Loading

**Open browser:**
```
http://localhost:3000
```

**Expected:**
- [ ] Home page loads
- [ ] "AI Personal Tutor" title visible
- [ ] No console errors (F12)
- [ ] "Login" and "Sign Up" buttons visible

### Test 3: API Connection Test

**Try signup:**
1. Click "Sign Up" button
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Sign Up"

**Expected:**
- [ ] Redirects to dashboard
- [ ] No errors in console
- [ ] Shows "Hi, Test User" in navbar

### Test 4: MongoDB Connection Test

**Backend terminal should show:**
```
✅ MongoDB Connected: [your-mongodb-host]
```

**If not connected:**
- Check MONGODB_URI in .env
- Verify MongoDB is running
- Check network connectivity (for Atlas)

### Test 5: Topic Generation Test

1. Click "New Topic" button
2. Enter:
   - Topic: "Test Topic"
   - Level: "beginner"
3. Click "Generate Topic"

**Expected:**
- [ ] Loading indicator shows
- [ ] Takes 20-30 seconds
- [ ] Redirects to topic page
- [ ] Shows lesson, quiz, flashcards tabs
- [ ] No errors in console

**Backend terminal shows:**
```
🤖 Generating lesson content...
🤖 Generating quiz questions...
🤖 Generating flashcards...
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "npm: command not found"
**Solution:**
```powershell
# Reinstall Node.js
# Download from: https://nodejs.org/
# Restart terminal after installation
```

### Issue 2: "MongoError: connect ECONNREFUSED"
**Problem:** MongoDB not running or wrong URI

**Solutions:**
```powershell
# If using local MongoDB:
# 1. Start MongoDB service
net start MongoDB

# 2. Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env to Atlas connection string
```

### Issue 3: "OpenAI API Error: Invalid API Key"
**Solution:**
```powershell
# 1. Verify API key at: https://platform.openai.com/
# 2. Check .env file - no extra spaces
# 3. Key should start with "sk-"
# 4. Ensure you have credits in OpenAI account
```

### Issue 4: "Port 5000 already in use"
**Solution:**
```powershell
# Option 1: Kill process using port 5000
netstat -ano | findstr :5000
# Note the PID, then:
taskkill /PID [PID] /F

# Option 2: Change port in .env
# Set PORT=5001
```

### Issue 5: "CORS Error" in browser
**Solution:**
```powershell
# 1. Check FRONTEND_URL in backend .env
# 2. Verify backend is running
# 3. Clear browser cache
# 4. Restart both servers
```

### Issue 6: Frontend can't connect to backend
**Symptoms:** API calls fail with network errors

**Solutions:**
```powershell
# 1. Verify backend is running on port 5000
curl http://localhost:5000/api/health

# 2. Check proxy in frontend/package.json:
#    "proxy": "http://localhost:5000"

# 3. Restart frontend server
cd frontend
npm start
```

### Issue 7: "Module not found" errors
**Solution:**
```powershell
# Delete and reinstall dependencies

# Backend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

# Frontend
cd frontend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
cd ..
```

---

## 🔍 Verification Checklist

### Before Starting
- [ ] Node.js v16+ installed
- [ ] MongoDB accessible
- [ ] OpenAI API key obtained
- [ ] .env file created and configured
- [ ] Dependencies installed (backend)
- [ ] Dependencies installed (frontend)

### After Starting
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check API responds
- [ ] Home page loads
- [ ] Can create account
- [ ] Can login
- [ ] Can generate topic
- [ ] Lesson displays correctly
- [ ] Quiz works
- [ ] Flashcards work
- [ ] Can ask doubts
- [ ] TTS plays audio

---

## 📊 System Requirements

### Minimum
- **CPU:** 2 cores
- **RAM:** 4GB
- **Disk:** 2GB free space
- **Network:** Stable internet (for AI APIs)

### Recommended
- **CPU:** 4 cores
- **RAM:** 8GB
- **Disk:** 5GB free space
- **Network:** High-speed internet

---

## 🎓 First-Time Usage Guide

### 1. Create Account
```
http://localhost:3000/signup
- Name: Your Name
- Email: your@email.com
- Password: min 6 characters
```

### 2. Generate First Topic
```
Dashboard → New Topic
- Title: "Introduction to React"
- Level: "beginner"
- Wait: 20-30 seconds
```

### 3. Explore Features
- Read lesson
- Take quiz
- Practice flashcards
- Ask questions
- Listen to audio

---

## 📞 Getting Help

### Self-Help Resources
1. Check console for error messages
2. Review this guide
3. Check `SETUP_GUIDE.md`
4. Review `API_TESTING.md`
5. Check `ARCHITECTURE.md` for understanding

### Diagnostic Commands
```powershell
# Check Node version
node --version

# Check npm version
npm --version

# Check if MongoDB is running
netstat -an | findstr :27017

# Check if backend is running
netstat -an | findstr :5000

# Check if frontend is running
netstat -an | findstr :3000

# View backend logs
# (Check Terminal 1)

# View frontend logs
# (Check Terminal 2 or browser console F12)
```

---

## ✅ Installation Success Indicators

You'll know installation is successful when:

1. ✅ Both terminals show no errors
2. ✅ Backend shows "MongoDB Connected"
3. ✅ Frontend shows "Compiled successfully"
4. ✅ Browser opens http://localhost:3000
5. ✅ Home page displays correctly
6. ✅ Can signup/login without errors
7. ✅ Can generate a topic successfully
8. ✅ All features work (lesson, quiz, flashcards, doubts)

---

## 🎉 Congratulations!

If all verification steps pass, your AI Personal Tutor application is successfully installed and running!

### Next Steps:
1. ✅ Create topics for subjects you want to learn
2. ✅ Explore all features
3. ✅ Customize AI prompts (optional)
4. ✅ Deploy to production (optional)

### Useful Commands:
```powershell
# Start development
npm run dev              # Backend
cd frontend; npm start   # Frontend

# Stop servers
# Press Ctrl+C in each terminal

# Restart with fresh data
# Delete MongoDB database and start again
```

---

**Happy Learning! 🚀**

**Version:** 1.0.0  
**Last Updated:** December 2024
