import SnippetOperation from "lib/operations/snippetOperation";
import Record from "lib/record";

export default class Eval extends SnippetOperation<Record, any> {
  async handle(record: Record): Promise<Record> {
    return this.executor.run(record);
  }
}
