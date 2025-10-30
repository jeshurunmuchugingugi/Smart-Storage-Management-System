# Import required libraries for HTTP requests, encoding, and authentication
import requests  # For making HTTP API calls to M-Pesa
import base64  # For encoding the password required by M-Pesa API
from datetime import datetime  # For generating timestamps
import os  # For accessing environment variables
from requests.auth import HTTPBasicAuth  # For OAuth authentication

# Service class to handle all M-Pesa payment operations
class MpesaService:
    def __init__(self):
        """
        Initialize the M-Pesa service with credentials and configuration.
        All sensitive credentials are loaded from environment variables for security.
        """
        # Consumer Key: Obtained from Safaricom Daraja portal after creating an app
        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY', '')
        
        # Consumer Secret: Paired with consumer key for OAuth authentication
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET', '')
        
        # Business Short Code: Your organization's M-Pesa paybill or till number
        self.business_short_code = os.getenv('MPESA_SHORTCODE', '')
        
        # Passkey: Provided by Safaricom for generating the transaction password
        self.passkey = os.getenv('MPESA_PASSKEY', '')
        
        # Callback URL: Where M-Pesa will send payment confirmation/failure notifications
        self.callback_url = os.getenv('MPESA_CALLBACK_URL', 'https://yourdomain.com/api/mpesa/callback')
        
        # Base URL for M-Pesa API endpoints
        # Sandbox: For testing without real money transactions
        self.base_url = 'https://sandbox.safaricom.co.ke'
        # Production: Uncomment this when going live with real transactions
        # self.base_url = 'https://api.safaricom.co.ke'
        
    def get_access_token(self):
        """
        Generate OAuth access token for authenticating M-Pesa API requests.
        This token is required for all subsequent API calls and expires after 1 hour.
        
        Returns:
            str: Access token if successful, None if failed
        """
        # Construct the OAuth endpoint URL
        url = f'{self.base_url}/oauth/v1/generate?grant_type=client_credentials'
        
        try:
            # Make GET request with Basic Authentication (consumer_key:consumer_secret)
            response = requests.get(url, auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret))
            
            # Raise exception if request failed (status code 4xx or 5xx)
            response.raise_for_status()
            
            # Extract and return the access token from JSON response
            return response.json().get('access_token')
        except Exception as e:
            # Log error and return None if authentication fails
            print(f"Error getting access token: {str(e)}")
            return None
    
    def generate_password(self):
        """
        Generate the password required for STK Push requests.
        Password is a Base64 encoded string of: Shortcode + Passkey + Timestamp
        
        Returns:
            tuple: (encoded_password, timestamp)
        """
        # Generate timestamp in format: YYYYMMDDHHmmss (e.g., 20240115143022)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        
        # Concatenate: Business Shortcode + Passkey + Timestamp
        data_to_encode = f"{self.business_short_code}{self.passkey}{timestamp}"
        
        # Encode the concatenated string to Base64
        encoded = base64.b64encode(data_to_encode.encode()).decode('utf-8')
        
        # Return both the password and timestamp (timestamp needed in API payload)
        return encoded, timestamp
    
    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """
        Initiate STK Push (Lipa Na M-Pesa Online) - sends payment prompt to customer's phone.
        Customer receives a popup on their phone to enter M-Pesa PIN and complete payment.
        
        Args:
            phone_number (str): Customer phone number in format 254XXXXXXXXX (Kenya country code)
            amount (float): Amount to charge the customer in KES
            account_reference (str): Unique reference for this transaction (e.g., booking ID)
            transaction_desc (str): Human-readable description shown to customer
            
        Returns:
            dict: Response with success status, checkout_request_id, and message
        """
        # Step 1: Get OAuth access token for authentication
        access_token = self.get_access_token()
        if not access_token:
            return {'success': False, 'error': 'Failed to get access token'}
        
        # Step 2: Generate password and timestamp for this transaction
        password, timestamp = self.generate_password()
        
        # Step 3: Construct the STK Push API endpoint
        url = f'{self.base_url}/mpesa/stkpush/v1/processrequest'
        
        # Step 4: Set request headers with Bearer token authentication
        headers = {
            'Authorization': f'Bearer {access_token}',  # OAuth token from step 1
            'Content-Type': 'application/json'  # Indicate JSON payload
        }
        
        # Step 5: Build the request payload with all required parameters
        payload = {
            'BusinessShortCode': self.business_short_code,  # Your paybill/till number
            'Password': password,  # Base64 encoded password from step 2
            'Timestamp': timestamp,  # Timestamp used in password generation
            'TransactionType': 'CustomerPayBillOnline',  # Type of transaction (paybill)
            'Amount': int(amount),  # Amount in KES (must be integer)
            'PartyA': phone_number,  # Customer's phone number (payer)
            'PartyB': self.business_short_code,  # Your business receiving the payment
            'PhoneNumber': phone_number,  # Phone to receive the STK push prompt
            'CallBackURL': self.callback_url,  # Where M-Pesa sends payment result
            'AccountReference': account_reference,  # Your internal reference (e.g., invoice #)
            'TransactionDesc': transaction_desc  # Description shown to customer
        }
        
        try:
            # Step 6: Send POST request to M-Pesa API
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()  # Raise exception for HTTP errors
            result = response.json()  # Parse JSON response
            
            # Step 7: Check if STK push was successfully initiated
            if result.get('ResponseCode') == '0':  # '0' means success
                return {
                    'success': True,
                    'checkout_request_id': result.get('CheckoutRequestID'),  # Use this to query status
                    'merchant_request_id': result.get('MerchantRequestID'),  # M-Pesa's internal ID
                    'message': result.get('CustomerMessage')  # Message shown to customer
                }
            else:
                # STK push request was rejected by M-Pesa
                return {
                    'success': False,
                    'error': result.get('errorMessage', 'STK Push failed')
                }
        except Exception as e:
            # Handle network errors, timeouts, or other exceptions
            return {'success': False, 'error': str(e)}
    
    def query_stk_status(self, checkout_request_id):
        """
        Query the status of an STK Push transaction.
        Use this to check if customer has completed payment after STK push was sent.
        
        Args:
            checkout_request_id (str): The CheckoutRequestID returned from stk_push()
            
        Returns:
            dict: Response with success status and transaction data
        """
        # Step 1: Get OAuth access token
        access_token = self.get_access_token()
        if not access_token:
            return {'success': False, 'error': 'Failed to get access token'}
        
        # Step 2: Generate password and timestamp
        password, timestamp = self.generate_password()
        
        # Step 3: Construct the query API endpoint
        url = f'{self.base_url}/mpesa/stkpushquery/v1/query'
        
        # Step 4: Set request headers
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        # Step 5: Build payload with transaction identifier
        payload = {
            'BusinessShortCode': self.business_short_code,  # Your business number
            'Password': password,  # Base64 encoded password
            'Timestamp': timestamp,  # Current timestamp
            'CheckoutRequestID': checkout_request_id  # ID from the original STK push
        }
        
        try:
            # Step 6: Send query request to M-Pesa
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
            # Return the transaction status data
            # Response includes: ResultCode, ResultDesc, and transaction details
            return {'success': True, 'data': response.json()}
        except Exception as e:
            # Handle errors during status query
            return {'success': False, 'error': str(e)}
