# 🚀 M-Pesa Real-Time Setup Guide

## Step-by-Step Instructions to Make M-Pesa Work NOW

---

## PART 1: Get Credentials from Safaricom (15 minutes)

### Step 1: Register on Safaricom Developer Portal

1. **Go to**: https://developer.safaricom.co.ke/
2. **Click**: "Sign Up" (top right)
3. **Fill in**:
   - Email address
   - Password
   - Phone number
   - Organization name
4. **Verify** your email (check inbox/spam)
5. **Login** to the portal

### Step 2: Create Your App

1. **Click**: "My Apps" in the menu
2. **Click**: "Create New App" button
3. **Fill in**:
   - App Name: `Smart Storage Payment`
   - Description: `Storage unit booking payment system`
4. **Select APIs**: Check "Lipa Na M-Pesa Online"
5. **Click**: "Create App"

### Step 3: Get Your Credentials

After creating the app, you'll see:

```
📋 COPY THESE EXACTLY:

Consumer Key: 
[Example: xQq9vKjKl8mNoPqRsTuVwXyZ1234567890]

Consumer Secret:
[Example: AbCdEfGhIjKlMnOp1234567890QrStUvWxYz]
```

**⚠️ IMPORTANT**: Keep these secret! Don't share them.

### Step 4: Get Sandbox Test Credentials

Safaricom provides these for testing:

```
Business Short Code: 174379
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919

Test Phone Numbers:
- 254708374149
- 254712345678

Test PIN: 1234
```

---

## PART 2: Setup Your Project (10 minutes)

### Step 1: Install Dependencies

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
pip install python-dotenv requests
```

### Step 2: Create .env File

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
cp .env.example .env
nano .env
```

### Step 3: Add Your Credentials to .env

**Copy this template and replace with YOUR credentials:**

```env
# M-Pesa Sandbox Configuration
MPESA_CONSUMER_KEY=xQq9vKjKl8mNoPqRsTuVwXyZ1234567890
MPESA_CONSUMER_SECRET=AbCdEfGhIjKlMnOp1234567890QrStUvWxYz
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/mpesa/callback

# Database
DATABASE_URL=sqlite:///instance/storage.db

# JWT Secret
JWT_SECRET_KEY=your-secret-key-here
```

**Replace**:
- `MPESA_CONSUMER_KEY` → Your actual Consumer Key from Step 3
- `MPESA_CONSUMER_SECRET` → Your actual Consumer Secret from Step 3
- `MPESA_CALLBACK_URL` → We'll get this in the next step

**Save**: Press `Ctrl+X`, then `Y`, then `Enter`

---

## PART 3: Setup Callback URL (5 minutes)

M-Pesa needs a public HTTPS URL to send payment confirmations. We'll use ngrok.

### Step 1: Install ngrok

```bash
# On macOS
brew install ngrok

# Or download from: https://ngrok.com/download
```

### Step 2: Start ngrok

```bash
ngrok http 5001
```

You'll see output like this:

```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:5001

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### Step 3: Copy the HTTPS URL

**Copy this URL**: `https://abc123def456.ngrok.io`

⚠️ **IMPORTANT**: 
- Use the HTTPS URL (not HTTP)
- Your URL will be different each time you restart ngrok
- Keep ngrok running while testing

### Step 4: Update .env with Callback URL

```bash
nano .env
```

Update this line:
```env
MPESA_CALLBACK_URL=https://abc123def456.ngrok.io/api/mpesa/callback
```

Replace `abc123def456` with YOUR ngrok URL.

**Save**: `Ctrl+X`, `Y`, `Enter`

---

## PART 4: Update Database (2 minutes)

### Add M-Pesa Fields to Database

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server

# Create migration
flask db migrate -m "Add M-Pesa fields to Payment"

# Apply migration
flask db upgrade
```

**If you get an error**, run this SQL directly:

```bash
sqlite3 instance/storage.db
```

Then paste:

```sql
ALTER TABLE payment ADD COLUMN mpesa_receipt_number VARCHAR(100);
ALTER TABLE payment ADD COLUMN checkout_request_id VARCHAR(100);
ALTER TABLE payment ADD COLUMN merchant_request_id VARCHAR(100);
ALTER TABLE payment ADD COLUMN phone_number VARCHAR(20);
.quit
```

---

## PART 5: Test Your Setup (5 minutes)

### Step 1: Test Credentials

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
python test_mpesa.py
```

**Expected Output**:
```
============================================================
M-PESA INTEGRATION TEST
============================================================
🔍 Checking M-Pesa credentials...
✅ All credentials found
   Consumer Key: xQq9vKjKl8...
   Shortcode: 174379
   Callback URL: https://abc123def456.ngrok.io/api/mpesa/callback

🔑 Testing access token generation...
✅ Access token obtained: eyJ0eXAiOiJKV1QiLCJ...

============================================================
✅ M-Pesa integration test complete!
============================================================
```

**If you see ✅**, you're good to go!

**If you see ❌**, check:
- Consumer Key and Secret are correct
- No extra spaces in .env file
- Internet connection is working

---

## PART 6: Start Your Application (2 minutes)

### Terminal 1: Start ngrok (keep running)

```bash
ngrok http 5001
```

### Terminal 2: Start Flask Server

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
python app.py
```

**Expected Output**:
```
Database initialized successfully
Starting server on http://localhost:5001
 * Running on http://0.0.0.0:5001
```

### Terminal 3: Start React App

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/client
npm start
```

---

## PART 7: Test Real Payment (5 minutes)

### Step 1: Create a Booking

1. Open browser: http://localhost:3000
2. Browse storage units
3. Click "Book Now" on any unit
4. Fill in booking form
5. Submit booking

### Step 2: Make Payment

1. You'll be redirected to payment page
2. **Select**: "M-PESA" payment method
3. **Enter phone**: `254708374149` (test number)
4. **Click**: "Pay Ksh. XXXX"

### Step 3: Watch the Magic! ✨

**In Sandbox Mode**:
- Payment auto-completes after 30 seconds
- No actual phone prompt (it's simulated)
- You'll see success message

**What Happens**:
1. ✅ STK Push sent to M-Pesa
2. ✅ M-Pesa processes payment
3. ✅ Callback received by your server
4. ✅ Payment status updated
5. ✅ Booking activated
6. ✅ Success message shown

### Step 4: Verify Payment

**Check Server Logs**:
```bash
# In Terminal 2, you should see:
INFO: STK Push initiated: ws_CO_123456789
INFO: Callback received: 0
INFO: Payment completed: QAB1CD2E3F
```

**Check Database**:
```bash
sqlite3 instance/storage.db
SELECT * FROM payment ORDER BY payment_id DESC LIMIT 1;
.quit
```

You should see your payment with M-Pesa receipt number!

---

## PART 8: Troubleshooting

### ❌ "Failed to get access token"

**Problem**: Wrong credentials

**Solution**:
1. Go back to Safaricom portal
2. Copy Consumer Key and Secret again
3. Update .env file
4. Restart Flask server

### ❌ "Callback not received"

**Problem**: Wrong callback URL

**Solution**:
1. Check ngrok is running
2. Copy the HTTPS URL from ngrok
3. Update MPESA_CALLBACK_URL in .env
4. Restart Flask server

### ❌ "Invalid phone number"

**Problem**: Wrong format

**Solution**:
- Use: `254708374149` (starts with 254)
- Not: `+254708374149` or `0708374149`

### ❌ Payment stuck on "Processing"

**Problem**: Callback not reaching server

**Solution**:
1. Check ngrok is running
2. Check Flask server is running
3. Check callback URL in .env matches ngrok URL
4. Wait 30 seconds (sandbox auto-completes)

---

## PART 9: Going to Production (When Ready)

### When You're Ready for Real Payments:

1. **Apply for Production Access**:
   - Go to Safaricom Developer Portal
   - Submit production application
   - Provide business documents
   - Wait 1-2 weeks for approval

2. **Get Production Credentials**:
   - Production Consumer Key
   - Production Consumer Secret
   - Your Paybill/Till Number
   - Production Passkey

3. **Update Code**:

In `server/mpesa_service.py`, change line 15:
```python
# FROM:
self.base_url = 'https://sandbox.safaricom.co.ke'

# TO:
self.base_url = 'https://api.safaricom.co.ke'
```

4. **Update .env**:
```env
MPESA_CONSUMER_KEY=your_production_key
MPESA_CONSUMER_SECRET=your_production_secret
MPESA_SHORTCODE=your_paybill_number
MPESA_PASSKEY=your_production_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

5. **Deploy to Production Server**:
   - Must have HTTPS/SSL certificate
   - Update callback URL to your domain
   - Test with small amounts first

---

## Quick Reference Card

### 📋 What You Need from Safaricom:

```
✅ Consumer Key          (from My Apps)
✅ Consumer Secret       (from My Apps)
✅ Business Short Code   (174379 for sandbox)
✅ Passkey              (provided by Safaricom)
```

### 🔧 Configuration Files:

```
✅ server/.env          (add credentials here)
✅ server/mpesa_service.py  (already created)
✅ server/app.py        (already updated)
```

### 🚀 Commands to Run:

```bash
# Terminal 1
ngrok http 5001

# Terminal 2
cd server && python app.py

# Terminal 3
cd client && npm start
```

### 📱 Test Numbers:

```
Phone: 254708374149
PIN: 1234 (not needed in sandbox)
```

---

## ✅ Checklist

Before testing, make sure:

- [ ] Registered on Safaricom Developer Portal
- [ ] Created app and got Consumer Key & Secret
- [ ] Created .env file with credentials
- [ ] Installed python-dotenv and requests
- [ ] Started ngrok and copied HTTPS URL
- [ ] Updated MPESA_CALLBACK_URL in .env
- [ ] Ran database migration
- [ ] Ran test_mpesa.py successfully
- [ ] Started Flask server (Terminal 2)
- [ ] Started ngrok (Terminal 1)
- [ ] Started React app (Terminal 3)

---

## 🎉 You're Done!

Your M-Pesa integration is now live and working!

**Next Steps**:
1. Test with sandbox numbers
2. Monitor server logs
3. Verify payments in database
4. When ready, apply for production access

**Need Help?**
- Safaricom Support: developer@safaricom.co.ke
- API Docs: https://developer.safaricom.co.ke/Documentation

---

**Good luck! 🚀💰**
