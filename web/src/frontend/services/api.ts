import { twAPI, HeroSummary } from 'shared/api';
import { createConsumer } from 'shared/typed-apis/axios-typed-api';
import { PagedDataSource } from './private/PagedDataSource';

export const api = createConsumer('/api', twAPI);

export const herosDataSource = new PagedDataSource<HeroSummary>(
    (pageNumber, searchTerm) =>        api.listHeros({
        query: {
            page: pageNumber.toString(),
            searchTerm: searchTerm || ''
        }
    }).then((res) => res.data)
);
