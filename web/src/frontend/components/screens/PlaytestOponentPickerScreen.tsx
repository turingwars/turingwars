import * as React from 'react';
import { connect } from 'react-redux';
import { loadCode } from '../../redux/editor/actions';
import { State } from '../../redux/state';
import { api, herosDataSource } from '../../services/api';
import { navigateTo, ROUTE_CREATE_HERO, ROUTE_REPLAY } from '../../services/navigation';
import { ActionsRow } from '../layout/ActionsRow';
import { BackButton } from '../widgets/BackButton';
import { HeroPicker } from '../widgets/HeroPicker';
import { ScreenActionButton } from '../widgets/ScreenActionButton';
import { BaseScreen } from './BaseScreen';

const mapStateToProps = (state: State) => {
    return {
        heroCode: state.editor.code
    };
};

const mapDispatchToProps = {
    loadCode
};

type PlaytestOponentPickerScreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;


export const PlaytestOponentPickerScreen = connect(mapStateToProps, mapDispatchToProps)(
class extends React.Component<PlaytestOponentPickerScreenProps> {

    /** @override */ public state = {
        listState: HeroPicker.initialListState()
    };

    /** @override */ public componentDidMount() {
        herosDataSource.invalidate();
    }

    /** @override */ public render() {
        return <BaseScreen title="Chose an opponent">
            <HeroPicker
                    player={2}
                    list={this.state.listState}
                    update={(listState) => this.setState({ listState })} />
            <ActionsRow>
                <BackButton />
                <ScreenActionButton enabled={this.state.listState.selected != null} onClick={this.startTestHandler}>Test</ScreenActionButton>
            </ActionsRow>
        </BaseScreen>
    }

    private startTestHandler = async () => {
        if (this.state.listState.selected === undefined) {
            throw new Error("You must chose an opponent");
        }
        if (this.props.heroCode == null) {
            return navigateTo(ROUTE_CREATE_HERO);
        }
        const res = await api.playTest({
            body: {
                opponent: this.state.listState.selected,
                hero: {
                    program: this.props.heroCode
                }
            }
        });

        navigateTo(`${ROUTE_REPLAY}/${res.data.gameId}`);
    };
});
