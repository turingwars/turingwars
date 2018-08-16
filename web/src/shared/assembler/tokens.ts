// tslint:disable:class-name
import { Position } from './Position';

export abstract class Token {
    public readonly name = this.constructor.name;

    constructor(
            public pos: Position) {
    }
}

export class T_COMMENT extends Token {
    constructor(
            pos: Position,
            public readonly text: string) {
        super(pos);
    }
}

export class T_IMMEDIATE extends Token {

}

export class T_REF extends Token {

}

export class T_OPEN_PARENT extends Token {

}

export class T_CLOSE_PARENT extends Token {

}

export class T_IDENT extends Token {
    constructor(
            pos: Position,
            public readonly value: string) {
        super(pos);
    }
}

export class T_PERCENT extends Token {

}

export class T_COLON extends Token {

}

export class T_PLUS extends Token {

}

export class T_MINUS extends Token {

}

export class T_NEWLINE extends Token {

}

export class T_NUMBER extends Token {
    constructor(
            pos: Position,
            public readonly value: string) {
        super(pos);
    }
}
