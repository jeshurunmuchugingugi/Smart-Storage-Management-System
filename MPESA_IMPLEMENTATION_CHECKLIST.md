# M-Pesa Implementation Checklist

## Phase 1: Setup & Configuration ⚙️

### Account Setup
- [ ] Register at https://developer.safaricom.co.ke/
- [ ] Verify email address
- [ ] Complete profile information
- [ ] Create new app (Lipa Na M-Pesa Online)
- [ ] Note down Consumer Key
- [ ] Note down Consumer Secret
- [ ] Get Sandbox Passkey
- [ ] Get Business Short Code (Sandbox: 174379)

### Local Environment
- [ ] Install Python dependencies: `pip install python-dotenv requests`
- [ ] Create `.env` file from `.env.example`
- [ ] Add M-Pesa credentials to `.env`
- [ ] Add `.env` to `.gitignore`
- [ ] Install ngrok: `brew install ngrok`
- [ ] Start ngrok: `ngrok http 5001`
- [ ] Copy ngrok HTTPS URL
- [ ] Update `MPESA_CALLBACK_URL` in `.env`

### Database
- [ ] Run migration: `flask db migrate -m "Add M-Pesa fields"`
- [ ] Apply migration: `flask db upgrade`
- [ ] Verify new columns in payment table
- [ ] Test database connection

### Code Integration
- [ ] Verify `mpesa_service.py` exists
- [ ] Verify `app.py` has new endpoints
- [ ] Verify `models.py` has M-Pesa fields
- [ ] Verify `config.py` loads environment variables
- [ ] Verify `Payment.js` has M-Pesa logic

## Phase 2: Testing 🧪

### Unit Tests
- [ ] Run test script: `python test_mpesa.py`
- [ ] Verify credentials are loaded
- [ ] Verify access token generation works
- [ ] Test STK Push with test number

### Integration Tests
- [ ] Start Flask server: `python app.py`
- [ ] Start React app: `npm start`
- [ ] Create a test booking
- [ ] Navigate to payment page
- [ ] Select M-Pesa payment method
- [ ] Enter test phone: 254708374149
- [ ] Verify STK push is sent
- [ ] Check server logs for callback
- [ ] Verify payment status updates
- [ ] Verify booking status changes to "active"

### API Endpoint Tests
- [ ] Test POST `/api/mpesa/stkpush`
- [ ] Test POST `/api/mpesa/callback`
- [ ] Test POST `/api/mpesa/query`
- [ ] Test GET `/api/payments` (verify M-Pesa fields)

### Error Handling Tests
- [ ] Test with invalid phone number
- [ ] Test with missing credentials
- [ ] Test with expired token
- [ ] Test callback timeout
- [ ] Test network failure

## Phase 3: Sandbox Testing 📱

### Sandbox Scenarios
- [ ] Test successful payment (254708374149)
- [ ] Test with different amounts (1, 10, 100, 1000)
- [ ] Test payment cancellation
- [ ] Test timeout scenario
- [ ] Test insufficient funds
- [ ] Test invalid PIN
- [ ] Monitor callback responses
- [ ] Verify transaction logs

### User Experience
- [ ] Payment prompt appears on phone
- [ ] Loading states work correctly
- [ ] Success message displays
- [ ] Error messages are clear
- [ ] Redirect works after payment
- [ ] Payment status updates in real-time

## Phase 4: Production Preparation 🚀

### Production Credentials
- [ ] Apply for production access on Safaricom portal
- [ ] Submit required documents
- [ ] Wait for approval (can take 1-2 weeks)
- [ ] Receive production credentials
- [ ] Get production Business Short Code
- [ ] Get production Passkey
- [ ] Update `.env` with production credentials

### Deployment
- [ ] Deploy backend to production server
- [ ] Ensure server has HTTPS/SSL certificate
- [ ] Update `MPESA_CALLBACK_URL` to production URL
- [ ] Update `base_url` in `mpesa_service.py` to production
- [ ] Test production credentials
- [ ] Set up monitoring/logging
- [ ] Configure error alerts

### Security Checklist
- [ ] Environment variables not in version control
- [ ] HTTPS enabled on production
- [ ] Callback endpoint validates requests
- [ ] Rate limiting implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CORS configured correctly
- [ ] Sensitive data encrypted

## Phase 5: Go Live 🎉

### Pre-Launch
- [ ] Test with real phone number (small amount)
- [ ] Verify callback is received
- [ ] Verify payment is recorded
- [ ] Verify booking is activated
- [ ] Test refund process (if implemented)
- [ ] Review all logs
- [ ] Backup database

### Launch
- [ ] Enable M-Pesa in production
- [ ] Monitor first transactions closely
- [ ] Check callback logs
- [ ] Verify payment reconciliation
- [ ] Test customer support flow

### Post-Launch
- [ ] Monitor transaction success rate
- [ ] Track callback response times
- [ ] Review error logs daily
- [ ] Collect user feedback
- [ ] Optimize based on metrics

## Phase 6: Maintenance & Optimization 🔧

### Daily Tasks
- [ ] Check transaction logs
- [ ] Monitor error rates
- [ ] Review failed payments
- [ ] Respond to customer issues

### Weekly Tasks
- [ ] Reconcile payments with M-Pesa statements
- [ ] Review callback success rate
- [ ] Analyze payment patterns
- [ ] Update documentation

### Monthly Tasks
- [ ] Review API usage
- [ ] Check for API updates from Safaricom
- [ ] Optimize database queries
- [ ] Update dependencies
- [ ] Security audit

## Additional Features (Optional) 🌟

### Enhanced Features
- [ ] Add payment history page
- [ ] Implement refund functionality
- [ ] Add transaction receipts
- [ ] Email payment confirmations
- [ ] SMS payment notifications
- [ ] Payment analytics dashboard
- [ ] Recurring payments
- [ ] Payment reminders

### Advanced Integration
- [ ] B2C payments (pay customers)
- [ ] B2B payments (business to business)
- [ ] Account balance check
- [ ] Transaction status query
- [ ] Bulk payments
- [ ] Payment scheduling

## Documentation 📚

- [ ] Read `MPESA_QUICK_START.md`
- [ ] Read `MPESA_SETUP_GUIDE.md`
- [ ] Read `MPESA_ARCHITECTURE.md`
- [ ] Review Safaricom API docs
- [ ] Document custom changes
- [ ] Create user guide
- [ ] Create admin guide

## Support & Resources 📞

### Safaricom Support
- Email: developer@safaricom.co.ke
- Portal: https://developer.safaricom.co.ke/
- Docs: https://developer.safaricom.co.ke/Documentation
- Community: https://developer.safaricom.co.ke/community

### Internal Resources
- [ ] Set up internal documentation
- [ ] Create troubleshooting guide
- [ ] Document common issues
- [ ] Create FAQ for customers
- [ ] Train support team

## Success Metrics 📊

### Track These Metrics
- [ ] Payment success rate (target: >95%)
- [ ] Average payment time (target: <30 seconds)
- [ ] Callback success rate (target: >99%)
- [ ] Customer satisfaction
- [ ] Failed payment reasons
- [ ] Peak transaction times

## Compliance ✅

### Legal Requirements
- [ ] Terms of service updated
- [ ] Privacy policy includes payment data
- [ ] Refund policy documented
- [ ] Transaction records retention (7 years)
- [ ] Data protection compliance
- [ ] PCI compliance (if storing card data)

## Emergency Procedures 🚨

### If Something Goes Wrong
- [ ] Document rollback procedure
- [ ] Have backup payment method
- [ ] Create incident response plan
- [ ] Set up emergency contacts
- [ ] Test disaster recovery

---

## Quick Reference

### Test Credentials (Sandbox)
```
Consumer Key: [From Safaricom Portal]
Consumer Secret: [From Safaricom Portal]
Shortcode: 174379
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
Test Phone: 254708374149
Test PIN: 1234
```

### Important Commands
```bash
# Start ngrok
ngrok http 5001

# Run test script
python test_mpesa.py

# Start server
python app.py

# Database migration
flask db migrate -m "Add M-Pesa fields"
flask db upgrade

# Check logs
tail -f server.log
```

### Key Files
- `server/mpesa_service.py` - M-Pesa integration
- `server/app.py` - API endpoints
- `server/.env` - Configuration
- `client/src/components/Payment.js` - Frontend

---

**Progress Tracker**
- [ ] Phase 1: Setup & Configuration
- [ ] Phase 2: Testing
- [ ] Phase 3: Sandbox Testing
- [ ] Phase 4: Production Preparation
- [ ] Phase 5: Go Live
- [ ] Phase 6: Maintenance & Optimization

**Estimated Timeline**
- Setup: 1-2 hours
- Testing: 2-3 hours
- Sandbox: 1-2 days
- Production Approval: 1-2 weeks
- Go Live: 1 day
- Total: ~2-3 weeks

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

Good luck with your M-Pesa integration! 🚀
