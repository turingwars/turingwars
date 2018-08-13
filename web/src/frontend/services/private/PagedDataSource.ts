import { ResultPage } from 'api';

export function emptyDataPage<T>(): IDataPage<T> {
    return {
        data: [],
        hasNext: true,
        hasPrevious: false
    }
}

export interface IDataPage<T> {
    data: T[];
    hasNext: boolean;
    hasPrevious: boolean;
}

export class PagedDataSource<T> {

    private srcPageSize: number | null;

    private pages = new Map<number, Promise<T[]>>();

    /**
     * Maximum 0-based index in the series where we know there is an element, even if we haven't acessed it yet.
     */
    private knownMax = -1;

    public constructor(
            private source: (pageNumber: number) => Promise<ResultPage<T>>) {
    }

    public invalidate() {
        this.pages = new Map();
        this.srcPageSize = null;
        this.knownMax = -1;
    }

    /**
     * Fetches all heros between `from` inclusive and `to` exclusive.
     */
    public async getRange(from: number, to: number): Promise<IDataPage<T>> {
        await this.init();

        const pagesRequired = this.getPageNumbersForInterval(from, to);

        const data = await Promise.all(pagesRequired.map(this.getPage)).then((allHeros) =>
            allHeros.reduce((prev, cur) => prev.concat(cur), [])
        );

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

    private getPage = (p: number): Promise<T[]> => {
        let page = this.pages.get(p);
        if (page == null) {
            page = this.fetchPage(p);
            this.pages.set(p, page);
        }
        return page;
    }

    private async init(): Promise<void> {
        if (this.srcPageSize == null) { // The source hasn't been initialized yet
            // We fecth and wait on the first page, this way we wait until 'srcPageSize' has been set
            // and we can start calculating offsets. It is impossible to work if we do not have this value,
            // and it is more future-proof to not hardcode it in the client.
            await this.getPage(0);
        }
    }

    private async fetchPage(p: number): Promise<T[]> {
        const page = await this.source(p);
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

    private getPageNumbersForInterval(start: number, end: number): number[] {
        if (this.srcPageSize == null) {
            throw new Error("Illegal state: srcPageSize is null!");
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