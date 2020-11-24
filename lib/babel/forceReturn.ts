// WARNING WARNING WARNING
// This Plugin has been deprecated in favor of babel-plugin-implicit-return
// WARNING WARNING WARNING

// This plugin will cause the final statement (if its an expressionstatement)
// to be a returned from a snippet
//
// Examples:
//   2+2; r.a -> 2+2; return r.a;
//   return r.b -> return r.b // No change needed
//   if (true) 3; -> if (true) 3; // cannot return an if
//
module.exports = function ({ types: t }) {
  const id = name => t.identifier(name);

  function forceFunctionReturn(nodeList) {
    let lastNode = nodeList[nodeList.length - 1];
    if (lastNode.type === "ExpressionStatement") {
      nodeList.pop();
      nodeList.push(t.returnStatement(lastNode.expression));
    }

    return nodeList;
  }

  const isExecutorWrapper = node => {
    if (node.type !== "FunctionExpression") return false;
    if (!node.id) return false;
    if (node.id.name !== "_jsrecsExecutor") return false;
    return true;
  };

  return {
    visitor: {
      FunctionExpression(path) {
        let node = path.node;
        if (!isExecutorWrapper(node)) return;
        node.body.body = forceFunctionReturn(node.body.body);
      },
    },
  };
};
