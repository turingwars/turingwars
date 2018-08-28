declare namespace engine {

    class Engine {
        constructor(
            prog1Code: string,
            prog2Code: string,
            configJSON: string
        )

        public run(): string;
    }

    interface EngineConfiguration {
        diffFrequency: number;
        nbCycles: number;
        memorySize: number;
    }
}
export = engine