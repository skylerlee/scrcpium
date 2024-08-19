import axios from 'axios';

export class Connection {
  private video: WebSocket | null;
  private control: WebSocket | null;

  constructor(private serial: string) {
    this.video = null;
    this.control = null;
  }

  async open() {
    const { data: deviceInfo } = await axios.post(`/devices/${this.serial}/connect`);
    this.video = new WebSocket(`ws://${location.host}/devices/${this.serial}/video`);
    this.control = new WebSocket(`ws://${location.host}/devices/${this.serial}/control`);
  }

  async close() {
    this.video?.close();
    this.control?.close();
    await axios.get(`/devices/${this.serial}/disconnect`);
  }
}
