from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# Create synchronous SQLAlchemy engine with connection pooling
engine = create_engine(
    settings.sync_database_url,
    pool_pre_ping=True,  # Automatically check and reconnect dead connections
    pool_size=10,
    max_overflow=20,
    echo=False,  # Set to True if you want to inspect raw SQL queries during debugging
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Declarative Base for ORM models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI Dependency that provides a database session and ensures clean closure"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()