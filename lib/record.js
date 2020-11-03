export default class Record {
  constructor(obj) {
    this.data = obj;
  }

  toJSON() {
    return this.data;
  }
}
