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
  _debugPrint(chunk: Uint8Array) {
    console.log(Array.prototype.map.call(chunk, (x) => x.toString(16).padStart(2, '0')).join(' '));
  }

  *parse(chunk: Uint8Array): Generator<Nalu> {
    for (const nalu of annexBSplitNalu(chunk)) {
      const naluType = nalu[0] & 0x1f;
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
          continue;
      }
      yield { data: nalu };
    }
  }
}
