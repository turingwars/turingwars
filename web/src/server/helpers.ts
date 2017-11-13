
export function orFail<T>(input: T | undefined): T {
    if (input == null) {
        throw new Error('Object not found!');
    }
    return input;
}
