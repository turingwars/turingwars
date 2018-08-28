import { immediate, InstructionField } from './InstructionField';
import * as rt from 'runtypes';


const BaseInstruction = <A extends string>(op: A) => rt.Record({
    op: rt.Literal(op),
    a: InstructionField,
    b: InstructionField
});

export const ADD = BaseInstruction('ADD');
export const DAT = BaseInstruction('DAT');
export const DIV = BaseInstruction('DIV');
export const DIVB = BaseInstruction('DIVB');
export const JMP = BaseInstruction('JMP');
export const JNZ = BaseInstruction('JNZ');
export const JZ = BaseInstruction('JZ');
export const MINE = BaseInstruction('MINE');
export const MOD = BaseInstruction('MOD');
export const MODB = BaseInstruction('MODB');
export const MOV = BaseInstruction('MOV');
export const MUL = BaseInstruction('MUL');
export const NOP = BaseInstruction('NOP');
export const SE = BaseInstruction('SE');
export const SNE = BaseInstruction('SNE');
export const SUB = BaseInstruction('SUB');
export const SUBB = BaseInstruction('SUBB');

export type Instruction = rt.Static<typeof Instruction>;
export const Instruction = rt.Union(
    ADD,
    DAT,
    DIV,
    DIVB,
    JMP,
    JNZ,
    JZ,
    MINE,
    MOD,
    MODB,
    MOV,
    MUL,
    NOP,
    SE,
    SNE,
    SUB,
    SUBB
);

const instr = <T extends rt.Runtype>(_: T, t: rt.Static<T>) => t;

export const add = (a: InstructionField, b: InstructionField) => instr(ADD, { op: 'ADD', a, b })

export const dat = (aValue: number, bValue: number) => instr(DAT, { op: 'DAT', a: immediate(aValue), b: immediate(bValue) })

export const div = (a: InstructionField, b: InstructionField) => instr(DIV, { op: 'DIV', a, b })

export const divb = (a: InstructionField, b: InstructionField) => instr(DIVB, { op: 'DIVB', a, b })

export const jmp = (dest: InstructionField) => instr(JMP, { op: 'JMP', a: dest, b: immediate() })

export const jnz = (cond: InstructionField, dest: InstructionField) => instr(JNZ, { op: 'JNZ', a: cond, b: dest })

export const jz = (cond: InstructionField, dest: InstructionField) => instr(JZ, { op: 'JZ', a: cond, b: dest })

export const mine = (id: InstructionField) => instr(MINE, { op: 'MINE', a: id, b: immediate() })

export const mod = (a: InstructionField, b: InstructionField) => instr(MOD, { op: 'MOD', a, b })

export const modb = (a: InstructionField, b: InstructionField) => instr(MODB, { op: 'MODB', a, b })

export const mov = (dest: InstructionField, src: InstructionField) => instr(MOV, { op: 'MOV', a: dest, b: src })

export const mul = (a: InstructionField, b: InstructionField) => instr(MUL, { op: 'MUL', a, b })

export const nop = () => instr(MUL, { op: 'MUL', a: immediate(), b: immediate() })

export const se = (a: InstructionField, b: InstructionField) => instr(SE, { op: 'SE', a, b })

export const sne = (a: InstructionField, b: InstructionField) => instr(SNE, { op: 'SNE', a, b })

export const sub = (a: InstructionField, b: InstructionField) => instr(SUB, { op: 'SUB', a, b })

export const subb = (a: InstructionField, b: InstructionField) => instr(SUBB, { op: 'SUBB', a, b })
