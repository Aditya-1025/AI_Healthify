
from pydantic import BaseModel, Field
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str = Field(..., min_length=6, max_length=72)

class UserLogin(BaseModel):
    email: str
    password: str

class DoctorCreate(BaseModel):
    name: str
    specialization: str
    fee: int

class AppointmentCreate(BaseModel):
    user_id: str
    doctor_id: str
    time: str

class MedicineCreate(BaseModel):
    user_id: str
    name: str
    dosage: str
    reminder_time: str

class ChatRequest(BaseModel):
    message: str
