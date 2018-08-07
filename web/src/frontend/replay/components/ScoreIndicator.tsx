import * as React from 'react';

interface IScoreIndicatorProps {
    score: number;
}

export class ScoreIndicator extends React.Component<IScoreIndicatorProps> {

    render() {
        return <div className="playerscore">{ this.props.score }</div>
    }
}