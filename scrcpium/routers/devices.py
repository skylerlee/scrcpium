from adbutils import AdbDeviceInfo, adb
from fastapi import APIRouter, WebSocket
from scrcpy import EVENT_FRAME, Client

from ..schemas.device import DeviceInfo

router = APIRouter()


@router.get("/")
def devices() -> list[AdbDeviceInfo]:
    return adb.list()


@router.get("/{serial}")
def get_device(serial: str) -> DeviceInfo:
    dev = adb.device(serial)
    return DeviceInfo(
        serial=dev.get_serialno(), state=dev.get_state(), name=dev.prop.model
    )


@router.websocket("/{serial}/connect")
def connect(websocket: WebSocket, serial: str):
    client = Client(adb.device(serial))
    client.add_listener(EVENT_FRAME, lambda frame: websocket.send_bytes(frame))
    client.start(threaded=True)
