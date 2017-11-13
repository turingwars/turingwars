import { Position } from './Position';

export default class StringCharacterIterator {
    private cursor: number = 0;

    private position: Position = new Position(1, 1);

    constructor(
            private chunk: string) {
    }

    public next(): string {
        if (!this.hasNext()) {
            throw new Error('Illegal state: iterator cannot move forward!');
        }
        const c = this.chunk.charAt(this.cursor);
        this.cursor++;
        this.position.ch++;
        if (c === '\n') {
            this.position.ch = 1;
            this.position.line++;
        }
        return c;
    }

    public peek(): string {
        if (!this.hasNext()) {
            throw new Error('Illegal state: iterator cannot move forward!');
        }
        return this.chunk.charAt(this.cursor);
    }

    public hasNext(): boolean {
        return this.cursor < this.chunk.length;
    }

    public getPosition(): Position {
        return new Position(this.position.line, this.position.ch);
    }
}
