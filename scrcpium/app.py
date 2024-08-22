from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from .routers import devices
from .shared.connection_manager import ConnectionManager

connections = ConnectionManager()


@asynccontextmanager
async def lifespan(app):
    yield
    connections.shutdown()


app = FastAPI(lifespan=lifespan)
app.mount("/assets", StaticFiles(directory="./static/assets"), name="assets")
app.include_router(devices.router, prefix="/devices")


@app.get("/")
def root():
    return FileResponse("./static/index.html")
