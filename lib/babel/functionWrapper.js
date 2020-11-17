export default function ({ types: t }) {
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
}
