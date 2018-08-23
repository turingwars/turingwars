import { twAPI, HeroSummary } from '../../api';
import { createConsumer } from '../../typed-apis/axios-typed-api';
import { PagedDataSource } from './private/PagedDataSource';

export const api = createConsumer('/api', twAPI);

export const herosDataSource = new PagedDataSource<HeroSummary>(
    (pageNumber) => api.listHeros({
        query: {
            page: pageNumber.toString()
        }
    }).then((res) => res.data)
);
