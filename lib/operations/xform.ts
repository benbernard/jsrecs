import SnippetOperation from "lib/operations/snippetOperation";
import Record from "lib/record";

export default class Xform extends SnippetOperation<Record, Record> {
  async handle(record: Record): Promise<Record> {
    this.executor.run(record);
    return record;
  }
}
