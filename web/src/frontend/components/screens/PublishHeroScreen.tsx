import * as React from 'react';
import { connect } from 'react-redux';
import { unloadCode } from '../../redux/editor/actions';
import { State } from '../../redux/state';
import { navigateTo, ROUTE_EDITOR, ROUTE_HOME } from '../../services/navigation';
import { FatMenu } from '../widgets/FatMenu';
import { FatMenuButton } from '../widgets/FatMenuButton';
import { MainTitle } from '../widgets/MainTitle';
import { FatMenuSpacer } from '../widgets/FatMenuSpacer';
import { Label } from '../widgets/Label';
import { Input } from '../widgets/Input';
import { Button } from '../widgets/Button';
import { api } from '../../services/api';

const mapStateToProps = (state: State) => {
    return {
        code: state.editor.code
    };
};

const mapDispatchToProps = {
    unloadCode
};

type PublishHeroScreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const PublishHeroScreen = connect(mapStateToProps, mapDispatchToProps)(
class extends React.Component<PublishHeroScreenProps> {

    /** @override */ public state = {
        heroName: ''
    };

    /** @override */ public componentDidMount() {
        if (this.props.code == null) {
            navigateTo(ROUTE_HOME);
        }
    }

    /** @override */ public render() {
        return <div>
            <MainTitle>Publish your hero</MainTitle>
            <FatMenu>
                <Label>Publish your hero to make it visible to other players.<br />You won't be able to modify it after that.</Label>
                <Input placeholder="Name your hero..." value={this.state.heroName} onChange={this.handleHeroNameChange} />
                <FatMenuSpacer />
                <Button href="#" onClick={this.publishHandler} enabled={this.state.heroName != ''} >Publish</Button>
                <FatMenuSpacer />
                <FatMenuButton href={`#${ROUTE_EDITOR}`} smaller={true}>Back to editor</FatMenuButton>
            </FatMenu>
        </div>
    }

    private handleHeroNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            heroName: evt.currentTarget.value
        });
    }

    private publishHandler = async (evt: React.MouseEvent<HTMLAnchorElement>) => {
        evt.preventDefault();
        if (this.state.heroName == '') {
            throw new Error('Name is empty!');
        }
        if (this.props.code == null) {
            throw new Error('Code is empty!');
        }
        await api.commitHero({
            body: {
                name: this.state.heroName,
                program: this.props.code
            }
        });
        this.props.unloadCode();
        navigateTo(ROUTE_HOME);
    }
});
