#!/usr/bin/env python3
"""
Test script for M-Pesa integration
Run this to verify your M-Pesa setup is working
"""

import os
from dotenv import load_dotenv
from mpesa_service import MpesaService

load_dotenv()

def test_credentials():
    """Test if credentials are loaded"""
    print("Checking M-Pesa credentials...")
    
    consumer_key = os.getenv('MPESA_CONSUMER_KEY')
    consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
    shortcode = os.getenv('MPESA_SHORTCODE')
    passkey = os.getenv('MPESA_PASSKEY')
    callback_url = os.getenv('MPESA_CALLBACK_URL')
    
    if not consumer_key:
        print("[ERROR] MPESA_CONSUMER_KEY not found in .env")
        return False
    if not consumer_secret:
        print("[ERROR] MPESA_CONSUMER_SECRET not found in .env")
        return False
    if not shortcode:
        print("[ERROR] MPESA_SHORTCODE not found in .env")
        return False
    if not passkey:
        print("[ERROR] MPESA_PASSKEY not found in .env")
        return False
    if not callback_url:
        print("[ERROR] MPESA_CALLBACK_URL not found in .env")
        return False
    
    print("[SUCCESS] All credentials found")
    print(f"   Consumer Key: {consumer_key[:10]}...")
    print(f"   Shortcode: {shortcode}")
    print(f"   Callback URL: {callback_url}")
    return True

def test_access_token():
    """Test if we can get access token"""
    print("\nTesting access token generation...")
    
    mpesa = MpesaService()
    token = mpesa.get_access_token()
    
    if token:
        print(f"[SUCCESS] Access token obtained: {token[:20]}...")
        return True
    else:
        print("[ERROR] Failed to get access token")
        print("   Check your Consumer Key and Secret")
        return False

def test_stk_push():
    """Test STK Push (optional - will send actual request)"""
    print("\nSTK Push Test")
    print("[WARNING] This will send an actual payment request!")
    
    response = input("Do you want to test STK Push? (yes/no): ")
    if response.lower() != 'yes':
        print("Skipped STK Push test")
        return True
    
    phone = input("Enter test phone number (254XXXXXXXXX): ")
    amount = input("Enter test amount (e.g., 1): ")
    
    print(f"\nSending STK Push to {phone} for KES {amount}...")
    
    mpesa = MpesaService()
    result = mpesa.stk_push(
        phone_number=phone,
        amount=amount,
        account_reference="TEST-001",
        transaction_desc="Test Payment"
    )
    
    if result.get('success'):
        print("[SUCCESS] STK Push sent successfully!")
        print(f"   Checkout Request ID: {result.get('checkout_request_id')}")
        print(f"   Message: {result.get('message')}")
        return True
    else:
        print("[ERROR] STK Push failed")
        print(f"   Error: {result.get('error')}")
        return False

def main():
    print("=" * 60)
    print("M-PESA INTEGRATION TEST")
    print("=" * 60)
    
    # Test 1: Credentials
    if not test_credentials():
        print("\n[ERROR] Setup incomplete. Please configure .env file")
        print("   See .env.example for reference")
        return
    
    # Test 2: Access Token
    if not test_access_token():
        print("\n[ERROR] Cannot connect to M-Pesa API")
        print("   Verify your credentials are correct")
        return
    
    # Test 3: STK Push (optional)
    test_stk_push()
    
    print("\n" + "=" * 60)
    print("[SUCCESS] M-Pesa integration test complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("   1. Start your Flask server: python app.py")
    print("   2. Start ngrok: ngrok http 5001")
    print("   3. Update MPESA_CALLBACK_URL in .env with ngrok URL")
    print("   4. Test payment flow in your app")

if __name__ == '__main__':
    main()
