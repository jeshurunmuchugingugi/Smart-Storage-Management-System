# 💰 M-Pesa Money Recovery Guide

## ⚠️ URGENT: Your Balance Was Deducted

If your M-Pesa balance reduced after the STK push, follow these steps immediately:

---

## 🔍 Step 1: Verify the Transaction

### Check Your M-Pesa Messages
Look for the M-Pesa confirmation SMS that shows:
- Amount deducted
- Transaction code (e.g., QGH7XYZ123)
- Recipient name/number
- Date and time

### Your Transaction Details:
- **Phone Number**: 254722836384
- **Amount**: KES 70.87
- **Time**: October 29, 2025 at 19:08:57
- **Merchant Request ID**: d19c-4213-90a5-8a1b7f338f6810298

---

## 💸 Step 2: Request Reversal (IMMEDIATE)

### Option A: M-Pesa Reversal via USSD
```
Dial: *234#
Select: Reverse Transaction
Enter: Transaction Code from SMS
Follow prompts
```

### Option B: Contact Safaricom Customer Care
```
Call: 100 or 0722000000 (from Safaricom line)
     +254722000000 (from other networks)

Say: "I need to reverse an M-Pesa transaction"

Provide:
- Your phone number: 254722836384
- Transaction code from SMS
- Amount: KES 70.87
- Reason: "Sent to wrong merchant/test account"
```

### Option C: Visit Safaricom Shop
- Go to nearest Safaricom shop with your ID
- Request transaction reversal
- Provide transaction details

---

## 📧 Step 3: Contact Safaricom Developer Support

Since this was a sandbox test that charged real money:

### Email Safaricom Developer Support
```
To: developer@safaricom.co.ke
Subject: Urgent - Real Money Charged in Sandbox Environment

Dear Safaricom Developer Support,

I was testing the M-Pesa STK Push integration using sandbox credentials 
(Short Code: 174379) and my actual M-Pesa account was charged real money.

Transaction Details:
- Phone Number: 254722836384
- Amount: KES 70.87
- Date/Time: October 29, 2025 at 19:08:57
- Merchant Request ID: d19c-4213-90a5-8a1b7f338f6810298
- Checkout Request ID: ws_CO_29102025190857017722836384

I request an immediate reversal as this was a test transaction in 
sandbox environment and should not have charged real money.

My Developer Portal Email: [YOUR EMAIL]
App Name: [YOUR APP NAME]

Thank you,
[YOUR NAME]
```

---

## 🚨 Step 4: Prevent Future Charges

### IMMEDIATELY Update Your Code

The issue is that you're using SANDBOX credentials but it's hitting PRODUCTION or your phone is registered for real transactions.

**Stop the backend server NOW:**
```bash
# Find the process
lsof -i :5001

# Kill it (replace PID with actual number)
kill [PID]
```

---

## 🔒 Step 5: Verify Sandbox vs Production

### Check if you accidentally used production credentials:

Your current setup:
```
MPESA_SHORTCODE=174379  ← This is SANDBOX
Base URL: https://sandbox.safaricom.co.ke  ← This is SANDBOX
```

**This SHOULD NOT charge real money!**

### Possible Issues:
1. ❌ Your phone number (254722836384) might be registered in production
2. ❌ The shortcode 174379 might have been activated for real transactions
3. ❌ There's a configuration mismatch

---

## 📱 Step 6: Check Transaction Status

Run this to see what M-Pesa returned:

```bash
cd /Users/jeshurun/Documents/Smart-Storage-Management-System/server

python3 -c "
from mpesa_service import MpesaService

mpesa = MpesaService()
result = mpesa.query_stk_status('ws_CO_29102025190857017722836384')
print(result)
"
```

---

## 💡 Important Information

### Sandbox Should NOT Charge Real Money
- Sandbox is for testing ONLY
- No real money should be transferred
- Transactions auto-complete without actual payment

### If Real Money Was Charged:
This indicates one of these problems:
1. Your credentials are actually PRODUCTION (not sandbox)
2. Your phone is whitelisted for production testing
3. There's a Safaricom system error

---

## 📞 Emergency Contacts

### Safaricom M-Pesa Support
- **Customer Care**: 100 (Safaricom) or 0722000000
- **Email**: care@safaricom.co.ke
- **Twitter**: @SafaricomPLC (DM them)

### Safaricom Developer Support
- **Email**: developer@safaricom.co.ke
- **Portal**: https://developer.safaricom.co.ke/
- **Support Ticket**: Login to developer portal → Support

---

## ✅ Recovery Checklist

- [ ] Check M-Pesa SMS for transaction code
- [ ] Try USSD reversal (*234#)
- [ ] Call Safaricom customer care (100)
- [ ] Email developer support
- [ ] Stop your backend server
- [ ] Document all transaction details
- [ ] Visit Safaricom shop if needed
- [ ] Request refund in writing

---

## 🛡️ Prevention for Future

### DO NOT test with real phone numbers until:
1. ✅ Confirmed you're in sandbox
2. ✅ Use test numbers: 254708374149, 254712345678
3. ✅ Verified no real money is charged
4. ✅ Got production approval from Safaricom

### For Testing:
- Use Safaricom's test phone numbers ONLY
- Never use your personal number in sandbox
- Always verify environment before testing

---

## 📋 Transaction Record

Keep this for your records:

```
Transaction Date: October 29, 2025
Time: 19:08:57 EAT
Phone: 254722836384
Amount: KES 70.87
Merchant Request: d19c-4213-90a5-8a1b7f338f6810298
Checkout Request: ws_CO_29102025190857017722836384
Environment: Claimed Sandbox (174379)
Status: Money deducted from customer
```

---

## ⏰ Time Sensitive

**ACT IMMEDIATELY** - M-Pesa reversals are easier within:
- First 24 hours: Automatic reversal possible
- After 24 hours: Manual review required
- After 7 days: More difficult to reverse

**Call 100 NOW and request immediate reversal!**

---

**Last Updated**: October 29, 2025
**Status**: 🚨 URGENT - Money Recovery Needed
