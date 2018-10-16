import * as React from 'react';
import styled from 'styled-components';
import { State } from '../../redux/state';
import { toggleSound } from 'frontend/redux/actions';
import { connect } from 'react-redux';

const VolumeControlDiv = styled.div`
    text-align: center;
    float: right;
    margin-top: 13px;
    font-size: 30px;
    margin-right: 10px;
    color: #6f6f6f;
`;

const IconWrapper = styled.div`
    display:inline;
    `

const SVGIcon = styled.svg`
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
    `

const VOLUME_ICONS = {
    off: '<use xlink:href="#icon-volume-mute"></use>',
    on: '<use xlink:href="#icon-volume-high"></use>'
}

interface VolumeIconProps {
    icon: keyof typeof VOLUME_ICONS;
}

class VolumeIcon extends React.Component<VolumeIconProps> {
    /** @override */ public render(){
        const html = VOLUME_ICONS[this.props.icon];
        return <IconWrapper><SVGIcon dangerouslySetInnerHTML={{ __html: html}}></SVGIcon></IconWrapper>
    };
}

const mapStateToProps = (_state: State) => {
    return {
        soundEnabled: _state.soundEnabled
    };
};

const mapDispatchToProps = {
    toggleSound
};

type VolumeControlScreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const VolumeControl = connect(mapStateToProps, mapDispatchToProps)(
class VolumeControl extends React.Component<VolumeControlScreenProps> {

    /** @override */ public render() {
        let volumeIcon: keyof typeof VOLUME_ICONS = 'off';
        if(this.props.soundEnabled){
            volumeIcon = 'on'
        }
        return <VolumeControlDiv onClick={() => {this.props.toggleSound()}}><VolumeIcon icon={volumeIcon} /></VolumeControlDiv>;
    }
});
