# 🚀 SendGrid Email Integration - Quick Start

## ⏱️ 5-Minute Setup

### 1. Get SendGrid API Key (2 minutes)

1. Go to https://sendgrid.com/free
2. Sign up (free account = 100 emails/day)
3. Navigate to **Settings** → **API Keys**
4. Click **Create API Key**
5. Name it "Smart Storage" and select **Full Access**
6. **COPY THE KEY** (you'll only see it once!)

### 2. Verify Sender Email (2 minutes)

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details (use your real email)
4. Check your email inbox
5. Click the verification link

### 3. Configure Your App (1 minute)

Edit `server/.env`:

```bash
SENDGRID_API_KEY=SG.paste_your_key_here
SENDGRID_FROM_EMAIL=your_verified_email@example.com
```

### 4. Install & Test

```bash
cd server
pip install -r requirements.txt
python test_email.py your_email@example.com
```

If you see ✅ messages, you're done!

---

## 📧 What Happens Now?

### Automatic Emails Sent:

1. **Customer books a unit** → Booking confirmation email
2. **M-Pesa payment succeeds** → Payment receipt email

### Email Contains:

**Booking Confirmation:**
- Booking ID
- Unit details
- Dates
- Total cost

**Payment Receipt:**
- Receipt number
- Amount paid
- Payment method
- Booking reference

---

## 🧪 Test It

### Option 1: Use Test Script
```bash
python server/test_email.py your_email@example.com
```

### Option 2: Create Real Booking
1. Start server: `python server/app.py`
2. Start client: `npm start` (in client directory)
3. Book a storage unit with your email
4. Check your inbox!

---

## ⚠️ Troubleshooting

### No Email Received?

1. **Check spam folder** - SendGrid emails might go to spam initially
2. **Verify sender email** - Must be verified in SendGrid dashboard
3. **Check API key** - Make sure it's correctly copied to `.env`
4. **Check logs** - Look for errors in server console

### Common Errors

| Error | Solution |
|-------|----------|
| "Unauthorized" | API key is wrong or not set |
| "Forbidden" | Sender email not verified |
| "Email disabled" | API key not in `.env` file |

---

## 🎯 Without SendGrid?

The system works fine without SendGrid:
- Bookings still work ✅
- Payments still work ✅
- Emails just won't send (logged instead)

This is called "graceful degradation" - the app doesn't break!

---

## 📊 Monitor Your Emails

SendGrid Dashboard: https://app.sendgrid.com

- See all sent emails
- Track delivery rates
- View bounces/blocks
- Check usage (free tier = 100/day)

---

## 🎉 You're Done!

Your Smart Storage system now sends professional emails automatically.

**Next Steps:**
- Customize email templates in `server/email_service.py`
- Add more email types (reminders, admin notifications)
- Monitor SendGrid dashboard for delivery stats

---

**Need Help?** Check [EMAIL_INTEGRATION.md](EMAIL_INTEGRATION.md) for full documentation.
