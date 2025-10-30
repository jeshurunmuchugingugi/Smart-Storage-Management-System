from app import app, db
from models import User
from sqlalchemy import Column, String, inspect, Table, MetaData

with app.app_context():
    inspector = inspect(db.engine)
    columns = [col['name'] for col in inspector.get_columns('user')]
    
    if 'role' not in columns:
        metadata = MetaData()
        user_table = Table('user', metadata, autoload_with=db.engine)
        role_col = Column('role', String(20), default='user')
        with db.engine.begin() as conn:
            conn.execute(db.schema.AddColumn('user', role_col))
        print("✓ Role column added to user table")
    else:
        print("✓ Role column already exists")
    
    # Update existing users to have 'user' role if NULL
    users = User.query.filter(User.role.is_(None)).all()
    for user in users:
        user.role = 'user'
    db.session.commit()
    print(f"✓ Updated {len(users)} users with default role")
