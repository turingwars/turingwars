import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../redux/state';
import { MemoryMap } from './MemoryMap';
import { api } from '../services/api';
import { player } from '../services/player';
import * as CONSTANTS from '../constants';
import { ScoreIndicator } from './ScoreIndicator';

const mapStateToProps = (state: State) => {
    return state;
};

const mapDispatchToProps = {
    
};

export const ReplayScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {

        componentDidMount() {
            (this.refs.displayFightDiv as HTMLElement).style.display = "none";
            this.pollServerForGame();
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

        private startReplay() {

            // TODO: display ready

            const displayFightDiv = this.refs.displayFightDiv as HTMLElement;
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

        public render() {
            return (
                <div>
                    {/* Header bar */}
                    <h1 id="title1">Turing &nbsp; wars</h1>
                    <div id="backArrow"><a href="/">◄ back</a></div>

                    {/* Left col */}
                    <div id="player1progressbar" className="playerBoard">
                        <ScoreIndicator score={ this.props.player1.score } />
                        <div className="bubbles"></div>
                    </div>

                    {/* Middle col */}
                    <MemoryMap 
                            stateID={this.props.id}
                            memory={this.props.memory}
                            processes={this.props.processes}
                            changedCells={this.props.changedCells}
                            memoryWidth={CONSTANTS.memoryWidth} />

                    {/* Right col */}
                    <div id="player2progressbar" className="playerBoard">
                        <ScoreIndicator score={ this.props.player2.score } />
                    </div>

                    {/* Bottom bar */}
                    <div id="versus">
                        <div id="player1name" className="playerName">{ this.props.player1.name }</div>
                        <div id="player2name" className="playerName">{ this.props.player2.name }</div>
                        <div className="bubbles"></div>
                    </div>

                    {/* FX */}
                    <div id="displayFight" ref="displayFightDiv" className="gold"></div>
                </div>
            );
        }
    }
);
