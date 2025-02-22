class Sym {
  static #knownSymbols = new Set();

  static define(...names) {
    for (let name of names) {
      if (typeof name !== 'string')
        throw new TypeError('Symbol name must be a string');

      if (!Sym.#knownSymbols.has(name)) {
        Sym.#knownSymbols.add(name);
        Object.defineProperty(Sym, name, { get: () => name });
      }
    }
  }

  static isKnown(symbol) {
    return Sym.#knownSymbols.has(symbol);
  }
}

export default Sym;
