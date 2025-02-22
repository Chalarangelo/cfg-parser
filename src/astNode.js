class ASTNode {
  constructor({ item, children }) {
    this.type = item.leftHandSide;

    if (
      item.isTerminal &&
      children.length === 1 &&
      typeof children[0] === 'string'
    ) {
      this.value = children[0];
    } else {
      this.children = children.map(child => new ASTNode(child));
    }
  }
}

export default ASTNode;
