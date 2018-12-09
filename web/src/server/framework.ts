import { Container } from 'inversify';

export const EXPRESS_APP = Symbol.for("express_app");

export interface IModule {
    configure(container: Container): Promise<void>;
    start(container: Container): Promise<void>;
    teardown(): Promise<void>;
}
