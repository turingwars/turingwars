export class PlaytestRequest {
    public opponent: string;

    /**
     * The temporary hero to test
     */
    public hero: {
        program: string;
    };
}
