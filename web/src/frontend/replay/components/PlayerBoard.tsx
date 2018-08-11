import * as React from 'react';
import { ScoreIndicator } from './ScoreIndicator';
import * as CONSTANTS from '../constants';
import { WaterProgressBar } from './WaterProgressBar';
import { PlayerState } from '../redux/state';

interface IPlayerBoardProps {
    player: PlayerState;
    playerID: number;
    hasWon: boolean;
}

export class PlayerBoard extends React.Component<IPlayerBoardProps> {

    /** @override */ public render() {
        return (<div className="playerBoardContainer">
            <div style={{position: "relative"}} className="playerBoard">
                <WaterProgressBar percent= { this.props.player.score / CONSTANTS.scoreMaxValue } color={CONSTANTS.playerColor[this.props.playerID] } />
                <ScoreIndicator score={ this.props.player.score } hasWon={this.props.hasWon} />
            </div>
            <div className={`playerName ${this.props.hasWon ? 'gold' : ''}`}>{ this.props.player.name }</div>
        </div>);
    }
}
