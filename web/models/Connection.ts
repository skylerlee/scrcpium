export class Connection {
  private video: WebSocket | null;
  private control: WebSocket | null;

  constructor(private serial: string) {
    this.video = null;
    this.control = null;
  }

  open() {
    this.video = new WebSocket(`ws://${location.host}/devices/${this.serial}/video`);
    this.control = new WebSocket(`ws://${location.host}/devices/${this.serial}/control`);
  }

  close() {
    this.video?.close();
    this.control?.close();
  }
}
