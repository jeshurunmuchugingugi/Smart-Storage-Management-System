# M-Pesa Integration Setup Guide

## 🚀 Quick Start

### 1. Get M-Pesa Credentials

1. **Register on Safaricom Developer Portal**
   - Visit: https://developer.safaricom.co.ke/
   - Create an account and log in

2. **Create a New App**
   - Go to "My Apps" → "Create New App"
   - Select "Lipa Na M-Pesa Online"
   - Fill in app details

3. **Get Your Credentials**
   - Consumer Key
   - Consumer Secret
   - Business Short Code (Sandbox: 174379)
   - Passkey (provided in sandbox test credentials)

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit `.env` and add your M-Pesa credentials:
   ```env
   MPESA_CONSUMER_KEY=your_actual_consumer_key
   MPESA_CONSUMER_SECRET=your_actual_consumer_secret
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your_actual_passkey
   MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/mpesa/callback
   ```

### 3. Install Dependencies

```bash
cd server
pip install python-dotenv requests
```

### 4. Update Database Schema

Run migration to add M-Pesa fields to Payment table:

```bash
cd server
flask db migrate -m "Add M-Pesa fields to Payment"
flask db upgrade
```

Or manually add columns:
```sql
ALTER TABLE payment ADD COLUMN mpesa_receipt_number VARCHAR(100);
ALTER TABLE payment ADD COLUMN checkout_request_id VARCHAR(100);
ALTER TABLE payment ADD COLUMN merchant_request_id VARCHAR(100);
ALTER TABLE payment ADD COLUMN phone_number VARCHAR(20);
```

### 5. Setup Callback URL (For Local Testing)

M-Pesa needs a public URL to send callbacks. Use ngrok:

1. **Install ngrok**:
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Start ngrok**:
   ```bash
   ngrok http 5001
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Update .env**:
   ```env
   MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/mpesa/callback
   ```

### 6. Update config.py

Add environment variable loading:

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Existing config...
    
    # M-Pesa Config
    MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY')
    MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET')
    MPESA_SHORTCODE = os.getenv('MPESA_SHORTCODE')
    MPESA_PASSKEY = os.getenv('MPESA_PASSKEY')
    MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL')
```

### 7. Start Your Server

```bash
cd server
python app.py
```

## 📱 Testing M-Pesa Integration

### Sandbox Test Credentials

**Test Phone Numbers** (Sandbox):
- 254708374149
- 254712345678

**Test PIN**: 1234 (for sandbox)

### Testing Flow

1. **Create a booking** through your app
2. **Go to payment page**
3. **Select M-Pesa** as payment method
4. **Enter test phone number** when prompted
5. **Check your terminal** - you'll see the STK push request
6. **In production**, user receives prompt on their phone
7. **In sandbox**, payment is auto-completed after 30 seconds

### Monitor Callbacks

Watch your server logs to see M-Pesa callbacks:
```bash
tail -f server/server.log
```

## 🔄 Payment Flow

```
User clicks "Pay with M-Pesa"
    ↓
Frontend calls /api/mpesa/stkpush
    ↓
Backend initiates STK Push to M-Pesa API
    ↓
User receives prompt on phone
    ↓
User enters M-Pesa PIN
    ↓
M-Pesa processes payment
    ↓
M-Pesa sends callback to /api/mpesa/callback
    ↓
Backend updates payment status
    ↓
Frontend polls and detects completion
    ↓
User sees success message
```

## 🔐 Security Best Practices

1. **Never commit .env file** - Add to .gitignore
2. **Use environment variables** for all credentials
3. **Validate callback data** before processing
4. **Use HTTPS** for callback URLs (required by M-Pesa)
5. **Implement rate limiting** on payment endpoints
6. **Log all transactions** for audit trail

## 🚀 Going to Production

### 1. Switch to Production API

In `mpesa_service.py`, change:
```python
self.base_url = 'https://api.safaricom.co.ke'  # Production
```

### 2. Get Production Credentials

- Apply for production access on Safaricom portal
- Get your production Business Short Code (Paybill/Till)
- Get production Consumer Key & Secret
- Get production Passkey

### 3. Update Environment Variables

```env
MPESA_CONSUMER_KEY=production_consumer_key
MPESA_CONSUMER_SECRET=production_consumer_secret
MPESA_SHORTCODE=your_paybill_number
MPESA_PASSKEY=production_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

### 4. Deploy with HTTPS

- Deploy to a server with SSL certificate
- Update callback URL to your production domain
- Test thoroughly before going live

## 📊 API Endpoints

### Initiate Payment
```http
POST /api/mpesa/stkpush
Content-Type: application/json

{
  "booking_id": 1,
  "phone_number": "254712345678",
  "amount": 5000
}
```

### Query Payment Status
```http
POST /api/mpesa/query
Content-Type: application/json

{
  "checkout_request_id": "ws_CO_123456789"
}
```

### Callback (M-Pesa calls this)
```http
POST /api/mpesa/callback
Content-Type: application/json

{
  "Body": {
    "stkCallback": {
      "ResultCode": 0,
      "CheckoutRequestID": "ws_CO_123456789",
      ...
    }
  }
}
```

## 🐛 Troubleshooting

### "Failed to get access token"
- Check Consumer Key and Secret are correct
- Verify you're using correct API URL (sandbox vs production)

### "Invalid Access Token"
- Token expires after 1 hour
- Service automatically gets new token for each request

### "Callback not received"
- Ensure ngrok is running
- Check callback URL is correct in .env
- Verify callback URL is HTTPS
- Check server logs for errors

### "Payment timeout"
- In sandbox, some test numbers auto-complete after 30 seconds
- In production, user must enter PIN within 60 seconds
- Implement proper timeout handling

## 📞 Support

- **Safaricom Developer Support**: developer@safaricom.co.ke
- **API Documentation**: https://developer.safaricom.co.ke/Documentation
- **Community Forum**: https://developer.safaricom.co.ke/community

## ✅ Checklist

- [ ] Registered on Safaricom Developer Portal
- [ ] Created app and got credentials
- [ ] Configured .env file
- [ ] Installed dependencies
- [ ] Updated database schema
- [ ] Setup ngrok for local testing
- [ ] Tested STK Push in sandbox
- [ ] Verified callback handling
- [ ] Tested payment status polling
- [ ] Ready for production deployment
