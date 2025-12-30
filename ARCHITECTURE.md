# 🏗️ System Architecture - AI Personal Tutor

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                      http://localhost:3000                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     REACT FRONTEND                               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │   Pages     │  │  Components  │  │  Context/State      │    │
│  │ - Home      │  │ - Navbar     │  │ - AuthContext      │    │
│  │ - Login     │  │ - Loading    │  │ - API Services     │    │
│  │ - Dashboard │  │ - Private    │  │                    │    │
│  │ - Topic     │  │   Route      │  │                    │    │
│  └─────────────┘  └──────────────┘  └────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Axios HTTP Requests
                             │ + JWT Token
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   EXPRESS.JS BACKEND                             │
│                  http://localhost:5000                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE                           │   │
│  │  • CORS          • Body Parser      • Morgan (Logging) │   │
│  │  • Auth (JWT)    • Error Handler                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                      ROUTES                             │   │
│  │  /api/auth  /api/topics  /api/doubts                   │   │
│  │  /api/flashcards        /api/tts                       │   │
│  └────────────────┬───────────────────────────────────────┘   │
│                   │                                             │
│  ┌────────────────▼───────────────────────────────────────┐   │
│  │                   CONTROLLERS                           │   │
│  │  authController    topicController    doubtController  │   │
│  │  flashcardController        ttsController              │   │
│  └────────────────┬───────────────────────────────────────┘   │
│                   │                                             │
│  ┌────────────────▼───────────────────────────────────────┐   │
│  │                    SERVICES                             │   │
│  │  • aiService (OpenAI)    • ttsService (Google)        │   │
│  └────────────────┬───────────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
┌───────────────┐      ┌─────────────────┐
│   MONGODB     │      │  EXTERNAL APIs  │
│               │      │                 │
│  Collections: │      │  • OpenAI API   │
│  • users      │      │  • Google TTS   │
│  • topics     │      │                 │
│  • lessons    │      └─────────────────┘
│  • quizzes    │
│  • flashcards │
│  • doubts     │
└───────────────┘
```

---

## 🔄 Request Flow Diagram

### 1. User Signup/Login Flow
```
User → Frontend → Backend → MongoDB
                    ↓
                JWT Token
                    ↓
    ← Frontend ← Backend
```

### 2. Topic Generation Flow
```
User clicks "Generate Topic"
        ↓
Frontend sends: { title, level }
        ↓
Backend receives request
        ↓
Validate JWT Token
        ↓
Call OpenAI API (3 requests):
  1. Generate Lesson
  2. Generate Quiz
  3. Generate Flashcards
        ↓
Save to MongoDB:
  - Topic
  - Lesson
  - Quiz
  - Flashcards
        ↓
Return complete data
        ↓
Frontend displays content
```

### 3. Doubt Solving Flow
```
User asks question
        ↓
Frontend: { topicId, question }
        ↓
Backend fetches lesson context
        ↓
Send to OpenAI with context
        ↓
Get AI-generated answer
        ↓
Save Q&A to MongoDB
        ↓
Return answer to frontend
        ↓
Display in chat interface
```

---

## 🗃️ Data Flow

### MongoDB Schema Relationships
```
User (1) ──────► (N) Topics
              │
              ├──► (1) Lesson
              │
              ├──► (1) Quiz
              │
              ├──► (N) Flashcards
              │
              └──► (N) Doubts
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│  AUTHENTICATION FLOW                                      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. User Signup/Login                                    │
│     ↓                                                     │
│  2. Backend validates credentials                        │
│     ↓                                                     │
│  3. Generate JWT Token (expires in 30 days)             │
│     ↓                                                     │
│  4. Return token to frontend                             │
│     ↓                                                     │
│  5. Frontend stores in localStorage                      │
│     ↓                                                     │
│  6. Include in all API requests:                         │
│     Authorization: Bearer <token>                        │
│     ↓                                                     │
│  7. Backend middleware validates token                   │
│     ↓                                                     │
│  8. If valid, proceed to route handler                   │
│     ↓                                                     │
│  9. If invalid, return 401 Unauthorized                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Integration Architecture

```
┌──────────────────────────────────────────────────────────┐
│  OpenAI Integration Flow                                  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  aiService.js                                            │
│     │                                                     │
│     ├─► generateLesson()                                │
│     │   • System prompt: "You are a tutor"              │
│     │   • User prompt: Topic + Level                    │
│     │   • Model: gpt-3.5-turbo                          │
│     │   • Temperature: 0.7                              │
│     │   • Max tokens: 2000                              │
│     │   • Returns: JSON (intro, steps, analogies)      │
│     │                                                     │
│     ├─► generateQuiz()                                  │
│     │   • Context: Lesson content                       │
│     │   • Generate: 5 MCQs                              │
│     │   • Returns: JSON (questions, options, answers)  │
│     │                                                     │
│     ├─► generateFlashcards()                            │
│     │   • Context: Lesson content                       │
│     │   • Generate: 8 flashcards                        │
│     │   • Returns: JSON (front, back)                  │
│     │                                                     │
│     └─► answerDoubt()                                   │
│         • Context: Lesson + Previous Q&A                │
│         • User question                                 │
│         • Returns: Contextual answer                    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🎵 Text-to-Speech Flow

```
User clicks "Listen" button
        ↓
Frontend sends lesson text
        ↓
Backend: ttsService.js
        ↓
Split text into chunks (200 char max)
        ↓
Call Google TTS API for each chunk
        ↓
Generate audio URLs
        ↓
Return URLs to frontend
        ↓
Frontend plays audio
```

---

## 📦 Component Hierarchy (Frontend)

```
App.js
├── AuthProvider (Context)
│   ├── Navbar
│   │   └── User Info + Logout
│   │
│   └── Routes
│       ├── Home (Public)
│       ├── Login (Public)
│       ├── Signup (Public)
│       │
│       ├── Dashboard (Private)
│       │   ├── Search Bar
│       │   ├── New Topic Modal
│       │   └── Topics Grid
│       │       └── Topic Cards
│       │
│       └── TopicDetail (Private)
│           ├── Tabs Navigation
│           ├── Lesson Tab
│           │   ├── TTS Button
│           │   ├── Introduction
│           │   ├── Steps
│           │   ├── Analogies
│           │   └── Summary
│           │
│           ├── Quiz Tab
│           │   ├── Question Counter
│           │   ├── Options
│           │   ├── Explanation
│           │   └── Score Display
│           │
│           ├── Flashcards Tab
│           │   ├── Card Display
│           │   ├── Flip Animation
│           │   └── Navigation
│           │
│           └── Doubts Tab
│               ├── Ask Form
│               └── Q&A History
```

---

## 🔄 State Management

```
AuthContext
├── user (object | null)
├── loading (boolean)
├── isAuthenticated (boolean)
├── signup(name, email, password)
├── login(email, password)
└── logout()

Local Component State
├── Dashboard
│   ├── topics (array)
│   ├── showModal (boolean)
│   └── formData (object)
│
└── TopicDetail
    ├── topic (object)
    ├── lesson (object)
    ├── quiz (object)
    ├── flashcards (array)
    ├── doubts (array)
    ├── activeTab (string)
    ├── currentQuestion (number)
    └── currentFlashcard (number)
```

---

## 🌐 API Communication Pattern

```
Frontend                  Backend                 Database/APIs
   │                         │                         │
   │  HTTP Request           │                         │
   ├────────────────────────►│                         │
   │  + JWT Token            │                         │
   │                         │  Validate Token         │
   │                         ├────────►                │
   │                         │                         │
   │                         │  Query/Update           │
   │                         ├────────────────────────►│
   │                         │                         │
   │                         │  ◄─────────────────────┤
   │                         │  Response               │
   │                         │                         │
   │  ◄─────────────────────┤                         │
   │  JSON Response          │                         │
   │                         │                         │
```

---

## 💾 Data Storage Pattern

```
localStorage (Frontend)
└── token: JWT string

MongoDB (Backend)
├── users Collection
│   └── { _id, name, email, password(hashed), role }
│
├── topics Collection
│   └── { _id, userId, title, level, createdAt }
│
├── lessons Collection
│   └── { _id, topicId, content: { intro, steps, analogies, summary } }
│
├── quizzes Collection
│   └── { _id, topicId, questions: [ { q, options, correct, explanation } ] }
│
├── flashcards Collection
│   └── { _id, topicId, userId, front, back, status }
│
└── doubts Collection
    └── { _id, topicId, userId, question, answer, createdAt }
```

---

## 🔒 Security Layers

```
Layer 1: Frontend Route Guards
         PrivateRoute component

Layer 2: Backend JWT Middleware
         Validates token on each request

Layer 3: User Ownership Check
         Verify user owns the resource

Layer 4: Password Hashing
         bcrypt with salt rounds

Layer 5: Environment Variables
         Secrets not in code

Layer 6: CORS Configuration
         Only allow trusted origins
```

---

## 📊 Performance Considerations

```
Bottlenecks:
1. OpenAI API calls (20-30s)
2. TTS generation (5-10s)
3. Large lesson data transfer

Optimizations:
• Show loading states
• Cache frequently requested topics
• Compress API responses
• Implement pagination
• Use CDN for assets
```

---

## 🧩 Module Dependencies

### Backend Dependencies
```
express          → Web framework
mongoose         → MongoDB ODM
jsonwebtoken     → JWT auth
bcryptjs         → Password hashing
openai           → AI integration
dotenv           → Environment vars
cors             → Cross-origin
morgan           → Logging
axios            → HTTP client
google-tts-api   → Text-to-speech
```

### Frontend Dependencies
```
react            → UI library
react-router-dom → Routing
axios            → HTTP client
lucide-react     → Icons
```

---

**This architecture supports:**
✅ Scalability
✅ Security
✅ Maintainability
✅ Testability
✅ User Experience

---

**Last Updated:** December 2024
