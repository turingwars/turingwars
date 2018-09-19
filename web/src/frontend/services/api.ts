import { twAPI, HeroSummary } from '../../api';
import { createConsumer } from '../../typed-apis/axios-typed-api';
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
