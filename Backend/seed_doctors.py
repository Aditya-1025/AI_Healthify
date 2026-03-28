"""
Script to seed the database with sample doctors
Run this once to populate doctors
"""

from app.database import SessionLocal
from app.models import Doctor

DOCTORS = [
    {
        "name": "Dr. Rajesh Kumar",
        "specialization": "Cardiologist",
        "fee": 500
    },
    {
        "name": "Dr. Priya Singh",
        "specialization": "General Practitioner",
        "fee": 300
    },
    {
        "name": "Dr. Amit Patel",
        "specialization": "Neurologist",
        "fee": 600
    },
    {
        "name": "Dr. Sneha Gupta",
        "specialization": "Pediatrician",
        "fee": 350
    },
    {
        "name": "Dr. Vikram Reddy",
        "specialization": "Orthopedic Surgeon",
        "fee": 700
    },
    {
        "name": "Dr. Anjali Verma",
        "specialization": "Dermatologist",
        "fee": 400
    },
]

db = SessionLocal()

try:
    # Check if doctors already exist
    existing_count = db.query(Doctor).count()
    if existing_count > 0:
        print(f"Database already has {existing_count} doctors. Skipping seed.")
        db.close()
        exit(0)
    
    # Add all doctors
    for doc in DOCTORS:
        doctor = Doctor(
            name=doc["name"],
            specialization=doc["specialization"],
            fee=doc["fee"]
        )
        db.add(doctor)
    
    db.commit()
    print(f"✅ Successfully seeded {len(DOCTORS)} doctors!")
    
except Exception as e:
    db.rollback()
    print(f"❌ Error seeding doctors: {e}")
finally:
    db.close()
