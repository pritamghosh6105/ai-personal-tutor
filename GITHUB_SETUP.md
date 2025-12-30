# GitHub Setup Guide

## Step 1: Create a New Repository on GitHub

1. Go to: https://github.com/pritamghosh6105
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository settings:
   - **Repository name:** `ai-personal-tutor`
   - **Description:** AI-powered personal tutoring application
   - **Visibility:** Public (or Private if you prefer)
   - **Do NOT initialize with README, .gitignore, or license** (we have our own)
4. Click **"Create repository"**

## Step 2: Push Your Code

Open PowerShell in your project directory and run:

```powershell
# Navigate to project folder (if not already there)
cd "e:\drive\Pritam\OneDrive\Desktop\AI Personal Tutor"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - AI Personal Tutor with daily quotes, markdown doubts, and reading mode"

# Rename branch to main
git branch -M main

# Add your GitHub repository as remote
git remote add origin https://github.com/pritamghosh6105/ai-personal-tutor.git

# Push code to GitHub
git push -u origin main
```

## Step 3: Verify Upload

1. Go to: https://github.com/pritamghosh6105/ai-personal-tutor
2. You should see all your files uploaded
3. README.md will be displayed on the repository page

## Common Issues

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/pritamghosh6105/ai-personal-tutor.git
git push -u origin main
```

### Error: "fatal: not a git repository"
```powershell
# Make sure you're in the correct directory
cd "e:\drive\Pritam\OneDrive\Desktop\AI Personal Tutor"
git init
```

### Authentication Required
If prompted for credentials:
- Use your GitHub username: `pritamghosh6105`
- Use a Personal Access Token (PAT) instead of password:
  1. Go to: https://github.com/settings/tokens
  2. Click **"Generate new token"** → **"Generate new token (classic)"**
  3. Give it a name: "AI Tutor Deploy"
  4. Select scopes: `repo` (full control of private repositories)
  5. Click **"Generate token"**
  6. Copy the token and use it as your password

## Next Steps

After pushing to GitHub, proceed with Render deployment:
1. Open [RENDER_QUICK_START.md](./RENDER_QUICK_START.md)
2. Follow Step 2 onwards (MongoDB setup and Render deployment)

## Repository URL
Your repository will be at:
**https://github.com/pritamghosh6105/ai-personal-tutor**
