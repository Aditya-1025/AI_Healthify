
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    specialization = Column(String)
    fee = Column(Integer)

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    doctor_id = Column(String, ForeignKey("doctors.id"))
    time = Column(String)
    status = Column(String, default="BOOKED")

class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    dosage = Column(String)
    reminder_time = Column(String)

class AIChatHistory(Base):
    __tablename__ = "ai_chat_history"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String)
    user_message = Column(String)
    ai_response = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    question = Column(String, unique=True, index=True)
    answer = Column(String)
    category = Column(String, default="general")
    created_at = Column(DateTime, default=datetime.utcnow)