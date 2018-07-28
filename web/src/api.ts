
export interface IHero {
    program: string;
    id: string;
    name: string;
}

export interface IAPIDefinition {
    '/hero/:id': {
        GET: {
            response: IHero
        },
        PUT: {
            body: IHero,
            response: {
                id: string
            }
        }
    };
}
