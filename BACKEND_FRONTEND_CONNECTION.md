  # Backend & Frontend Integration Guide

## Overview
Your Healthify application now connects the FastAPI backend with the React frontend. The frontend's AI chatbot now communicates through your backend instead of calling Gemini directly.

## Architecture

```
Frontend (React)
    ↓
API Client (http://localhost:5000/api)
    ↓
Backend (FastAPI)
    ↓
Gemini API
```

## Setup Instructions

### 1. Backend Setup

#### Prerequisites
- Python 3.8+
- pip (Python package manager)

#### Install Dependencies
```bash
cd Backend
pip install -r requirements.txt
```

#### Configure Environment
The `.env` file in the `Backend/` folder is already created with:
```env
GEMINI_API_KEY=your_key
DATABASE_URL=sqlite:///./healthify.db
```

#### Run Backend Server
```bash
cd Backend
python -m uvicorn app.main:app --reload --port 5000
```

The backend will start at: **http://localhost:5000**

---

### 2. Frontend Setup

#### Prerequisites
- Node.js 16+
- npm

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Run Frontend Development Server
```bash
npm run dev
```

The frontend will start at: **http://localhost:5173** (or another port if 5173 is busy)

---

### 3. Running Both Together

**Terminal 1 (Backend):**
```bash
cd Backend
python -m uvicorn app.main:app --reload --port 5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

That's it! The frontend will automatically connect to `http://localhost:5000/api`

---

## API Endpoints

### AI Chat Endpoint
**POST** `/api/ai/chat`

**Request:**
```json
{
  "message": "I have a fever, what should I do?"
}
```

**Response:**
```json
{
  "response": "A fever is... [AI response]"
}
```

### Other Available Endpoints
- **Auth**: `/api/auth/` - User login/signup
- **Doctors**: `/api/doctors/` - Doctor management
- **Appointments**: `/api/appointments/` - Appointment booking
- **Medicines**: `/api/medicines/` - Medicine management

---

## How It Works Now

1. **User types in chatbot** → Message sent to frontend
2. **Frontend calls backend** → POST `/api/ai/chat` with message
3. **Backend processes** → Calls Gemini API with system prompt
4. **Response returned** → Displayed in chatbot UI

### Benefits
✅ **Security**: API key stays on backend (not exposed in browser)  
✅ **Logging**: Backend can track all conversations  
✅ **Rate Limiting**: Backend can enforce usage limits  
✅ **Consistency**: Same system prompt for all users  
✅ **Scalability**: Easy to add authentication, user tracking, etc.

---

## Environment Variables

### Frontend (.env.local)
```env
VITE_GEMINI_API_KEY=not_needed_anymore
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (.env)
```env
GEMINI_API_KEY=your_actual_api_key
DATABASE_URL=sqlite:///./healthify.db
```

---

## Troubleshooting

### "Connection refused" Error
**Solution**: Make sure backend is running on port 5000
```bash
python -m uvicorn app.main:app --reload --port 5000
```

### "GEMINI_API_KEY not found"
**Solution**: Check `Backend/.env` has the correct API key

### CORS Error
**Solution**: CORS is already enabled in `Backend/app/main.py`

### Database Issues
**Solution**: Delete `Backend/healthify.db` to reset the database
```bash
cd Backend
rm healthify.db
```

---

## Next Steps

1. ✅ Backend and frontend are connected
2. Add authentication to AI chat endpoint
3. Store conversation history in database
4. Add user-specific features (health history, preferences)
5. Implement rate limiting
6. Add logging and monitoring

---

## File Structure

```
Healthify/
├── Backend/
│   ├── app/
│   │   ├── main.py           (FastAPI app)
│   │   ├── routers/
│   │   │   ├── ai_chat.py    (AI endpoint)
│   │   │   ├── auth.py
│   │   │   ├── doctors.py
│   │   │   ├── appointments.py
│   │   │   └── medicines.py
│   │   ├── models.py         (Database models)
│   │   ├── schemas.py        (Request/Response schemas)
│   │   └── database.py       (DB connection)
│   ├── requirements.txt
│   └── .env                  (Config)
│
├── frontend/
│   ├── src/
│   │   ├── components/ai/FloatingAI.jsx  (Chatbot UI)
│   │   ├── services/api.js               (API client)
│   │   ├── services/geminiService.js     (No longer used)
│   │   └── ...
│   ├── package.json
│   └── .env.local            (Config)
```

---

Enjoy your integrated health application! 🏥✨
