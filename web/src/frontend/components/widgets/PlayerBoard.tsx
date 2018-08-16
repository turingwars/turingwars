import * as React from 'react';
import { ScoreIndicator } from './ScoreIndicator';
import { WaterProgressBar } from './WaterProgressBar';
import { PlayerState } from 'frontend/redux/replay/state';
import { SCORE_MAX_VALUE } from 'shared/config';
import { COLOR_P1, COLOR_P2 } from 'frontend/style';
import styled from 'styled-components';

interface IPlayerBoardProps {
    player: PlayerState;
    playerID: number;
    hasWon: boolean;
}

function playerColor(playerId: number) {
    return playerId === 0 ? COLOR_P1 : COLOR_P2;
}

const PlayerBoardContainer = styled.div`
    overflow: hidden;
    width: 100%; /* Lets flexbox decide the actual width to fill the remaining space */
    height: 520px;
    border: 15px solid #222;
    padding: 0px;
    position: relative;
`;
export class PlayerBoard extends React.Component<IPlayerBoardProps> {

    /** @override */ public render() {
        return <PlayerBoardContainer>
            <WaterProgressBar percent= { this.props.player.score / SCORE_MAX_VALUE } color={playerColor(this.props.playerID) } />
            <ScoreIndicator score={ this.props.player.score } hasWon={this.props.hasWon} />
        </PlayerBoardContainer>
    }
}
