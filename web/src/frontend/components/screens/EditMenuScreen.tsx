import * as React from 'react';
import { connect } from 'react-redux';
import { loadCode } from '../../redux/editor/actions';
import { State } from '../../redux/state';
import { navigateTo, ROUTE_EDITOR, ROUTE_IMPORT_HERO } from '../../services/navigation';
import { FatMenu } from '../widgets/FatMenu';
import { FatMenuButton } from '../widgets/FatMenuButton';
import { MainTitle } from '../widgets/MainTitle';
import { FatMenuSpacer } from '../widgets/FatMenuSpacer';

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
            <MainTitle>Create a hero</MainTitle>
            <FatMenu>
                <FatMenuButton href={`#${ROUTE_EDITOR}`} onClick={this.fromScratchHandler}>From scratch</FatMenuButton>
                <FatMenuButton href={`#${ROUTE_IMPORT_HERO}`}>Load existing</FatMenuButton>
                <FatMenuSpacer />
                <FatMenuButton href="#/" smaller={true}>Main menu</FatMenuButton>
            </FatMenu>
        </div>
    }

    private fromScratchHandler = () => {
        this.props.loadCode(DEFAULT_CODE);
    }
});
