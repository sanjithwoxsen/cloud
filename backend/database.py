import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine.url import make_url
from dotenv import load_dotenv
import os
import asyncio
from sqlalchemy import text
import psycopg2
from psycopg2 import sql

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

def ensure_database_exists_sync(db_url_str: str) -> None:
	"""Ensure the target PostgreSQL database exists using psycopg2.
	Connects to the default 'postgres' database and creates the target if missing.
	"""
	if not db_url_str:
		raise RuntimeError("DATABASE_URL is not set")
	url = make_url(db_url_str)
	if not url.get_backend_name().startswith("postgresql"):
		return  # Only handle Postgres here

	dbname = url.database
	host = url.host or "localhost"
	port = url.port or 5432
	user = url.username or "postgres"
	password = url.password or ""

	conn = None
	cur = None
	try:
		conn = psycopg2.connect(
			dbname="postgres",
			user=user,
			password=password,
			host=host,
			port=str(port),
		)
		conn.autocommit = True
		cur = conn.cursor()
		cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
		exists = cur.fetchone() is not None
		if not exists:
			cur.execute(sql.SQL("CREATE DATABASE {} ").format(sql.Identifier(dbname)))
			print(f"Database '{dbname}' created.")
	except psycopg2.Error as e:
		raise RuntimeError(f"Failed to ensure database '{dbname}' exists: {e}") from e
	finally:
		if cur:
			cur.close()
		if conn:
			conn.close()

# Ensure DB exists before creating async engine
ensure_database_exists_sync(DATABASE_URL)

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Check if tables exist, else run create_tables.py
async def ensure_tables():
	async with engine.begin() as conn:
		result = await conn.execute(text("SELECT to_regclass('public.users')"))
		users_exists = result.scalar()
		result = await conn.execute(text("SELECT to_regclass('public.notes')"))
		notes_exists = result.scalar()
		if not users_exists or not notes_exists:
			print("Tables missing. Running create_tables as module...")
			os.system("python -m backend.create_tables")
		else:
			print("All tables exist.")

async def get_db():
	async with SessionLocal() as session:
		yield session

if __name__ == "__main__":
	asyncio.run(ensure_tables())
