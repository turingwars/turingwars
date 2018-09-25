import { Position } from './Position';

export class ParseError extends Error {

    constructor(
            public readonly pos: Position,
            message: string) {
        super(`Parse error: ${pos.line}:${pos.ch}: ${message}`);
    }
}
