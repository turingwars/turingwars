import * as React from 'react';
import { ROUTE_CREATE_HERO, ROUTE_MATCHMAKING, URL_ABOUT } from '../../services/navigation';
import { FatMenuButton } from '../widgets/FatMenuButton';
import { FatMenu } from '../widgets/FatMenu';
import { FatMenuSpacer } from '../widgets/FatMenuSpacer';
import { MainTitle } from '../widgets/MainTitle';

export const HomeScreen = () => <div>
    <MainTitle>Turing Wars</MainTitle>
    <FatMenu>
        <FatMenuButton href={`#${ROUTE_MATCHMAKING}`}>Matchmaking</FatMenuButton>
        <FatMenuButton href={`#${ROUTE_CREATE_HERO}`}>Create a hero</FatMenuButton>
        <FatMenuSpacer />
        <FatMenuButton href={URL_ABOUT} smaller={true}>About</FatMenuButton>
    </FatMenu>
</div>;
