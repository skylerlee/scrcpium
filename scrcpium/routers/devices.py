import asyncio

from adbutils import adb
from fastapi import (
    APIRouter,
    BackgroundTasks,
    HTTPException,
    WebSocket,
    WebSocketException,
    status,
)
from scrcpy import EVENT_FRAME, Client

from ..schemas.device import DeviceInfo
from ..shared.connection_manager import ConnectionManager

router = APIRouter()


@router.get("/")
def devices() -> list[DeviceInfo]:
    return [DeviceInfo(serial=dev.serial, state=dev.state) for dev in adb.list()]


@router.get("/{serial}")
def get_device(serial: str) -> DeviceInfo:
    dev = adb.device(serial)
    return DeviceInfo(
        serial=dev.get_serialno(), state=dev.get_state(), name=dev.prop.device
    )


@router.post("/{serial}/connect")
def connect(serial: str, background_tasks: BackgroundTasks) -> DeviceInfo:
    client = Client(adb.device(serial), block_frame=True)
    connections = ConnectionManager()
    connections[serial] = client
    background_tasks.add_task(lambda: client.start(threaded=True))
    dev = client.device
    return DeviceInfo(
        serial=dev.get_serialno(),
        state=dev.get_state(),
        name=dev.prop.device,
        device_name=client.device_name,
        resolution=client.resolution,
        alive=client.alive,
    )


@router.delete("/{serial}/disconnect")
def disconnect(serial: str) -> DeviceInfo:
    connections = ConnectionManager()
    client = connections.pop(serial)
    if client is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "device not found")
    client.stop()
    dev = client.device
    return DeviceInfo(
        serial=dev.get_serialno(),
        state=dev.get_state(),
        name=dev.prop.device,
        device_name=client.device_name,
        resolution=client.resolution,
        alive=client.alive,
    )


@router.websocket("/{serial}/video")
async def connect_video(websocket: WebSocket, serial: str):
    connections = ConnectionManager()
    client = connections.get(serial, None)
    if client is None:
        raise WebSocketException(4040, "device not found")
    await websocket.accept()
    loop = asyncio.get_event_loop()
    queue = asyncio.Queue()
    client.add_listener(
        EVENT_FRAME,
        lambda frame: asyncio.run_coroutine_threadsafe(queue.put(frame), loop),
    )
    while True:
        frame = await queue.get()
        await websocket.send_bytes(frame)


@router.websocket("/{serial}/control")
async def connect_control(websocket: WebSocket, serial: str):
    connections = ConnectionManager()
    client = connections.get(serial, None)
    if client is None:
        raise WebSocketException(4040, "device not found")
    await websocket.accept()
    # client.control.touch()
    # client.control.swipe()
