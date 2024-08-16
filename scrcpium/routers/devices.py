from adbutils import adb
from fastapi import APIRouter, HTTPException, WebSocket
from scrcpy import EVENT_FRAME, Client

from ..schemas.device import DeviceInfo

router = APIRouter()

connections: dict[str, Client] = {}


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
def connect(serial: str) -> DeviceInfo:
    client = Client(adb.device(serial))
    client.start(threaded=True)
    connections[serial] = client
    dev = client.device
    return DeviceInfo(
        serial=dev.get_serialno(),
        state=dev.get_state(),
        name=dev.prop.device,
        device_name=client.device_name,
        alive=client.alive,
    )


@router.post("/{serial}/disconnect")
def disconnect(serial: str) -> DeviceInfo:
    client = connections.pop(serial)
    if client is None:
        raise HTTPException(404, "device not found")
    client.stop()
    dev = client.device
    return DeviceInfo(
        serial=dev.get_serialno(),
        state=dev.get_state(),
        name=dev.prop.device,
        device_name=client.device_name,
        alive=client.alive,
    )


@router.websocket("/{serial}/video")
async def connect_video(websocket: WebSocket, serial: str):
    client = connections.get(serial, None)
    if client is None:
        raise HTTPException(404, "device not found")
    await websocket.accept()
    client.add_listener(EVENT_FRAME, lambda frame: websocket.send_bytes(frame))


@router.websocket("/{serial}/control")
async def connect_control(websocket: WebSocket, serial: str):
    client = connections.get(serial, None)
    if client is None:
        raise HTTPException(404, "device not found")
    await websocket.accept()
    # client.control.touch()
    # client.control.swipe()
