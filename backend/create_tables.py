import os
import secrets
try:
    from backend.database import engine, Base
except ImportError:
    from database import engine, Base
import asyncio

# Ensure models are imported so tables are registered on Base.metadata
try:
    from backend import models  # noqa: F401
except ImportError:
    import models  # noqa: F401

ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")

def ensure_env():
    if not os.path.exists(ENV_PATH):
        secret_key = secrets.token_urlsafe(32)
        # Allow overriding via environment variables when first creating .env
        default_db_url = os.getenv(
            "DATABASE_URL",
            "postgresql+asyncpg://postgres:123@localhost:5432/cloudnotes",
        )
        with open(ENV_PATH, "w") as f:
            f.write(f"SECRET_KEY={secret_key}\n")
            f.write(f"DATABASE_URL={default_db_url}\n")
            f.write("JWT_EXPIRATION=3600\n")
        print("Created .env (SECRET_KEY generated).")
    else:
        # Read and show current .env values
        with open(ENV_PATH) as f:
            lines = f.readlines()
        env_vars = {}
        for line in lines:
            if '=' in line:
                k, v = line.strip().split('=', 1)
                env_vars[k] = v
        print(".env already exists. Current values:")
        print(f"SECRET_KEY={env_vars.get('SECRET_KEY')}")
        print(f"DATABASE_URL={env_vars.get('DATABASE_URL')}")
        print(f"JWT_EXPIRATION={env_vars.get('JWT_EXPIRATION')}")

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created.")

if __name__ == "__main__":
    ensure_env()
    asyncio.run(create_tables())
