
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/")
def book_appointment(data: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    appointment = models.Appointment(**data.dict())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/")
def get_appointments(db: Session = Depends(get_db)):
    return db.query(models.Appointment).all()
