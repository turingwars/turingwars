import * as React from 'react';
import { connect } from 'react-redux';

import * as CONSTANTS from '../constants';
import { State } from '../redux/state';
import { api } from '../services/api';
import { player } from '../services/player';
import { MemoryMap } from './MemoryMap';
import { ScoreIndicator } from './ScoreIndicator';
import { PlayerBoard } from './PlayerBoard';

const mapStateToProps = (state: State) => {
    return state;
};

const mapDispatchToProps = {

};

type ReplaySreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const ReplayScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<ReplaySreenProps> {

        public componentDidMount() {
            this.pollServerForGame();
        }

        public componentDidUpdate(oldProps: ReplaySreenProps) {
            if (oldProps.gameResult == null && this.props.gameResult != null) {
                // The game just ended
                this.showEndGameSplash();
            }
        }

        public render() {
            return (
                <div>
                    {/* Header bar */}
                    <h1 id="title1">Turing &nbsp; wars</h1>
                    <div id="backArrow"><a href="/">◄ back</a></div>

                    <div style={{ display: 'flex'}}>
                        {/* Left col */}
                        <PlayerBoard player={ this.props.player1 } playerID={0} hasWon={this.playerHasWon('0')} />

                        {/* Middle col */}
                        <MemoryMap 
                            stateID={this.props.id}
                            memory={this.props.memory}
                            processes={this.props.processes}
                            changedCells={this.props.changedCells}
                            memoryWidth={CONSTANTS.memoryWidth} />

                        {/* Right col */}
                        <PlayerBoard player={ this.props.player2 } playerID={1} hasWon={this.playerHasWon('1')} />
                    </div>

                    {/* FX */}
                    <div id="displayFight" ref="displayFight" className="gold"></div>
                    <div id="displayWinner" ref="displayWinner" className="gold"></div>
                </div>
            );
        }

        private playerHasWon(playerId: string) {
            const gameResult = this.props.gameResult;
            return gameResult && gameResult.type === 'VICTORY' && gameResult.winner === playerId;
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

        private showEndGameSplash() {
            const displayWinnerDiv = this.refs.displayWinner as HTMLElement;
            displayWinnerDiv.innerText = this.getEndGameText();
            displayWinnerDiv.style.display = 'block';
            $(displayWinnerDiv).animate({
                'font-size': CONSTANTS.drawWinnerFinalFontSize},
                CONSTANTS.drawWinnerAnimationLengthInMs);
        }

        private getEndGameText() {
            if (this.props.gameResult.type === 'DRAW') {
                return 'Draw!';
            } else if(this.props.gameResult.winner === '0') {
                return `${this.props.player1.name} wins!`;
            } else {
                return `${this.props.player2.name} wins!`;
            }
        }

        private startReplay() {
            const displayFightDiv = this.refs.displayFight as HTMLElement;
            displayFightDiv.innerText = 'Fight !';
            displayFightDiv.style.fontSize = CONSTANTS.drawFightStartFontSize + 'px';
            displayFightDiv.style.display = '';

            $(displayFightDiv).animate(
                {
                    'font-size': CONSTANTS.drawFightStopFontSize
                },
                CONSTANTS.drawFightDuration,
                () => {
                    displayFightDiv.style.display = 'none';
                    player.start();
                });
        }
    }
);
