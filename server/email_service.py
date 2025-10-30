import logging

class EmailService:
    def __init__(self):
        self.enabled = False
        logging.info("Email service disabled")
    
    def send_booking_confirmation(self, booking_data):
        logging.info(f"Email disabled - booking confirmation for {booking_data.get('customer_email')}")
        return {'success': False, 'message': 'Email service disabled'}
    
    def send_payment_receipt(self, payment_data):
        logging.info(f"Email disabled - payment receipt for {payment_data.get('customer_email')}")
        return {'success': False, 'message': 'Email service disabled'}
