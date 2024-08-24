import time

from scrcpy import EVENT_DISCONNECT, EVENT_FRAME, Client


def __stream_loop(self):
    """
    Core loop for raw video streaming
    """
    while self.alive:
        try:
            raw_h264 = self._Client__video_socket.recv(0x10000)
            if raw_h264 == b"":
                raise ConnectionError("Video stream is disconnected")
            # self.resolution = (frame.shape[1], frame.shape[0])
            self._Client__send_to_listeners(EVENT_FRAME, raw_h264)
        except BlockingIOError:
            time.sleep(0.01)
            if not self.block_frame:
                self._Client__send_to_listeners(EVENT_FRAME, None)
        except (ConnectionError, OSError) as e:  # Socket Closed
            if self.alive:
                self._Client__send_to_listeners(EVENT_DISCONNECT)
                self.stop()
                raise e


def apply_patches():
    Client._Client__stream_loop = __stream_loop
