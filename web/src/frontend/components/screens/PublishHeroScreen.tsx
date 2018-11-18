import * as React from 'react';
import { connect } from 'react-redux';
import { unloadCode } from 'frontend/redux/editor/actions';
import { State } from 'frontend/redux/state';
import { navigateTo, ROUTE_EDITOR, ROUTE_HOME } from 'frontend/services/navigation';
import { FatMenu } from 'frontend/components/widgets/FatMenu';
import { FatMenuButton } from 'frontend/components/widgets/FatMenuButton';
import { MainTitle } from 'frontend/components/widgets/MainTitle';
import { FatMenuSpacer } from 'frontend/components/widgets/FatMenuSpacer';
import { Label } from 'frontend/components/widgets/Label';
import { Input } from 'frontend/components/widgets/Input';
import { Button } from 'frontend/components/widgets/Button';
import { api } from 'frontend/services/api';

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
        heroName: '',
        error: undefined as undefined | string
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
                <Input placeholder="Name your hero" value={this.state.heroName} onChange={this.handleHeroNameChange} />
                { this.state.error && <Label type="error">{ this.state.error }</Label> }
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
        this.clearError();
        if (this.state.heroName == '') {
            throw new Error('Name is empty!');
        }
        if (this.props.code == null) {
            throw new Error('Code is empty!');
        }
        try {
            await api.commitHero({
                body: {
                    name: this.state.heroName,
                    program: this.props.code
                }
            });
        } catch (error) {
            if (error.response) {
                this.showError(error.response.data.message);
            } else {
                this.showError(error.toString());
            }
            throw error;
        }
        this.props.unloadCode();
        navigateTo(ROUTE_HOME);
    }

    private clearError() {
        this.setState({
            error: undefined
        });
    }

    private showError(e: string) {
        this.setState({
            error: e
        });
    }
});
