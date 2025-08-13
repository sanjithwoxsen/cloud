# First Time Setup Instructions

1. Create and activate your Python virtual environment:
   python3 -m venv .venv
   source .venv/bin/activate

2. Install dependencies:
   pip install -r requirements.txt

3. Set up your .env file in backend/:
   SECRET_KEY=yoursecretkey
   DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/cloudnotes
   JWT_EXPIRATION=3600

4. Create the database tables:
   python backend/create_tables.py

5. Start the FastAPI server:
   python -m uvicorn backend.main:app --reload

6. Open http://127.0.0.1:8000/docs to test your API endpoints.

---

If you change your database name, user, or password, update the DATABASE_URL in .env accordingly.
