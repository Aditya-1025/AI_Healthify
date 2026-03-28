
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .. import models, schemas
from ..database import get_db
from ..security import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = models.User(
            name=user.name,
            email=user.email,
            password=hash_password(user.password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"message": "User registered successfully"}
    except IntegrityError as e:
        db.rollback()
        if "email" in str(e).lower():
            raise HTTPException(status_code=400, detail="Email already registered. Please use a different email or login.")
        raise HTTPException(status_code=400, detail="Registration failed. Please try again.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="An error occurred during registration")

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_token({"sub": db_user.id})
    return {
        "access_token": token,
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }
