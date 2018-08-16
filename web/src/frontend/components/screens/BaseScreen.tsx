import * as React from 'react';
import { ScreenTitle } from 'frontend/components/widgets/ScreenTitle';

interface IBaseScreenProps {
    title: string;
}

export class BaseScreen extends React.Component<IBaseScreenProps> {

    /** @override */ public render() {
        return <div>
            <ScreenTitle>{ this.props.title }</ScreenTitle>
            { this.props.children }
        </div>
    }
}