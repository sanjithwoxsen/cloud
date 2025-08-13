# Cloud Notes App Backend

A minimal FastAPI backend for a cloud notes app using PostgreSQL, async SQLAlchemy, JWT authentication, and password hashing.

## Features
- FastAPI with async SQLAlchemy and asyncpg
- JWT authentication with python-jose
- Password hashing with passlib
- Environment variables from `.env`
- CRUD for notes (only accessible to logged-in users)

## Project Structure
```
backend/
├── auth.py            # JWT and password utilities
├── database.py        # DB connection setup
├── main.py            # FastAPI app entrypoint
├── models.py          # SQLAlchemy models (User, Note)
├── routes/
│   ├── auth.py        # Auth endpoints (register, login, get current user)
│   └── notes.py       # Notes CRUD endpoints
├── schemas.py         # Pydantic models
├── requirements.txt   # Python dependencies
├── .env               # Environment variables
```

## Models
- **User**: id, email, password_hash, created_at
- **Note**: id, title, content, owner_id (FK to User), created_at, updated_at, deleted_at

## Endpoints
- `POST /register` - Register a new user
- `POST /login` - Login and get JWT token
- `GET /me` - Get current user info
- `POST /notes` - Create a note
- `GET /notes` - List notes
- `PUT /notes/{id}` - Update a note
- `DELETE /notes/{id}` - Delete a note

## Setup
1. Clone the repo and navigate to the `backend` directory.
2. Create and activate a Python virtual environment:
   ```zsh
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```zsh
   pip install -r requirements.txt
   ```
4. Set up your `.env` file with your PostgreSQL credentials and secret key.
5. Run database migrations (manual or with Alembic).
6. Start the server:
   ```zsh
   uvicorn main:app --reload
   ```

## Environment Variables
Example `.env`:
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/cloudnotes
SECRET_KEY=supersecretkey
```

## License
MIT
