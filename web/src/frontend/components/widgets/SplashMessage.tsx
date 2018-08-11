import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { COLOR_PRIMARY, CRT_GLITCH_TEXT_LG } from '../../style';

interface ISplashMessageProps {
    message: string;
    oneShot?: boolean;
}

export const SPLASH_ONE_SHOT_DURATION_MS = 1000;

const splashing = keyframes`
    from { font-size: 1px; }
    to { font-size: 100px; }
`;

export const SplashMessageText = styled.div`

    ${CRT_GLITCH_TEXT_LG}

    z-index: 1000;
    font-size: 100px;
    position:absolute;
    top: 300px;
    text-align:center;
    width:100%;
    animation-duration: 1000ms;
    animation-name: ${splashing};
    color: ${COLOR_PRIMARY};
`;

export class SplashMessage extends React.Component<ISplashMessageProps> {

    /** @override */ public state = {
        visible: true
    };

    /** @override */ public componentDidMount() {
        if (this.props.oneShot) {
            setTimeout(() => this.setState({
                visible: false
            }), SPLASH_ONE_SHOT_DURATION_MS);
        }
    }

    /** @override */ public render() {
        return (this.state.visible) ?
                this.renderActualElement() :
                <div />; // Return a dummy because react still expects you to return something
    }

    private renderActualElement() {
        return <SplashMessageText>
            { this.props.message }
        </SplashMessageText>;
    }
}