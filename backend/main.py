

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from .database import ensure_tables
from .routes.auth import router as auth_router
from .routes.notes import router as notes_router

load_dotenv()

app = FastAPI()

@app.on_event("startup")
async def startup_event():
	await ensure_tables()

@app.get("/")
async def root():
	return {"message": "Cloud Notes API is running"}

@app.get("/healthz")
async def healthz():
	return {"status": "ok"}

@app.get("/favicon.ico")
async def favicon():
	# Return an empty response to silence browser 404s
	return Response(status_code=204)

origins = [
	"*"
]
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(notes_router)
