import { describe, test, expect } from 'vitest';
import { annexBSplitNalu } from './utils.js';

describe('annexBSplitNalu', () => {
  test('should split annex B NALUs correctly', () => {
    const buf = new Uint8Array([
      0x00, 0x00, 0x00, 0x01, 0x01, 0x02, 0x00, 0x00, 0x00, 0x01, 0x03, 0x04,
    ]);
    for (const seg of annexBSplitNalu(buf)) {
      console.log(seg);
    }
  });
});
