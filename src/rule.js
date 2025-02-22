import Sym from './sym.js';

class Rule {
  #leftHandSide = null;
  #rightHandSide = null;
  #evaluate = null;
  #isTerminal = null;

  constructor(leftHandSide, rightHandSide, evaluator) {
    if (!Sym.isKnown(leftHandSide))
      throw new TypeError('Left-hand side must be a symbol');

    if (!Array.isArray(rightHandSide) || !rightHandSide.length)
      throw new TypeError('Right-hand side must be a non-empty array');

    if (evaluator && typeof evaluator !== 'function')
      throw new TypeError('Evaluator must be a function');

    this.#leftHandSide = leftHandSide;
    this.#rightHandSide = rightHandSide;
    this.#evaluate = evaluator ? ([...args]) => evaluator(...args) : null;
    this.#isTerminal = Rule.#determineIfRuleIsTerminal(rightHandSide);
  }

  get leftHandSide() {
    return this.#leftHandSide;
  }

  get rightHandSide() {
    return this.#rightHandSide;
  }

  get evaluate() {
    return this.#evaluate;
  }

  get isTerminal() {
    return this.#isTerminal;
  }

  get tokenMatcher() {
    if (!this.isTerminal) return null;

    const [symbol] = this.rightHandSide;
    if (symbol instanceof RegExp) return symbol;

    const escapedSymbol = symbol.replace(/[.*+-?^${}()|[\]\\\/]/g, '\\$&');
    return new RegExp(`${escapedSymbol}`);
  }

  static #determineIfRuleIsTerminal(rightHandSide) {
    if (rightHandSide.length !== 1) return false;
    const [symbol] = rightHandSide;

    return typeof symbol === 'string' || symbol instanceof RegExp;
  }

  matches(token) {
    if (!this.isTerminal) return false;
    return this.tokenMatcher.test(token);
  }

  equals(otherRule) {
    return (
      this.rightHandSide.length === otherRule.rightHandSide.length &&
      this.rightHandSide.every((s, i) => s === otherRule.rightHandSide[i])
    );
  }

  includesRuleAt(index, otherRule) {
    return this.rightHandSide[index] === otherRule.leftHandSide;
  }

  get length() {
    return this.rightHandSide.length;
  }
}

export default Rule;
