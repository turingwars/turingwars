import { immediate, InstructionField } from './InstructionField';

export enum OpCode {
    ADD = 'ADD',
    DAT = 'DAT',
    DIV = 'DIV',
    DIVB = 'DIVB',
    JMP = 'JMP',
    JNZ = 'JNZ',
    JZ = 'JZ',
    MINE = 'MINE',
    MOD = 'MOD',
    MODB = 'MODB',
    MOV = 'MOV',
    MUL = 'MUL',
    NOP = 'NOP',
    SE = 'SE',
    SNE = 'SNE',
    SUB = 'SUB',
    SUBB = 'SUBB',
}

export class Instruction {

    public op: OpCode;

    public a: InstructionField;

    public b: InstructionField;
}

export function add(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.ADD;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function dat(aValue: number, bValue: number) {
    const instr = new Instruction();
    instr.op = OpCode.DAT;
    instr.a = immediate(aValue);
    instr.b = immediate(bValue);
    return instr;
}

export function div(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.DIV;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function divb(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.DIVB;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function jmp(dest: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.JMP;
    instr.a = dest;
    instr.b = immediate();
    return instr;
}

export function jnz(cond: InstructionField, dest: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.JNZ;
    instr.a = cond;
    instr.b = dest;
    return instr;
}

export function jz(cond: InstructionField, dest: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.JZ;
    instr.a = cond;
    instr.b = dest;
    return instr;
}

export function mine(id: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.MINE;
    instr.a = id;
    instr.b = immediate();
    return instr;
}

export function mod(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.MOD;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function modb(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.MODB;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function mov(dest: InstructionField, src: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.MOV;
    instr.a = dest;
    instr.b = src;
    return instr;
}

export function mul(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.MUL;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function nop() {
    const instr = new Instruction();
    instr.op = OpCode.NOP;
    instr.a = immediate();
    instr.b = immediate();
    return instr;
}

export function se(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.SE;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function sne(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.SNE;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function sub(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.SUB;
    instr.a = a;
    instr.b = b;
    return instr;
}

export function subb(a: InstructionField, b: InstructionField) {
    const instr = new Instruction();
    instr.op = OpCode.SUBB;
    instr.a = a;
    instr.b = b;
    return instr;
}
