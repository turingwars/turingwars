import * as React from 'react';
import { ScoreIndicator } from './ScoreIndicator';
import { WaterProgressBar } from './WaterProgressBar';
import { PlayerState } from '../../redux/state';
import { SCORE_MAX_VALUE } from 'config';
import { COLOR_P1, COLOR_P2 } from '../../style';

interface IPlayerBoardProps {
    player: PlayerState;
    playerID: number;
    hasWon: boolean;
}

function playerColor(playerId: number) {
    return playerId === 0 ? COLOR_P1 : COLOR_P2;
}


export class PlayerBoard extends React.Component<IPlayerBoardProps> {

    /** @override */ public render() {
        return (<div className="playerBoardContainer">
            <div style={{position: "relative"}} className="playerBoard">
                <WaterProgressBar percent= { this.props.player.score / SCORE_MAX_VALUE } color={playerColor(this.props.playerID) } />
                <ScoreIndicator score={ this.props.player.score } hasWon={this.props.hasWon} />
            </div>
        </div>);
    }
}
