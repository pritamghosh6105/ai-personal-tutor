# ✨ MindSpark - AI Personal Tutor

> **Master any subject with AI-powered personalized learning**

An intelligent, premium EdTech platform that generates custom lessons, quizzes, flashcards, and provides instant doubt resolution — all powered by advanced AI.

## 🎨 Design Highlights

✅ **Premium UI/UX** - Modern gradient design with glassmorphism effects  
✅ **Professional Typography** - Google Fonts (Inter) with optimized hierarchy  
✅ **Smooth Animations** - Delightful micro-interactions and transitions  
✅ **Responsive Design** - Seamless experience across all devices  
✅ **Conversion-Optimized** - Strategic CTAs and trust signals  

📚 **Design Documentation**: See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete design specifications

## ✨ Features

- **Personalized Notes Generator**: AI-generated lessons tailored to your level
- **Interactive Quizzes**: Auto-generated MCQs with explanations
- **Flashcards**: Create and practice with smart flashcards
- **Doubt Solving**: Ask follow-up questions in a chat interface
- **Voice Teaching Mode**: Listen to lessons with text-to-speech
- **Progress Tracking**: Save and revisit your learning materials

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Context API for state management

### Backend
- Node.js + Express
- MongoDB + Mongoose
- OpenAI API
- JWT Authentication
- Text-to-Speech integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
cd "AI Personal Tutor"
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Configure environment variables**
```bash
cp .env.example .env
```
Edit `.env` and add your:
- MongoDB URI
- OpenAI API key
- JWT secret

5. **Run the application**

**Backend only:**
```bash
npm run dev
```

**Frontend only:**
```bash
npm run client
```

**Both (concurrent):**
```bash
npm run dev:full
```

## 📁 Project Structure

```
AI Personal Tutor/
├── backend/
│   ├── config/          # Database & config
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── services/        # AI & external APIs
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # State management
│   │   ├── services/    # API calls
│   │   └── App.js
│   └── public/
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Topics & Lessons
- `POST /api/topics/generate` - Generate new topic with AI
- `GET /api/topics` - Get all user topics
- `GET /api/topics/:id` - Get topic details

### Doubts
- `POST /api/doubts/ask` - Ask a question
- `GET /api/doubts/:topicId` - Get all doubts for a topic

### Text-to-Speech
- `POST /api/tts` - Convert text to speech

## 🤖 AI Prompts

The application uses carefully crafted prompts to generate:
- Structured lessons with introductions, steps, and summaries
- MCQs with explanations
- Flashcards
- Contextual doubt responses

## 📝 License

ISC

## 👨‍💻 Author

Built with ❤️ for learners everywhere
