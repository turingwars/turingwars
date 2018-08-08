import * as React from 'react';
import * as CONSTANTS from '../constants';

interface IScoreIndicatorProps {
    score: number;
}

export class ScoreIndicator extends React.Component<IScoreIndicatorProps, { pumping: boolean }> {

    state = {
        pumping: false
    };

    private resetTimer: number | null;

    componentWillReceiveProps(prevProps: IScoreIndicatorProps) {
        if (prevProps.score !== this.props.score) {
            this.triggerPumping();
        }
    }

    render() {
        return <div
                className={`playerscore${this.state.pumping ? ' pumping gold' : ''}`} >
            { this.props.score }
        </div>;
    }

    // This function debounces the transition to "pumping" state, such that rapid sequences of mining and not mining don't
    // cause jitter or other artifacts.
    private triggerPumping() {
        this.setState({
            pumping: true
        });
        if (this.resetTimer != null) {
            clearTimeout(this.resetTimer);
        }
        this.resetTimer = setTimeout(() => {
            this.setState({
                pumping: false
            });
            this.resetTimer = null;
        }, 200);
    }
}