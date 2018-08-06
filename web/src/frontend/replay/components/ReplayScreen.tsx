import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../redux/state';
import { MemoryMap } from './MemoryMap';
import { api } from '../services/api';
import { player } from '../services/player';

const mapStateToProps = (state: State) => {
    return state;
};

const mapDispatchToProps = {
    
};

export const ReplayScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {

        componentDidMount() {
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
                player.start();
            } else {
                setTimeout(() => this.pollServerForGame(), 1000);
            }
        }

        public render() {
            return (
                <div>
                    {/* Header bar */}
                    <h1 id="title1">Turing &nbsp; wars</h1>
                    <div id="backArrow"><a href="/">◄ back</a></div>

                    {/* Left col */}
                    <div id="player1progressbar" className="playerBoard">
                        <div id="player1score" className="playerscore">0</div>
                        <div className="bubbles"></div>
                    </div>

                    {/* Middle col */}
                    <MemoryMap 
                            stateID={this.props.id}
                            memory={this.props.memory}
                            processes={this.props.processes}
                            changedCells={this.props.changedCells}
                            memoryWidth={46} />

                    {/* Right col */}
                    <div id="player2progressbar" className="playerBoard">
                        <div id="player2score" className="playerscore">0</div>
                    </div>

                    {/* Bottom bar */}
                    <div id="versus">
                        <div id="player2name" className="playerName">@(PLAYER_0_NAME)</div>
                        <div id="player1name" className="playerName">@(PLAYER_1_NAME)</div>
                        <div className="bubbles"></div>
                    </div>
                </div>
            );
        }
    }
);
