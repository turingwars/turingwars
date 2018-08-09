import * as React from 'react';
import { ScreenTitle } from '../widgets/ScreenTitle';
import { BackButton } from '../widgets/BackButton';

interface IBaseScreenProps {
    title: string;
}

export class BaseScreen extends React.Component<IBaseScreenProps> {

    /** @override */ public render() {
        return <div>
            <ScreenTitle>{ this.props.title }</ScreenTitle>
            <BackButton />
            { this.props.children }
        </div>
    }
}