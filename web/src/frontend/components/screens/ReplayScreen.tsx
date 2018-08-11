import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { initPlayers, startGame } from '../../redux/actions';
import { GameResult, State } from '../../redux/state';
import { api } from '../../services/api';
import { player } from '../../services/player';
import { GRAY, GRAY_2, COLOR_PRIMARY } from '../../style';
import { BackButton } from '../widgets/BackButton';
import { MemoryMap } from '../widgets/MemoryMap';
import { PlayerBoard } from '../widgets/PlayerBoard';
import { SplashMessage } from '../widgets/SplashMessage';
import { BaseScreen } from './BaseScreen';

const MEMORY_WIDTH = 40;
const START_DELAY_MS = 1000;

const mapStateToProps = (state: State) => {
    return state.replay;
};

const mapDispatchToProps = {
    startGame,
    initPlayers,
};

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const PlayerName = styled.div<{winner: boolean}>`
    text-shadow: 0px 0px 2px ${GRAY};
    text-align: center;
    font-size: 30px;
    margin: 5px 20px;
    margin-top: 0;
    color: ${props => props.winner ? COLOR_PRIMARY : GRAY_2};
`;

const Contents = styled.div`
    margin-top: -40px;
`;

type ReplaySreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{gameId: string}>;

export const ReplayScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<ReplaySreenProps> {

        /** @override */ public componentDidMount() {
            if (!this.props.gameStarted) {
                this.pollServerForGame().catch((e) => {throw e;});
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
                                changedCells={this.props.changedCells}
                                memoryWidth={MEMORY_WIDTH} />

                            {/* Right col */}
                            <PlayerBoard player={ this.props.player2 } playerID={1} hasWon={this.playerHasWon('1')} />
                        </Row>
                    </Contents>
                    <BackButton />

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

        private async pollServerForGame() {
            const res = await api.getGame({
                params: {
                    id: this.props.match.params.gameId
                }
            });

            this.props.initPlayers(res.data.player1Name, res.data.player2Name);

            if (res.data.isOver && res.data.log != null) {
                player.load(res.data.log);
                this.startReplay();
            } else {
                setTimeout(() => this.pollServerForGame(), 1000);
            }
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
