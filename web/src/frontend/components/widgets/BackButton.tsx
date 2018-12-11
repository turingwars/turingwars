import * as React from 'react';
import styled from 'styled-components';
import { WHITE, GRAY_2 } from 'frontend/style';
import { Sounds } from 'frontend/sounds';

const BackArrow = styled.a`
    color: ${GRAY_2};
    font-family: Lazer85;
    text-transform: lowercase;

    &:hover {
        color: ${WHITE};
    }

    &:before {
        content: "◄";
        font-size:30px;
        padding: 0 5px;
        display:inline-block; /* prevents underline */
    }
`;

interface IBackButtonProps {
    onClick?: () => void;
}

// Warning: This is a temporary solution. If the user comes from another website, going back will not bring
// him to the home page!
export class BackButton extends React.Component <IBackButtonProps>{

    public hover(): void {
        Sounds.playSFX("beep");
    }

    /** @override */ public render() {
        return <BackArrow
                onClick={this.props.onClick}
                onMouseEnter={this.hover}
                href="javascript:history.back()">back
        </BackArrow>;
    }
}