import * as React from 'react';
import styled from 'styled-components';
import { GRAY, GRAY_2 } from 'frontend/style';

const BackArrow = styled.a`
    color: ${GRAY};
    font-family: Lazer85;
    text-transform: lowercase;

    &:hover {
        color: ${GRAY_2};
    }
`;

interface IBackButtonProps {
    onClick?: () => void;
}

// Warning: This is a temporary solution. If the user comes from another website, going back will not bring
// him to the home page!
export const BackButton = (props: IBackButtonProps) => (
    <BackArrow
            onClick={props.onClick}
            href="javascript:history.back()">
        ◄ back
    </BackArrow>
);
