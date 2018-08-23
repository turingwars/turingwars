import * as React from 'react';
import { Button } from "./Button";
import styled from 'styled-components';


const Container = styled.div`
    margin-top: 20px;
`;

type ScreenActionButtonProps = {
    enabled?: boolean;
    onClick?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
} & { children: React.Component | string };

export const ScreenActionButton = (props: ScreenActionButtonProps) => <Container>
    <Button size="lg" animate={true} enabled={props.enabled} onClick={props.onClick}>{ props.children }</Button>
</Container>;
