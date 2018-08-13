import { twAPI, Hero } from '../../api';
import { createConsumer } from '../../typed-apis/axios-typed-api';
import { PagedDataSource } from './private/PagedDataSource';

export const api = createConsumer('/api', twAPI);

export const herosDataSource = new PagedDataSource<Hero>(
    (pageNumber) => api.getAllHeros({
        query: {
            page: pageNumber.toString()
        }
    }).then((res) => res.data)
);
