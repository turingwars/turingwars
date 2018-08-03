
export function baseAction<T extends string, PAYLOAD>(type: T, payload: PAYLOAD) {
    return {
        type,
        payload
    };
}

export function setMessageAction(msg: string) {
    return baseAction('setMessage', msg);
}

/**
 * Join here all possible actions
 */
export type AppActions =
        ReturnType<typeof setMessageAction>;
