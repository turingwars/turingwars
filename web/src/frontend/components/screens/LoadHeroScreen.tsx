import * as React from 'react';
import { connect } from 'react-redux';
import { loadCode } from '../../redux/editor/actions';
import { State } from '../../redux/state';
import { api, herosDataSource } from '../../services/api';
import { navigateTo, ROUTE_EDITOR } from '../../services/navigation';
import { ActionsRow } from '../layout/ActionsRow';
import { BackButton } from '../widgets/BackButton';
import { HeroPicker } from '../widgets/HeroPicker';
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

    /** @override */ public state = {
        listState: HeroPicker.initialListState()
    };

    /** @override */ public componentDidMount() {
        herosDataSource.invalidate();
    }

    /** @override */ public render() {
        return <BaseScreen title="Load a hero">
            <HeroPicker
                    player={1}
                    list={this.state.listState}
                    update={(listState) => this.setState({ listState })} />
            <ActionsRow>
                <BackButton />
                <ScreenActionButton enabled={this.state.listState.selected != null} onClick={this.loadHeroHandler}>Load</ScreenActionButton>
            </ActionsRow>
        </BaseScreen>
    }

    private loadHeroHandler = async () => {
        if (this.state.listState.selected == null) {
            throw new Error('No hero selected');
        }
        const res = await api.getHero({
            params: {
                id: this.state.listState.selected
            }
        });
        this.props.loadCode(res.data.program);
        navigateTo(ROUTE_EDITOR);
    };
});
