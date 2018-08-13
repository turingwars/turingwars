import * as React from 'react';
import styled from 'styled-components';
import { api, herosDataSource } from '../../services/api';
import { navigateTo, ROUTE_REPLAY } from '../../services/navigation';
import { player } from '../../services/player';
import { COLOR_P1, COLOR_P2, WHITE } from '../../style';
import { ActionsRow } from '../layout/ActionsRow';
import { Row } from '../layout/Row';
import { BackButton } from '../widgets/BackButton';
import { HeroPickerList } from '../widgets/HeroPickerList';
import { HeroPickerListController, IHeroPickerListControllerState } from '../widgets/HeroPickerListController';
import { HeroPickerSeparator } from '../widgets/HeroPickerSeparator';
import { ScreenActionButton } from '../widgets/ScreenActionButton';
import { BaseScreen } from './BaseScreen';
import { Label } from '../widgets/Label';



const Column = styled.div`
    flex-grow: 1;
    flex-basis: 0;
    flex-shrink: 1;
    overflow: hidden;
`;

const PlayerTitle = styled.h2<{playerId: 1 | 2}>`
    color: ${WHITE};
    font-size: 20px;
    margin: 5px 10px;

    &:${props => props.playerId === 1 ? 'after' : 'before'} {
        content: "▾";
        padding: 0 20px;
        color: ${props => props.playerId === 1 ? COLOR_P1 : COLOR_P2};
    }
`;

interface MatchMakingScreenState {
    heroPicker1: IHeroPickerListControllerState;
    heroPicker2: IHeroPickerListControllerState;
}


export class MatchMakingScreen extends React.Component<{}, MatchMakingScreenState> {

    /** @override */ public state: MatchMakingScreenState = {
        heroPicker1: HeroPickerListController.initialState(),
        heroPicker2: HeroPickerListController.initialState()
    };

    private p1HerosListController = new HeroPickerListController(
        (state) => this.setState({
            heroPicker1: state
        }),
        () => this.state.heroPicker1
    );

    private p2HerosListController = new HeroPickerListController(
        (state) => this.setState({
            heroPicker2: state
        }),
        () => this.state.heroPicker2
    );

    /** @override */ public componentDidMount() {
        herosDataSource.invalidate();
        // TODO: proper error handling
        this.p1HerosListController.init().catch((e) => { throw e });
        this.p2HerosListController.init().catch((e) => { throw e });
    }

    /** @override */ public render() {
        return <BaseScreen title="Select Fighters">
            <Row>
                <PlayerTitle playerId={1}>Player 1</PlayerTitle>
                <PlayerTitle playerId={2}>Player 2</PlayerTitle>
            </Row>
            <Row>
                <Column>
                    <Label>{ this.state.heroPicker1.selected }</Label>
                    <HeroPickerList 
                            player={1}
                            selectedHeroId={this.state.heroPicker1.selected}
                            onSelect={this.p1HerosListController.selectHandler}
                            herosPage={this.state.heroPicker1.heros}
                            onRequestNextPage={this.p1HerosListController.loadNextPageHandler}
                            onRequestPreviousPage={this.p1HerosListController.loadPreviousPageHandler} />
                </Column>
                <HeroPickerSeparator />
                <Column>
                    <HeroPickerList
                            player={2}
                            selectedHeroId={this.state.heroPicker2.selected}
                            onSelect={this.p2HerosListController.selectHandler}
                            herosPage={this.state.heroPicker2.heros}
                            onRequestNextPage={this.p2HerosListController.loadNextPageHandler}
                            onRequestPreviousPage={this.p2HerosListController.loadPreviousPageHandler} />
                </Column>
            </Row>
            <ActionsRow>
                <BackButton />
                <ScreenActionButton enabled={this.canStartGame()} onClick={this.startGameHandler}>Fight!</ScreenActionButton>
            </ActionsRow>
        </BaseScreen>
    }

    private canStartGame() {
        return this.state.heroPicker1.selected !== undefined && this.state.heroPicker2.selected !== undefined;
    }


    // Note: Handlers are bound to the class instance so we don't lose context during event dispatch!

    private startGameHandler = async () => {
        if (this.state.heroPicker1.selected === undefined || this.state.heroPicker2.selected === undefined) {
            return;
        }

        // TODO: Wrap the starting a game in a service

        // TODO: show a loader and handle errors
        const result = await api.createGame({
            body: {
                champions: [
                    this.state.heroPicker1.selected,
                    this.state.heroPicker2.selected
                ]
            }
        });

        const gameId = result.data.gameId;
        player.reset();
        navigateTo(`${ROUTE_REPLAY}/${gameId}`);
    }
}