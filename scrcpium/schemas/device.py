from dataclasses import dataclass


@dataclass
class DeviceInfo:
    serial: str
    state: str
    name: str = None
    device_name: str = None
    alive: bool = None
