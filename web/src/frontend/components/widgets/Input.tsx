
import styled from 'styled-components';

export const Input = styled.input`
    background-color: #000;
    border: none;
    font-size: 20px;
    color: white;
    font-family: 'VT323', monospace;
    padding: 3px 5px;
    /* caret-color: transparent; */
    display: block;

    &:focus {
        outline: none;
    }
`;