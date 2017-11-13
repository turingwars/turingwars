import { add, jmp, nop } from '../model/Instruction';
import { immediate, ref } from '../model/InstructionField';
import { Program } from '../model/Program';

const program = new Program();
program.program = [
    add(ref('a', 1), immediate(4)),
    jmp(immediate(1)),
    nop()
];
console.log(JSON.stringify(program));
