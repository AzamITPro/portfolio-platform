from typing import Generic, TypeVar, Type, Optional, List, Any, Dict
from sqlalchemy import select, func, update, delete
from sqlalchemy.orm import Session
from app.db.session import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get_by_id(self, db: Session, id: Any) -> Optional[ModelType]:
        """Fetch a single record by primary key."""
        return db.get(self.model, id)

    def get_all(
        self, db: Session, skip: int = 0, limit: int = 100, order_by: Any = None
    ) -> List[ModelType]:
        """Fetch multiple records with pagination and optional ordering."""
        query = select(self.model)
        if order_by is not None:
            query = query.order_by(order_by)
        query = query.offset(skip).limit(limit)
        return list(db.execute(query).scalars().all())

    def count(self, db: Session) -> int:
        """Count total records for this entity."""
        query = select(func.count()).select_from(self.model)
        return db.execute(query).scalar_one()

    def create(self, db: Session, obj_in_data: Dict[str, Any]) -> ModelType:
        """Create and persist a new record."""
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, db_obj: ModelType, obj_in_data: Dict[str, Any]
    ) -> ModelType:
        """Update an existing record with a dictionary of changes."""
        for field, value in obj_in_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: Any) -> bool:
        """Delete a record by its primary key."""
        obj = self.get_by_id(db, id)
        if obj:
            db.delete(obj)
            db.commit()
            return True
        return False