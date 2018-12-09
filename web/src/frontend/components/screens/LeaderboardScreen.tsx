import * as React from 'react';
import { connect } from 'react-redux';
import { loadCode } from 'frontend/redux/editor/actions';
import { State } from 'frontend/redux/state';
import { herosCache } from 'frontend/services/api';
import { HeroPicker, PICKER_FONT_SIZE } from 'frontend/components/widgets/HeroPicker';
import { BaseScreen } from './BaseScreen';
import styled from 'styled-components';
import { COLOR_PRIMARY } from 'frontend/style';

const mapStateToProps = (_state: State) => {
    return {
    };
};

const mapDispatchToProps = {
    loadCode
};

const ScreenHeader = styled.div`
    font-size: ${PICKER_FONT_SIZE}px;
    padding: 3px 15px;
    color: ${COLOR_PRIMARY};
`;

type LoadHeroSreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const LeaderboardScreen = connect(mapStateToProps, mapDispatchToProps)(
class extends React.Component<LoadHeroSreenProps> {

    /** @override */ public state = {
        listState: HeroPicker.initialListState()
    };

    /** @override */ public componentDidMount() {
        herosCache.invalidate();
    }

    /** @override */ public render() {
        return <BaseScreen title="Leaderboard">
            <ScreenHeader>
                <span>Rank |</span>
                <span> Score - W/L&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | </span>
                <span> Name </span>
            </ScreenHeader>
            <HeroPicker
                    showRanking={true}
                    player={1}
                    list={this.state.listState}
                    update={(listState) => this.setState({ listState })} />
        </BaseScreen>
    }
});

