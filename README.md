# FitTrack — Full-Stack Fitness & Workout Tracking Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-22b5bf)](https://recharts.org/)

> **FitTrack** is a full-stack fitness and workout tracking platform designed to help athletes and fitness enthusiasts design structured workout plans, record live gym sessions with progressive overload tracking, log body measurements, and visualize physique transformation over time.

---

## 🚀 Key Features

### 1. 📊 Interactive Recharts Progress Visualizations
- **Weight & Body Fat Trajectory:** Dual-axis Area/Line Chart displaying weight (kg) and body fat (%) alongside user target goal.
- **Volume Overload & Calorie Expenditure:** Composed chart tracking total resistance volume lifted (Sets × Reps × Kg) and energy burn per session.
- **Muscle Focus Radar:** Multi-axis RadarChart analyzing muscle distribution balance (Chest, Back, Legs, Shoulders, Arms, Core).
- **Body Circumference Trends:** Multi-line chart tracking chest, waist, hips, biceps, and thighs over time.

### 2. 🏋️ Workout Plans & Splits
- Pre-loaded with curated training splits (**Push Pull Legs (PPL)**, **Upper / Lower Power**, **HIIT Conditioning**).
- Create custom multi-day plans with target exercises, sets, reps, target weights, and rest intervals.
- 1-click **"Start Workout from Plan"** to auto-load exercise templates into your active workout session.
- Duplicate and customize templates.

### 3. ⏱️ Live Workout Session Logger & Rest Timer
- Track set-by-set execution with live checkbox completion.
- Dynamic real-time calculation of total session volume (kg) and duration.
- **Floating Rest Timer:** Interactive countdown ring with +30s / -15s interval adjustments and audio/visual cues between sets.
- Celebratory confetti feedback upon session completion.

### 4. 📏 Body Measurement & Weigh-In Tracker
- Log morning weigh-ins, body fat percentage, and tape circumferences (Chest, Waist, Hips, Biceps, Thighs).
- Visual delta trackers comparing initial baseline vs current measurements.

### 5. 🔐 Secure JWT Authentication & Demo Mode
- Password encryption via `bcryptjs` and token-based session handling with `jsonwebtoken`.
- **1-Click Demo Login (`Alex Johnson`):** Pre-seeded with 30 days of realistic workouts, volume progression, and body transformation charts for immediate testing.

### 6. 💾 Profile & Data Portability
- Customize height, goal weight, primary fitness target (Hypertrophy, Fat Loss, Endurance), and preferred metric/imperial units.
- **Full JSON Backup Export** to save and migrate your training history.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Recharts, Lucide React, Canvas Confetti, Vite |
| **Backend** | Node.js, Express.js, REST APIs |
| **Database & ODM** | MongoDB, Mongoose (with embedded MongoMemoryServer fallback for 0-setup run) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **Styling** | Vanilla CSS Design System with Obsidian Glassmorphism & Cyber Neon Accents |

---

## 🏁 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone & Setup
```bash
# Clone the repository
git clone https://github.com/Ayush121518/Fit-Track.git
cd Fit-Track
```

### 2. Run Both Server & Client Concurrently
From the root directory:
```bash
npm run dev
```
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Frontend App:** [http://localhost:5173](http://localhost:5173)

*(Alternatively, you can run `npm run server` and `npm run client` in separate terminals).*

### 3. Instant Demo Access
1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Click **"1-Click Demo"** to explore with pre-loaded 30-day fitness history!

---

## 🔌 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user account & seed initial templates
- `POST /api/auth/login` - Authenticate with email & password
- `POST /api/auth/demo` - 1-click test login with seeded demo account
- `GET /api/auth/me` - Get authenticated user profile
- `PUT /api/auth/profile` - Update fitness goals, height, weight, and preferences

### Workout Plans (`/api/workout-plans`)
- `GET /api/workout-plans` - Get user plans & system templates
- `POST /api/workout-plans` - Create a custom workout plan
- `GET /api/workout-plans/:id` - Get specific plan details
- `PUT /api/workout-plans/:id` - Update workout plan
- `DELETE /api/workout-plans/:id` - Delete workout plan
- `POST /api/workout-plans/:id/duplicate` - Clone template into editable user routine

### Workout Logs (`/api/workouts`)
- `GET /api/workouts` - Get historical workout sessions (supports sorting & limits)
- `POST /api/workouts` - Record completed workout with exercises & sets
- `GET /api/workouts/stats/streak` - Calculate consecutive day streak, total volume, calories
- `DELETE /api/workouts/:id` - Delete workout log

### Body Measurements (`/api/measurements`)
- `GET /api/measurements` - Get all weigh-ins and circumference history
- `POST /api/measurements` - Log a new weigh-in & measurements
- `GET /api/measurements/summary` - Compare baseline vs latest metrics & deltas
- `DELETE /api/measurements/:id` - Delete entry

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Pre-aggregated data feeds for Recharts (Weight trend, Volume progression, Muscle distribution radar, Circumference trends)

---

## 👤 Author

**Ayush Yadav**
- GitHub: [@Ayush121518](https://github.com/Ayush121518)
- LinkedIn: [linkedin.com/in/ayush-yadav-b44955346](https://linkedin.com/in/ayush-yadav-b44955346/)
- Email: ayay121518@gmail.com
