import * as React from 'react';
import styled from 'styled-components';
import { GRAY, LIGHTGRAY } from '../../style';

const BackArrow = styled.a`
    color: ${GRAY};

    &:hover {
        color: ${LIGHTGRAY};
    }
`;

// Warning: This is a temporary solution. If the user comes from another website, going back will not bring
// him to the home page!
export const BackButton = () => <BackArrow href="javascript:history.back()">◄ back</BackArrow>