import { Position } from './Position';
import StringCharacterIterator from './StringCharacterIterator';
import {
    T_CLOSE_PARENT,
    T_COMMENT,
    T_IDENT,
    T_MINUS,
    T_NEWLINE,
    T_NUMBER,
    T_OPEN_PARENT,
    T_PERCENT,
    T_PLUS,
    Token,
} from './tokens';

type TokenizerState = (this: Tokenizer, eof: boolean) => TokenizerState;

const IDENT_RX = /[A-Za-z]/;
const NUMERIC_RX = /[0-9]/;

export class Tokenizer {

    private it: StringCharacterIterator;

    private state: TokenizerState;

    private tokens: Token[] = [];

    private buffer: string = '';
    private bufferPosition: Position = new Position(0, 0);

    constructor(
            input: string) {
        this.it = new StringCharacterIterator(input);
        this.state = this.state_init;
    }

    public tokenize(): Token[] {
        while (this.it.hasNext()) {
            this.state = this.state(false);
        }
        this.state(true);
        return this.tokens;
    }

    private state_init(eof: boolean): TokenizerState {
        if (eof) {
            return this.state;
        }

        const c = this.it.next();
        switch (c) {
            case ';':
                return this.state_comment;
            case '\n':
                this.tokens.push(new T_NEWLINE(this.it.getPosition()));
                return this.state_init;
            case '+':
                this.tokens.push(new T_PLUS(this.it.getPosition()));
                return this.state_init;
            case '-':
                this.tokens.push(new T_MINUS(this.it.getPosition()));
                return this.state_init;
            case '(':
                this.tokens.push(new T_OPEN_PARENT(this.it.getPosition()));
                return this.state_init;
            case ')':
                this.tokens.push(new T_CLOSE_PARENT(this.it.getPosition()));
                return this.state_init;
            case '%':
                this.tokens.push(new T_PERCENT(this.it.getPosition()));
                return this.state_init;
            default:
                if (IDENT_RX.test(c)) {
                    this.buffer += c;
                    this.bufferPosition = this.it.getPosition();
                    this.bufferPosition.ch --;
                    return this.state_ident;
                } else if (NUMERIC_RX.test(c)) {
                    this.buffer += c;
                    return this.state_numeric;
                } else if (this.isSpace(c)) {
                    return this.state;
                } else {
                    const pos = this.it.getPosition();
                    throw new Error(`Syntax error at line ${pos.line}:${pos.ch}`);
                }
        }
    }

    private state_comment(eof: boolean): TokenizerState {
        if (eof || this.it.next() === '\n') {
            this.tokens.push(new T_COMMENT(
                this.it.getPosition(),
                this.buffer
            ));
            this.buffer = '';
            return this.state_init;
        }
        return this.state;
    }

    private state_ident(eof: boolean): TokenizerState {
        if (eof || !IDENT_RX.test(this.it.peek())) {
            this.tokens.push(new T_IDENT(this.bufferPosition, this.buffer));
            this.buffer = '';
            return this.state_init;
        }
        this.buffer += this.it.next();
        return this.state;
    }

    private state_numeric(eof: boolean): TokenizerState {
        if (eof || !NUMERIC_RX.test(this.it.peek())) {
            this.tokens.push(new T_NUMBER(this.it.getPosition(), this.buffer));
            this.buffer = '';
            return this.state_init;
        }
        this.buffer += this.it.next();
        return this.state;
    }

    private isSpace(c: string) {
        return c === ' ' || c === '\n' || c === '\t';
    }
}
