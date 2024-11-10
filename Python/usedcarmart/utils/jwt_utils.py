import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv('JWT_SECRET_KEY')

def generate_token(user):
    expiration = datetime.utcnow() + timedelta(hours=1)
    payload = {
        "id": user["id"],
        "role": user["role"],
        "exp": expiration
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token
