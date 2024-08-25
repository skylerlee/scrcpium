import axios from 'axios';

export class Connection {
  /**
   * Device video connection
   */
  private video: WebSocket | null;

  /**
   * Device control connection
   */
  private control: WebSocket | null;

  constructor(private serial: string) {
    this.video = null;
    this.control = null;
  }

  async open() {
    const { data: deviceInfo } = await axios.post(`/devices/${this.serial}/connect`);
    this.video = new WebSocket(`ws://${location.host}/devices/${this.serial}/video`);
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

  private _onVideoData = (e: WebSocketEventMap['message']) => {
    const frameData = e.data;
  };

  private _setupListeners() {
    this.video?.addEventListener('message', this._onVideoData);
  }

  private _teardownListeners() {
    this.video?.removeEventListener('message', this._onVideoData);
  }
}
