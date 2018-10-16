import styled from "styled-components";
import * as React from 'react';
import { VolumeControl } from '../widgets/VolumeControl';

const InnerBody = styled.div`
    position:relative;
    z-index: 100;
    background-color: black;
    width: 1000px;
    margin:auto;
    padding: 30px;
    padding-bottom: 70px;
    opacity: 1;
    background: #272727;
    box-shadow: 20px 20px 80px #ff00974d,-20px -20px 80px #1ba1e2b3, inset 3px 3px 10px #fff6, inset -3px -3px 10px #00000080, inset -7px -7px 10px black;
    border-radius: 5px;
`;

const CRTScreen = styled.div`
    border-radius: 20px / 500px;
    background-color: black;
    border: 1px solid black;
    overflow:hidden;
    box-shadow: inset 3px 3px 10px #ffffff4d;
    position: relative;
    padding: 0px;
    margin: 0px;

    &::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
        z-index: 2;
        background-size: 100% 2px, 3px 100%;
        pointer-events: none;
        opacity:0.4;
    }
    `;

const CRTInnerScreen = styled.div`
    margin: 0px;
    padding: 0px;
    animation: textShadow 10s infinite;
    padding-top: 50px;
    min-height: 650px;
    background: black;
    background: linear-gradient(to bottom, #0e0e0e66 0%,#14141480 10%,#202020b3 30%,#0b0b0b99 100%);
    `;

const CRTContent = styled.div`
    width: 95%;
    margin: auto;
    `;

export class AppBody extends React.Component {

    /** @override */ public render() {
        return <InnerBody>
            <CRTScreen>
                <CRTInnerScreen>
                    <CRTContent>{this.props.children}</CRTContent>
                </CRTInnerScreen>
            </CRTScreen>
            <VolumeControl />
        </InnerBody>;
    }
};