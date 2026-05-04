from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, notes

app = FastAPI(title="Notes App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(notes.router, prefix="/notes", tags=["notes"])


@app.get("/")
async def root():
    return {"message": "Notes App API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
