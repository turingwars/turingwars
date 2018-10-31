import { endpoints } from 'shared/api/endpoints';
import { createConsumer } from 'rest-ts-axios';
import { HeroSummary } from 'shared/api/dto';
import { PageCache } from './private/PageCache';
import axios from 'axios';

export const api = createConsumer(endpoints, axios.create({
    baseURL: '/api'
}));

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