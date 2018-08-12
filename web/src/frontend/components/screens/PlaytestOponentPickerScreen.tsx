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
import { navigateTo, ROUTE_REPLAY, ROUTE_CREATE_HERO } from '../../services/navigation';

const mapStateToProps = (state: State) => {
    return {
        heroCode: state.editor.code
    };
};

const mapDispatchToProps = {
    loadCode
};

type PlaytestOponentPickerScreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

interface PlaytestOponentPickerScreenState {
    chosen: string | undefined;
    heros: Hero[];
}

export const PlaytestOponentPickerScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<PlaytestOponentPickerScreenProps> {

    /** @override */ public state: PlaytestOponentPickerScreenState = {
        chosen: undefined,
        heros: []
    };

    /** @override */ public componentDidMount() {
        this.loadHeros().catch((e) => { throw e });
    }

    /** @override */ public render() {
        return <BaseScreen title="Chose an opponent">
            <HeroPickerList player={2} heros={this.state.heros} selectedHeroId={this.state.chosen} onSelect={this.selectHeroHandler} />
            <ActionsRow>
                <BackButton />
                <ScreenActionButton enabled={this.state.chosen != null} onClick={this.startTestHandler}>Test</ScreenActionButton>
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

    private startTestHandler = async () => {
        if (this.state.chosen === undefined) {
            throw new Error("You must chose an opponent");
        }
        if (this.props.heroCode == null) {
            return navigateTo(ROUTE_CREATE_HERO);
        }
        const res = await api.playTest({
            body: {
                opponent: this.state.chosen,
                hero: {
                    program: this.props.heroCode
                }
            }
        });

        navigateTo(`${ROUTE_REPLAY}/${res.data.gameId}`);
    };
});
