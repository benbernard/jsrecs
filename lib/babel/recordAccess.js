import Record from "../record.js";

let recordKeys = [...Object.getOwnPropertyNames(Record.prototype), "data"];

export default function ({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        let node = path.node;
        if (isRDotProperty(node)) {
          let currentObject = node.object;
          node.object = t.memberExpression(currentObject, t.identifier("data"));
          node.object.skipRecordAccess = true;
        }
      },
    },
  };
}

function isRDotProperty(node) {
  const object = node.object;
  const property = node.property;

  if (object.type !== "Identifier") return false;
  if (object.name !== "r") return false;

  if (property.type !== "Identifier") return false;
  if (recordKeys.indexOf(property.name) !== -1) return false;
  if (node.skipRecordAccess) return false;

  return true;
}
