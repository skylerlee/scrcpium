from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from .routers import devices

app = FastAPI()
app.mount("/assets", StaticFiles(directory="static/assets"), name="static")
app.include_router(devices.router, prefix="/devices")


@app.get("/")
def root():
    return FileResponse("static/index.html")
