import * as React from 'react'
import styled, { css, keyframes } from 'styled-components';
import { COLOR_PRIMARY, CRT_GLITCH_TEXT_LG, GRAY } from 'frontend/style';
import { Sounds } from 'frontend/sounds';

export type ButtonSize = 'sm' | 'md' | 'lg';

type StyledButtonProps = {
    size?: ButtonSize;
    enabled?: boolean;
    animate?: boolean;
}

function getFontSize(buttonSize?: ButtonSize) {
    switch(buttonSize) {
        case 'sm':
            return 20;
        case 'lg':
            return 40;
        case 'md':
        default:
            return 30;
    }
}

const isEnabled = (props: StyledButtonProps) => props.enabled === undefined || props.enabled;

function makeHitFrames(size: ButtonSize) {
    const fontSize = getFontSize(size);
    return keyframes`
        from { font-size: ${fontSize}px;}
        25% { font-size: ${1.1 * fontSize}px; }
        to { font-size: ${fontSize}px; }
    `;
}

const hitFrames = {
    'lg': makeHitFrames('lg'),
    'md': makeHitFrames('md'),
    'sm': makeHitFrames('sm'),
};

export const StyledButton = styled.a<StyledButtonProps>`
    color: ${props => isEnabled(props) ? COLOR_PRIMARY : GRAY};
    text-decoration: none;
    font-size: ${props => `${getFontSize(props.size)}px`};
    display: block;
    cursor: default;
    font-family: Lazer85;
    text-transform: lowercase;
    
    ${props => isEnabled(props) ? css`
        &:hover, &:focus {
            cursor: pointer;
            ${CRT_GLITCH_TEXT_LG}
            outline: none;
        }` :
        ''}
    ${props => isEnabled(props) && props.animate ? css`
        animation: ${hitFrames[props.size || 'md']} 200ms;` :
        ''}
`;

interface IButtonProps {
    size?: ButtonSize;
    url?: string,
    enabled?: boolean,
    animate?: boolean;
    onClick?: (evt: React.MouseEvent<HTMLAnchorElement>) => void,
}

export class Button extends React.Component <IButtonProps>{

    public hover(): void {
        Sounds.play("beep");
    }

    /** @override */ public render() {
        return <StyledButton 
            href={(this.props.url === undefined) ? this.props.url : '#'}
            onMouseEnter={this.hover}
            onClick={this.props.onClick}
            size={this.props.size}
            animate={this.props.animate}>
            {this.props.children}
        </StyledButton>;
    }
}