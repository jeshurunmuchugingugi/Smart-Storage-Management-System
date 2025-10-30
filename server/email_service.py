import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import logging

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@storage.com')
        self.enabled = bool(self.api_key)
        
        if not self.enabled:
            logging.warning("SendGrid API key not configured. Email notifications disabled.")
    
    def send_booking_confirmation(self, booking_data):
        """Send booking confirmation email"""
        if not self.enabled:
            logging.info("Email disabled - would have sent booking confirmation")
            return {'success': False, 'message': 'Email service not configured'}
        
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=booking_data['customer_email'],
                subject='Booking Confirmation - Smart Storage',
                html_content=f"""
                <h2>Booking Confirmed!</h2>
                <p>Dear {booking_data['customer_name']},</p>
                <p>Your storage unit booking has been confirmed.</p>
                <h3>Booking Details:</h3>
                <ul>
                    <li><strong>Booking ID:</strong> {booking_data['booking_id']}</li>
                    <li><strong>Unit:</strong> {booking_data.get('unit_number', 'N/A')}</li>
                    <li><strong>Start Date:</strong> {booking_data['start_date']}</li>
                    <li><strong>End Date:</strong> {booking_data['end_date']}</li>
                    <li><strong>Total Cost:</strong> KES {booking_data['total_cost']}</li>
                </ul>
                <p>Thank you for choosing Smart Storage!</p>
                """
            )
            
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            
            logging.info(f"Booking confirmation sent to {booking_data['customer_email']}")
            return {'success': True, 'status_code': response.status_code}
        except Exception as e:
            logging.error(f"Failed to send booking confirmation: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_payment_receipt(self, payment_data):
        """Send payment receipt email"""
        if not self.enabled:
            logging.info("Email disabled - would have sent payment receipt")
            return {'success': False, 'message': 'Email service not configured'}
        
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=payment_data['customer_email'],
                subject='Payment Receipt - Smart Storage',
                html_content=f"""
                <h2>Payment Received!</h2>
                <p>Dear {payment_data['customer_name']},</p>
                <p>We have received your payment.</p>
                <h3>Payment Details:</h3>
                <ul>
                    <li><strong>Receipt Number:</strong> {payment_data.get('receipt_number', 'N/A')}</li>
                    <li><strong>Amount:</strong> KES {payment_data['amount']}</li>
                    <li><strong>Payment Method:</strong> {payment_data['payment_method']}</li>
                    <li><strong>Booking ID:</strong> {payment_data['booking_id']}</li>
                </ul>
                <p>Thank you for your payment!</p>
                """
            )
            
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            
            logging.info(f"Payment receipt sent to {payment_data['customer_email']}")
            return {'success': True, 'status_code': response.status_code}
        except Exception as e:
            logging.error(f"Failed to send payment receipt: {str(e)}")
            return {'success': False, 'error': str(e)}
