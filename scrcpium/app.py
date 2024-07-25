from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from .routers import devices

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(devices.router, prefix="/devices")


@app.get("/")
def root():
    return FileResponse("static/index.html")
