# M-Pesa Integration - Quick Start

## 🎯 What Was Added

### Backend (Python/Flask)
1. **mpesa_service.py** - M-Pesa API integration service
2. **New API endpoints** in app.py:
   - `/api/mpesa/stkpush` - Initiate payment
   - `/api/mpesa/callback` - Receive payment confirmation
   - `/api/mpesa/query` - Check payment status
3. **Database fields** added to Payment model:
   - mpesa_receipt_number
   - checkout_request_id
   - merchant_request_id
   - phone_number

### Frontend (React)
1. **Payment.js** - Updated to support M-Pesa STK Push
   - Prompts user for phone number
   - Initiates STK Push
   - Polls for payment completion

## 🚀 Setup Steps (5 minutes)

### 1. Install Dependencies
```bash
cd server
pip install python-dotenv
```

### 2. Get M-Pesa Credentials
- Go to: https://developer.safaricom.co.ke/
- Register and create an app
- Get: Consumer Key, Consumer Secret, Passkey

### 3. Configure Environment
```bash
cd server
cp .env.example .env
nano .env  # Edit with your credentials
```

Add:
```env
MPESA_CONSUMER_KEY=your_key_here
MPESA_CONSUMER_SECRET=your_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/mpesa/callback
```

### 4. Setup Callback URL (Local Testing)
```bash
# Install ngrok
brew install ngrok

# Start ngrok
ngrok http 5001

# Copy the HTTPS URL and update .env
```

### 5. Update Database
```bash
cd server
flask db migrate -m "Add M-Pesa fields"
flask db upgrade
```

Or run SQL directly:
```sql
ALTER TABLE payment ADD COLUMN mpesa_receipt_number VARCHAR(100);
ALTER TABLE payment ADD COLUMN checkout_request_id VARCHAR(100);
ALTER TABLE payment ADD COLUMN merchant_request_id VARCHAR(100);
ALTER TABLE payment ADD COLUMN phone_number VARCHAR(20);
```

### 6. Start Server
```bash
cd server
python app.py
```

## 🧪 Test It

### Sandbox Test Numbers
- Phone: 254708374149 or 254712345678
- PIN: 1234

### Test Flow
1. Create a booking in your app
2. Go to payment page
3. Select "M-PESA"
4. Enter test phone number
5. Wait for confirmation (auto-completes in sandbox)

## 📱 How It Works

```
Customer → Clicks "Pay with M-Pesa"
         ↓
Frontend → Asks for phone number
         ↓
Backend  → Sends STK Push to M-Pesa API
         ↓
M-Pesa   → Sends prompt to customer's phone
         ↓
Customer → Enters PIN on phone
         ↓
M-Pesa   → Processes payment
         ↓
M-Pesa   → Sends callback to your server
         ↓
Backend  → Updates payment status
         ↓
Frontend → Shows success message
```

## 🔧 Key Files Modified

1. **server/mpesa_service.py** (NEW) - M-Pesa API integration
2. **server/app.py** - Added 3 new endpoints
3. **server/models.py** - Added M-Pesa fields to Payment
4. **server/config.py** - Added M-Pesa config
5. **server/.env.example** (NEW) - Environment template
6. **client/src/components/Payment.js** - M-Pesa payment flow

## ⚠️ Important Notes

1. **Callback URL must be HTTPS** - Use ngrok for local testing
2. **Phone format**: 254XXXXXXXXX (no + or spaces)
3. **Sandbox auto-completes** after 30 seconds
4. **Production requires approval** from Safaricom
5. **Never commit .env** - Add to .gitignore

## 🐛 Common Issues

**"Failed to get access token"**
- Check Consumer Key/Secret in .env
- Verify credentials are correct

**"Callback not received"**
- Ensure ngrok is running
- Check callback URL in .env is HTTPS
- Verify URL matches ngrok output

**"Invalid phone number"**
- Use format: 254712345678
- Remove +, spaces, or dashes

## 📚 Full Documentation

See `MPESA_SETUP_GUIDE.md` for complete documentation.

## 🎉 You're Done!

Your storage system now accepts M-Pesa payments! 🚀
