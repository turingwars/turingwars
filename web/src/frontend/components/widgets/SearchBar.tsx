import { Input } from './Input';

export const SearchInput = Input.extend<{color: string}>`
    color: ${(props) => props.color};
    width: 100%;
    border: 3px solid ${(props) => props.color};
    border-bottom: 0;
`