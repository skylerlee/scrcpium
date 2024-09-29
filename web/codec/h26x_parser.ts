import { annexBSplitNalu } from './utils';

enum NaluType {
  SPS = 7,
  PPS = 8,
  AUD = 9,
}

export interface Nalu {
  data: Uint8Array;
}

export class H26xParser {
  private _prevBuffer = new Uint8Array(0);

  _debug(buffer: Uint8Array) {
    console.log(Array.prototype.map.call(buffer, (x) => x.toString(16).padStart(2, '0')).join(' '));
  }

  _concat(buffer: Uint8Array) {
    const newBuffer = new Uint8Array(this._prevBuffer.length + buffer.length);
    newBuffer.set(this._prevBuffer);
    newBuffer.set(buffer, this._prevBuffer.length);
    return newBuffer;
  }

  *parse(buffer: Uint8Array): Generator<Nalu> {
    for (const naluChunk of annexBSplitNalu(this._concat(buffer))) {
      if (!naluChunk.ended) {
        // store remaining data
        this._prevBuffer = naluChunk.data;
        continue;
      }
      const naluData = naluChunk.data;
      const naluType = naluData[0] & 0x1f;
      switch (naluType) {
        case NaluType.SPS:
          console.log('SPS');
          break;
        case NaluType.PPS:
          console.log('PPS');
          break;
        case NaluType.AUD:
          console.log('AUD');
          break;
        default:
          break;
      }
      yield { data: naluData };
    }
  }
}
