import { HeroSummary } from 'shared/api/dto';
import * as color from 'color';
import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { COLOR_P1, COLOR_P2, WHITE } from 'frontend/style';
import { Label } from './Label';
import { SearchInput } from './SearchBar';
import { IDataPage, emptyDataPage, PagedDataSource } from '../../services/private/PagedDataSource';
import { herosCache } from '../../services/api';

const ENTRIES_PER_PAGE = 15;
const PICKER_HEIGHT = 500;

/**
 * Returns the index of the first entry shown at page n (0-indexed)
 */
function firstEntryOfPage(n: number) {
    if (n <= 0) {
        return 0;
    } else if (n === 1) {
        // On the first page, we need one extra space for the page down button
        return ENTRIES_PER_PAGE - 1;
    } else {
        // On the next pages, we need two extra spaces.
        return ENTRIES_PER_PAGE - 1 + (n - 1) * (ENTRIES_PER_PAGE - 2);
    }
}

const HorizontalPixelGridBackground = styled.div<{baseColor: string}>`
    background: repeating-linear-gradient(
        ${props => color(props.baseColor).fade(1).string()} 0px,
        ${props => color(props.baseColor).fade(0.8).string()} 3px,
        ${props => color(props.baseColor).fade(1).string()} 4px);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 100;
`;

const Glow = styled.div<{baseColor: string}>`
    box-shadow: inset 0 0 100px 3px ${props => color(props.baseColor).fade(0.5).string()};
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 105;
`;

const RGBPixelGridBackground = styled.div`
    background: repeating-linear-gradient(90deg,
        #aaa 0,
        #f00 1px,
        #0f0 3px,
        #00f 4px,
        #aaa 6px);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 101;
    mix-blend-mode: multiply;
`;

const largeScanFrames = keyframes`
    from {
        transform: translate(0px, 0%);
    }
    to {
        transform: translate(0px, 50%);
    }
`;


// Create two scan patterns so they don't awkwardly run synchronously
const makeListBackgroundScan = () => styled.div`
        background: repeating-linear-gradient(
            #535 0%,
            #dfd ${10 + Math.random() * 10}%,
            #dcf 23%,
            #888 25%,
            #aff 30%,
            #845 ${36 + Math.random() * 4}%,
            #fff 48%,
            #535 50%);
        position: absolute;
        height: 200%;
        width: 100%;
        top: -100%;
        z-index: 102;
        animation: ${largeScanFrames} ${5 + Math.random() }s linear infinite;
        mix-blend-mode: multiply;
    `;
const ListBackgroundScan1 = makeListBackgroundScan();
const ListBackgroundScan2 = makeListBackgroundScan();

const ListContainer = styled.div<{baseColor: string}>`
    border: ${props => props.baseColor} 3px solid;
    padding: 0;
    margin: 0;
    height: ${PICKER_HEIGHT}px;
    overflow: hidden;

    position: relative;
`;

const StyledElement = styled.div<{
        baseColor: string;
        selected: boolean;
    }>`
    font-size: ${PICKER_HEIGHT / ENTRIES_PER_PAGE - 6}px; /* The magic offset depends on the font used */
    color: #eee;
    width: 100%;
    height: ${PICKER_HEIGHT / ENTRIES_PER_PAGE}px;
    padding: 3px 12px;
    cursor: pointer;
    position: relative;
    z-index: 110;
    mix-blend-mode: color-dodge;

    ${props => props.selected ?
        css`
            color: ${WHITE};
            background: linear-gradient(90deg,
                    ${props => props.baseColor} 0%,
                    ${props => color(props.baseColor).fade(0.4).string()} 20%,
                    ${props => color(props.baseColor).fade(0.4).string()} 80%,
                    ${props => props.baseColor} 100%);
            mix-blend-mode: screen;
        ` :
        css`
            &:hover {
                color: ${WHITE};
                background-color: ${props => color(props.baseColor).fade(0.7).string()};
            }
        `
    }
`;

class ListElement extends React.PureComponent<{
        hero: HeroSummary;
        onClick: (heroId: string) => void;
        selected: boolean;
        baseColor: string;
    }> {
    /** @override */ public render() {
        return <StyledElement
                baseColor={this.props.baseColor}
                selected={this.props.selected}
                onClick={this.clickHandler}>
            <Label>{ this.props.hero.name }</Label>
        </StyledElement>
    }

    private clickHandler = () => {
        this.props.onClick(this.props.hero.id);
    }
};

export type HeroPickerListState = {
    heros: IDataPage<HeroSummary> | undefined;
    page: number;
    selected?: string;
    searchTerm: string;
    heroDataSource: PagedDataSource<HeroSummary>
};

export type HeroPickerProps = {
    player: 1 | 2;
    list: HeroPickerListState;
    update: (listState: HeroPickerListState) => void;
};

export class HeroPicker extends React.Component<HeroPickerProps> {

    // These variable is used in updateSearchTerm to prevent race conditions
    private searchTermRaceCounter = 0;
    private lastSearchTermRaceWinner = 0;

    public static initialListState(): HeroPickerListState {
        return {
            heros: emptyDataPage<HeroSummary>(),
            page: 0,
            selected: undefined,
            searchTerm: "",
            heroDataSource: new PagedDataSource<HeroSummary>(
                (pageNumber, searchTerm) => herosCache.getPage(pageNumber, {
                    searchTerm: searchTerm || ''
                })
            )
        }
    };

    /** @override */ public componentDidMount() {
        this.props.list.heroDataSource.invalidate()
        this.props.list.heroDataSource.getRange(0, firstEntryOfPage(1)).then((res) => this.props.update({
            ...this.props.list,
            heros: res
        })).catch((e) => { throw e });
    }

    /** @override */ public render() {
        const baseColor = this.props.player === 1 ? COLOR_P1 : COLOR_P2;
        return  [<SearchInput color={baseColor} value={this.props.list.searchTerm} onChange={(s) => this.updateSearchTerm(s.currentTarget.value) }/>,
                <ListContainer baseColor={baseColor}>
                {
                    this.props.list.heros && this.renderListEntries(baseColor, this.props.list.heros)
                }
                <HorizontalPixelGridBackground baseColor={baseColor}/>
                <RGBPixelGridBackground />
                {this.props.player === 1 ? <ListBackgroundScan1 /> :  <ListBackgroundScan2 />}
                <Glow baseColor={baseColor} />
        </ListContainer>]
    }

    private renderListEntries(baseColor: string, herosPage: IDataPage<HeroSummary>) {
        return [
            herosPage.hasPrevious && (
                <StyledElement onClick={this.loadPreviousPageHandler} key="prev-page" baseColor={baseColor} selected={false}>
                    <Label textAlign="center">▴</Label>
                </StyledElement>
            ),
            herosPage.data.map((hero) => <ListElement
                key={hero.id}
                baseColor={baseColor}
                hero={hero} selected={hero.id === this.props.list.selected}
                onClick={this.selectHandler} />
            ),
            herosPage.hasNext && (
                <StyledElement onClick={this.loadNextPageHandler} key="next-page" baseColor={baseColor} selected={false}>
                    <Label textAlign="center">▾</Label>
                </StyledElement>
            )
        ];
    }

    private loadNextPageHandler = async () => {
        const searchTerm = this.props.list.searchTerm
        const page = this.props.list.page;
        const nextPage = page + 1;
        this.props.update({
            ...this.props.list,
            heros: await this.props.list.heroDataSource.getRange(firstEntryOfPage(nextPage), firstEntryOfPage(nextPage + 1), searchTerm),
            page: nextPage
        });
    }

    private loadPreviousPageHandler = async () => {
        const searchTerm = this.props.list.searchTerm
        const page = this.props.list.page;
        const previousPage = page - 1;
        this.props.update({
            ...this.props.list,
            heros: await this.props.list.heroDataSource.getRange(firstEntryOfPage(previousPage), firstEntryOfPage(page), searchTerm),
            page: previousPage
        });
    }

    private updateSearchTerm = async (searchTerm: string) => {

        // This "thread" gets assigned a numeric value. We use this value below to prevent multiple
        // invokation of this method from racing against each other. In other words, we guarantee that
        // invokations of this method take effect in the same order as the call order. Any out-of-order
        // result is aborted.
        const raceCounter = this.searchTermRaceCounter++;

        // First update the search term because we want the search term to update instantly upon key press,
        // not seconds after when the ajax request returns
        this.props.update({
            ...this.props.list,
            searchTerm: searchTerm,
        });

        this.props.list.heroDataSource.invalidate()
        const from = this.props.list.page;
        const l = await this.props.list.heroDataSource.getRange(firstEntryOfPage(from), firstEntryOfPage(from+1), searchTerm);

        // Before we update, check that no newer "thread" won the race against the current one
        if (this.lastSearchTermRaceWinner >= raceCounter) {
            // If we did lose a race, then abort.
            return;
        }
        // Otherwise, prevent older threads from updating after us
        this.lastSearchTermRaceWinner = raceCounter;

        // Then update only the results list. The search term has already been optimistically updated at that point.
        this.props.update({
            ...this.props.list,
            heros: l,
        });
    }

    private selectHandler = (selected: string) => {
        this.props.update({
            ...this.props.list,
            selected: selected
        });
    }
};
