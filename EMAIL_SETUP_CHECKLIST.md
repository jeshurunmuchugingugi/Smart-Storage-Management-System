# ✅ SendGrid Email Setup Checklist

Follow these steps to activate email notifications in your Smart Storage system.

---

## 📋 Pre-Setup Checklist

- [ ] You have access to an email account
- [ ] You can receive verification emails
- [ ] Server is currently stopped (stop it if running)

---

## 🚀 Setup Steps

### Step 1: SendGrid Account (2 minutes)

- [ ] Go to https://sendgrid.com/free
- [ ] Sign up for free account
- [ ] Verify your email address
- [ ] Log in to SendGrid dashboard

### Step 2: Create API Key (1 minute)

- [ ] Navigate to **Settings** → **API Keys**
- [ ] Click **Create API Key**
- [ ] Name: "Smart Storage System"
- [ ] Permission: Select **Full Access**
- [ ] Click **Create & View**
- [ ] **COPY THE KEY** (you won't see it again!)
- [ ] Save it temporarily in a text file

### Step 3: Verify Sender Email (2 minutes)

- [ ] Navigate to **Settings** → **Sender Authentication**
- [ ] Click **Verify a Single Sender**
- [ ] Fill in the form:
  - From Name: "Smart Storage"
  - From Email: Your email address
  - Reply To: Same email
  - Company Address: Any address
- [ ] Click **Create**
- [ ] Check your email inbox
- [ ] Click the verification link
- [ ] Wait for "Verified" status in dashboard

### Step 4: Configure Application (1 minute)

- [ ] Open `server/.env` file in your editor
- [ ] Find the SendGrid section:
  ```bash
  # SendGrid Email Configuration
  SENDGRID_API_KEY=your_sendgrid_api_key_here
  SENDGRID_FROM_EMAIL=noreply@yourdomain.com
  ```
- [ ] Replace `your_sendgrid_api_key_here` with your actual API key
- [ ] Replace `noreply@yourdomain.com` with your verified email
- [ ] Save the file

### Step 5: Install Dependencies (1 minute)

```bash
cd server
pip install -r requirements.txt
```

- [ ] Run the command above
- [ ] Wait for installation to complete
- [ ] Check for any errors (should be none)

### Step 6: Test Email Service (1 minute)

```bash
python test_email.py your_email@example.com
```

- [ ] Replace `your_email@example.com` with your actual email
- [ ] Run the command
- [ ] Look for ✅ success messages
- [ ] Check your email inbox (and spam folder)
- [ ] You should receive 2 test emails

### Step 7: Start Server (30 seconds)

```bash
python app.py
```

- [ ] Start the server
- [ ] Look for "Starting server on http://localhost:5001"
- [ ] Check for any email-related errors (should be none)

### Step 8: Test in Application (2 minutes)

- [ ] Open browser to http://localhost:3000
- [ ] Navigate to storage units
- [ ] Create a booking with your email address
- [ ] Check your inbox for booking confirmation
- [ ] Complete M-Pesa payment (if configured)
- [ ] Check your inbox for payment receipt

---

## ✅ Verification Checklist

### Configuration
- [ ] `SENDGRID_API_KEY` is set in `.env`
- [ ] `SENDGRID_FROM_EMAIL` is set in `.env`
- [ ] Sender email is verified in SendGrid dashboard
- [ ] `sendgrid` package is installed

### Testing
- [ ] Test script runs without errors
- [ ] Booking confirmation email received
- [ ] Payment receipt email received (if tested)
- [ ] Emails not in spam folder

### Application
- [ ] Server starts without email errors
- [ ] Bookings create successfully
- [ ] Emails send after booking
- [ ] System works even if email fails

---

## 🔧 Troubleshooting

### "Email disabled - would have sent..."
**Problem**: API key not configured  
**Solution**: Check `.env` file has correct `SENDGRID_API_KEY`

### "Unauthorized" Error
**Problem**: Invalid API key  
**Solution**: 
1. Create new API key in SendGrid
2. Copy it exactly (no extra spaces)
3. Update `.env` file

### "Forbidden" Error
**Problem**: Sender email not verified  
**Solution**: 
1. Go to SendGrid → Settings → Sender Authentication
2. Verify your sender email
3. Wait for verification email
4. Click verification link

### No Email Received
**Problem**: Email might be in spam  
**Solution**: 
1. Check spam/junk folder
2. Add sender to contacts
3. Check SendGrid dashboard for delivery status

### Test Script Fails
**Problem**: Missing dependencies or config  
**Solution**: 
1. Run `pip install -r requirements.txt`
2. Check `.env` file exists
3. Verify API key is correct

---

## 📊 Success Criteria

You're done when:

✅ Test script shows "All tests passed"  
✅ You received 2 test emails  
✅ Server starts without errors  
✅ Booking creates and sends email  
✅ Email appears in inbox (not spam)

---

## 🎯 What's Next?

After successful setup:

1. **Customize Templates**: Edit `server/email_service.py` to change email design
2. **Monitor Usage**: Check SendGrid dashboard for email stats
3. **Add More Emails**: Implement reminders, admin notifications, etc.
4. **Go Live**: Deploy to production with same configuration

---

## 📞 Need Help?

- **Quick Start**: See `SENDGRID_QUICKSTART.md`
- **Full Docs**: See `EMAIL_INTEGRATION.md`
- **SendGrid Docs**: https://docs.sendgrid.com
- **Test Script**: `python server/test_email.py your@email.com`

---

## 🎉 Completion

Once all checkboxes are ✅, your email integration is complete!

**Estimated Total Time**: 10 minutes  
**Difficulty**: Easy  
**Cost**: Free (100 emails/day)

---

**Last Updated**: January 2025  
**Status**: Ready for Setup
