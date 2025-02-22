class ASTNode {
  constructor({ item, children }) {
    this.type = item.leftHandSide;

    if (
      item.isTerminal &&
      children.length === 1 &&
      typeof children[0] === 'string'
    ) {
      this.value = children[0];

      this.evaluate = item.evaluate
        ? () => item.evaluate(this.value)
        : () => this.value;
    } else {
      this.children = children.map(child => new ASTNode(child));

      this.evaluate = item.evaluate
        ? () => item.evaluate(this.children.flatMap(child => child.evaluate()))
        : () => this.children.flatMap(child => child.evaluate());
    }
  }
}

export default ASTNode;
