# Quick Start Guide - Smart Storage Management System

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Servers

```bash
./START_SERVERS.sh
```

This will start:
- **Backend (Flask)** on http://localhost:5001
- **Frontend (React)** on http://localhost:3000

### Step 2: Access the Application

Open your browser and navigate to:
- **Main Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/login
- **Storage Units**: http://localhost:3000/storage

### Step 3: Login to Admin Dashboard

Default admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

---

## 📋 What You Can Do

### As Admin:
1. **Login** at `/admin/login`
2. **Create Storage Units** in the dashboard
3. **View Bookings** and manage reservations
4. **Track Payments** and transaction status

### As Customer:
1. **Browse Storage Units** at `/storage`
2. **Book a Unit** by clicking "BOOK AND PAY NOW"
3. **Complete Payment** via M-Pesa or Card
4. **Request Transportation** (optional) during booking

---

## 🔧 Troubleshooting

### Issue: Storage page shows no data after creating units in admin

**Solution**: Make sure the backend server is running!

```bash
# Check if backend is running
lsof -i :5001

# If not running, start it
cd server
python3 app.py
```

### Issue: Cannot book a storage unit

**Solution**: Backend server must be running on port 5001

```bash
./START_SERVERS.sh
```

### Issue: Cannot access payments page

**Solution**: Ensure you completed the booking successfully and backend is running

---

## 🛑 Stopping the Servers

```bash
./STOP_SERVERS.sh
```

Or manually:
```bash
# Stop backend
lsof -ti:5001 | xargs kill

# Stop frontend
lsof -ti:3000 | xargs kill
```

---

## 📚 More Information

- **Full Troubleshooting Guide**: See `TROUBLESHOOTING.md`
- **API Documentation**: See `docs/` folder
- **M-Pesa Setup**: See `docs/MPESA_SETUP_GUIDE.md`

---

## ⚡ Quick Commands

```bash
# Start servers
./START_SERVERS.sh

# Stop servers
./STOP_SERVERS.sh

# Check server status
lsof -i :5001  # Backend
lsof -i :3000  # Frontend

# View backend logs
tail -f server/backend.log

# Test API
curl http://localhost:5001/api/units

# Check database
sqlite3 server/instance/storage.db "SELECT * FROM storageunit LIMIT 5;"
```

---

## 🎯 Common Workflows

### Creating and Viewing Storage Units

1. Start servers: `./START_SERVERS.sh`
2. Login to admin: http://localhost:3000/admin/login
3. Click "Units / Storage" in sidebar
4. Click "+ Add New Unit"
5. Fill in the form and click "Create"
6. Open http://localhost:3000/storage to see your units

### Booking a Storage Unit

1. Go to http://localhost:3000/storage
2. Click "BOOK AND PAY NOW" on any available unit
3. Fill in your details:
   - Personal information
   - Rental period
   - Transportation (optional)
4. Click "Confirm Booking & Pay"
5. Complete payment on the payment page

### Processing Payments

1. After booking, you'll be redirected to payment page
2. Choose payment method:
   - **M-Pesa**: Enter phone number and complete on your phone
   - **Card**: Enter card details (if configured)
3. Wait for payment confirmation
4. You'll be redirected to home page on success

---

## 🔐 Security Notes

- Default admin password should be changed in production
- M-Pesa credentials should be kept secure in `.env` file
- Never commit `.env` file to version control
- Use HTTPS in production environment

---

## 📞 Need Help?

If you encounter issues:

1. Check `TROUBLESHOOTING.md` for detailed solutions
2. Review server logs for error messages
3. Verify both servers are running
4. Check browser console for frontend errors

---

## ✅ System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 14 or higher
- **npm**: 6 or higher
- **SQLite**: 3 or higher (usually pre-installed)
- **Operating System**: macOS, Linux, or Windows

---

## 🎉 You're All Set!

Your Smart Storage Management System is ready to use. Start by running:

```bash
./START_SERVERS.sh
```

Then visit http://localhost:3000 to see your application in action!
