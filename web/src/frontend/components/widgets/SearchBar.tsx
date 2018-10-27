import { Input } from './Input';

export const SearchInput = Input.extend<{color: string}>`
    width: 100%;
    border: 3px solid ${(props) => props.color};
    border-bottom: 0;
`