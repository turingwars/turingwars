export function baseAction<T extends string, PAYLOAD>(type: T, payload: PAYLOAD) {
    return {
        type,
        payload
    };
}

export function catchUnhandledAction(_action: never) {
    // Throws a type error at compile time if an action is missing, but doesn't do
    // anything at runtime to prevent crashing for no good reason.
}
