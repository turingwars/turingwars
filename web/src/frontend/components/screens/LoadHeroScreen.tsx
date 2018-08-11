import * as React from 'react';
import { api } from '../../services/api';
import { ActionsRow } from '../layout/ActionsRow';
import { BackButton } from '../widgets/BackButton';
import { HeroPickerList } from '../widgets/HeroPickerList';
import { ScreenActionButton } from '../widgets/ScreenActionButton';
import { BaseScreen } from './BaseScreen';
import { State } from '../../redux/state';
import { loadCode } from '../../redux/editor/actions';
import { connect } from 'react-redux';
import { Hero } from 'api';
import { navigateTo, ROUTE_EDITOR } from '../../services/navigation';

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
        chosen: undefined,
        heros: [] as Hero[]
    };

    /** @override */ public componentDidMount() {
        this.loadHeros().catch((e) => { throw e });
    }

    /** @override */ public render() {
        return <BaseScreen title="Load a hero">
            TODO
            <HeroPickerList player={1} heros={this.state.heros} selectedHeroId={this.state.chosen} onSelect={this.selectHeroHandler} />
            <ActionsRow>
                <BackButton />
                <ScreenActionButton enabled={this.state.chosen != null} onClick={this.loadHeroHandler}>Load</ScreenActionButton>
            </ActionsRow>
        </BaseScreen>
    }

    private async loadHeros() {
        const response = await api.getAllHeros({
            query: {
                page: '0'
            }
        });
        this.setState({
            heros: response.data.data
        });
    }

    private selectHeroHandler = (heroId: string) => {
        this.setState({
            chosen: heroId
        });
    }

    private loadHeroHandler = () => {
        const hero = this.state.heros.find((h) => h.id === this.state.chosen);
        if (hero === undefined) {
            throw new Error('Hero not found!');
        }
        this.props.loadCode(hero.program);

        navigateTo(ROUTE_EDITOR);
    };
});
