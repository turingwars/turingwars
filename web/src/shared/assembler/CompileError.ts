import { ParseError } from './ParseError';

export class CompilerError extends Error {
    constructor(
            public readonly errors: ParseError[]) {
        super(`There were compile errors:\n${errors.map((e) => e.toString()).join('\n')}`);
    }
}
