import * as React from 'react';
import { ROUTE_EDITOR, ROUTE_MATCHMAKING, URL_ABOUT } from '../../navigation';
import { FatMenuButton } from '../widgets/FatMenuButton';
import { FatMenu } from '../widgets/FatMenu';
import { MenuSpacer } from '../widgets/MenuSpacer';
import { MainTitle } from '../widgets/MainTitle';

export const HomeScreen = () => <div>
    <MainTitle>Turing Wars</MainTitle>
    <FatMenu>
        <FatMenuButton href={`#${ROUTE_MATCHMAKING}`}>Matchmaking</FatMenuButton>
        <FatMenuButton href={`#${ROUTE_EDITOR}`}>Make a hero</FatMenuButton>
        <MenuSpacer />
        <FatMenuButton href={URL_ABOUT} smaller={true}>About</FatMenuButton>
    </FatMenu>
</div>;
