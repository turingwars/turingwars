import { Hero } from 'api';
import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../services/api';
import { COLOR_P1, COLOR_P2, WHITE } from '../../style';
import { HeroPickerSeparator } from '../widgets/HeroPickerSeparator';
import { HeroPickerList } from '../widgets/HeroPickerList';
import { BaseScreen } from './BaseScreen';
import { BackButton } from '../widgets/BackButton';
import { ROUTE_REPLAY, navigateTo } from '../../services/navigation';
import { player } from '../../services/player';
import { ScreenActionButton } from '../widgets/ScreenActionButton';
import { Row } from '../layout/Row';
import { ActionsRow } from '../layout/ActionsRow';



const Column = styled.div`
    flex-grow: 1;
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



export class MatchMakingScreen extends React.Component<{}> {

    /** @override */ public state = {
        heros: [] as Hero[],
        selectedP1: undefined as string | undefined,
        selectedP2: undefined as string | undefined,
    };

    /** @override */ public componentDidMount() {
        this.loadHeros().catch((e) => { throw e });
    }

    /** @override */ public render() {
        return <BaseScreen title="Select Fighters">
            <Row>
                <PlayerTitle playerId={1}>Player 1</PlayerTitle>
                <PlayerTitle playerId={2}>Player 2</PlayerTitle>
            </Row>
            <Row>
                <Column>
                    <HeroPickerList 
                            player={1}
                            heros={this.state.heros}
                            selectedHeroId={this.state.selectedP1}
                            onSelect={this.p1SelectHandler}/>
                </Column>
                <HeroPickerSeparator />
                <Column>
                    <HeroPickerList
                            player={2}
                            heros={this.state.heros}
                            selectedHeroId={this.state.selectedP2}
                            onSelect={this.p2SelectHandler} />
                </Column>
            </Row>
            <ActionsRow>
                <BackButton />
                <ScreenActionButton enabled={this.canStartGame()} onClick={this.startGameHandler}>Fight!</ScreenActionButton>
            </ActionsRow>
        </BaseScreen>
    }

    private async loadHeros() {
        const response = await api.getAllHeros({
            query: {
                page: '0'
            }
        });
        this.setState({
            heros: response.data.data
        });
    }

    private canStartGame() {
        return this.state.selectedP1 !== undefined && this.state.selectedP2 !== undefined;
    }


    // Note: Handlers are bound to the class instance so we don't lose context during event dispatch!

    private p1SelectHandler = (heroId: string) => {
        this.setState({
            selectedP1: heroId
        });
    }

    private p2SelectHandler = (heroId: string) => {
        this.setState({
            selectedP2: heroId
        });
    }

    private startGameHandler = async () => {
        if (this.state.selectedP1 === undefined || this.state.selectedP2 === undefined) {
            return;
        }

        // TODO: Wrap the starting a game in a service

        // TODO: show a loader and handle errors
        const result = await api.createGame({
            body: {
                champions: [
                    this.state.selectedP1,
                    this.state.selectedP2
                ]
            }
        });

        const gameId = result.data.gameId;
        player.reset();
        navigateTo(`${ROUTE_REPLAY}/${gameId}`);
    }
}