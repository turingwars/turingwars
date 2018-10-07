import * as React from 'react';
import { connect } from 'react-redux';
import { loadCode } from 'frontend/redux/editor/actions';
import { State } from 'frontend/redux/state';
import { navigateTo, ROUTE_EDITOR, ROUTE_IMPORT_HERO } from 'frontend/services/navigation';
import { FatMenu } from 'frontend/components/widgets/FatMenu';
import { FatMenuButton } from 'frontend/components/widgets/FatMenuButton';
import { MainTitle } from 'frontend/components/widgets/MainTitle';
import { FatMenuSpacer } from 'frontend/components/widgets/FatMenuSpacer';
import { ActionsRow } from '../layout/ActionsRow';
import { BackButton } from '../widgets/BackButton';

const DEFAULT_CODE = `; Type your code here

; This is the smallest possible program, known as the 'imp'.
mov 1 0`;

const mapStateToProps = (state: State) => {
    return {
        hasEditorCode: state.editor.code != null
    };
};

const mapDispatchToProps = {
    loadCode
};

type LoadHeroSreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const EditMenuScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<LoadHeroSreenProps> {

    /** @override */ public componentDidMount() {
        if (this.props.hasEditorCode) {
            navigateTo(ROUTE_EDITOR);
        }
    }

    /** @override */ public render() {
        return <div>
            <MainTitle>New Hero</MainTitle>
            <FatMenu>
                <FatMenuButton href={`#${ROUTE_EDITOR}`} onClick={this.fromScratchHandler}>From scratch</FatMenuButton>
                <FatMenuButton href={`#${ROUTE_IMPORT_HERO}`}>Load existing</FatMenuButton>
                <FatMenuSpacer />
            </FatMenu>
            <ActionsRow>
                <BackButton />
            </ActionsRow>
        </div>
    }

    private fromScratchHandler = () => {
        this.props.loadCode(DEFAULT_CODE);
    }
});
