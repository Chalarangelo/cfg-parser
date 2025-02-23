import CFG from './cfg.js';

class Tokenizer {
  #tokenMatchers;

  constructor(cfg) {
    if (!(cfg instanceof CFG))
      throw new TypeError('CFG must be a context-free grammar');

    this.#tokenMatchers = cfg.tokenMatchers;
  }

  tokenize(input) {
    let tokens = [];
    let index = 0;
    let inputLength = input.length;

    while (index < inputLength) {
      let token = this.#tokenizeNextToken(input, index);
      if (!token) throw new Error(`Unexpected token at index ${index}`);

      const { token: tokenValue, index: tokenIndex } = token;
      tokens.push(tokenValue);
      index += tokenIndex + tokenValue.length;
    }

    return tokens;
  }

  #tokenizeNextToken(input, index) {
    const slicedInput = input.slice(index);
    const token = this.#tokenMatchers.reduce(
      (acc, tokenMatcher) => {
        let match = slicedInput.match(tokenMatcher);
        if (match) {
          const token = match[0];
          const index = match.index;
          if (acc.index === null || index < acc.index) {
            acc.token = token;
            acc.index = index;
          }
        }
        return acc;
      },
      { token: null, index: null }
    );

    if (!token.token) return null;
    return token;
  }
}

export default Tokenizer;
