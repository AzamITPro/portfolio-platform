import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Add parent directory to sys.path so app modules can be imported
sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.models import Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the SQLAlchemy connection URL dynamically from settings
# Support dynamic cloud URL passed via -x sqlalchemy.url=...
# Support dynamic cloud URL passed via -x sqlalchemy.url=... with percent-escape
x_args = context.get_x_argument(as_dictionary=True)
if "sqlalchemy.url" in x_args:
    escaped_url = x_args["sqlalchemy.url"].replace("%", "%%")
    config.set_main_option("sqlalchemy.url", escaped_url)
else:
    config.set_main_option("sqlalchemy.url", settings.sync_database_url.replace("%", "%%"))

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()