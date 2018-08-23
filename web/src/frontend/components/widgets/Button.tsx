import styled, { css, keyframes } from 'styled-components';
import { COLOR_PRIMARY, CRT_GLITCH_TEXT_LG, GRAY } from '../../style';

export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
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

const isEnabled = (props: ButtonProps) => props.enabled === undefined || props.enabled;

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

export const Button = styled.a<ButtonProps>`
    color: ${props => isEnabled(props) ? COLOR_PRIMARY : GRAY};
    text-decoration: none;
    font-size: ${props => `${getFontSize(props.size)}px`};
    display: block;
    cursor: default;
    
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
