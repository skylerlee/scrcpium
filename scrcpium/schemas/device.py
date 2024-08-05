from dataclasses import dataclass


@dataclass
class DeviceInfo:
    serial: str
    state: str
    name: str
