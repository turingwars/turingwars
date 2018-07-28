import { T_PERCENT } from '../assembler/tokens';
import {
    add,
    dat,
    div,
    divb,
    jmp,
    jnz,
    jz,
    mine,
    mod,
    mov,
    mul,
    nop,
    OpCode,
    se,
    sne,
    sub,
    subb,
} from '../model/Instruction';
import { immediate, InstructionField, ref } from '../model/InstructionField';
import { Program } from '../model/Program';
import { CompilerError } from './CompileError';
import { IVariableStore } from './IVariableStore';
import { ParseError } from './ParseError';
import {
    T_CLOSE_PARENT, T_COMMENT, T_IDENT, T_MINUS, T_NEWLINE, T_NUMBER, T_OPEN_PARENT, T_PLUS, Token } from './tokens';
import TokensIterator from './TokensIterator';

type ParserState = (this: Parser, eof: boolean) => ParserState;

interface IBufferedToken<T> {
    value: T;
    token: Token;
}

function bufferToken<T>(tk: Token, t: T): IBufferedToken<T> {
    return {
        value: t,
        token: tk
    };
}

export class Parser {

    private it: TokensIterator;

    private program: Program = new Program();

    private state: ParserState;

    private bufferOpcode: T_IDENT | null;
    private bufferAField: IBufferedToken<InstructionField> | null;
    private bufferBField: IBufferedToken<InstructionField> | null;
    // TODO: remove sign tokens
    private bufferSign: number = 1;
    private bufferIdent: T_IDENT;

    private errors: ParseError[] = [];

    constructor(
            tokens: Token[],
            private variables: IVariableStore) {
        this.it = new TokensIterator(tokens);
        this.state = this.state_init;
    }

    public parse(): Program {
        while (this.it.hasNext()) {
            this.state = this.state(false);
        }
        this.state(true);

        if (this.errors.length > 0) {
            throw new CompilerError(this.errors);
        }
        return this.program;
    }

    private state_init(eof: boolean): ParserState {
        if (eof) {
            return this.state;
        }

        const token = this.it.next();

        switch (token.name) {
            case T_IDENT.name:
                this.beginInstruction(token as T_IDENT);
                return this.state_field;
            case T_COMMENT.name:
            case T_NEWLINE.name:
                // ignore
                return this.state;
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_field(eof: boolean): ParserState {
        if (eof) {
            this.produceInstruction();
            return this.state;
        }
        const token = this.it.next();
        switch (token.name) {
            case T_NEWLINE.name:
                this.produceInstruction();
                return this.state_init;
            case T_PLUS.name:
                return this.state_fieldImmediateNumber;
            case T_MINUS.name:
                this.bufferSign = -1;
                return this.state_fieldImmediateNumber;
            case T_IDENT.name:
                this.bufferIdent = token as T_IDENT;
                return this.state_fieldIdent;
            case T_PERCENT.name:
                return this.state_variable;
            case T_NUMBER.name:
                const value = (token as T_NUMBER).value;
                try {
                    const intValue = parseInt(value, 10);
                    if (this.bufferAField == null) {
                        this.bufferAField = bufferToken(token, immediate(intValue));
                    } else {
                        this.bufferBField = bufferToken(token, immediate(intValue));
                    }
                    return this.state_endField;
                } catch (e) {
                    this.errors.push(new ParseError(token.pos, `Invalid number ${value}`));
                    return this.state_error;
                }
            case T_COMMENT.name:
                return this.state;
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_variable(eof: boolean): ParserState {
        if (eof) {
            this.errors.push(new ParseError(this.it.current().pos, 'Unexpected end of file after percent'));
            return this.state;
        }
        const token = this.it.next();
        switch (token.name) {
            case T_IDENT.name:
                const value = this.variables[(token as T_IDENT).value];
                if (this.bufferAField == null) {
                    this.bufferAField = bufferToken(token, immediate(value));
                }
                return this.state_endField;
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_fieldIdent(eof: boolean): ParserState {
        if (eof) {
            this.errors.push(new ParseError(this.it.current().pos, 'Unexpected end of file after field identifier'));
            return this.state;
        }
        const token = this.it.next();
        switch (token.name) {
            case T_OPEN_PARENT.name:
                return this.state_reference;
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_reference(eof: boolean): ParserState {
        if (eof) {
            this.errors.push(new ParseError(this.it.current().pos, 'Unexpected end of file in reference.'));
            return this.state;
        }
        const token = this.it.next();
        switch (token.name) {
            case T_PLUS.name:
                return this.state_referenceNumber;
            case T_MINUS.name:
                this.bufferSign = -1;
                return this.state_referenceNumber;
            case T_NUMBER.name:
                const value = (token as T_NUMBER).value;
                try {
                    if (this.bufferIdent.value !== 'a' && this.bufferIdent.value !== 'b') {
                        this.errors.push(new ParseError(this.bufferIdent.pos,
                            `Invalid field name: ${this.bufferIdent.value} (must be 'a' or 'b')`));
                        return this.state_error;
                    }
                    const intValue = parseInt(value, 10);
                    const instr = ref(this.bufferIdent.value, intValue);
                    if (this.bufferAField == null) {
                        this.bufferAField = bufferToken(token, instr);
                    } else {
                        this.bufferBField = bufferToken(token, instr);
                    }
                    return this.state_endReference;
                } catch (e) {
                    this.errors.push(new ParseError(token.pos, `Invalid number ${value}`));
                    return this.state_error;
                }
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_endReference(eof: boolean): ParserState {
        if (eof) {
            this.errors.push(new ParseError(this.it.current().pos, 'Unexpected end of file. Expected ")"'));
            return this.state;
        }
        const token = this.it.next();
        switch (token.name) {
            case T_CLOSE_PARENT.name:
                return this.state_endField;
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_referenceNumber(eof: boolean): ParserState {
        if (eof) {
            this.errors.push(new ParseError(this.it.current().pos, 'Unexpected end of file'));
            return this.state;
        }
        const token = this.it.next();
        switch (token.name) {
            case T_NUMBER.name:
                const value = (token as T_NUMBER).value;
                try {
                    if (this.bufferIdent.value !== 'a' && this.bufferIdent.value !== 'b') {
                        this.errors.push(new ParseError(this.bufferIdent.pos,
                            `Invalid field name: ${this.bufferIdent.value} (must be 'a' or 'b')`));
                        return this.state_error;
                    }
                    const intValue = parseInt(value, 10) * this.bufferSign;
                    const instr = ref(this.bufferIdent.value, intValue);
                    if (this.bufferAField == null) {
                        this.bufferAField = bufferToken(token, instr);
                        this.bufferSign = 1;
                    } else {
                        this.bufferBField = bufferToken(token, instr);
                    }
                    return this.state_endReference;
                } catch (e) {
                    this.errors.push(new ParseError(token.pos, `Invalid number ${value}`));
                    return this.state_error;
                }
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_fieldImmediateNumber(eof: boolean): ParserState {
        if (eof) {
            this.errors.push(new ParseError(this.it.current().pos, 'Unexpected end of file'));
            return this.state;
        }
        const token = this.it.next();
        switch (token.name) {
            case T_NUMBER.name:
                const value = (token as T_NUMBER).value;
                try {
                    const intValue = parseInt(value, 10) * this.bufferSign;
                    if (this.bufferAField == null) {
                        this.bufferAField = bufferToken(token, immediate(intValue));
                        this.bufferSign = 1;
                    } else {
                        this.bufferBField = bufferToken(token, immediate(intValue));
                    }
                    return this.state_endField;
                } catch (e) {
                    this.errors.push(new ParseError(token.pos, `Invalid number ${value}`));
                    return this.state_error;
                }
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_endInstruction(eof: boolean): ParserState {
        this.produceInstruction();
        if (eof) {
            return this.state;
        }
        const token = this.it.next();

        switch (token.name) {
            case T_NEWLINE.name:
                return this.state_init;
            case T_COMMENT.name:
                return this.state;
            default:
                this.errors.push(new ParseError(token.pos, `Unexpected token: ${token.name}`));
                return this.state_error;
        }
    }

    private state_endField(eof: boolean): ParserState {
        // We don't consume anything so we need to call the next state in order to preserve the semantics
        if (this.bufferBField == null) {
            return this.state_field(eof);
        } else {
            return this.state_endInstruction(eof);
        }
    }

    private state_error(eof: boolean): ParserState {
        if (eof || this.it.next().name === T_NEWLINE.name) {
            return this.state_init;
        }
        return this.state;
    }

    private beginInstruction(opTk: T_IDENT) {
        this.bufferOpcode = opTk;
        this.bufferAField = null;
        this.bufferBField = null;
        this.bufferSign = 1;
    }

    private produceInstruction(): void {

        if (this.bufferOpcode == null) {
            throw new Error('Assertion error: opcode is null');
        }

        const op = this.bufferOpcode.value.toUpperCase();

        switch (op) {
            case OpCode.ADD:
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(add(aField, bField));
                });
                break;
            case OpCode.DAT:
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    // TODO: check that aField and bField are immediate
                    this.program.program.push(dat(aField.value, bField.value));
                });
                break;
            case OpCode.DIV:
                // TODO: check that aField is not immediate
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(div(aField, bField));
                });
                break;
            case OpCode.DIVB:
                // TODO: check that bField is not immediate
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(divb(aField, bField));
                });
                break;
            case OpCode.JMP:
                this.withAField(this.bufferOpcode, (aField) => {
                    this.program.program.push(jmp(aField));
                });
                break;
            case OpCode.JNZ:
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(jnz(aField, bField));
                });
                break;
            case OpCode.JZ:
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(jz(aField, bField));
                });
                break;
            case OpCode.MINE:
                this.withAField(this.bufferOpcode, (aField) => {
                    this.program.program.push(mine(aField));
                });
                break;
            case OpCode.MOD:
                // TODO: check that aField is not immediate
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(mod(aField, bField));
                });
                break;
            case OpCode.MODB:
                // TODO: check that bField is not immediate
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(mod(aField, bField));
                });
                break;
            case OpCode.MOV:
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(mov(aField, bField));
                });
                break;
            case OpCode.MUL:
                // TODO: check that aField is not immediate
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(mul(aField, bField));
                });
                break;
            case OpCode.NOP:
                // TODO: check that there is no field
                this.program.program.push(nop());
                break;
            case OpCode.SE:
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(se(aField, bField));
                });
                break;
            case OpCode.SNE:
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(sne(aField, bField));
                });
                break;
            case OpCode.SUB:
                // TODO: check that aField is not immediate
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(sub(aField, bField));
                });
                break;
            case OpCode.SUBB:
                // TODO: check that bField is not immediate
                this.withAandBField(this.bufferOpcode, (aField, bField) => {
                    this.program.program.push(subb(aField, bField));
                });
                break;
            default:
                this.errors.push(new ParseError(
                    this.bufferOpcode.pos, `Invalid opcode: ${this.bufferOpcode.value}`));
        }
    }

    private withAField(opcodeToken: Token, cb: (aField: InstructionField) => void): void {
        if (this.bufferAField == null) {
            this.errors.push(new ParseError(opcodeToken.pos, 'Missing a-field'));
            return;
        }
        if (this.bufferBField != null) {
            this.errors.push(new ParseError(this.bufferAField.token.pos, 'Extraneous b-field'));
            return;
        }
        cb(this.bufferAField.value);
    }

    private withAandBField(
            opcodeToken: Token,
            cb: (aField: InstructionField, bField: InstructionField) => void): void {
        if (this.bufferAField == null) {
            this.errors.push(new ParseError(opcodeToken.pos, 'Missing a-field'));
            return;
        }
        if (this.bufferBField == null) {
            this.errors.push(new ParseError(opcodeToken.pos, 'Missing b-field'));
            return;
        }
        cb(this.bufferAField.value, this.bufferBField.value);
    }
}
