import * as React from 'react';
import styled from 'styled-components';
import { COLOR_PRIMARY, CRT_GLITCH_TEXT_LG } from '../../style';

const Link = styled.a<{
    smaller?: boolean
}>`
    color: ${COLOR_PRIMARY};
    text-decoration: none;
    font-size: ${props => props.smaller ? '30px' : '40px' };
    margin: 50px 0;
    display: block;

    &:hover, &:focus {
        ${CRT_GLITCH_TEXT_LG}
        outline: none;
    }
`;

type FatMenuButtonProps = {
    href: string;
    smaller?: boolean;
};

export const FatMenuButton = (props: FatMenuButtonProps & { children?: React.Component | string }) => <li>
    <Link smaller={props.smaller} href={props.href}>{props.children}</Link>
</li>;
