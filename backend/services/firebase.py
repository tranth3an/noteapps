import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
import json

_db = None
_initialized = False


def initialize_firebase():
    global _initialized
    if _initialized:
        return

    # Load from environment variable (JSON string) or file path
    firebase_cred_env = os.getenv("FIREBASE_CREDENTIALS")
    firebase_cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")

    if firebase_cred_env:
        cred_dict = json.loads(firebase_cred_env)
        cred = credentials.Certificate(cred_dict)
    elif os.path.exists(firebase_cred_path):
        cred = credentials.Certificate(firebase_cred_path)
    else:
        raise RuntimeError(
            "Firebase credentials not found. "
            "Set FIREBASE_CREDENTIALS env var or provide firebase-credentials.json"
        )

    firebase_admin.initialize_app(cred)
    _initialized = True


def get_db():
    global _db
    if _db is None:
        initialize_firebase()
        _db = firestore.client()
    return _db


def verify_token(id_token: str) -> dict:
    initialize_firebase()
    decoded = auth.verify_id_token(id_token)
    return decoded
