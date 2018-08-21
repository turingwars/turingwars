export class InstructionField {
    public fieldType: 'immediate' | 'reference';
    public value: number;
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
