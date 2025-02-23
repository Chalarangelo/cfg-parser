# cfg-parser
Context free grammar parser based on Earley parsing

## How to us

Allow the `console` script to be executed:

```sh
chmod +x ./bin/console

./bin/console
```

In the `console`, you can use the following commands:

- `tokenize(<input>)`: Tokenize the input string using the grammar defined in the loaded grammar.
- `parse(<input>)`: Parse the input string using the grammar defined in the loaded grammar.
- `evaluate(<input>)`: Evaluate the input string using the grammar defined in the loaded grammar.

The default grammar is defined in `./src/samples/math.js`. You can define your own an export it from a file, then import it in the `console` and use it.
