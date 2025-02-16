import Sym from './sym.js';
import Rule from './rule.js';

class CFG {
  #rules = new Map();

  constructor(rules) {
    if (!Array.isArray(rules) || !rules.length)
      throw new TypeError('Rules must be a non-empty array');

    rules.forEach(rule => this.addRule(rule));
  }

  addRule(rule) {
    if (!(rule instanceof Rule))
      throw new TypeError('Rule must be an instance of Rule');

    this.#rules.set(rule.leftHandSide, rule);
  }

  get symbols() {
    return new Set(this.#rules.keys());
  }

  get rules() {
    return this.#rules.values();
  }

  get tokenMatchers() {
    let tokenMatchers = [];
    this.#rules.forEach(rule => {
      if (rule.isTerminal) tokenMatchers.push(rule.tokenMatcher);
    });

    return tokenMatchers;
  }
}

export default CFG;
