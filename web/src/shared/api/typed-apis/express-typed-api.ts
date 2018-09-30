import * as express from 'express';

import { ApiDefinition, EndpointDefinition, getPathWithParams, RealType, Tuple2Dict } from './typed-api';
import { BadRequestHttpException } from '@senhung/http-exceptions';

/**
 * A promise of T or just T.
 */
type PromiseOrValue<T> = PromiseLike<T> | T;



/**
 * An express Request with proper typings.
 */
interface TypedRequest<T extends EndpointDefinition> extends Express.Request {
    body: RealType<T['body']>;
    params: Tuple2Dict<T['params']>;
    query: RealType<T['query']>;
}

export type RouteHandler<T extends EndpointDefinition> =
    (req: TypedRequest<T>, res: Express.Response) => PromiseOrValue<RealType<T['response']>>;

export type RouterDefinition<T extends ApiDefinition> = {
    [K in keyof T]: RouteHandler<T[K]['def']>;
};

export function createRouter<T extends ApiDefinition>(apiDefinition: T, hash: RouterDefinition<T>): express.Router {
    const router = express.Router();
    for (const i of Object.keys(apiDefinition)) {
        const endpoint = apiDefinition[i];
        const def = endpoint.def;
        const path = getPathWithParams(def);
        switch (endpoint.def.method) {
            case 'GET':
                router.get(path, makeHandler(def, hash[i].bind(hash)));
                break;
            case 'POST':
                router.post(path, makeHandler(def, hash[i].bind(hash)));
                break;
            case 'PUT':
                router.put(path, makeHandler(def, hash[i].bind(hash)));
                break;
            case 'DELETE':
                router.delete(path, makeHandler(def, hash[i].bind(hash)));
                break;
        }
    }
    return router;
}

export function makeHandler<T extends EndpointDefinition>(def: T, fn: RouteHandler<T>) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        (async () => {
            sanitizeIncomingRequest(def, req);
            const data = await Promise.resolve(fn(req, res));
            if (data !== undefined && !res.headersSent) {
                res.send(data);
            } else {
                next();
            }
        })()
        .catch(next);
    }
}

function sanitizeIncomingRequest(def: EndpointDefinition, req: express.Request) {
    if (req.body != null) {
        try {
            req.body = def.body == null ? null : def.body.check(req.body);
        } catch (e) {
            throw new BadRequestHttpException(e);
        }
    }
}