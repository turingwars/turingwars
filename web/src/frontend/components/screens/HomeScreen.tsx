import * as React from 'react';
import { ROUTE_CREATE_HERO, ROUTE_MATCHMAKING, URL_ABOUT } from 'frontend/services/navigation';
import { FatMenuButton } from 'frontend/components/widgets/FatMenuButton';
import { FatMenu } from 'frontend/components/widgets/FatMenu';
import { FatMenuSpacer } from 'frontend/components/widgets/FatMenuSpacer';
import { MainTitle } from 'frontend/components/widgets/MainTitle';

export const HomeScreen = () => <div>
    <MainTitle>Turing Wars</MainTitle>
    <FatMenu>
        <FatMenuButton url={`#${ROUTE_MATCHMAKING}`}>Matchmaking</FatMenuButton>
        <FatMenuButton url={`#${ROUTE_CREATE_HERO}`}>Create a hero</FatMenuButton>
        <FatMenuSpacer />
        <FatMenuButton blank url={URL_ABOUT} smaller={true}>About</FatMenuButton>
    </FatMenu>
</div>;