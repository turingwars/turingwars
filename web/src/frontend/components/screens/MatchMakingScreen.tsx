import * as React from 'react';
import styled from 'styled-components';
import { api, herosCache } from '../../services/api';
import { navigateTo, ROUTE_REPLAY } from '../../services/navigation';
import { player } from '../../services/player';
import { COLOR_P1, COLOR_P2, WHITE } from '../../style';
import { ActionsRow } from '../layout/ActionsRow';
import { Row } from '../layout/Row';
import { BackButton } from '../widgets/BackButton';
import { HeroPicker, HeroPickerListState } from '../widgets/HeroPicker';
import { HeroPickerSeparator } from '../widgets/HeroPickerSeparator';
import { ScreenActionButton } from '../widgets/ScreenActionButton';
import { BaseScreen } from './BaseScreen';


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
    font-family: Lazer85;
    text-transform: lowercase;

    &:${props => props.playerId === 1 ? 'after' : 'before'} {
        content: "▾";
        font-size:40px;
        padding: 0 5px;
        color: ${props => props.playerId === 1 ? COLOR_P1 : COLOR_P2};
    }
`;

interface MatchMakingScreenState {
    heroPicker1: HeroPickerListState;
    heroPicker2: HeroPickerListState;
}

export class MatchMakingScreen extends React.Component<{}, MatchMakingScreenState> {

    /** @override */ public state: MatchMakingScreenState = {
        heroPicker1: HeroPicker.initialListState(),
        heroPicker2: HeroPicker.initialListState(),
    };    

    /** @override */ public componentDidMount() {
        herosCache.invalidate();
    }

    /** @override */ public render() {
        return <BaseScreen title="Select Fighters">
            <Row>
                <PlayerTitle playerId={1}>Player 1</PlayerTitle>
                <PlayerTitle playerId={2}>Player 2</PlayerTitle>
            </Row>
            <Row>
                <Column>
                    <HeroPicker 
                            player={1}
                            list={this.state.heroPicker1}
                            update={(heroPicker1) => this.setState({ heroPicker1 })} />
                </Column>
                <HeroPickerSeparator />
                <Column>
                    <HeroPicker
                            player={2}
                            list={this.state.heroPicker2}
                            update={(heroPicker2) => this.setState({ heroPicker2 })} />
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