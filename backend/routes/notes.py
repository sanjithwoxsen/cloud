from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Note, User
from ..schemas import NoteCreate, NoteOut
from ..routes.auth import get_current_user
from datetime import datetime

router = APIRouter()

async def get_db_dep():
    async for s in get_db():
        yield s

@router.post("/notes", response_model=NoteOut)
async def create_note(note: NoteCreate, db: AsyncSession = Depends(get_db_dep), current_user: User = Depends(get_current_user)):
    new_note = Note(title=note.title, content=note.content, owner_id=current_user.id)
    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    return new_note

@router.get("/notes", response_model=list[NoteOut])
async def get_notes(db: AsyncSession = Depends(get_db_dep), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Note).where(Note.owner_id == current_user.id, Note.deleted_at == None))
    notes = result.scalars().all()
    return notes

@router.put("/notes/{id}", response_model=NoteOut)
async def update_note(id: int, note: NoteCreate, db: AsyncSession = Depends(get_db_dep), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Note).where(Note.id == id, Note.owner_id == current_user.id, Note.deleted_at == None))
    db_note = result.scalar_one_or_none()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db_note.title = note.title
    db_note.content = note.content
    db_note.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(db_note)
    return db_note

@router.delete("/notes/{id}")
async def delete_note(id: int, db: AsyncSession = Depends(get_db_dep), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Note).where(Note.id == id, Note.owner_id == current_user.id, Note.deleted_at == None))
    db_note = result.scalar_one_or_none()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db_note.deleted_at = datetime.utcnow()
    await db.commit()
    return {"detail": "Note deleted"}
