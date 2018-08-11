import * as React from 'react';
import { connect } from 'react-redux';

import * as CONSTANTS from '../constants';
import { State, GameResult } from '../redux/state';
import { api } from '../services/api';
import { player } from '../services/player';
import { MemoryMap } from './MemoryMap';
import { PlayerBoard } from './PlayerBoard';
import { SplashMessage } from './SplashMessage';
import { startGame } from '../redux/actions';

const mapStateToProps = (state: State) => {
    return state;
};

const mapDispatchToProps = {
    startGame
};

type ReplaySreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const ReplayScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<ReplaySreenProps> {

        /** @override */ public componentDidMount() {
            this.pollServerForGame().catch((e) => {throw e;});
        }

        /** @override */ public render() {
            return (
                <div style={{position: 'relative'}}>
                    {/* Header bar */}
                    <h1 id="title1">Turing &nbsp; wars</h1>
                    <div id="backArrow"><a href="/">◄ back</a></div>

                    <div style={{ display: 'flex'}}>
                        {/* Left col */}
                        <PlayerBoard player={ this.props.player1 } playerID={0} hasWon={this.playerHasWon('0')} />

                        {/* Middle col */}
                        <MemoryMap
                            memory={this.props.memory}
                            processes={this.props.processes}
                            changedCells={this.props.changedCells}
                            memoryWidth={CONSTANTS.memoryWidth} />

                        {/* Right col */}
                        <PlayerBoard player={ this.props.player2 } playerID={1} hasWon={this.playerHasWon('1')} />
                    </div>

                    {/* FX */}
                    { this.props.gameStarted ? <SplashMessage message="Fight!" oneShot={true}/> : null }
                    { this.props.gameResult != null ? <SplashMessage message={this.getEndGameText(this.props.gameResult)} /> : ''}
                </div>
            );
        }

        private playerHasWon(playerId: string) {
            const gameResult = this.props.gameResult;
            return gameResult != null && gameResult.type === 'VICTORY' && gameResult.winner === playerId;
        }

        private async pollServerForGame() {
            const res = await api.getGame({
                params: {
                    id: this.props.gameId
                }
            });

            if (res.data.isOver) {
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
            setTimeout(() => player.start(), CONSTANTS.drawFightDuration);
        }
    }
);
