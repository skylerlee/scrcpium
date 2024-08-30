export interface Nalu {
  data: Uint8Array;
}

export class H26xParser {
  parse(chunk: Uint8Array): Nalu[] {}
}
