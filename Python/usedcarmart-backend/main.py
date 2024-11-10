from database import engine, Base
from models import User

# Automatically create all tables based on the models
def setup_database():
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    setup_database()
