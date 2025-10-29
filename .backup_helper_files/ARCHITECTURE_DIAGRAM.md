# System Architecture Diagram

## Current System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                     http://localhost:3000                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React App)                         │
│                     Port: 3000                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components:                                             │  │
│  │  • StorageUnits.js  → Displays storage units            │  │
│  │  • BookingForm.js   → Handles bookings                  │  │
│  │  • Payment.js       → Processes payments                │  │
│  │  • AdminDashboard.js → Admin management                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls (fetch)
                              │ http://localhost:5001/api/*
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Flask API)                          │
│                     Port: 5001                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Endpoints:                                          │  │
│  │  • GET  /api/units          → List storage units        │  │
│  │  • POST /api/units          → Create storage unit       │  │
│  │  • GET  /api/units/:id      → Get specific unit         │  │
│  │  • POST /api/bookings       → Create booking            │  │
│  │  • GET  /api/bookings/:id   → Get booking details       │  │
│  │  • POST /api/payments       → Create payment            │  │
│  │  • POST /api/mpesa/stkpush  → Initiate M-Pesa payment   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                            │
│              server/instance/storage.db                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tables:                                                 │  │
│  │  • storageunit          → Storage unit data             │  │
│  │  • booking              → Booking records               │  │
│  │  • payment              → Payment transactions          │  │
│  │  • admin                → Admin users                   │  │
│  │  • user                 → Customer users                │  │
│  │  • feature              → Unit features                 │  │
│  │  • transportationrequest → Transport requests           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Problem: Backend Server Not Running

### What Was Happening (BROKEN STATE):

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                     http://localhost:3000                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React App)                         │
│                     Port: 3000                                  │
│                     ✅ RUNNING                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              │ http://localhost:5001/api/*
                              ▼
                        ❌ CONNECTION REFUSED
                        (Backend not running)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Flask API)                          │
│                     Port: 5001                                  │
│                     ❌ NOT RUNNING                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                            │
│              server/instance/storage.db                         │
│                     ✅ EXISTS WITH DATA                         │
│  (Units created by admin are stored here but not accessible)   │
└─────────────────────────────────────────────────────────────────┘
```

### Result:
- ❌ Storage page shows static fallback data (not real units)
- ❌ Booking form cannot fetch unit details
- ❌ Payment page cannot fetch booking details
- ❌ All API operations fail

---

## The Solution: Start Backend Server

### What Should Happen (WORKING STATE):

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                     http://localhost:3000                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React App)                         │
│                     Port: 3000                                  │
│                     ✅ RUNNING                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              │ http://localhost:5001/api/*
                              ▼
                        ✅ CONNECTION SUCCESS
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Flask API)                          │
│                     Port: 5001                                  │
│                     ✅ RUNNING                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                            │
│              server/instance/storage.db                         │
│                     ✅ EXISTS WITH DATA                         │
│  (Units are now accessible through the API)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Result:
- ✅ Storage page displays real units from database
- ✅ Booking form fetches and displays unit details
- ✅ Payment page fetches and displays booking details
- ✅ All API operations work correctly

---

## Data Flow Examples

### Example 1: Viewing Storage Units

**BROKEN (Backend not running):**
```
Browser → StorageUnits.js → fetch('/api/units')
                          → ❌ Connection Refused
                          → Falls back to static data
                          → Shows hardcoded units (not real data)
```

**WORKING (Backend running):**
```
Browser → StorageUnits.js → fetch('/api/units')
                          → Backend API → Database
                          → Returns real units
                          → Displays actual units created in admin
```

---

### Example 2: Booking a Storage Unit

**BROKEN (Backend not running):**
```
Browser → Click "BOOK NOW" → BookingForm.js
                           → fetch('/api/units/1')
                           → ❌ Connection Refused
                           → Shows "Unit Not Found"
```

**WORKING (Backend running):**
```
Browser → Click "BOOK NOW" → BookingForm.js
                           → fetch('/api/units/1')
                           → Backend API → Database
                           → Returns unit details
                           → Displays booking form with unit info
                           → Submit form → POST /api/bookings
                           → Creates booking in database
                           → Redirects to payment page
```

---

### Example 3: Processing Payment

**BROKEN (Backend not running):**
```
Browser → Payment page → fetch('/api/bookings/1')
                      → ❌ Connection Refused
                      → Shows "Booking Not Found"
```

**WORKING (Backend running):**
```
Browser → Payment page → fetch('/api/bookings/1')
                      → Backend API → Database
                      → Returns booking details
                      → Displays payment form
                      → Submit payment → POST /api/mpesa/stkpush
                      → Initiates M-Pesa payment
                      → Updates payment status
```

---

## Admin Dashboard Flow

### Creating Storage Units:

```
Admin Dashboard → Fill form → Click "Create"
                            → POST /api/units
                            → Backend API
                            → INSERT INTO storageunit
                            → Database updated
                            → Admin dashboard refreshes
                            → Shows new unit in admin table
```

### Why units don't show on storage page (when backend is down):

```
Admin creates unit → Stored in database ✅
                  → Admin dashboard shows it ✅
                  → But storage page can't fetch it ❌
                  → Because backend is not running ❌
```

---

## Port Usage

| Service  | Port | Status Required | Purpose                    |
|----------|------|-----------------|----------------------------|
| Frontend | 3000 | ✅ Must be running | Serves React UI          |
| Backend  | 5001 | ✅ Must be running | Serves API and data      |
| Database | N/A  | ✅ File must exist | Stores all data          |

---

## Startup Sequence

### Correct Startup Order:

```
1. Start Backend (Flask)
   cd server
   python3 app.py
   ↓
   Backend initializes database
   Backend starts listening on port 5001
   ✅ Backend ready

2. Start Frontend (React)
   cd client
   npm start
   ↓
   Frontend compiles
   Frontend starts on port 3000
   ✅ Frontend ready

3. Access Application
   Open http://localhost:3000
   ↓
   Frontend makes API calls to backend
   Backend fetches data from database
   ✅ Everything works
```

---

## Quick Check Commands

```bash
# Check if backend is running
lsof -i :5001
# Should show: python3 app.py

# Check if frontend is running
lsof -i :3000
# Should show: node (React dev server)

# Test backend API
curl http://localhost:5001/api/units
# Should return JSON array of units

# Check database
sqlite3 server/instance/storage.db "SELECT COUNT(*) FROM storageunit;"
# Should return number of units
```

---

## Summary

**The Issue**: Backend server (Flask on port 5001) was not running

**The Impact**: 
- Frontend could not fetch data from API
- All database operations failed
- Application fell back to static/dummy data

**The Solution**: Start the backend server
```bash
./START_SERVERS.sh
```

**The Result**: All three issues resolved - storage page shows data, bookings work, payments work
