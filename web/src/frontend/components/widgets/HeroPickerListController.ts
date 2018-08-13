import { IDataPage, emptyDataPage } from '../../services/private/PagedDataSource';
import { Hero } from 'api';
import { herosDataSource } from '../../services/api';
import { firstEntryOfPage } from './HeroPickerList';

export interface IHeroPickerListControllerState {
    readonly heros: IDataPage<Hero>;
    readonly page: number;
    readonly selected: string | undefined;
}

export class HeroPickerListController {

    public static initialState(): IHeroPickerListControllerState {
        return {
            heros: emptyDataPage(),
            page: 0,
            selected: undefined
        }
    }

    constructor(
            private setState: (s: IHeroPickerListControllerState) => void,
            private getState: () => IHeroPickerListControllerState) {
    }

    public init(): Promise<void> {
        return herosDataSource.getRange(0, firstEntryOfPage(1)).then((res) => this.setState({
            ...this.getState(),
            heros: res
        }));
    }

    public selectHandler = (selected: string) => {
        this.setState({
            ...this.getState(),
            selected: selected
        });
    }

    public loadNextPageHandler = async () => {
        const page = this.getState().page;
        const nextPage = page + 1;
        this.setState({
            ...this.getState(),
            heros: await herosDataSource.getRange(firstEntryOfPage(nextPage), firstEntryOfPage(nextPage + 1)),
            page: nextPage
        });
    }

    public loadPreviousPageHandler = async () => {
        const page = this.getState().page;
        const previousPage = page - 1;
        this.setState({
            ...this.getState(),
            heros: await herosDataSource.getRange(firstEntryOfPage(previousPage), firstEntryOfPage(page)),
            page: previousPage
        });
    }
}
