from fastapi import APIRouter, Depends, HTTPException
from routers.auth import get_current_user
from schemas.notes import NoteCreate, NoteUpdate
from services.firebase import get_db
from datetime import datetime, timezone

router = APIRouter()


@router.get("/")
async def get_notes(current_user: dict = Depends(get_current_user)):
    db = get_db()
    uid = current_user["uid"]
    docs = db.collection("notes").where("uid", "==", uid).order_by("updated_at", direction="DESCENDING").stream()
    notes = []
    for doc in docs:
        note = doc.to_dict()
        note["id"] = doc.id
        notes.append(note)
    return notes


@router.post("/")
async def create_note(note: NoteCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    uid = current_user["uid"]
    now = datetime.now(timezone.utc).isoformat()
    data = {
        "uid": uid,
        "title": note.title,
        "content": note.content,
        "color": note.color,
        "created_at": now,
        "updated_at": now,
    }
    ref = db.collection("notes").add(data)
    return {"id": ref[1].id, **data}


@router.put("/{note_id}")
async def update_note(note_id: str, note: NoteUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    uid = current_user["uid"]
    ref = db.collection("notes").document(note_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Note not found")
    if doc.to_dict()["uid"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    updates = {k: v for k, v in note.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    ref.update(updates)
    updated = ref.get().to_dict()
    updated["id"] = note_id
    return updated


@router.delete("/{note_id}")
async def delete_note(note_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    uid = current_user["uid"]
    ref = db.collection("notes").document(note_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Note not found")
    if doc.to_dict()["uid"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    ref.delete()
    return {"message": "Note deleted"}
