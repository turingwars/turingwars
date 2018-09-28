import { endpoints } from 'shared/api/endpoints';
import { createConsumer } from 'shared/api/typed-apis/axios-typed-api';
import { PagedDataSource } from './private/PagedDataSource';
import { HeroSummary } from 'shared/api/dto';

export const api = createConsumer('/api', endpoints);

export const herosDataSource = new PagedDataSource<HeroSummary>(
    (pageNumber, searchTerm) =>        api.listHeros({
        query: {
            page: pageNumber.toString(),
            searchTerm: searchTerm || ''
        }
    }).then((res) => res.data)
);
