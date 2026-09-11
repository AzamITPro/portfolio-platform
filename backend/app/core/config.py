from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Dynamically locate the backend directory containing .env
BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE_PATH = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "Azzam AL-JARMOUZI Portfolio API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database Settings
    POSTGRES_SERVER: str = "127.0.0.1"
    POSTGRES_PORT: int = 5433
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str = "portfolio_db"

    @property
    def sync_database_url(self) -> str:
        """Synchronous connection string for Alembic migrations and standard ORM sessions"""
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def async_database_url(self) -> str:
        """Asynchronous connection string for async engine operations"""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # Security
    SECRET_KEY: str = "c489df3a5b28a49c2d12e4f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 Hours

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()