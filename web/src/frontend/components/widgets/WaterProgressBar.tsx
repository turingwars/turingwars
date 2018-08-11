import * as React from 'react';

interface IWaterProgressBar {
    percent: number;
    color: string;
}

const N_WAVES = 2;

// Relative to the viewbox units
const WAVE_SPEED = 0.3;
const WAVE_HEIGHT = 0.01;

export class WaterProgressBar extends React.Component<IWaterProgressBar> {

    /** @override */ public state = {
        waveOffset: 0
    };

    // Used to generate a new unique id for each instance
    private static uniqueIncrement = 0;

    private isLive = false;

    private uid = WaterProgressBar.uniqueIncrement++;

    private _clipPathId: string | null;

    /** @override */ public componentDidMount() {
        this.isLive = true;
        this.animate();
    }

    /** @override */ public componentWillUnmount() {
        this.isLive = false;
    }

    /** @override */ public render() {
        return (
            <svg    className="waterProgressBar"
                    viewBox={`0 0 500 1000`}
                    preserveAspectRatio="xMinYMin slice"
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%"
                    }}>
                <clipPath id={this.clipPathId()} clipPathUnits="objectBoundingBox">
                    <path d={this.clipPathData()} />
                </clipPath>
                <g clipPath={`url(#${this.clipPathId()})`} width="100%" height="100%">
                    <image  x="0"
                            width="100%"
                            y="0"
                            height="100%"
                            preserveAspectRatio="none"
                            href="/images/water_texture.gif"
                            style={{opacity: 0.1}} />
                    <rect   
                            x="0"
                            width="100%"
                            y="0"
                            height="100%"
                            fill={this.props.color}
                            style={{ opacity: 0.5 }}/>
                </g>
            </svg>
        );
    }

    private animate = () => {
        if (!this.isLive) {
            return;
        }
        const seconds = Date.now() / 1000;
        this.setState({
            waveOffset: (WAVE_SPEED * seconds) % (1 / N_WAVES)
        });
        requestAnimationFrame(this.animate);
    }

    /**
     * Cross-references within the svg use ids. We need to make sure the id is unique across the whole page.
     */
    private clipPathId() {
        if (this._clipPathId != null) {
            return this._clipPathId;
        }
        return this._clipPathId = `clipPathPlayer${this.uid}`;
    }

    /**
     * This function draws the geometry that masks the progress bar. The interior of the surface is what's visible.
     */
    private clipPathData() {
        const progress = this.props.percent;
        const step = 0.5 / N_WAVES;
        const halfStep = step / 2;

        let ret = `M ${this.state.waveOffset - 2 * step} ${1 - progress}`; // Go to origin

        // Draw wavy top
        ret += ` Q ${this.state.waveOffset - 2 * step + halfStep} ${1 - progress - WAVE_HEIGHT}, ${this.state.waveOffset - step} ${1 - progress}`;
        ret += ` T ${this.state.waveOffset} ${1 - progress}`;
        for (let i = 1 ; i < N_WAVES + 1; i++) {
            ret += ` T ${this.state.waveOffset + (2 * i - 1) * step} ${1 - progress}`;
            ret += ` T ${this.state.waveOffset + (2 * i) * step} ${1 - progress}`;
        }

        // Go around the rest of the surface
        ret += ' L 1 1 L 0 1 Z';

        return ret;
    }
}
