import { IsDefined, IsIn, IsNumber } from 'class-validator';

export class InstructionField {

    @IsDefined()
    @IsIn(['immediate', 'reference'])
    public fieldType: 'immediate' | 'reference';

    @IsDefined()
    @IsNumber()
    public value: number;

    @IsIn(['a', 'b'])
    public field: 'a' | 'b';
}

export function immediate(value?: number): InstructionField {
    const ifield = new InstructionField();
    ifield.fieldType = 'immediate';
    ifield.value = value || 0;
    ifield.field = 'a';
    return ifield;
}

export function ref(field: 'a' | 'b', value: number): InstructionField {
    const ifield = new InstructionField();
    ifield.fieldType = 'reference';
    ifield.value = value;
    ifield.field = field;
    return ifield;
}
