import * as React from 'react';
import * as CONSTANTS from '../constants';

interface ISplashMessageProps {
    message: string;
    oneShot?: boolean;
}

export class SplashMessage extends React.Component<ISplashMessageProps> {

    /** @override */ public state = {
        visible: true
    };

    /** @override */ public componentDidMount() {
        if (this.props.oneShot) {
            setTimeout(() => this.setState({
                visible: false
            }), CONSTANTS.drawFightDuration);
        }
    }

    /** @override */ public render() {
        return (this.state.visible) ?
                this.renderActualElement() :
                <div />; // Return a dummy because react still expects you to return something
    }

    private renderActualElement() {
        return <div className={`gold splash-message ${this.props.oneShot ? 'one-shot' : ''}`}>
            { this.props.message }
        </div>;
    }
}