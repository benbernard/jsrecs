const Record = prequire("lib/record");

// This babel plugin will transform unknown names, ones not already defined on
// Record into accesses on the data property of the r identifier
//
// Examples:
//   r.a -> r.data.a
//   r.a = 2 -> r.data.a = 2
//   r.toJSON() -> r.toJSON() // No transformation, toJSON is on the Record object
//

let recordKeys = [...Object.getOwnPropertyNames(Record.prototype), "data"];

module.exports = function ({ types: t }) {
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
};

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
