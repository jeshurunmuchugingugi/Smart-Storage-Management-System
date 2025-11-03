#!/usr/bin/env python3
"""
Fix database schema for size column
This script recreates the database with the correct schema
"""
from app import app, db
from models import Admin, StorageUnit, Feature, Booking, Payment, TransportationRequest
import os

def fix_database():
    with app.app_context():
        try:
            print("Fixing database schema...")
            
            # Backup approach: Drop and recreate tables
            print("Dropping all tables...")
            db.drop_all()
            
            print("Creating tables with new schema...")
            db.create_all()
            
            # Create default admin
            admin = Admin(username='admin', email='admin@storage.com', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            
            # Create sample storage units
            units_data = [
                {'unit_number': 'A101', 'site': 'Main Storage', 'size': '5x5', 'monthly_rate': 50.00, 'status': 'available', 'location': 'Building A, Floor 1'},
                {'unit_number': 'A102', 'site': 'Main Storage', 'size': '10x10', 'monthly_rate': 100.00, 'status': 'available', 'location': 'Building A, Floor 1'},
                {'unit_number': 'B201', 'site': 'Downtown Storage', 'size': '5x10', 'monthly_rate': 75.00, 'status': 'available', 'location': 'Building B, Floor 2'},
            ]
            
            for unit_data in units_data:
                unit = StorageUnit(**unit_data)
                db.session.add(unit)
            
            db.session.commit()
            print("✓ Database fixed successfully!")
            print("\nDefault admin credentials:")
            print("  Username: admin")
            print("  Password: admin123")
            
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error fixing database: {str(e)}")
            return False
        
        return True

if __name__ == '__main__':
    success = fix_database()
    exit(0 if success else 1)
