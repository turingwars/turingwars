import { Program } from '../model/Program';
import { IVariableStore } from './IVariableStore';
import { Parser } from './Parser';
import { Tokenizer } from './Tokenizer';

/**
 * Entry-point of the assembler.
 *
 * Transforms input text into the JSON representation of a program.
 */
export class Assembler {

    private variables: IVariableStore;

    constructor(
            variables?: IVariableStore) {
        this.variables = { ...(variables || {}) };
    }

    public assemble(code: string): Program {
        const tokenizer = new Tokenizer(code);
        const tokens = tokenizer.tokenize();
        const parser = new Parser(tokens, this.variables);
        return parser.parse();
    }
}
