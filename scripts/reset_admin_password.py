import sys
import getpass
from pathlib import Path

# Ensure backend modules can be imported
backend_path = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(backend_path))

from app.db.session import SessionLocal
from app.repositories.user import user_repo
from app.core.security import get_password_hash


def main():
    print("=" * 60)
    print("  ADMIN PASSWORD RESET SCRIPT")
    print("=" * 60)

    email = input("Enter Admin Email [Default: azamaljarmozi@gmail.com]: ").strip()
    if not email:
        email = "azamaljarmozi@gmail.com"

    new_password = getpass.getpass("Enter New Password: ")
    confirm_password = getpass.getpass("Confirm New Password: ")

    if not new_password or len(new_password) < 8:
        print("[-] Error: Password must be at least 8 characters long.")
        sys.exit(1)

    if new_password != confirm_password:
        print("[-] Error: Passwords do not match.")
        sys.exit(1)

    db = SessionLocal()
    try:
        user = user_repo.get_by_email(db, email)
        if not user:
            print(f"[-] Error: User with email '{email}' was not found.")
            sys.exit(1)

        user.password_hash = get_password_hash(new_password)
        db.commit()
        print("=" * 60)
        print("[+] SUCCESS: Admin password has been updated successfully!")
        print(f"    - Email: {user.email}")
        print("=" * 60)
    except Exception as e:
        print(f"[-] An error occurred: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()