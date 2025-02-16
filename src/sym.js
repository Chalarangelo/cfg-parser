class Sym {
  static #knownSymbols = new Map();

  static define(...names) {
    for (let name of names) {
      if (typeof name !== 'string')
        throw new TypeError('Symbol name must be a string');

      const symbol = Sym.#symbolFromName(name);

      if (!Sym.#knownSymbols.has(symbol)) {
        Sym.#knownSymbols.set(symbol, name);
        Object.defineProperty(Sym, name, { get: () => symbol });
      }
    }
  }

  static get(symbol) {
    return Sym.#knownSymbols.get(Sym.#symbolFromName(symbol));
  }

  static isKnown(symbol) {
    return Sym.#knownSymbols.has(Sym.#symbolFromName(symbol));
  }

  static #symbolFromName(name) {
    if (typeof name === 'symbol') return name;
    return Symbol.for(`Sym(${name})`);
  }
}

export default Sym;
