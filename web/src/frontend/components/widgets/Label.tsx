import styled, { css } from 'styled-components';

export const Label = styled.div<{
    textAlign?: 'left' | 'center' | 'right'
 }>`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${(props) => props.textAlign ? css`text-align: ${props.textAlign}` : ''}
`;