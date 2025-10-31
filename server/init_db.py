from app import app, db
from models import Admin, StorageUnit, Feature

def init_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✓ Database tables created")
        
        # Check if admin exists
        admin = Admin.query.filter_by(username='admin').first()
        if not admin:
            admin = Admin(username='admin', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✓ Admin user created (username: admin, password: admin123)")
        else:
            print("✓ Admin user already exists")
        
        # Add sample features if none exist
        if Feature.query.count() == 0:
            features = [
                Feature(name='Climate Control'),
                Feature(name='24/7 Access'),
                Feature(name='Security Cameras'),
                Feature(name='Drive-up Access')
            ]
            db.session.add_all(features)
            db.session.commit()
            print("✓ Sample features added")
        
        print("\nDatabase initialization complete!")
        print("You can now start the server with: gunicorn app:app")

if __name__ == '__main__':
    init_database()
