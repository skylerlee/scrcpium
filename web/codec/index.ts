import { H26xParser } from './h26x_parser';

export class Codec {
  private videoGenerator: MediaStreamTrackGenerator<VideoFrame>;
  private videoDecoder: VideoDecoder;
  private parser: H26xParser;

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
    this.parser = new H26xParser();
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

  appendRawData(data: Uint8Array) {
    for (const nalu of this.parser.parse(data)) {
      const encoded = new EncodedVideoChunk({
        type: 'key',
        timestamp: 0,
        data: nalu.data,
      });
      this.videoDecoder.decode(encoded);
    }
  }

  close() {
    this.videoDecoder.close();
  }
}
