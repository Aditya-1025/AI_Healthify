
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/medicines", tags=["Medicines"])

@router.post("/")
def add_medicine(data: schemas.MedicineCreate, db: Session = Depends(get_db)):
    medicine = models.Medicine(**data.dict())
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine

@router.get("/")
def get_medicines(db: Session = Depends(get_db)):
    return db.query(models.Medicine).all()
