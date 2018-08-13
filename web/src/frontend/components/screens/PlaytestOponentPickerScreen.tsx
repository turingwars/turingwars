import * as React from 'react';
import { connect } from 'react-redux';
import { loadCode } from '../../redux/editor/actions';
import { State } from '../../redux/state';
import { api, herosDataSource } from '../../services/api';
import { navigateTo, ROUTE_CREATE_HERO, ROUTE_REPLAY } from '../../services/navigation';
import { ActionsRow } from '../layout/ActionsRow';
import { BackButton } from '../widgets/BackButton';
import { HeroPickerList } from '../widgets/HeroPickerList';
import { HeroPickerListController } from '../widgets/HeroPickerListController';
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

    private listController = new HeroPickerListController(
        (listController) => this.setState({ listController }),
        () => this.state.listController
    );

    /** @override */ public state = {
        listController: HeroPickerListController.initialState()
    };

    /** @override */ public componentDidMount() {
        herosDataSource.invalidate();
        this.listController.init().catch((e) => { throw e });
    }

    /** @override */ public render() {
        return <BaseScreen title="Chose an opponent">
            <HeroPickerList
                    player={2}
                    herosPage={this.state.listController.heros}
                    selectedHeroId={this.state.listController.selected}
                    onSelect={this.listController.selectHandler}
                    onRequestPreviousPage={this.listController.loadPreviousPageHandler}
                    onRequestNextPage={this.listController.loadNextPageHandler} />
            <ActionsRow>
                <BackButton />
                <ScreenActionButton enabled={this.state.listController.selected != null} onClick={this.startTestHandler}>Test</ScreenActionButton>
            </ActionsRow>
        </BaseScreen>
    }

    private startTestHandler = async () => {
        if (this.state.listController.selected === undefined) {
            throw new Error("You must chose an opponent");
        }
        if (this.props.heroCode == null) {
            return navigateTo(ROUTE_CREATE_HERO);
        }
        const res = await api.playTest({
            body: {
                opponent: this.state.listController.selected,
                hero: {
                    program: this.props.heroCode
                }
            }
        });

        navigateTo(`${ROUTE_REPLAY}/${res.data.gameId}`);
    };
});
