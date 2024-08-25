export class Codec {
  private videoGenerator: MediaStreamTrackGenerator<VideoFrame>;
  private videoDecoder: VideoDecoder;

  constructor() {
    this.videoGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
    this.videoDecoder = new VideoDecoder({
      output: (frame) => {},
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

  decode(data: Blob) {
    const chunk = data;
    const encoded = new EncodedVideoChunk(chunk);
    this.videoDecoder.decode(encoded);
  }
}
