#!/usr/bin/env python3
"""
Test script for SendGrid email integration
Usage: python test_email.py your_email@example.com
"""

import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from email_service import EmailService

def test_booking_email(recipient_email):
    """Test booking confirmation email"""
    print(f"\n📧 Testing booking confirmation email to {recipient_email}...")
    
    email_service = EmailService()
    
    test_data = {
        'booking_id': 999,
        'customer_name': 'Test Customer',
        'customer_email': recipient_email,
        'unit_number': 'TEST-101',
        'start_date': '2025-02-01',
        'end_date': '2025-03-01',
        'total_cost': 5000
    }
    
    result = email_service.send_booking_confirmation(test_data)
    
    if result.get('success'):
        print("✅ Booking confirmation email sent successfully!")
        print(f"   Status code: {result.get('status_code')}")
    else:
        print("❌ Failed to send booking confirmation email")
        print(f"   Error: {result.get('error', result.get('message'))}")
    
    return result.get('success', False)

def test_payment_email(recipient_email):
    """Test payment receipt email"""
    print(f"\n📧 Testing payment receipt email to {recipient_email}...")
    
    email_service = EmailService()
    
    test_data = {
        'booking_id': 999,
        'customer_name': 'Test Customer',
        'customer_email': recipient_email,
        'amount': 5000,
        'payment_method': 'M-Pesa',
        'receipt_number': 'TEST123456'
    }
    
    result = email_service.send_payment_receipt(test_data)
    
    if result.get('success'):
        print("✅ Payment receipt email sent successfully!")
        print(f"   Status code: {result.get('status_code')}")
    else:
        print("❌ Failed to send payment receipt email")
        print(f"   Error: {result.get('error', result.get('message'))}")
    
    return result.get('success', False)

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_email.py your_email@example.com")
        sys.exit(1)
    
    recipient = sys.argv[1]
    
    print("=" * 60)
    print("SendGrid Email Integration Test")
    print("=" * 60)
    
    # Check configuration
    api_key = os.getenv('SENDGRID_API_KEY')
    from_email = os.getenv('SENDGRID_FROM_EMAIL')
    
    print(f"\n🔧 Configuration:")
    print(f"   API Key: {'✅ Set' if api_key else '❌ Not set'}")
    print(f"   From Email: {from_email if from_email else '❌ Not set'}")
    print(f"   Recipient: {recipient}")
    
    if not api_key:
        print("\n⚠️  SENDGRID_API_KEY not set in .env file")
        print("   Emails will not be sent (graceful degradation mode)")
    
    # Run tests
    booking_success = test_booking_email(recipient)
    payment_success = test_payment_email(recipient)
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print(f"Booking Email: {'✅ PASS' if booking_success else '❌ FAIL'}")
    print(f"Payment Email: {'✅ PASS' if payment_success else '❌ FAIL'}")
    
    if booking_success and payment_success:
        print("\n🎉 All tests passed! Check your inbox.")
    elif not api_key:
        print("\n⚠️  Configure SendGrid to enable email sending")
    else:
        print("\n❌ Some tests failed. Check the errors above.")

if __name__ == '__main__':
    main()
