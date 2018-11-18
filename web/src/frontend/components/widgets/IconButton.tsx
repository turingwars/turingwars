import styled  from 'styled-components';
import * as React from 'react';
import { CRT_GLITCH_TEXT_LG, COLOR_PRIMARY, GRAY_0 } from 'frontend/style';

const LinkWrapper = styled.a`
    padding: 5px 10px;
    border-right: 1px ${GRAY_0} solid;
    color: ${COLOR_PRIMARY};

    &:hover, &:focus {
        cursor: pointer;
        ${CRT_GLITCH_TEXT_LG}
        outline: none;
    }
`;

export interface IconButtonProps {
    href?: string;
    onClick?: () => void;
    type: string;
    title?: string;
}

export const IconButton = (props: IconButtonProps) => <LinkWrapper
        title={props.title}
        href={props.href}
        onClick={props.onClick}>
    <i className={`fa fa-${props.type}`}></i>
</LinkWrapper>;
