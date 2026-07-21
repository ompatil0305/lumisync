import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load env variables from backend/.env
# Since this script runs from backend/ folder, it should load .env from the current directory.
load_dotenv()

# We can also import settings from config just in case
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

def run_migration():
    url = settings.DATABASE_URL
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    
    print(f"Connecting to database to run migrations...")
    engine = create_engine(url)
    
    migration_file = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "migrations",
        "schema.sql"
    )
    
    if not os.path.exists(migration_file):
        print(f"Migration file not found at: {migration_file}")
        sys.exit(1)
        
    with open(migration_file, "r") as f:
        sql = f.read()
        
    # Execute commands
    try:
        with engine.connect() as conn:
            # We want to run them in a transaction, except CREATE EXTENSION which might need autocommit
            # In PostgreSQL, CREATE EXTENSION can be run inside a transaction, so running the whole script is fine.
            print("Executing schema.sql...")
            # We split by semicolon to execute statement by statement to be safe and get better logs
            statements = [s.strip() for s in sql.split(";") if s.strip()]
            for statement in statements:
                if not statement:
                    continue
                conn.execute(text(statement))
            conn.commit()
            print("Database migration COMPLETED successfully!")
    except Exception as e:
        print(f"Database migration FAILED: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_migration()
