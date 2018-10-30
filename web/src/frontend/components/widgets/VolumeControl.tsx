import * as React from 'react';
import styled from 'styled-components';
import { State } from '../../redux/state';
import { toggleMusic, toggleSFX } from 'frontend/redux/sounds/actions';
import { connect } from 'react-redux';

const VolumeControlDiv = styled.div`
    text-align: center;
    float: right;
    margin-top: 10px;
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

const Text = styled.div`   
    font-size: 14px;
    margin-top: -10px;
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
        musicEnabled: _state.sound.musicEnabled,
        audioSFXEnabled: _state.sound.audioSFXEnabled
    };
};

const mapDispatchToProps = {
    toggleMusic,
    toggleSFX
};

type VolumeControlScreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const VolumeControl = connect(mapStateToProps, mapDispatchToProps)(
    class VolumeControl extends React.Component<VolumeControlScreenProps> {
    
        /** @override */ public render() {
            let musicIcon: keyof typeof VOLUME_ICONS = 'off';
            let audioSFXIcon: keyof typeof VOLUME_ICONS = 'off';
            if(this.props.musicEnabled){
                musicIcon = 'on'
            }
            if(this.props.audioSFXEnabled){
                audioSFXIcon = 'on'
            }
            return [<VolumeControlDiv onClick={() => {this.props.toggleMusic()}}>
                        <VolumeIcon icon={musicIcon} /><Text>music</Text>
                    </VolumeControlDiv>,
                    <VolumeControlDiv onClick={() => {this.props.toggleSFX()}}>
                        <VolumeIcon icon={audioSFXIcon} /><Text>sfx&nbsp;</Text>
                    </VolumeControlDiv>];
        }
    });    