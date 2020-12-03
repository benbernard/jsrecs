// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecordData = globalThis.Record<string, unknown>;

export default class Record {
  constructor(public data: RecordData) {}

  toJSON(): RecordData {
    return this.data;
  }
}

export { Record };
