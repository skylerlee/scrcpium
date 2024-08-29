export class Codec {
  private videoGenerator: MediaStreamTrackGenerator<VideoFrame>;
  private videoDecoder: VideoDecoder;

  constructor() {
    this.videoGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
    const videoWriter = this.videoGenerator.writable.getWriter();
    this.videoDecoder = new VideoDecoder({
      output: (frame) => {
        videoWriter.write(frame);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getMediaStream() {
    const mediaStream = new MediaStream();
    mediaStream.addTrack(this.videoGenerator);
    return mediaStream;
  }

  configure() {
    this.videoDecoder.configure({
      codec: 'avc1.4d002a',
    });
  }

  appendRawData(data: ArrayBuffer) {
    const chunk = new TextEncoder().encode(sample);
    const encoded = new EncodedVideoChunk({
      type: 'key',
      timestamp: 0,
      data: chunk,
    });
    this.videoDecoder.decode(encoded);
  }

  close() {
    this.videoDecoder.close();
  }
}
