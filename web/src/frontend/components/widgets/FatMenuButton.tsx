import * as React from 'react';
import styled from 'styled-components';
import { COLOR_PRIMARY, COLOR_SECONDARY, CRT_GLITCH_LG } from '../../style';

const Link = styled.a`
    color: ${COLOR_PRIMARY};
    text-decoration: none;
    font-size: 40px;
    margin: 50px 0;
    display: block;

    &:hover {
        ${CRT_GLITCH_LG}
    }
`;

const LinkSmaller = Link.extend`
    font-size: 30px;
`;

interface IFatMenuButtonProps {
    href: string;
    smaller?: boolean;
}

export class FatMenuButton extends React.Component<IFatMenuButtonProps> {
    /** @override */ public render() {
        const A = this.getLinkComponent();
        return <li><A href={this.props.href}>{this.props.children}</A></li>;
    }

    private getLinkComponent() {
        return this.props.smaller ? LinkSmaller : Link;
    }
}
