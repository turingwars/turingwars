import { endpoints } from 'shared/api/endpoints';
import { createConsumer } from 'shared/api/typed-apis/axios-typed-api';
import { HeroSummary } from 'shared/api/dto';
import { PageCache } from './private/PageCache';

export const api = createConsumer('/api', endpoints);

interface HerosDataSourceParams {
    searchTerm: string
};

export const herosCache = new PageCache<HeroSummary, HerosDataSourceParams>(
    (p: number, data: HerosDataSourceParams) => api.listHeros({
        query: {
            page: p.toString(),
            searchTerm: data.searchTerm || ''
        }
    }).then((res) => res.data),
    (params: HerosDataSourceParams) => params.searchTerm);