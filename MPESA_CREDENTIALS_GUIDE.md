# 🔑 M-Pesa Credentials - What You Need & Where to Get It

## 📍 Where to Get Everything

### 1. Safaricom Developer Portal
**URL**: https://developer.safaricom.co.ke/

**What you'll get here**:
- ✅ Consumer Key
- ✅ Consumer Secret

---

## 🎯 Exact Steps to Get Credentials

### Step 1: Register Account (5 minutes)

1. Go to: https://developer.safaricom.co.ke/
2. Click: **"Sign Up"** (top right corner)
3. Fill in:
   ```
   Email: your-email@example.com
   Password: (create strong password)
   Phone: 0712345678
   Organization: Your Business Name
   ```
4. Click: **"Register"**
5. Check email and verify account
6. Login with your credentials

---

### Step 2: Create App (3 minutes)

1. After login, click: **"My Apps"** in menu
2. Click: **"Create New App"** button
3. Fill in form:
   ```
   App Name: Smart Storage Payment
   Description: Payment system for storage bookings
   ```
4. Under **"Select APIs"**, check:
   - ☑️ **Lipa Na M-Pesa Online**
5. Click: **"Create App"**

---

### Step 3: Get Your Credentials (1 minute)

After creating app, you'll see a page with:

```
┌─────────────────────────────────────────────────┐
│  App Details                                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  Consumer Key:                                   │
│  xQq9vKjKl8mNoPqRsTuVwXyZ1234567890            │
│  [Copy Button]                                   │
│                                                  │
│  Consumer Secret:                                │
│  AbCdEfGhIjKlMnOp1234567890QrStUvWxYz          │
│  [Copy Button]                                   │
│                                                  │
└─────────────────────────────────────────────────┘
```

**📋 COPY BOTH OF THESE!**

---

### Step 4: Get Sandbox Test Credentials

Safaricom provides these for testing (no need to apply):

```
Business Short Code: 174379
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```

**Test Phone Numbers**:
- 254708374149
- 254712345678

**Test PIN**: 1234 (you won't need to enter this in sandbox)

---

## 📝 Fill in Your .env File

Open: `/Users/jeshurun/Documents/Smart-Storage-Management-System/server/.env`

```env
# ============================================
# M-Pesa Sandbox Configuration
# ============================================

# FROM SAFARICOM PORTAL (Step 3 above)
MPESA_CONSUMER_KEY=PASTE_YOUR_CONSUMER_KEY_HERE
MPESA_CONSUMER_SECRET=PASTE_YOUR_CONSUMER_SECRET_HERE

# SANDBOX TEST CREDENTIALS (provided by Safaricom)
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919

# FROM NGROK (after running: ngrok http 5001)
MPESA_CALLBACK_URL=https://YOUR_NGROK_URL.ngrok.io/api/mpesa/callback

# ============================================
# Other Configuration
# ============================================
DATABASE_URL=sqlite:///instance/storage.db
JWT_SECRET_KEY=your-secret-key-here
```

---

## 🔍 Example of Filled .env File

```env
# Real example (with fake credentials for illustration)
MPESA_CONSUMER_KEY=xQq9vKjKl8mNoPqRsTuVwXyZ1234567890
MPESA_CONSUMER_SECRET=AbCdEfGhIjKlMnOp1234567890QrStUvWxYz
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://abc123def456.ngrok.io/api/mpesa/callback

DATABASE_URL=sqlite:///instance/storage.db
JWT_SECRET_KEY=my-super-secret-key-12345
```

---

## 🚀 Getting ngrok URL

### Install ngrok:
```bash
brew install ngrok
```

### Start ngrok:
```bash
ngrok http 5001
```

### Copy the HTTPS URL:
```
ngrok

Forwarding    https://abc123def456.ngrok.io -> http://localhost:5001
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
              COPY THIS PART
```

### Update .env:
```env
MPESA_CALLBACK_URL=https://abc123def456.ngrok.io/api/mpesa/callback
```

---

## ✅ Verification Checklist

Before testing, verify you have:

- [ ] **Consumer Key** - From Safaricom portal (starts with random letters/numbers)
- [ ] **Consumer Secret** - From Safaricom portal (longer than Consumer Key)
- [ ] **Shortcode** - Use `174379` for sandbox
- [ ] **Passkey** - Use the long string provided above for sandbox
- [ ] **Callback URL** - From ngrok (must start with `https://`)

---

## 🧪 Test Your Credentials

Run this command to verify everything is correct:

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server
python test_mpesa.py
```

**Expected Output**:
```
✅ All credentials found
✅ Access token obtained
```

**If you see ❌**:
- Double-check Consumer Key and Secret
- Make sure no extra spaces in .env
- Verify you copied the complete strings

---

## 📞 What Each Credential Does

| Credential | Purpose | Where to Get |
|------------|---------|--------------|
| **Consumer Key** | Identifies your app | Safaricom Portal → My Apps |
| **Consumer Secret** | Authenticates your app | Safaricom Portal → My Apps |
| **Shortcode** | Your business number | `174379` (sandbox) or your Paybill (production) |
| **Passkey** | Encrypts requests | Provided by Safaricom |
| **Callback URL** | Where M-Pesa sends results | Your ngrok HTTPS URL |

---

## 🔐 Security Tips

1. **Never commit .env** - Already in .gitignore
2. **Don't share credentials** - Keep them secret
3. **Use different credentials** - Sandbox vs Production
4. **Rotate secrets** - Change them periodically in production

---

## 🎯 Quick Commands Reference

```bash
# 1. Create .env file
cd server
cp .env.example .env
nano .env

# 2. Start ngrok
ngrok http 5001

# 3. Test credentials
python test_mpesa.py

# 4. Start server
python app.py
```

---

## 📱 Sandbox vs Production

### Sandbox (Testing)
```env
MPESA_CONSUMER_KEY=from_sandbox_app
MPESA_CONSUMER_SECRET=from_sandbox_app
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```
- Use test phone numbers
- Payments auto-complete
- No real money involved

### Production (Live)
```env
MPESA_CONSUMER_KEY=from_production_app
MPESA_CONSUMER_SECRET=from_production_app
MPESA_SHORTCODE=your_paybill_number
MPESA_PASSKEY=production_passkey_from_safaricom
```
- Use real phone numbers
- Real money transactions
- Requires Safaricom approval

---

## ❓ Common Questions

### Q: Where do I find my Consumer Key after creating the app?
**A**: Login → My Apps → Click your app name → Keys are displayed

### Q: Can I use the same credentials for testing and production?
**A**: No, you need separate credentials for sandbox and production

### Q: How long is the Consumer Key?
**A**: Usually 20-30 characters (letters and numbers)

### Q: What if I lose my Consumer Secret?
**A**: You can regenerate it in the Safaricom portal (My Apps → Your App → Generate New Secret)

### Q: Do I need to pay to get credentials?
**A**: No, sandbox credentials are free. Production requires business verification.

---

## 🆘 Need Help?

### Safaricom Support
- **Email**: developer@safaricom.co.ke
- **Portal**: https://developer.safaricom.co.ke/
- **Docs**: https://developer.safaricom.co.ke/Documentation

### Can't Login to Portal?
- Reset password: https://developer.safaricom.co.ke/forgot-password
- Check spam folder for verification email
- Try different browser

### Can't Create App?
- Make sure you verified your email
- Complete your profile information
- Try logging out and back in

---

## ✨ You're Ready!

Once you have all credentials in your .env file:

1. ✅ Run `python test_mpesa.py`
2. ✅ Start ngrok
3. ✅ Start Flask server
4. ✅ Test payment with `254708374149`

**Good luck! 🚀**
