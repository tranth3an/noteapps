from pydantic import BaseModel
from typing import Optional


class NoteCreate(BaseModel):
    title: str
    content: str
    color: Optional[str] = "#ffffff"


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    color: Optional[str] = None
