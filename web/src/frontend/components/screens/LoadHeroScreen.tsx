import * as React from 'react';
import { connect } from 'react-redux';
import { loadCode } from '../../redux/editor/actions';
import { State } from '../../redux/state';
import { api, herosDataSource } from '../../services/api';
import { navigateTo, ROUTE_EDITOR } from '../../services/navigation';
import { ActionsRow } from '../layout/ActionsRow';
import { BackButton } from '../widgets/BackButton';
import { HeroPickerList } from '../widgets/HeroPickerList';
import { HeroPickerListController } from '../widgets/HeroPickerListController';
import { ScreenActionButton } from '../widgets/ScreenActionButton';
import { BaseScreen } from './BaseScreen';

const mapStateToProps = (_state: State) => {
    return {
    };
};

const mapDispatchToProps = {
    loadCode
};

type LoadHeroSreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const LoadHeroScreen = connect(mapStateToProps, mapDispatchToProps)(
class extends React.Component<LoadHeroSreenProps> {

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
        return <BaseScreen title="Load a hero">
            <HeroPickerList
                    player={1}
                    herosPage={this.state.listController.heros}
                    selectedHeroId={this.state.listController.selected}
                    onSelect={this.listController.selectHandler}
                    onRequestNextPage={this.listController.loadNextPageHandler}
                    onRequestPreviousPage={this.listController.loadPreviousPageHandler} />
            <ActionsRow>
                <BackButton />
                <ScreenActionButton enabled={this.state.listController.selected != null} onClick={this.loadHeroHandler}>Load</ScreenActionButton>
            </ActionsRow>
        </BaseScreen>
    }

    private loadHeroHandler = async () => {
        if (this.state.listController.selected == null) {
            throw new Error('No hero selected');
        }
        const res = await api.getHero({
            params: {
                id: this.state.listController.selected
            }
        });
        this.props.loadCode(res.data.program);
        navigateTo(ROUTE_EDITOR);
    };
});
