import os
import psycopg2

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "123")
DB_PORT = os.getenv("DB_PORT", "5432")
NEW_DB_NAME = os.getenv("NEW_DB_NAME", "cloudnotes")

conn = None
cur = None
try:
    # Connect to default postgres database
    conn = psycopg2.connect(
        dbname="postgres",
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
    )
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (NEW_DB_NAME,))
    exists = cur.fetchone() is not None
    if not exists:
        cur.execute(f"CREATE DATABASE {NEW_DB_NAME}")
        print(f"Database '{NEW_DB_NAME}' created successfully!")
    else:
        print(f"Database '{NEW_DB_NAME}' already exists.")
except psycopg2.Error as e:
    print(f"Error: {e}")
finally:
    if cur:
        cur.close()
    if conn:
        conn.close()
