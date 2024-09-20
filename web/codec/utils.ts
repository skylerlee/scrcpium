export type NaluChunk = {
  data: Uint8Array;
  ended: boolean;
};

export function* annexBSplitNalu(buffer: Uint8Array): Generator<NaluChunk> {
  // -1 means we haven't found the first start code
  let start = -1;
  // How many `0x00`s in a row we have counted
  let zeroCount = 0;
  let inEmulation = false;
  for (let i = 0; i < buffer.length; i += 1) {
    const byte = buffer[i]!;
    if (inEmulation) {
      if (byte > 0x03) {
        // `0x00000304` or larger are invalid
        throw new Error('Invalid data');
      }
      inEmulation = false;
      continue;
    }
    if (byte === 0x00) {
      zeroCount += 1;
      continue;
    }
    const prevZeroCount = zeroCount;
    zeroCount = 0;
    if (start === -1) {
      // 0x000001 is the start code
      // But it can be preceded by any number of zeros
      // So 2 is the minimal
      if (prevZeroCount >= 2 && byte === 0x01) {
        // Found start of first NAL unit
        start = i + 1;
        continue;
      }
      // Not begin with start code
      throw new Error('Invalid data');
    }
    if (prevZeroCount < 2) {
      // zero or one `0x00`s are acceptable
      continue;
    }
    if (byte === 0x01) {
      // Found another NAL unit
      yield {
        data: buffer.subarray(start, i - prevZeroCount),
        ended: true,
      };
      start = i + 1;
      continue;
    }
    if (prevZeroCount > 2) {
      // Too much `0x00`s
      throw new Error('Invalid data');
    }
    switch (byte) {
      case 0x02:
        // Didn't find why, but 7.4.1 NAL unit semantics forbids `0x000002` appearing in NAL units
        throw new Error('Invalid data');
      case 0x03:
        // `0x000003` is the "emulation_prevention_three_byte"
        // `0x00000300`, `0x00000301`, `0x00000302` and `0x00000303` represent
        // `0x000000`, `0x000001`, `0x000002` and `0x000003` respectively
        inEmulation = true;
        break;
      default:
        // `0x000004` or larger are as-is
        break;
    }
  }
  if (inEmulation) {
    throw new Error('Invalid data');
  }
  yield {
    data: buffer.subarray(start, buffer.length),
    ended: false,
  };
}
