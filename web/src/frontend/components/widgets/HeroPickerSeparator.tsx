import * as React from 'react';
import styled from 'styled-components';
import { COLOR_PRIMARY_1, CRT_GLITCH_TEXT_LG, WHITE } from '../../style';

export const HeroPickerSeparator = (() => {

    const width = 100;
    const height = 400;

    const separatorHeight = height;
    const separatorWidth = 3;

    const SeparatorBar = styled.div`
        box-shadow: 0px 0px 2px 1px #fff, 0px 0px 4px 5px #f09609, 0px -7px 7px 2px #f09609, 0px 7px 7px 2px #f09609;
        height: ${separatorHeight}px;
        width: 0px;
        background-color: ${WHITE};
        box-shadow: 0px 0px 1px 1px ${WHITE},
                    /* 0px 0px 4px 5px ${COLOR_PRIMARY_1}, */
                    0px -4px 7px 3px ${COLOR_PRIMARY_1},
                    0px 4px 7px 3px ${COLOR_PRIMARY_1};
        transform: translate(${(width - separatorWidth) / 2}px, 0);
    `;

    const SeparatorContainer = styled.div`
        height: ${height}px;
        width: ${width}px;
        position: relative;
        flex-shrink: 0;
    `;

    const VersusText = styled.div`
        position: absolute;
        color: ${WHITE};
        font-size: 47px;

        /* Adjust magic if changing the font or font size so the text is centered */
        top: ${(height - 15) / 2}px;
        left: ${(width - 43) / 2}px;

        ${CRT_GLITCH_TEXT_LG}
    `;

    return () => <SeparatorContainer>
        <SeparatorBar />
        <VersusText>VS</VersusText>
    </SeparatorContainer>;
})();
