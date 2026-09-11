from sqlalchemy import text
from app.db.session import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT current_database(), current_user;"))
        row = result.fetchone()
        print("=" * 60)
        print("SUCCESS: SQLAlchemy 2.0 connected successfully!")
        print(f"Connected Database: {row[0]}")
        print(f"Connected User    : {row[1]}")
        print("=" * 60)
except Exception as e:
    print("=" * 60)
    print(f"FAILED: SQLAlchemy connection error: {e}")
    print("=" * 60)