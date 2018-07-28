export function initialState() {
    return {
        message: 'Hello world'
    };
}

export type State = ReturnType<typeof initialState>;
