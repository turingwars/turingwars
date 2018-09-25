
/**
 * Asynchronous sleep function.
 * 
 * usage: await pause(delay_ms);
 */
export function pause(milliseconds: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}