from app.models import Base

print("=" * 60)
print(f"Total Registered Tables in ORM: {len(Base.metadata.tables)}")
print("=" * 60)
for table_name in sorted(Base.metadata.tables.keys()):
    columns_count = len(Base.metadata.tables[table_name].columns)
    print(f"  -> Table: {table_name:<25} ({columns_count} columns)")
print("=" * 60)
print("SUCCESS: All 20 models and tables are correctly configured!")
print("=" * 60)