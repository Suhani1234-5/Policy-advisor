# backend/auth.py
import os
import secrets
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv

load_dotenv()

security = HTTPBasic()

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    """
    Verify admin credentials from environment variables.
    Used to protect all /admin/* endpoints.
    """
    correct_user = secrets.compare_digest(
        credentials.username,
        os.getenv("ADMIN_USERNAME", "admin")
    )
    correct_pass = secrets.compare_digest(
        credentials.password,
        os.getenv("ADMIN_PASSWORD", "admin123")
    )
    if not (correct_user and correct_pass):
        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username