// This babel plugin will transform unknown names, ones not already defined on
// Record into accesses on the data property of the r identifier
//
// Examples:
//   r.a -> r.data.a
//   r.a = 2 -> r.data.a = 2
//   r.toJSON() -> r.toJSON() // No transformation, toJSON is on the Record object
//

import Record from "lib/record";
import { Visitor, Node } from "@babel/traverse";
import * as BabelTypes from "@babel/types";

let recordKeys = [...Object.getOwnPropertyNames(Record.prototype), "data"];

export default function transform({
  types: t,
}: {
  types: typeof BabelTypes;
}): { visitor: Visitor<void> } {
  let seenRecords = new WeakSet();

  return {
    visitor: {
      MemberExpression(path) {
        let node = path.node;
        if (isRDotProperty(node, seenRecords)) {
          let currentObject = node.object;
          node.object = t.memberExpression(currentObject, t.identifier("data"));
          seenRecords.add(node.object);
        }
      },
    },
  };
}

function isRDotProperty(node, seen: WeakSet<Node>): boolean {
  const object = node.object;
  const property = node.property;

  if (object.type !== "Identifier") return false;
  if (object.name !== "r") return false;

  if (property.type !== "Identifier") return false;
  if (recordKeys.indexOf(property.name) !== -1) return false;
  if (seen.has(node)) return false;

  return true;
}
