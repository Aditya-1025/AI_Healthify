#!/usr/bin/env python3
"""
Script to check all registered users in the database
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import User
from pathlib import Path

# Database setup
DB_URL = "sqlite:///./healthify.db"
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print("\n" + "="*60)
print("📋 REGISTERED USERS IN DATABASE")
print("="*60 + "\n")

try:
    users = db.query(User).all()
    
    if not users:
        print("❌ No users found in database\n")
    else:
        print(f"✅ Total users: {len(users)}\n")
        
        for user in users:
            print(f"ID:          {user.id}")
            print(f"Name:        {user.name}")
            print(f"Email:       {user.email}")
            print(f"Created:     {user.created_at}")
            print(f"Password:    {'[HASHED]' if user.password else 'Not set'}")
            print("-" * 60)
            
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    db.close()
    print("\n✨ Database check complete!\n")
