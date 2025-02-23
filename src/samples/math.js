import Sym from '#src/sym.js';
import Rule from '#src/rule.js';
import CFG from '#src/cfg.js';
import Tokenizer from '#src/tokenizer.js';
import EarleyParser from '#src/earleyParser.js';

Sym.define(
  'Expression',
  'Operator',
  'Term',
  'ParenthesesOpen',
  'ParenthesesClose',
  'Function',
  'NegativeSign'
);

const rules = [
  // Non-terminal rules
  // E -> T
  new Rule(Sym.Expression, [Sym.Term]),
  // E -> E op E
  new Rule(
    Sym.Expression,
    [Sym.Expression, Sym.Operator, Sym.Expression],
    (left, operator, right) => {
      switch (operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
      }
    }
  ),
  // T -> f(T)
  new Rule(Sym.Expression, [Sym.Function, Sym.Term], (func, expression) => {
    switch (func) {
      case 'sin':
        return Math.sin(expression);
      case 'cos':
        return Math.cos(expression);
      case 'tan':
        return Math.tan(expression);
      case 'sqrt':
        return Math.sqrt(expression);
    }
  }),
  // T -> -T
  new Rule(Sym.Term, [Sym.NegativeSign, Sym.Term], (_, term) => -term),
  // T -> (E)
  new Rule(
    Sym.Term,
    [Sym.ParenthesesOpen, Sym.Expression, Sym.ParenthesesClose],
    (open, expression, close) => expression
  ),

  // Terminal rules
  // op -> + | - | * | / (terminal operator matcher)
  new Rule(Sym.Operator, [/[\+\-\*\/]/]),
  // T -> n (terminal number matcher)
  new Rule(Sym.Term, [/\d+/], token => Number.parseFloat(token)),
  // f -> sin | cos | tan | sqrt (terminal function matcher)
  new Rule(Sym.Function, [/(sin|cos|tan|sqrt)/]),
  // - -> - (terminal negative sign matcher)
  new Rule(Sym.NegativeSign, ['-']),
  // ( -> ( (terminal parentheses open matcher)
  new Rule(Sym.ParenthesesOpen, ['(']),
  // ) -> ) (terminal parentheses close matcher)
  new Rule(Sym.ParenthesesClose, [')']),
];

const cfg = new CFG(rules);
const tokenizer = new Tokenizer(cfg);
const parser = new EarleyParser(cfg, Sym.E);

export { rules, cfg, tokenizer, parser };
