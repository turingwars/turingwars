import styled from 'styled-components';
import { COLOR_PRIMARY, CRT_GLITCH_TEXT_LG } from '../../style';

export const FatMenuButton = styled.a<{
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
`;

