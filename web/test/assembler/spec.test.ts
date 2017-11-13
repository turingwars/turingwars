import { Assembler } from '../../src/assembler/Assembler';
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
    se,
    sne,
    sub,
    subb,
} from '../../src/model/Instruction';
import { immediate, ref } from '../../src/model/InstructionField';
import { Program } from '../../src/model/Program';

describe('Basic operations', () => {
    test('ADD', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            add(immediate(2), immediate(4))
        ];
        expect(asm.assemble('add 2 4')).toEqual(program);
    });

    test('DAT', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            dat(2, 4)
        ];
        expect(asm.assemble('dat 2 4')).toEqual(program);
    });

    test('DIV', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            div(immediate(2), immediate(4))
        ];
        expect(asm.assemble('div 2 4')).toEqual(program);
    });

    test('DIVB', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            divb(immediate(2), immediate(4))
        ];
        expect(asm.assemble('divb 2 4')).toEqual(program);
    });

    test('JMP', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jmp(immediate(2))
        ];
        expect(asm.assemble('jmp 2')).toEqual(program);
    });

    test('JNZ', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jnz(immediate(2), immediate(4))
        ];
        expect(asm.assemble('jnz 2 4')).toEqual(program);
    });

    test('JZ', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jz(immediate(2), immediate(4))
        ];
        expect(asm.assemble('jz 2 4')).toEqual(program);
    });

    test('MINE', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mine(immediate(2))
        ];
        expect(asm.assemble('mine 2')).toEqual(program);
    });

    test('MOD', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mod(immediate(2), immediate(4))
        ];
        expect(asm.assemble('mod 2 4')).toEqual(program);
    });

    test('MODB', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mod(immediate(2), immediate(4))
        ];
        expect(asm.assemble('modb 2 4')).toEqual(program);
    });

    test('MOV', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mov(immediate(2), immediate(4))
        ];
        expect(asm.assemble('mov 2 4')).toEqual(program);
    });

    test('MUL', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mul(immediate(2), immediate(4))
        ];
        expect(asm.assemble('mul 2 4')).toEqual(program);
    });

    test('NOP', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            nop()
        ];
        expect(asm.assemble('nop')).toEqual(program);
    });

    test('SE', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            se(immediate(2), immediate(4))
        ];
        expect(asm.assemble('se 2 4')).toEqual(program);
    });

    test('SNE', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            sne(immediate(2), immediate(4))
        ];
        expect(asm.assemble('sne 2 4')).toEqual(program);
    });

    test('SUB', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            sub(immediate(2), immediate(4))
        ];
        expect(asm.assemble('sub 2 4')).toEqual(program);
    });

    test('SUBB', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            subb(immediate(2), immediate(4))
        ];
        expect(asm.assemble('subb 2 4')).toEqual(program);
    });
});

describe('Immediate values', () => {
    test('simple', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jmp(immediate(42))
        ];
        expect(asm.assemble('jmp 42')).toEqual(program);
    });
    test('positive', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jmp(immediate(42))
        ];
        expect(asm.assemble('jmp +42')).toEqual(program);
    });
    test('negative', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jmp(immediate(-42))
        ];
        expect(asm.assemble('jmp -42')).toEqual(program);
    });
});

describe('References', () => {

    test('a-field reference', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jmp(ref('a', 2))
        ];
        expect(asm.assemble('jmp a(2)')).toEqual(program);
    });

    test('b-field reference', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jmp(ref('b', 2))
        ];
        expect(asm.assemble('jmp b(2)')).toEqual(program);
    });

    test('negative reference', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jmp(ref('a', -2))
        ];
        expect(asm.assemble('jmp a(-2)')).toEqual(program);
    });
});

describe('Variables', () => {
    test('Can load user id', () => {
        const asm = new Assembler({
            id: 1
        });
        const program = new Program();
        program.program = [
            mine(immediate(1))
        ];
        expect(asm.assemble('mine %id')).toEqual(program);
    });
});

describe('Not code characters', () => {
    test('Regular comment', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mine(immediate(1))
        ];
        expect(asm.assemble('; a comment\nmine 1')).toEqual(program);
    });
    test('Inline comment', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mine(immediate(1))
        ];
        expect(asm.assemble('mine 1 ; a comment')).toEqual(program);
    });
    test('Empty line', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mine(immediate(1)),
            jmp(immediate(3))
        ];
        expect(asm.assemble('mine 1\n\njmp 3')).toEqual(program);
        expect(asm.assemble('\nmine 1\njmp 3\n')).toEqual(program);
    });
});

describe('Full programs', () => {

    test('Imp', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            mov(immediate(1), immediate(0))
        ];
        expect(asm.assemble('mov 1 0')).toEqual(program);
    });

    test('Dwarf', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            add(ref('b', 3), immediate(4)),
            mov(ref('b', 2), immediate(2)),
            jmp(immediate(-2)),
            dat(0, 0)
        ];
        expect(asm.assemble(
            'add b(3) 4\n' +
            'mov b(2) 2\n' +
            'jmp -2\n' +
            'dat 0 0\n'
        )).toEqual(program);
    });

    test('jump negative', () => {
        const asm = new Assembler();
        const program = new Program();
        program.program = [
            jmp(immediate(2)),
            dat(0, 0),
            jnz(immediate(2), ref('a', -1)),
            mine(immediate(0))
        ];
        expect(asm.assemble(
            'jmp 2\n' +
            'dat 0 0\n' +
            'jnz 2 a(-1)\n' +
            'mine 0\n'
        )).toEqual(program);
    });
});
