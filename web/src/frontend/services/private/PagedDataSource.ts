import { ResultPage } from 'shared/api/dto';

export function emptyDataPage<T>(): IDataPage<T> {
    return {
        data: [],
        hasNext: false,
        hasPrevious: false
    }
}

export interface IDataPage<T> {
    data: T[];
    hasNext: boolean;
    hasPrevious: boolean;
}


/**
 * This is an adapter for a per-page datasource. It offers maximum flexibility by allowing
 * components to fetch ranges of data, without worrying about the underlying page model.
 * 
 * You can use this to implement infinite scroll on a paged resource, or adapt a UI paged list
 * to a backend paged resource with different page sizes.
 * 
 * The source should provide fixed-length pages. The PagedDataSource is clever enough to detect
 * if the source changes its number of entries per page, and reload the appropriate page, but it
 * cannot deal with variable-size source pages.
 * 
 * Each source page is requested at most once, and only when necessary. To clear the PagedDataSource's cache,
 * simply call `invalidate`. Further requests will use fresh data.
 * 
 * _note: This could be split into two classes: One for the adapter feature, and one for the page cache._
 */
export class PagedDataSource<DATA> {

    private srcPageSize: number | null;

    /**
     * This counter increases each time the source is invalidated and helps us detect stale reads.
     */
    private version = 0;

    /**
     * Maximum 0-based index in the series where we know there is an element, even if we haven't acessed it yet.
     */
    private knownMax = -1;

    public constructor(
            private source: (pageNumber: number, searchTerm?: string) => Promise<ResultPage<DATA>>) {
    }

    public invalidate() {
        this.srcPageSize = null;
        this.knownMax = -1;
        this.version++;
    }

    /**
     * Fetches all heros between `from` inclusive and `to` exclusive.
     */
    public async getRange(from: number, to: number, searchTerm: string = ''): Promise<IDataPage<DATA>> {
        const startVersion = this.version;
        const pagesRequired = await this.getPageNumbersForInterval(from, to, searchTerm);
        const data = await Promise.all(pagesRequired.map(p => this.fetchPage(p, searchTerm))).then((allHeros) =>
            allHeros.reduce((prev, cur) => prev.concat(cur), [])
        );

        if (startVersion != this.version) {
            // This data source has been invalidated while we were fetching data.
            return await this.getRange(from, to); // Retry
        }

        const hasPrevious = from > 0;
        const hasNext = to <= this.knownMax;

        if (this.srcPageSize == null) {
            // Maybe we got raced by a change in the backend. I don't expect this to even happen in practice
            // but in theory it could...
            return this.getRange(from, to);
        }

        const offset = from % this.srcPageSize;

        return {
            data: data.slice(offset, offset + to - from),
            hasNext,
            hasPrevious };
    }

    private async fetchPage(p: number, searchTerm: string): Promise<DATA[]> {
        const page = await this.source(p, searchTerm);
        if (this.srcPageSize != null && this.srcPageSize != page.perPage) {
            console.warn("Page size has changed. This means that the backend code was updated while the frontend was running.");
            this.invalidate();
        }
        this.srcPageSize = page.perPage;
        if (this.knownMax < page.total - 1) {
            this.knownMax = page.total - 1;
        }
        return page.data;
    }

    private async getPageNumbersForInterval(start: number, end: number, searchTerm: string): Promise<number[]> {
        while (this.srcPageSize == null) {
            await this.fetchPage(0, searchTerm);
        }
        const minimum = Math.floor(start / this.srcPageSize);
        const maximum = Math.floor((end - 1) / this.srcPageSize);
        const ret = new Array(maximum - minimum);
        for (let i = 0 ; i <= maximum - minimum ; i++) {
            ret[i] = minimum + i;
        }
        return ret;
    }
}