from scrcpy import Client


class ConnectionManager(dict[str, Client]):
    __instance = None

    def __new__(cls, *args, **kwargs):
        if cls.__instance is None:
            cls.__instance = super().__new__(cls, *args, **kwargs)
        return cls.__instance

    def shutdown(self):
        for client in self.values():
            client.stop()
