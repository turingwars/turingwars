import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import styled, { css } from 'styled-components';
import { State } from 'frontend/redux/state';
import { api } from 'frontend/services/api';
import { player } from 'frontend/services/player';
import { GRAY_2, COLOR_PRIMARY } from 'frontend/style';
import { BackButton } from 'frontend/components/widgets/BackButton';
import { MemoryMap } from 'frontend/components/widgets/MemoryMap';
import { PlayerBoard } from 'frontend/components/widgets/PlayerBoard';
import { SplashMessage } from 'frontend/components/widgets/SplashMessage';
import { BaseScreen } from './BaseScreen';
import { Row } from 'frontend/components/layout/Row';
import { startGame, initPlayers } from 'frontend/redux/replay/actions';
import { GameResult, LoadedGame } from 'frontend/redux/replay/state';
import { ActionsRow } from 'frontend/components/layout/ActionsRow';
import { navigateTo, ROUTE_HOME } from 'frontend/services/navigation';

const MEMORY_WIDTH = 40;
const START_DELAY_MS = 1000;

const mapStateToProps = (state: State) => {
    return state.replay;
};

const mapDispatchToProps = {
    startGame,
    initPlayers,
};

const PlayerName = styled.div<{winner: boolean}>`
    text-align: center;
    font-size: 30px;
    margin: 5px 20px;
    margin-top: 0;
    color: ${GRAY_2};
    ${props => props.winner && css`
        text-shadow: 0px 0px 2px ${GRAY_2};
        color: ${COLOR_PRIMARY};
    `}
`;

const Contents = styled.div`
    margin-top: -40px;
`;

type ReplaySreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{gameId?: string}>;

export const ReplayScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<ReplaySreenProps> {

        /** @override */ public componentDidMount() {
            if (!this.props.gameStarted) {
                if (this.props.match.params.gameId != null) {
                    this.pollServerForGame(this.props.match.params.gameId).catch((e) => { throw e; });
                } else if (this.props.loadedGame != null) {
                    this.startLoadedGame(this.props.loadedGame);
                } else {
                    console.error("Impossible to load this game");
                    navigateTo(ROUTE_HOME);
                }
            }
        }

        /** @override */ public componentWillUnmount() {
            player.reset();
        }

        /** @override */ public render() {
            return (
                <BaseScreen title="Arena">
                    <Contents>
                        <Row>
                            <PlayerName winner={this.playerHasWon('0')}>{ this.props.player1.name }</PlayerName>
                            <PlayerName winner={this.playerHasWon('1')}>{ this.props.player2.name }</PlayerName>
                        </Row>
                        <Row>
                            {/* Left col */}
                            <PlayerBoard player={ this.props.player1 } playerID={0} hasWon={this.playerHasWon('0')} />

                            {/* Middle col */}
                            <MemoryMap
                                memory={this.props.memory}
                                processes={this.props.processes}
                                memoryWidth={MEMORY_WIDTH} />

                            {/* Right col */}
                            <PlayerBoard player={ this.props.player2 } playerID={1} hasWon={this.playerHasWon('1')} />
                        </Row>
                    </Contents>
                    <ActionsRow>
                        <BackButton />
                    </ActionsRow>

                    {/* FX */}
                    { this.props.gameStarted ? <SplashMessage message="Fight!" oneShot={true}/> : null }
                    { this.props.gameResult != null ? <SplashMessage message={this.getEndGameText(this.props.gameResult)} /> : ''}
                </BaseScreen>
            );
        }

        private playerHasWon(playerId: string) {
            const gameResult = this.props.gameResult;
            return gameResult != null && gameResult.type === 'VICTORY' && gameResult.winner === playerId;
        }

        private async pollServerForGame(gameId: string) {
            const res = await api.getGame({
                params: {
                    id: gameId
                }
            });

            this.props.initPlayers(res.data.player1Name, res.data.player2Name);

            if (res.data.isOver && res.data.log != null) {
                player.load(res.data.log);
                this.startReplay();
            } else {
                setTimeout(() => this.pollServerForGame(gameId), 1000);
            }
        }

        /**
         * This is used to replay a game that was preloaded by another component. For instance during playtests.
         */
        private startLoadedGame(loadedGame: LoadedGame) {
            this.props.initPlayers(loadedGame.player1Name, loadedGame.player2Name);
            player.load(loadedGame.log);
            this.startReplay();
        }

        private getEndGameText(gameResult: GameResult) {
            if (gameResult.type === 'DRAW') {
                return 'Draw!';
            } else if(gameResult.winner === '0') {
                return `${this.props.player1.name} wins!`;
            } else {
                return `${this.props.player2.name} wins!`;
            }
        }

        private startReplay() {
            this.props.startGame();
            // Delay the start of the game by one second so we can appreciate the magnificent wordart
            // in the middle of the screen.
            setTimeout(() => player.start(), START_DELAY_MS);
        }
    }
);
