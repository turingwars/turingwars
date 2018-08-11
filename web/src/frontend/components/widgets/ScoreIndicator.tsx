import * as React from 'react';

interface IScoreIndicatorProps {
    score: number;
    hasWon: boolean;
}

export class ScoreIndicator extends React.Component<IScoreIndicatorProps, { pumping: boolean }> {

    // `isMounted` is already used for some obscure internal react API on which we don't want to rely.
    private mounted: boolean = false;

    /** @override */ public state = {
        pumping: false
    };

    private resetTimer: number | null;

    /** @override */ public componentDidMount = () => {
        this.mounted = true;
    }

    /** @override */ public componentWillUnmount() {
        this.mounted = false;
    }

    /** @override */ public componentWillReceiveProps(prevProps: IScoreIndicatorProps) {
        if (prevProps.score !== this.props.score) {
            this.triggerPumping();
        }
    }

    /** @override */ public render() {
        return <div className={this.generateClassName()}>
            { this.props.score }
        </div>;
    }

    private generateClassName() {
        let className = 'playerscore';

        if (this.state.pumping) {
            className += ' pumping';
        }
        if (this.props.hasWon || this.state.pumping) {
            className += ' gold';
        }
        return className;
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
        this.resetTimer = window.setTimeout(() => {
            if (this.mounted) {
                this.setState({
                    pumping: false
                });
                this.resetTimer = null;
            }
        }, 200);
    }
}