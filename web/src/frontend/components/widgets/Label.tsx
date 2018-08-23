import styled, { css } from 'styled-components';
import { COLOR_SECONDARY, COLOR_TEXT, COLOR_ERROR } from '../../style';

type LabelType = 'info' | 'error';

function colorForType(type: LabelType) {
    switch (type) {
        case 'info':
            return COLOR_SECONDARY;
        case 'error':
            return COLOR_ERROR;
        default:
            return COLOR_TEXT;
    }
}

export const Label = styled.div<{
    textAlign?: 'left' | 'center' | 'right',
    type?: LabelType
 }>`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${(props) => props.type && css`color: ${colorForType(props.type)}` }
    ${(props) => props.textAlign && css`text-align: ${props.textAlign}` }
`;