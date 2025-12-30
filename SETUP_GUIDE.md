# 🚀 Setup Guide - AI Personal Tutor

## Prerequisites
Before you begin, make sure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **OpenAI API Key** - Get it from [OpenAI Platform](https://platform.openai.com/)

## Step 1: Clone or Navigate to Project

```bash
cd "e:\drive\Pritam\OneDrive\Desktop\AI Personal Tutor"
```

## Step 2: Install Backend Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- openai
- axios
- morgan
- express-validator
- google-tts-api

## Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- react-markdown
- lucide-react

## Step 4: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` file and add your configurations:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-personal-tutor

# Option 2: MongoDB Atlas (Recommended)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-personal-tutor?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Getting Your OpenAI API Key:
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it in the `.env` file

### Setting up MongoDB:

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Paste it in `.env` as `MONGODB_URI`

**Option B: Local MongoDB**
1. Download and install MongoDB Community Server
2. Start MongoDB service
3. Use `MONGODB_URI=mongodb://localhost:27017/ai-personal-tutor`

## Step 5: Start the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 2: Run Both Concurrently (After installing concurrently)
```bash
npm run dev:full
```

## Step 6: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🧪 Testing the Application

1. **Sign Up:**
   - Go to http://localhost:3000/signup
   - Create a new account

2. **Create a Topic:**
   - Click "New Topic"
   - Enter a topic like "CPU Pipelining" or "Photosynthesis"
   - Select your level
   - Click "Generate Topic" (this takes 20-30 seconds)

3. **Explore Features:**
   - Read the AI-generated lesson
   - Take the quiz
   - Practice with flashcards
   - Ask doubts in the chat
   - Listen to the lesson with text-to-speech

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Topics
- `POST /api/topics/generate` - Generate new topic (protected)
- `GET /api/topics` - Get all user topics (protected)
- `GET /api/topics/:id` - Get topic details (protected)
- `DELETE /api/topics/:id` - Delete topic (protected)

### Doubts
- `POST /api/doubts/ask` - Ask a question (protected)
- `GET /api/doubts/:topicId` - Get doubts for topic (protected)

### Flashcards
- `GET /api/flashcards/:topicId` - Get flashcards (protected)
- `PUT /api/flashcards/:id` - Update flashcard status (protected)

### Text-to-Speech
- `POST /api/tts` - Convert text to speech (protected)

## 🔧 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network connectivity for Atlas

### OpenAI API Error
- Verify API key is correct
- Check if you have credits in your OpenAI account
- Ensure no extra spaces in the key

### Port Already in Use
- Change PORT in `.env` to a different number
- Kill process using the port: `netstat -ano | findstr :5000`

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Clear browser cache

## 🎯 Next Steps

1. **Customize Prompts:**
   - Edit `backend/services/aiService.js` to modify AI prompts

2. **Add More Features:**
   - Progress tracking
   - Study streaks
   - Spaced repetition for flashcards
   - Export notes as PDF

3. **Deploy to Production:**
   - Use services like Heroku, Vercel, or Railway
   - Set environment variables in production
   - Use production MongoDB Atlas cluster

## 📚 Project Structure

```
AI Personal Tutor/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # AI & external services
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React context
│       ├── pages/       # Page components
│       ├── services/    # API calls
│       └── App.js       # Main app
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Backend dependencies
└── README.md           # Documentation
```

## 🎓 Learning Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)

## 💡 Tips

1. **Save API Costs:** Use `gpt-3.5-turbo` instead of GPT-4
2. **Database:** Regularly backup your MongoDB data
3. **Security:** Never commit `.env` file to Git
4. **Development:** Use `npm run dev` for auto-restart on changes

## ❓ Need Help?

- Check the console for error messages
- Review the API responses in browser DevTools
- Verify all environment variables are set correctly
- Make sure MongoDB is accessible

---

**Happy Learning! 🎉**
