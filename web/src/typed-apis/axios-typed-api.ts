import axios, { AxiosResponse } from 'axios';
import { ApiDefinition, EndpointDefinition, makePathWithParams } from './typed-api';


type IsInRecord<T, Key extends keyof T> = T extends Record<Key, any> ? Key : never;
type KeyIfDefined<T, Key extends keyof T> = Key extends IsInRecord<T, Key> ? Key : never;

interface TypedAxiosResponse<T extends EndpointDefinition> extends AxiosResponse {
    data: T['response'];
}

type RouteConsumerParams<T extends EndpointDefinition> = {
    [K in KeyIfDefined<T, 'params' | 'query' | 'body'>]: T[K];
};

type RouteConsumer<T extends EndpointDefinition> = KeyIfDefined<T, 'params' | 'query' | 'body'> extends never ?
    () => Promise<TypedAxiosResponse<T>> :
    (params: RouteConsumerParams<T>) => Promise<TypedAxiosResponse<T>>;

export type ApiConsumer<T extends ApiDefinition> = {
    [K in keyof T]: RouteConsumer<T[K]>;
};

export function createConsumer<T extends ApiDefinition>(baseURL: string, def: T): ApiConsumer<T> {
    const ret: ApiConsumer<T> = {} as any;
    for (const i of Object.keys(def)) {
        ret[i] = makeAxiosEndpoint(baseURL, def[i]) as any;
    }
    return ret;
}

function makeAxiosEndpoint<T extends EndpointDefinition>(baseURL: string, def: T): RouteConsumer<EndpointDefinition> {
    return ((args?: any) => {
        const params = args != null ? args.params : undefined;
        const body = args ? args.body : undefined;
        const query = args ? args.query : undefined;
        return axios({
            baseURL,
            method: def.method.toLowerCase(),
            url: makePathWithParams(def, params),
            params: query,
            data: body
        });
    });
}
