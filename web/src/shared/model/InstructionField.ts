import * as rt from 'runtypes';

export type InstructionField = rt.Static<typeof InstructionField>;
export const InstructionField = rt.Record({
    fieldType: rt.Union(rt.Literal('immediate'), rt.Literal('reference')),
    value: rt.Number,
    field: rt.Union(rt.Literal('a'), rt.Literal('b'))
});

export function immediate(value?: number): InstructionField {
    return {
        fieldType: 'immediate',
        value: value || 0,
        field: 'a'
    }
}

export function ref(field: 'a' | 'b', value: number): InstructionField {
    return {
        fieldType: 'reference',
        value: value,
        field: field
    }
}
