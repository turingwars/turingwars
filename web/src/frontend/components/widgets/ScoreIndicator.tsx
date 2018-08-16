import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { COLOR_PRIMARY, GRAY_2 } from 'frontend/style';

interface IScoreIndicatorProps {
    score: number;
    hasWon: boolean;
}

const TEXT_SIZE_PX = 50;

const pumpingAnimation = keyframes`
    from {
        font-size: ${TEXT_SIZE_PX}px;
    }
    /* The randomized pattern makes the animation look more organic than a simple one-hit loop */
    5% { font-size: ${TEXT_SIZE_PX * 1.2}px; }
    20% { font-size: ${TEXT_SIZE_PX}px; }
    25% { font-size: ${TEXT_SIZE_PX * 1.25}px; }
    39% { font-size: ${TEXT_SIZE_PX * 0.95}px; }
    45% { font-size: ${TEXT_SIZE_PX * 1.15}px; }
    60% { font-size: ${TEXT_SIZE_PX}px; }
    64% { font-size: ${TEXT_SIZE_PX * 1.3}px; }
    80% { font-size: ${TEXT_SIZE_PX}px; }
    85% { font-size: ${TEXT_SIZE_PX * 1.25}px; }
    to {
        font-size: ${TEXT_SIZE_PX}px;
    }
`;

const ScoreText = styled.div<{
    pumping: boolean;
    golden: boolean;
}>`
    text-shadow: 0px 0px 1px #ccc;
    width: 100%;
    text-align: center;
    font-size: ${TEXT_SIZE_PX}px;
    position: absolute;
    transition-property: color, font-size;
    transition-duration: 300ms;
    line-height: ${TEXT_SIZE_PX * 1.1}px; /* Leaves enough room for the pumping animation to fill */

    ${(props) => props.pumping && css`
        animation-duration: 1000ms;
        animation-name: ${pumpingAnimation};
        animation-iteration-count: infinite;
    `}

    ${(props) => props.golden && css`
        color: ${COLOR_PRIMARY};
        text-shadow: 0px 0px 2px ${GRAY_2};
    `}
`;

export class ScoreIndicator extends React.Component<IScoreIndicatorProps, { pumping: boolean }> {

    /** @override */ public state = {
        pumping: false
    };

    private resetTimer: number | null;

    /** @override */ public componentWillUnmount() {
        if (this.resetTimer != null) {
            window.clearTimeout(this.resetTimer);
            this.resetTimer = null;
        }
    }

    /** @override */ public componentWillReceiveProps(prevProps: IScoreIndicatorProps) {
        if (prevProps.score !== this.props.score) {
            this.triggerPumping();
        }
    }

    /** @override */ public render() {
        return <ScoreText pumping={this.state.pumping} golden={this.props.hasWon || this.state.pumping}>
            { this.props.score }
        </ScoreText>;
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
            this.setState({
                pumping: false
            });
            this.resetTimer = null;
        }, 200);
    }
}