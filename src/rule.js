import Sym from './sym.js';

// TODO: instanceof doesn't always work, why?
const isRegExp = value =>
  value instanceof RegExp ||
  value.constructor === RegExp ||
  value.constructor.name === 'RegExp';

class Rule {
  constructor(leftHandSide, rightHandSide, evaluator) {
    if (!Sym.isKnown(leftHandSide))
      throw new TypeError('Left-hand side must be a symbol');
    if (!Array.isArray(rightHandSide) || !rightHandSide.length)
      throw new TypeError('Right-hand side must be a non-empty array');
    if (evaluator && typeof evaluator !== 'function')
      throw new TypeError('Evaluator must be a function');

    // TODO: Make these getters to avoid reassigment
    this.leftHandSide = leftHandSide;
    this.rightHandSide = rightHandSide;
    this.evaluate = evaluator ? ([...args]) => evaluator(...args) : null;
    this.isTerminal = Rule.#determineIfRuleIsTerminal(rightHandSide);
  }

  get tokenMatcher() {
    if (!this.isTerminal) return null;

    const [symbol] = this.rightHandSide;
    if (isRegExp(symbol)) return symbol;

    const escapedSymbol = symbol.replace(/[.*+-?^${}()|[\]\\\/]/g, '\\$&');
    return new RegExp(`${escapedSymbol}`);
  }

  static #determineIfRuleIsTerminal(rightHandSide) {
    if (rightHandSide.length !== 1) return false;
    const [symbol] = rightHandSide;

    return typeof symbol === 'string' || isRegExp(symbol);
  }
}

export default Rule;
