import sys
import getpass
from pathlib import Path

# Ensure backend modules can be imported
backend_path = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(backend_path))

from app.db.session import SessionLocal
from app.repositories.user import user_repo


def main():
    print("=" * 60)
    print("  ADMIN USER PROVISIONING SCRIPT - AZZAM PORTFOLIO")
    print("=" * 60)

    email = input("Enter Admin Email [e.g. admin@portfolio.local]: ").strip()
    if not email or "@" not in email:
        print("[-] Error: A valid email address is required.")
        sys.exit(1)

    full_name = input("Enter Full Name [Default: Azzam AL-JARMOUZI]: ").strip()
    if not full_name:
        full_name = "Azzam AL-JARMOUZI"

    password = getpass.getpass("Enter Secure Admin Password: ")
    confirm_password = getpass.getpass("Confirm Admin Password: ")

    if not password or len(password) < 8:
        print("[-] Error: Password must be at least 8 characters long.")
        sys.exit(1)

    if password != confirm_password:
        print("[-] Error: Passwords do not match.")
        sys.exit(1)

    db = SessionLocal()
    try:
        existing_user = user_repo.get_by_email(db, email)
        if existing_user:
            print(f"[-] Error: A user with email '{email}' already exists.")
            sys.exit(1)

        user = user_repo.create_admin(db, email, password, full_name)
        print("=" * 60)
        print("[+] SUCCESS: Admin user created successfully!")
        print(f"    - ID       : {user.id}")
        print(f"    - Name     : {user.full_name}")
        print(f"    - Email    : {user.email}")
        print(f"    - Role     : {user.role}")
        print(f"    - Profile  : Initialized and linked")
        print("=" * 60)
    except Exception as e:
        print(f"[-] An error occurred during user creation: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()