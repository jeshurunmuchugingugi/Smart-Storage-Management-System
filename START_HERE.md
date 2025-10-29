# 🚀 START HERE - M-Pesa Integration Setup

## 📋 Complete Setup in 30 Minutes

Follow these steps in order:

---

## ✅ STEP 1: Get Safaricom Credentials (15 min)

### What You Need:
1. Go to: **https://developer.safaricom.co.ke/**
2. Register account
3. Create app (select "Lipa Na M-Pesa Online")
4. Copy these 2 things:
   - ✅ Consumer Key
   - ✅ Consumer Secret

**📖 Detailed Guide**: [MPESA_CREDENTIALS_GUIDE.md](MPESA_CREDENTIALS_GUIDE.md)

---

## ✅ STEP 2: Install Dependencies (2 min)

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
pip install python-dotenv requests
```

---

## ✅ STEP 3: Configure .env File (3 min)

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
cp .env.example .env
nano .env
```

**Add your credentials**:
```env
MPESA_CONSUMER_KEY=your_consumer_key_from_safaricom
MPESA_CONSUMER_SECRET=your_consumer_secret_from_safaricom
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/mpesa/callback
```

Save: `Ctrl+X`, `Y`, `Enter`

---

## ✅ STEP 4: Setup ngrok (3 min)

```bash
# Install
brew install ngrok

# Start
ngrok http 5001
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

**Update .env**:
```bash
nano .env
```
Change:
```env
MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/mpesa/callback
```

---

## ✅ STEP 5: Update Database (2 min)

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
flask db migrate -m "Add M-Pesa fields"
flask db upgrade
```

---

## ✅ STEP 6: Test Setup (2 min)

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
python test_mpesa.py
```

**Expected**: ✅ All checks pass

---

## ✅ STEP 7: Start Everything (3 min)

### Terminal 1 - ngrok:
```bash
ngrok http 5001
```

### Terminal 2 - Flask:
```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
python app.py
```

### Terminal 3 - React:
```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/client
npm start
```

---

## ✅ STEP 8: Test Payment! (5 min)

1. Open: http://localhost:3000
2. Book a storage unit
3. Go to payment page
4. Select "M-PESA"
5. Enter phone: `254708374149`
6. Click "Pay"
7. Wait 30 seconds
8. See success! ✨

---

## 📚 Documentation

| Guide | When to Use |
|-------|-------------|
| **[START_HERE.md](START_HERE.md)** | 👈 You are here |
| **[MPESA_CREDENTIALS_GUIDE.md](MPESA_CREDENTIALS_GUIDE.md)** | Getting Safaricom credentials |
| **[MPESA_REALTIME_SETUP.md](MPESA_REALTIME_SETUP.md)** | Detailed setup instructions |
| **[MPESA_QUICK_START.md](MPESA_QUICK_START.md)** | Quick reference |
| **[MPESA_SETUP_GUIDE.md](MPESA_SETUP_GUIDE.md)** | Complete documentation |

---

## 🐛 Troubleshooting

### ❌ "Failed to get access token"
→ Check Consumer Key/Secret in .env

### ❌ "Callback not received"
→ Check ngrok is running and URL in .env matches

### ❌ "Invalid phone number"
→ Use format: `254708374149` (no +, spaces, or dashes)

**Full troubleshooting**: [MPESA_REALTIME_SETUP.md](MPESA_REALTIME_SETUP.md)

---

## 🎯 Quick Reference

### Test Credentials:
```
Phone: 254708374149 or 254712345678
PIN: 1234 (not needed in sandbox)
Shortcode: 174379
```

### Commands:
```bash
# Test
python test_mpesa.py

# Start ngrok
ngrok http 5001

# Start server
python app.py
```

---

## ✨ What You Get

After setup, your system will:
- ✅ Accept M-Pesa payments
- ✅ Send STK Push to customer's phone
- ✅ Process payments automatically
- ✅ Update booking status
- ✅ Track all transactions

---

## 📞 Need Help?

1. **Check guides** in this folder
2. **Run test script**: `python test_mpesa.py`
3. **Safaricom support**: developer@safaricom.co.ke

---

## 🎉 Ready to Start?

**Next Step**: Open [MPESA_CREDENTIALS_GUIDE.md](MPESA_CREDENTIALS_GUIDE.md) to get your Safaricom credentials!

**Good luck! 🚀💰**
