import { twAPI, HeroSummary } from 'shared/api';
import { createConsumer } from 'shared/typed-apis/axios-typed-api';
import { PagedDataSource } from './private/PagedDataSource';

export const api = createConsumer('/api', twAPI);

export const herosDataSource = new PagedDataSource<HeroSummary>(
    (pageNumber) => api.listHeros({
        query: {
            page: pageNumber.toString()
        }
    }).then((res) => res.data)
);
