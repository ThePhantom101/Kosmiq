import os
from sqlalchemy import create_engine
from engine.db import Base, Biodata, LifeEvent
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("DATABASE_URL not found in environment")
else:
    engine = create_engine(DATABASE_URL)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully: user_biodata, life_events")
