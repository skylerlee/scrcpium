import { describe, test, expect } from 'vitest';
import { H26xParser } from './h26x_parser';

describe('H26xParser', () => {
  describe('parse', () => {
    test('should parse annex B NALUs correctly', () => {
      const parser = new H26xParser();
      const nalus = Array.from(
        parser.parse(
          new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x01, 0x02, 0x00, 0x00, 0x00, 0x01, 0x03, 0x04]),
        ),
      );
      console.log(nalus);
    });
  });
});
