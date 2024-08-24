from scrcpy import Client


def __stream_loop(self: Client):
    print(self.alive)


def apply_patches():
    Client._Client__stream_loop = __stream_loop
