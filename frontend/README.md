# JanMitra AI — Full Stack Enterprise AI Governance Platform

## 🚀 Project Overview

JanMitra AI is an AI-powered smart governance and grievance resolution platform inspired by the UP Jansunwai Portal and Lucknow Nagar Nigam.

This starter codebase provides:

* Enterprise frontend architecture
* Backend API architecture
* Gemini AI integration layer
* Complaint routing logic
* Dashboard analytics structure
* Modern SaaS UI architecture
* Production-ready folder organization

---

# 📁 PROJECT STRUCTURE

```bash
janmitra-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── animations/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── app.js
│
└── README.md
```

---

# ⚛ FRONTEND SETUP

## Install

```bash
npm create vite@latest frontend -- --template react

cd frontend

npm install

npm install react-router-dom axios framer-motion recharts lucide-react

npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

---

# 🎨 Tailwind Config

## tailwind.config.js

```js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

# 🧠 MAIN ENTRY

## src/main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

# 🌐 APP ROUTER

## src/App.jsx

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ComplaintPage from './pages/ComplaintPage'
import TrackingPage from './pages/TrackingPage'
import DashboardPage from './pages/DashboardPage'
import AIMonitorPage from './pages/AIMonitorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/complaint' element={<ComplaintPage />} />
        <Route path='/track' element={<TrackingPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/ai-monitor' element={<AIMonitorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

# 🖥 LANDING PAGE

## src/pages/LandingPage.jsx

```jsx
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-black text-white'>
      <section className='flex flex-col items-center justify-center h-screen'>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-6xl font-bold'
        >
          JanMitra AI
        </motion.h1>

        <p className='mt-6 text-xl text-gray-400'>
          AI-Powered Governance Operating System
        </p>

        <button className='mt-8 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition'>
          Launch Platform
        </button>
      </section>
    </div>
  )
}
```

---

# 📝 COMPLAINT PAGE

## src/pages/ComplaintPage.jsx

```jsx
import { useState } from 'react'
import axios from 'axios'

export default function ComplaintPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: '',
    title: '',
    description: '',
  })

  const submitComplaint = async () => {
    const res = await axios.post(
      'http://localhost:5000/api/complaints',
      form
    )

    console.log(res.data)
  }

  return (
    <div className='p-10'>
      <div className='max-w-2xl mx-auto bg-white/10 backdrop-blur-xl p-8 rounded-3xl'>
        <h1 className='text-4xl mb-8'>Submit Complaint</h1>

        <input
          placeholder='Name'
          className='w-full mb-4 p-3 rounded-xl bg-black/30'
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder='Complaint Description'
          className='w-full mb-4 p-3 rounded-xl bg-black/30'
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          onClick={submitComplaint}
          className='bg-cyan-500 px-6 py-3 rounded-xl'
        >
          Submit
        </button>
      </div>
    </div>
  )
}
```

---

# 📊 DASHBOARD PAGE

## src/pages/DashboardPage.jsx

```jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Road', complaints: 120 },
  { name: 'Water', complaints: 80 },
  { name: 'Electricity', complaints: 50 },
]

export default function DashboardPage() {
  return (
    <div className='p-10'>
      <h1 className='text-4xl mb-10'>Governance Dashboard</h1>

      <div className='bg-white/10 p-6 rounded-3xl'>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='complaints' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

---

# 🔥 BACKEND SETUP

## Install Dependencies

```bash
mkdir backend

cd backend

npm init -y

npm install express mongoose cors dotenv axios

npm install nodemon --save-dev
```

---

# ⚙ SERVER

## backend/server.js

```js
const app = require('./app')
require('dotenv').config()

const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
```

---

# 🚀 EXPRESS APP

## backend/app.js

```js
const express = require('express')
const cors = require('cors')

const complaintRoutes = require('./routes/complaintRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/complaints', complaintRoutes)

module.exports = app
```

---

# 📦 COMPLAINT MODEL

## backend/models/Complaint.js

```js
const mongoose = require('mongoose')

const ComplaintSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    area: String,
    title: String,
    description: String,
    image: String,

    category: String,
    department: String,
    urgency: String,
    sentiment: String,

    status: {
      type: String,
      default: 'pending',
    },

    ai_confidence_score: Number,
    priority_score: Number,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Complaint', ComplaintSchema)
```

---

# 🧠 GEMINI AI SERVICE

## backend/services/geminiService.js

```js
const axios = require('axios')

exports.analyzeComplaint = async (text) => {
  try {
    const prompt = `
Analyze this complaint:
${text}

Return JSON only.
`

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    )

    return response.data
  } catch (err) {
    return {
      category: 'other',
      department: 'Other',
      urgency: 'medium',
    }
  }
}
```

---

# 🎯 CONTROLLER

## backend/controllers/complaintController.js

```js
const Complaint = require('../models/Complaint')
const { analyzeComplaint } = require('../services/geminiService')

exports.createComplaint = async (req, res) => {
  try {
    const aiResult = await analyzeComplaint(req.body.description)

    const complaint = await Complaint.create({
      ...req.body,
      category: aiResult.category,
      department: aiResult.department,
      urgency: aiResult.urgency,
      sentiment: aiResult.sentiment,
      ai_confidence_score: aiResult.ai_confidence_score,
      priority_score: aiResult.priority_score,
    })

    res.json(complaint)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getComplaints = async (req, res) => {
  const complaints = await Complaint.find()

  res.json(complaints)
}
```

---

# 🛣 ROUTES

## backend/routes/complaintRoutes.js

```js
const express = require('express')

const {
  createComplaint,
  getComplaints,
} = require('../controllers/complaintController')

const router = express.Router()

router.post('/', createComplaint)
router.get('/', getComplaints)

module.exports = router
```

---

# 🌍 ENV FILE

## backend/.env

```env
PORT=5000

MONGO_URI=YOUR_MONGO_URI

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

# 🚀 RUN PROJECT

## Frontend

```bash
cd frontend

npm run dev
```

---

## Backend

```bash
cd backend

npm run dev
```

---

# 📡 API ENDPOINTS

## Complaints

```bash
POST /api/complaints
GET /api/complaints
GET /api/complaints/:id
```

---

## AI

```bash
POST /api/ai/analyze
```

---

## Dashboard

```bash
GET /api/dashboard/stats
```

---

# 🧠 FUTURE IMPROVEMENTS

* Voice complaint support
* WhatsApp integration
* AI heatmaps
* Officer dashboard
* Role-based authentication
* Real-time notifications
* Predictive AI analytics
* GIS mapping
* Smart escalation engine

---

# 🏆 HACKATHON ADVANTAGES

✅ Enterprise-grade architecture
✅ Real civic use-case
✅ AI-first governance system
✅ Smart city infrastructure
✅ Multilingual support
✅ AI analytics dashboard
✅ Real-time complaint routing
✅ High scalability potential

---

# ❤️ Vision

"Building AI-powered transparent governance systems for smart cities and digital India."
