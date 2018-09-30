import { ResultPage } from 'shared/api/dto';


export class PageCache<DATA, PARAMS> {
    
    /**
     * Map of internal tags to data page.
     */
    private pages = new Map<string, Promise<ResultPage<DATA>>>();    

    constructor(
            private source: (p: number, params: PARAMS) => Promise<ResultPage<DATA>>,
            private tag: (params: PARAMS) => string) {
    }

    public getPage(p: number, params: PARAMS): Promise<ResultPage<DATA>> {
        const tag = this.makeTag(p, params);
        let page = this.pages.get(tag);
        if (page == null) {
            page = this.source(p, params);
            this.pages.set(tag, page);
        }
        return page;
    }

    public invalidate(): void {
        this.pages = new Map();
    }

    private makeTag(p: number, params: PARAMS) {
        return `${p}:${this.tag(params)}`;
    }
}