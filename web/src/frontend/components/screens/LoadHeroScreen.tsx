import * as React from 'react';
import { connect } from 'react-redux';
import { loadCode } from 'frontend/redux/editor/actions';
import { State } from 'frontend/redux/state';
import { api, herosCache } from 'frontend/services/api';
import { navigateTo, ROUTE_EDITOR } from 'frontend/services/navigation';
import { ActionsRow } from 'frontend/components/layout/ActionsRow';
import { BackButton } from 'frontend/components/widgets/BackButton';
import { HeroPicker } from 'frontend/components/widgets/HeroPicker';
import { ScreenActionButton } from 'frontend/components/widgets/ScreenActionButton';
import { BaseScreen } from './BaseScreen';

const mapStateToProps = (_state: State) => {
    return {
    };
};

const mapDispatchToProps = {
    loadCode
};

type LoadHeroScreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const LoadHeroScreen = connect(mapStateToProps, mapDispatchToProps)(
class extends React.Component<LoadHeroScreenProps> {

    /** @override */ public state = {
        listState: HeroPicker.initialListState()
    };

    /** @override */ public componentDidMount() {
        herosCache.invalidate();
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
