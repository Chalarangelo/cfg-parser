import Rule from './rule.js';

class CFG {
  #rules = [];
  #symbols = new Set();

  constructor(rules) {
    if (!Array.isArray(rules) || !rules.length)
      throw new TypeError('Rules must be a non-empty array');

    rules.forEach(rule => this.addRule(rule));
  }

  addRule(rule) {
    if (!(rule instanceof Rule))
      throw new TypeError('Rule must be an instance of Rule');

    this.#rules.push(rule);
    this.#symbols.add(rule.leftHandSide);
  }

  get symbols() {
    return this.#symbols;
  }

  hasSymbol(symbol) {
    return this.#symbols.has(symbol);
  }

  get rules() {
    return this.#rules;
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
