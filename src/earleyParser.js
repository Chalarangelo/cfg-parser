import CFG from './cfg.js';
import ASTNode from './astNode.js';

class EarleyParser {
  constructor(cfg) {
    if (!(cfg instanceof CFG))
      throw new TypeError('CFG must be a context-free grammar');

    this.cfg = cfg;
    this.rulePairs = [...cfg.rules].map(rule => {
      return { rule, position: 0, origin: 0 };
    });
  }

  parse(tokens) {
    const n = tokens.length;
    const states = Array.from({ length: n + 1 }).map(() => []);

    states[0].push(...this.rulePairs);

    for (let i = 0; i <= n; i += 1)
      for (let j = 0; j < states[i].length; j += 1) {
        this.predict(states, i, j);
        if (i < n) this.scan(states, i, j, tokens[i]);
        this.complete(states, i, j);
      }

    const rootStates = states
      .map(state => state.filter(item => item.position >= item.rule.length))
      .reduce(
        (newStates, state, i) => {
          state.forEach(item => {
            newStates[item.origin].push({ ...item, origin: i });
          });
          return newStates;
        },
        Array.from({ length: states.length }).map(() => [])
      );

    return new ASTNode(this.dfs(rootStates, tokens));
  }

  predict(states, i, j) {
    const curr = states[i][j];

    if (this.cfg.hasSymbol(curr.rule.rightHandSide[curr.position])) {
      [...this.cfg.rules].forEach(rule => {
        const stateHasItem =
          curr.position === 0 && states[i].some(item => item.rule.equals(rule));

        if (!stateHasItem) {
          states[i].push({ rule, position: 0, origin: i });
        }
      });
    }
  }

  scan(states, i, j, token) {
    const curr = states[i][j];

    if (curr.rule.matches(token))
      states[i + 1].push({ ...curr, position: curr.position + 1 });
  }

  complete(states, i, j) {
    const curr = states[i][j];

    if (curr.position >= curr.rule.length) {
      states[curr.origin].forEach(earleyItem => {
        if (earleyItem.rule.includesRuleAt(earleyItem.position, curr.rule)) {
          const stateHasItem = states[i].some(
            ei =>
              ei.rule.equals(earleyItem.rule) &&
              ei.position === earleyItem.position + 1 &&
              ei.origin === earleyItem.origin
          );

          if (stateHasItem) return;
          states[i].push({ ...earleyItem, position: earleyItem.position + 1 });
        }
      });
    }
  }

  dfs(states, tokens) {
    const root = states[0].reduce((best, curr) => {
      if (best == null || curr.origin > best.origin) return curr;
      return best;
    }, null);

    if (root == null)
      throw new SyntaxError(`Parsing error near '${tokens[0]}' `);

    if (root.origin !== tokens.length)
      throw new SyntaxError(`Parsing error near '${tokens[root.origin]}' `);

    return {
      item: root.rule,
      children: this.dfsHelper(states, root, 0, 0, tokens),
    };
  }

  dfsHelper(states, root, state, depth, tokens) {
    let edges;

    if (state === root.origin && depth === root.rule.length) return [];

    if (depth === 0 && root.rule.matches(tokens[state])) {
      const subMatch = this.dfsHelper(
        states,
        root,
        state + 1,
        depth + 1,
        tokens
      );

      if (subMatch) return [tokens[state], ...subMatch];
    }

    edges = states[state]
      .filter(item => root.rule.includesRuleAt(depth, item.rule))
      .map(item => {
        const subMatch = this.dfsHelper(
          states,
          root,
          item.origin,
          depth + 1,
          tokens
        );

        if (subMatch)
          return [
            {
              item: item.rule,
              children: this.dfsHelper(states, item, state, 0, tokens),
            },
            ...subMatch,
          ];

        return null;
      })
      .filter(Boolean);

    return edges[0];
  }
}

export default EarleyParser;
