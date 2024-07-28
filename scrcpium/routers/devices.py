from adbutils import AdbDeviceInfo, adb
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_devices() -> list[AdbDeviceInfo]:
    return adb.list()


@router.get("/{serial}")
def get_device(serial: str):
    return adb.device(serial)
