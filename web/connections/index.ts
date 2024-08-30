import axios from 'axios';

export class Connections {
  /**
   * Device video connection
   */
  private video: WebSocket | null;

  /**
   * Device control connection
   */
  private control: WebSocket | null;

  /**
   * Video data listener
   */
  private _videoDataListener: ((data: ArrayBuffer) => void) | null;

  constructor(private serial: string) {
    this.video = null;
    this.control = null;
    this._videoDataListener = null;
  }

  async open() {
    const { data: deviceInfo } = await axios.post(`/devices/${this.serial}/connect`);
    this.video = new WebSocket(`ws://${location.host}/devices/${this.serial}/video`);
    this.video.binaryType = 'arraybuffer';
    this.control = new WebSocket(`ws://${location.host}/devices/${this.serial}/control`);
    this._setupListeners();
    return deviceInfo;
  }

  async close() {
    this._teardownListeners();
    this.video?.close();
    this.control?.close();
    await axios.get(`/devices/${this.serial}/disconnect`);
  }

  listenVideoData(callback: (data: ArrayBuffer) => void) {
    this._videoDataListener = callback;
  }

  private _onVideoData = (e: WebSocketEventMap['message']) => {
    const videoData = e.data;
    this._videoDataListener?.(videoData);
  };

  private _setupListeners() {
    this.video?.addEventListener('message', this._onVideoData);
  }

  private _teardownListeners() {
    this.video?.removeEventListener('message', this._onVideoData);
  }
}
