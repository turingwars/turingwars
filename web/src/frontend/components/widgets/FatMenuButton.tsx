import * as React from 'react';
import styled from 'styled-components';
import { COLOR_PRIMARY, CRT_GLITCH_TEXT_LG } from 'frontend/style';
import {Sounds} from '../../sounds'

const FatMenuButtonA = styled.a<{
    smaller?: boolean
}>`
    color: ${COLOR_PRIMARY};
    text-decoration: none;
    font-size: ${props => props.smaller ? '30px' : '40px' };
    display: block;

    &:hover, &:focus {
        ${CRT_GLITCH_TEXT_LG}
        outline: none;
    }

    font-family: Lazer85;
    text-transform: lowercase;
`;

interface IFatMenuButtonProps {
    url: string,
    children: string,
    blank?: boolean,
    smaller?: boolean,
    onClick?: (evt?: React.MouseEvent<HTMLAnchorElement>) => void,
}

export class FatMenuButton extends React.Component <IFatMenuButtonProps>{

    public hover(): void {
        Sounds.playSFX("beep");
    }

    /** @override */ public render() {
        return <FatMenuButtonA
            href={this.props.url}
            target={this.props.blank ? "_blank" : ''}
            smaller={this.props.smaller}
            onMouseEnter={this.hover}
            onClick={this.props.onClick}>
            {this.props.children}
        </FatMenuButtonA>;
    }
}