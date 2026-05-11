"""
Database connectivity for the Astro Engine.

Uses SQLAlchemy 2.0+ to connect directly to the Supabase PostgreSQL instance,
enabling GET endpoints that resolve chart IDs without a proxy layer.
"""

import os
from sqlalchemy import create_engine, Column, String, DateTime, JSON, Float, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker, relationship, DeclarativeBase, Session
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    name = Column(String, nullable=False)
    dob = Column(String, nullable=False)       # ISO date YYYY-MM-DD
    tob = Column(String, nullable=False)       # ISO time HH:mm:ss
    lat = Column(String, nullable=False)
    long = Column(String, nullable=False)
    tz_offset = Column(Integer, nullable=False)
    ayanamsa_offset = Column(String)
    biometric_hash = Column(String)
    chart_style = Column(String, default="north_indian")
    is_guest = Column(Boolean, default=False)
    created_at = Column(DateTime)

    chart = relationship("Chart", back_populates="profile", uselist=False)


class Chart(Base):
    __tablename__ = "charts"

    id = Column(UUID(as_uuid=True), primary_key=True)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    planetary_degrees = Column(JSON, nullable=False)
    shodashvarga = Column(JSON, nullable=False)
    planetary_strengths = Column(JSON, nullable=False)
    ashtakavarga = Column(JSON, nullable=False)
    last_calculated_at = Column(DateTime)

    profile = relationship("Profile", back_populates="chart")


class Biodata(Base):
    __tablename__ = "user_biodata"

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), unique=True, nullable=False)
    gender = Column(String)
    current_city = Column(String)
    marital_status = Column(String)
    occupation = Column(String)
    knows_exact_time = Column(Boolean, default=True)
    updated_at = Column(DateTime)


class LifeEvent(Base):
    __tablename__ = "life_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    category = Column(String)
    event_type = Column(String)
    date = Column(String)  # YYYY-MM
    note = Column(String)
    impact = Column(String)
    created_at = Column(DateTime)


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
