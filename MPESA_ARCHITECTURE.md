# M-Pesa Integration Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR SYSTEM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │   React      │         │   Flask      │                      │
│  │   Frontend   │◄───────►│   Backend    │                      │
│  │              │  HTTP   │              │                      │
│  │ Payment.js   │         │   app.py     │                      │
│  └──────────────┘         └──────┬───────┘                      │
│                                   │                              │
│                                   │                              │
│                          ┌────────▼────────┐                    │
│                          │  mpesa_service  │                    │
│                          │      .py        │                    │
│                          └────────┬────────┘                    │
│                                   │                              │
└───────────────────────────────────┼──────────────────────────────┘
                                    │
                                    │ HTTPS
                                    │
                    ┌───────────────▼────────────────┐
                    │                                 │
                    │    Safaricom M-Pesa API        │
                    │   (Daraja API Gateway)         │
                    │                                 │
                    └───────────────┬─────────────────┘
                                    │
                                    │ STK Push
                                    │
                            ┌───────▼────────┐
                            │                 │
                            │  Customer's     │
                            │  Mobile Phone   │
                            │                 │
                            └─────────────────┘
```

## Payment Flow Sequence

```
Customer                Frontend              Backend              M-Pesa API          Customer Phone
   │                       │                     │                      │                     │
   │  1. Click Pay         │                     │                      │                     │
   ├──────────────────────►│                     │                      │                     │
   │                       │                     │                      │                     │
   │  2. Enter Phone       │                     │                      │                     │
   ├──────────────────────►│                     │                      │                     │
   │                       │                     │                      │                     │
   │                       │  3. POST /mpesa/    │                      │                     │
   │                       │     stkpush         │                      │                     │
   │                       ├────────────────────►│                      │                     │
   │                       │                     │                      │                     │
   │                       │                     │  4. Get Access Token │                     │
   │                       │                     ├─────────────────────►│                     │
   │                       │                     │◄─────────────────────┤                     │
   │                       │                     │                      │                     │
   │                       │                     │  5. Initiate STK     │                     │
   │                       │                     ├─────────────────────►│                     │
   │                       │                     │                      │                     │
   │                       │                     │                      │  6. Send Prompt    │
   │                       │                     │                      ├────────────────────►│
   │                       │  7. Success         │                      │                     │
   │                       │     Response        │                      │                     │
   │                       │◄────────────────────┤                      │                     │
   │                       │                     │                      │                     │
   │  8. "Check Phone"     │                     │                      │                     │
   │◄──────────────────────┤                     │                      │                     │
   │                       │                     │                      │                     │
   │                       │                     │                      │  9. Enter PIN      │
   │                       │                     │                      │◄────────────────────┤
   │                       │                     │                      │                     │
   │                       │                     │  10. Callback        │                     │
   │                       │                     │      (Payment Result)│                     │
   │                       │                     │◄─────────────────────┤                     │
   │                       │                     │                      │                     │
   │                       │                     │  11. Update DB       │                     │
   │                       │                     │      (Payment Status)│                     │
   │                       │                     │                      │                     │
   │                       │  12. Poll Status    │                      │                     │
   │                       ├────────────────────►│                      │                     │
   │                       │◄────────────────────┤                      │                     │
   │                       │  (Status: Completed)│                      │                     │
   │                       │                     │                      │                     │
   │  13. Success Message  │                     │                      │                     │
   │◄──────────────────────┤                     │                      │                     │
   │                       │                     │                      │                     │
```

## Database Schema Changes

```sql
-- Payment Table (BEFORE)
CREATE TABLE payment (
    payment_id INTEGER PRIMARY KEY,
    booking_id INTEGER,
    user_id INTEGER,
    amount NUMERIC(10, 2),
    payment_method VARCHAR(30),
    payment_date DATETIME,
    status VARCHAR(20),
    transaction_id VARCHAR(200)
);

-- Payment Table (AFTER - with M-Pesa fields)
CREATE TABLE payment (
    payment_id INTEGER PRIMARY KEY,
    booking_id INTEGER,
    user_id INTEGER,
    amount NUMERIC(10, 2),
    payment_method VARCHAR(30),
    payment_date DATETIME,
    status VARCHAR(20),
    transaction_id VARCHAR(200),
    -- NEW M-Pesa fields
    mpesa_receipt_number VARCHAR(100),
    checkout_request_id VARCHAR(100),
    merchant_request_id VARCHAR(100),
    phone_number VARCHAR(20)
);
```

## API Endpoints

### 1. Initiate Payment (STK Push)
```
POST /api/mpesa/stkpush

Request:
{
  "booking_id": 123,
  "phone_number": "254712345678",
  "amount": 5000
}

Response (Success):
{
  "success": true,
  "message": "Please check your phone...",
  "checkout_request_id": "ws_CO_123456789"
}

Response (Error):
{
  "error": "Invalid phone number"
}
```

### 2. M-Pesa Callback (Webhook)
```
POST /api/mpesa/callback

Request (from M-Pesa):
{
  "Body": {
    "stkCallback": {
      "ResultCode": 0,
      "ResultDesc": "Success",
      "CheckoutRequestID": "ws_CO_123456789",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 5000},
          {"Name": "MpesaReceiptNumber", "Value": "QAB1CD2E3F"},
          {"Name": "PhoneNumber", "Value": 254712345678}
        ]
      }
    }
  }
}

Response:
{
  "ResultCode": 0,
  "ResultDesc": "Success"
}
```

### 3. Query Payment Status
```
POST /api/mpesa/query

Request:
{
  "checkout_request_id": "ws_CO_123456789"
}

Response:
{
  "success": true,
  "data": {
    "ResultCode": "0",
    "ResultDesc": "Success"
  }
}
```

## File Structure

```
Smart-Storage-Management-System/
├── server/
│   ├── app.py                    # Main Flask app (MODIFIED)
│   ├── models.py                 # Database models (MODIFIED)
│   ├── config.py                 # Configuration (MODIFIED)
│   ├── mpesa_service.py          # M-Pesa integration (NEW)
│   ├── test_mpesa.py             # Test script (NEW)
│   ├── .env                      # Environment variables (NEW)
│   ├── .env.example              # Environment template (NEW)
│   └── requirements.txt          # Python dependencies (MODIFIED)
│
├── client/
│   └── src/
│       └── components/
│           └── Payment.js        # Payment component (MODIFIED)
│
└── Documentation/
    ├── MPESA_SETUP_GUIDE.md      # Full setup guide (NEW)
    ├── MPESA_QUICK_START.md      # Quick start guide (NEW)
    └── MPESA_ARCHITECTURE.md     # This file (NEW)
```

## Environment Variables

```env
# M-Pesa Sandbox (Testing)
MPESA_CONSUMER_KEY=abc123...
MPESA_CONSUMER_SECRET=xyz789...
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/mpesa/callback

# M-Pesa Production (Live)
MPESA_CONSUMER_KEY=prod_key...
MPESA_CONSUMER_SECRET=prod_secret...
MPESA_SHORTCODE=600123
MPESA_PASSKEY=prod_passkey...
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

## Security Considerations

1. **HTTPS Required**: M-Pesa only sends callbacks to HTTPS URLs
2. **Environment Variables**: Never hardcode credentials
3. **Callback Validation**: Verify callback authenticity
4. **Rate Limiting**: Prevent abuse of payment endpoints
5. **Logging**: Log all transactions for audit trail
6. **Error Handling**: Gracefully handle API failures

## Testing Strategy

### Sandbox Testing
- Use test credentials from Safaricom
- Test phone numbers: 254708374149, 254712345678
- Test PIN: 1234
- Payments auto-complete after 30 seconds

### Production Testing
- Start with small amounts
- Test with real phone numbers
- Monitor callback logs
- Verify payment reconciliation

## Monitoring & Logging

```python
# Log all M-Pesa transactions
logging.info(f"STK Push initiated: {checkout_request_id}")
logging.info(f"Callback received: {result_code}")
logging.info(f"Payment completed: {mpesa_receipt_number}")
```

## Troubleshooting Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid Access Token" | Expired token | Token auto-refreshes |
| "Callback not received" | Wrong URL | Check ngrok/callback URL |
| "Invalid phone number" | Wrong format | Use 254XXXXXXXXX |
| "Timeout" | User didn't enter PIN | Implement retry logic |
| "Insufficient funds" | Low M-Pesa balance | Ask user to top up |

## Performance Optimization

1. **Cache Access Token**: Valid for 1 hour
2. **Async Callbacks**: Don't block on callback processing
3. **Database Indexing**: Index checkout_request_id
4. **Connection Pooling**: Reuse HTTP connections
5. **Retry Logic**: Handle transient failures

## Compliance & Regulations

- **PCI DSS**: Not required (M-Pesa handles card data)
- **Data Protection**: Store minimal customer data
- **Transaction Records**: Keep for 7 years (Kenya law)
- **Refunds**: Implement refund process
- **Dispute Resolution**: Handle payment disputes

## Next Steps

1. ✅ Complete setup (see MPESA_QUICK_START.md)
2. ✅ Test in sandbox
3. ✅ Apply for production access
4. ✅ Deploy with HTTPS
5. ✅ Monitor transactions
6. ✅ Handle edge cases
7. ✅ Implement refunds
8. ✅ Add transaction history
