from fastapi import APIRouter, Header, HTTPException, Depends
from services.firebase import verify_token

router = APIRouter()


def get_current_user(authorization: str = Header(...)):
    """Extract and verify Firebase ID token from Authorization header."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ", 1)[1]
    try:
        user = verify_token(token)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "uid": current_user["uid"],
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "picture": current_user.get("picture"),
    }
