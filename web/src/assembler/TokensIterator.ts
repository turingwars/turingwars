import { Token } from './tokens';

export default class TokensIterator {
    private cursor: number = 0;

    constructor(
            private tokens: Token[]) {
    }

    public current(): Token {
        if (this.cursor > 0) {
            return this.tokens[this.cursor - 1];
        }
        throw new Error('Iterator not stated');
    }

    public next(): Token {
        if (!this.hasNext()) {
            throw new Error('Illegal state: iterator cannot move forward!');
        }
        return this.tokens[this.cursor++];
    }

    public peek(): Token {
        if (!this.hasNext()) {
            throw new Error('Illegal state: iterator cannot move forward!');
        }
        return this.tokens[this.cursor];
    }

    public hasNext(): boolean {
        return this.cursor < this.tokens.length;
    }
}
