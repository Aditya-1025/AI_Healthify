from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from difflib import SequenceMatcher
from .. import models, schemas
from ..database import get_db
from datetime import datetime, timedelta

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

def calculate_similarity(str1: str, str2: str) -> float:
    """Calculate similarity ratio between two strings"""
    return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()

@router.post("/chat")
def chat(request: dict, db: Session = Depends(get_db)):
    """
    Local chatbot endpoint that searches knowledge base
    """
    user_message = request.get("message", "").strip()
    
    if not user_message:
        return {"response": "Please ask me something!"}
    
    # Get all Q&A pairs from knowledge base
    all_qa = db.query(models.KnowledgeBase).all()
    
    if not all_qa:
        return {
            "response": "I don't have any knowledge base set up yet. Please add some Q&A pairs first.",
            "confidence": 0
        }
    
    # Find best matching question
    best_match = None
    highest_similarity = 0
    
    for qa in all_qa:
        similarity = calculate_similarity(user_message, qa.question)
        if similarity > highest_similarity:
            highest_similarity = similarity
            best_match = qa
    
    # Return answer if similarity is above threshold (0.3 = 30% match)
    if best_match and highest_similarity > 0.3:
        return {
            "response": best_match.answer,
            "confidence": round(highest_similarity, 2),
            "matched_question": best_match.question
        }
    else:
        return {
            "response": "I'm not sure about that. Could you rephrase your question or ask something else?",
            "confidence": 0
        }

@router.post("/knowledge/add")
def add_knowledge(request: dict, db: Session = Depends(get_db)):
    """Add a new Q&A pair to the knowledge base"""
    question = request.get("question", "").strip()
    answer = request.get("answer", "").strip()
    category = request.get("category", "general").strip()
    
    if not question or not answer:
        return {"error": "Question and answer are required"}
    
    # Check if question already exists
    existing = db.query(models.KnowledgeBase).filter(
        func.lower(models.KnowledgeBase.question) == question.lower()
    ).first()
    
    if existing:
        # Update existing
        existing.answer = answer
        existing.category = category
        db.commit()
        return {"message": "Q&A pair updated successfully"}
    
    # Add new Q&A pair
    knowledge = models.KnowledgeBase(
        question=question,
        answer=answer,
        category=category
    )
    db.add(knowledge)
    db.commit()
    db.refresh(knowledge)
    
    return {
        "message": "Q&A pair added successfully",
        "id": knowledge.id
    }

@router.get("/knowledge/all")
def get_all_knowledge(db: Session = Depends(get_db)):
    """Get all Q&A pairs from knowledge base"""
    qa_pairs = db.query(models.KnowledgeBase).all()
    return {
        "count": len(qa_pairs),
        "data": [
            {
                "id": qa.id,
                "question": qa.question,
                "answer": qa.answer,
                "category": qa.category
            }
            for qa in qa_pairs
        ]
    }

@router.delete("/knowledge/{qa_id}")
def delete_knowledge(qa_id: str, db: Session = Depends(get_db)):
    """Delete a Q&A pair from knowledge base"""
    qa = db.query(models.KnowledgeBase).filter(models.KnowledgeBase.id == qa_id).first()
    
    if not qa:
        return {"error": "Q&A pair not found"}
    
    db.delete(qa)
    db.commit()
    
    return {"message": "Q&A pair deleted successfully"}

# ───── APPOINTMENT BOOKING ENDPOINTS ─────

@router.get("/doctors-list")
def get_available_doctors(db: Session = Depends(get_db)):
    """Get list of available doctors for appointment booking"""
    doctors = db.query(models.Doctor).all()
    
    if not doctors:
        return {
            "available": False,
            "message": "No doctors available at the moment. Please try again later.",
            "doctors": []
        }
    
    return {
        "available": True,
        "count": len(doctors),
        "doctors": [
            {
                "id": doc.id,
                "name": doc.name,
                "specialization": doc.specialization,
                "fee": doc.fee
            }
            for doc in doctors
        ]
    }

@router.get("/available-slots")
def get_available_slots():
    """Get available appointment time slots"""
    # Generate time slots for next 7 days
    slots = []
    current_date = datetime.now()
    
    for day in range(1, 8):  # Next 7 days
        date = current_date + timedelta(days=day)
        
        # Skip weekends (5=Saturday, 6=Sunday)
        if date.weekday() >= 5:
            continue
        
        # Time slots: 9 AM to 5 PM, every 30 minutes
        for hour in range(9, 17):
            for minute in [0, 30]:
                slot_time = date.replace(hour=hour, minute=minute, second=0, microsecond=0)
                slots.append({
                    "date": slot_time.strftime("%Y-%m-%d"),
                    "time": slot_time.strftime("%H:%M"),
                    "display": slot_time.strftime("%d %b %Y, %I:%M %p")
                })
    
    return {
        "available_slots": slots,
        "total_slots": len(slots)
    }

@router.post("/book-appointment")
def book_appointment_from_chat(request: dict, db: Session = Depends(get_db)):
    """Book an appointment directly from chatbot"""
    user_id = request.get("user_id")
    doctor_id = request.get("doctor_id")
    appointment_time = request.get("time")  # Format: "YYYY-MM-DD HH:MM"
    
    # Validate inputs
    if not all([user_id, doctor_id, appointment_time]):
        return {
            "success": False,
            "message": "Missing required fields: user_id, doctor_id, time"
        }
    
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return {
            "success": False,
            "message": "User not found"
        }
    
    # Verify doctor exists
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        return {
            "success": False,
            "message": "Doctor not found"
        }
    
    # Check if slot is already booked
    existing = db.query(models.Appointment).filter(
        (models.Appointment.doctor_id == doctor_id) &
        (models.Appointment.time == appointment_time)
    ).first()
    
    if existing:
        return {
            "success": False,
            "message": "This time slot is already booked. Please choose another time."
        }
    
    # Create appointment
    try:
        appointment = models.Appointment(
            user_id=user_id,
            doctor_id=doctor_id,
            time=appointment_time,
            status="BOOKED"
        )
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        
        return {
            "success": True,
            "message": f"✅ Appointment booked successfully!",
            "appointment": {
                "id": appointment.id,
                "doctor_name": doctor.name,
                "doctor_specialization": doctor.specialization,
                "appointment_time": appointment_time,
                "status": appointment.status
            }
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Error booking appointment: {str(e)}"
        }

