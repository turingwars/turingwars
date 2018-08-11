import { Hero } from 'api';
import * as color from 'color';
import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { COLOR_P1, COLOR_P2, WHITE } from '../../style';
import { Label } from './Label';

const ENTRIES_PER_PAGE = 15;
const PICKER_HEIGHT = 500;

const HorizontalPixelGridBackground = styled.div<{baseColor: string}>`
    background: repeating-linear-gradient(
        ${props => color(props.baseColor).fade(1).string()} 0px,
        ${props => color(props.baseColor).fade(0.8).string()} 3px,
        ${props => color(props.baseColor).fade(1).string()} 4px);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 100;
`;

const Glow = styled.div<{baseColor: string}>`
    box-shadow: inset 0 0 100px 3px ${props => color(props.baseColor).fade(0.5).string()};
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 105;
`;

const RGBPixelGridBackground = styled.div`
    background: repeating-linear-gradient(90deg,
        #aaa 0,
        #f00 1px,
        #0f0 3px,
        #00f 4px,
        #aaa 6px);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 101;
    mix-blend-mode: multiply;
`;

const largeScanFrames = keyframes`
    from {
        transform: translate(0px, 0%);
    }
    to {
        transform: translate(0px, 50%);
    }
`;


// Create two scan patterns so they don't awkwardly run synchronously
const makeListBackgroundScan = () => styled.div`
        background: repeating-linear-gradient(
            #535 0%,
            #dfd ${10 + Math.random() * 10}%,
            #dcf 23%,
            #888 25%,
            #aff 30%,
            #845 ${36 + Math.random() * 4}%,
            #fff 48%,
            #535 50%);
        position: absolute;
        height: 200%;
        width: 100%;
        top: -100%;
        z-index: 102;
        animation: ${largeScanFrames} ${5 + Math.random() }s linear infinite;
        mix-blend-mode: multiply;
    `;
const ListBackgroundScan1 = makeListBackgroundScan();
const ListBackgroundScan2 = makeListBackgroundScan();

const ListContainer = styled.div<{baseColor: string}>`
    border: ${props => props.baseColor} 3px solid;
    padding: 0;
    margin: 0;
    height: ${PICKER_HEIGHT}px;
    overflow: hidden;
    
    position: relative;
`;

const StyledElement = styled.div<{
        baseColor: string;
        selected: boolean;
    }>`
    font-size: ${PICKER_HEIGHT / ENTRIES_PER_PAGE - 6}px; /* The magic offset depends on the font used */
    color: #eee;
    width: 100%;
    height: ${PICKER_HEIGHT / ENTRIES_PER_PAGE}px;
    padding: 3px 12px;
    cursor: pointer;
    position: relative;
    z-index: 110;
    mix-blend-mode: color-dodge;

    ${props => props.selected ?
        css`
            color: ${WHITE};
            background: linear-gradient(90deg,
                    ${props => props.baseColor} 0%,
                    ${props => color(props.baseColor).fade(0.4).string()} 20%,
                    ${props => color(props.baseColor).fade(0.4).string()} 80%,
                    ${props => props.baseColor} 100%);
            mix-blend-mode: screen;
        ` :
        css`
            &:hover {
                color: ${WHITE};
                background-color: ${props => color(props.baseColor).fade(0.7).string()};
            }
        `
    }
`;

class ListElement extends React.PureComponent<{
        hero: Hero;
        onClick: (heroId: string) => void;
        selected: boolean;
        baseColor: string;
    }> {
    /** @override */ public render() {
        return <StyledElement 
                baseColor={this.props.baseColor}
                selected={this.props.selected}
                onClick={this.clickHandler}>
            <Label>{ this.props.hero.name }</Label>
        </StyledElement>
    }

    private clickHandler = () => {
        this.props.onClick(this.props.hero.id);
    }
};

type HeroPickerListProps = {
    player: 1 | 2;
    heros: Hero[];
    selectedHeroId?: string;
    onSelect: (heroId: string) => void;
};

export const HeroPickerList = (props: HeroPickerListProps) => {
    const baseColor = props.player === 1 ? COLOR_P1 : COLOR_P2;
    return <ListContainer baseColor={baseColor}>
            { props.heros.map((hero) => <ListElement
                    key={hero.id}
                    baseColor={baseColor}
                    hero={hero} selected={hero.id === props.selectedHeroId}
                    onClick={props.onSelect} />
                )}
            <HorizontalPixelGridBackground baseColor={baseColor}/>
            <RGBPixelGridBackground />
            {props.player === 1 ? <ListBackgroundScan1 /> :  <ListBackgroundScan2 />}
            <Glow baseColor={baseColor} />
    </ListContainer>
};
