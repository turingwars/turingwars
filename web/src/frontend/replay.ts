import * as d3 from 'd3';
import * as _ from 'underscore';

import { GetGameResponse } from '../dto/GetGameResponse';
import { GameConfig } from '../model/GameConfig';
import { GameUpdate, MemoryUpdate, Process, Score } from '../model/GameUpdate';
import { Instruction, nop, OpCode } from '../model/Instruction';

export class Replay {

    public static CONSTANTS = {
        boxSize : 10,
        outerBoxSize : 13,
        canvasSize : 600,
        lineWidth : 1,

        drawFightStartFontSize : 40,
        drawFightStopFontSize : 50,
        drawFightDuration : 1000,

        drawWinnerFinalFontSize : 100,
        drawWinnerAnimationLengthInMs : 1000,
        drawWinnerBeforeTimeOut: 2000,

        scoreUpdateStartFontSize : '50px',
        scoreUpdateStopFontSize : '30px',
        scoreUpdateWinFontSize : '40px',
        scoreUpdateDuration : 100,

        scoreMinValue : 0,
        scoreMaxValue : 1000,

        gold: '#f09609',
        purple: '#ff0097',
        blue: '#1ba1e2',
        gray: '#333',
    };

    /**
     * The stuff below is bound to some ID in the DOM.
     */

    public static MEMORY_MAP_CANVAS_ID = 'memoryMapCanvas';

    public static PLAYER1_NAME_DIV_ID = 'player1name';
    public static PLAYER2_NAME_DIV_ID = 'player2name';

    public static PLAYER1_SCORE_DIV_ID = 'player1score';
    public static PLAYER2_SCORE_DIV_ID = 'player2score';

    public static DISPLAY_WINNER_DIV_ID = 'displayWinner';
    public static DISPLAY_FIGHT_DIV_ID = 'displayFight';

    public static PLAYER1_PROGRESS_DIV_ID = 'player1progressbar';
    public static PLAYER2_PROGRESS_DIV_ID = 'player2progressbar';

    private memoryCanvas: HTMLCanvasElement;

    private drawingContext: CanvasRenderingContext2D;

    private player1Name: HTMLDivElement;
    private player2Name: HTMLDivElement;

    private player1Score: HTMLDivElement;
    private player2Score: HTMLDivElement;

    private displayWinnerDiv: HTMLDivElement;
    private displayFightDiv: HTMLDivElement;

    private player1ProgressBar: HTMLDivElement;
    private player2ProgressBar: HTMLDivElement;

    private player1ProgressBarUpdate: (x: number) => void;
    private player2ProgressBarUpdate: (x: number) => void;

    /**
     * The stuff below are classical members.
     */
    private stopWavesAnimation: boolean;

    private gameFinished: boolean;

    private nPlayers: number;

    private memorySize: number;

    // memoryWidth^2 = memorySize
    private memoryWidth: number;

    private bufferedGameUpdates: GameUpdate[] = [];

    private currentProcesses: { [key: string]: Process } = {};

    private currentScores: { [key: string]: number } = {};

    private currentMemory: { [key: number]: Instruction };

    private currentOwners: { [key: number]: number };

    private lastGameUpdate: GameUpdate | null = null;

    public getMemoryWidth(): number {
        return this.memoryWidth;
    }

    public init(config: GameConfig, update: GameUpdate): void {

        if (update.score.length > 0) {
            update.score[0].playerId = '' + update.score[0].playerId;
        }
        if (update.score.length > 1) {
            update.score[1].playerId = '' + update.score[1].playerId;
        }

        // sanity check for hackaton
        if (config.nPlayers !== 2) {
            throw new Error('Only strictly two players supported by this GUI');
        }
        if (config.memorySize !== 2116) {
            throw new Error('Only memorySize==2116 accepted');
        }

        if (Math.sqrt(config.memorySize) !== Math.floor(Math.sqrt(config.memorySize))) {
            throw new Error('Memory size is not square, cannot represent');
        }

        this.nPlayers = config.nPlayers;
        this.memorySize = config.memorySize;
        this.memoryWidth = Math.sqrt(this.memorySize);

        // sanity check, this would not be treated here
        if (update.memory !== undefined) {
            throw new Error('Please do not give any memory updates in the init() function');
        }

        // locally copy the processes
        for (const proc of update.processes) {
            this.currentProcesses[proc.processId] = proc;
        }

        // sanity check : we need two processes, with id 0 and 1
        if (this.currentProcesses[0] === undefined) {
            throw new Error('Please specify a process with ID 0');
        }
        if (this.currentProcesses[1] === undefined) {
            throw new Error('Please specify a process with ID 1');
        }

        // locally copy the scores
        for (const score of update.score) {
            this.currentScores[score.playerId] = score.score;
        }

        // sanity check : we need two players, with id 0 and 1
        if (config.playerNames[0] === undefined) {
            throw new Error('Please specify a player name with ID 0');
        }
        if (config.playerNames[1] === undefined) {
            throw new Error('Please specify a player name with ID 1');
        }

        // sanity check : we need two players, with id 0 and 1
        if (this.currentScores[0] === undefined) {
            throw new Error('Please specify a player/score with ID 0');
        }
        if (this.currentScores[1] === undefined) {
            throw new Error('Please specify a player/score with ID 1');
        }

        // initialize the memory with NOP's
        const NOP = nop();

        this.currentMemory = {};
        this.currentOwners = {};
        for (let i = 0; i < this.memorySize; i++) {
            this.currentMemory[i] = NOP;
            this.currentOwners[i] = -1;
        }

        // inits the graphic tools
        this.initGraphics();

        this.displayFightDiv.style.display = 'block';
        this.displayFightDiv.innerText = 'Loading...';

        // draw the map. Now it's all NOPs
        this.drawAll();

        // set the names and scores
        this.player1Name.innerHTML = config.playerNames['0'];
        this.player2Name.innerHTML = config.playerNames['1'];
        this.player1Score.innerHTML = '' + Replay.CONSTANTS.scoreMinValue;
        this.player2Score.innerHTML = '' + Replay.CONSTANTS.scoreMinValue;
    }

    public initGraphics() {

        // binds canvas
        const memoryCanvas = document.getElementById(Replay.MEMORY_MAP_CANVAS_ID);
        if (memoryCanvas == null) {
            throw new Error('Could not find canvas with ID ' + Replay.MEMORY_MAP_CANVAS_ID);
        }

        this.memoryCanvas = memoryCanvas as HTMLCanvasElement;
        const drawingContext = this.memoryCanvas.getContext('2d');

        if (drawingContext == null) {
            throw new Error('Could not get Drawing Context');
        }

        this.drawingContext = drawingContext;
        this.drawingContext.lineWidth = Replay.CONSTANTS.lineWidth;

        // binds divs
        this.player1Name = this.getDivFromDomOrDie(Replay.PLAYER1_NAME_DIV_ID);
        this.player2Name = this.getDivFromDomOrDie(Replay.PLAYER2_NAME_DIV_ID);
        this.player1Score = this.getDivFromDomOrDie(Replay.PLAYER1_SCORE_DIV_ID);
        this.player2Score = this.getDivFromDomOrDie(Replay.PLAYER2_SCORE_DIV_ID);
        this.displayWinnerDiv = this.getDivFromDomOrDie(Replay.DISPLAY_WINNER_DIV_ID);
        this.displayFightDiv = this.getDivFromDomOrDie(Replay.DISPLAY_FIGHT_DIV_ID);
        this.player1ProgressBar = this.getDivFromDomOrDie(Replay.PLAYER1_PROGRESS_DIV_ID);
        this.player2ProgressBar = this.getDivFromDomOrDie(Replay.PLAYER2_PROGRESS_DIV_ID);

        // binds progressbars
        this.player1ProgressBarUpdate = this.enableProgressBarOnDiv(Replay.PLAYER1_PROGRESS_DIV_ID,
            Replay.CONSTANTS.blue);
        this.player2ProgressBarUpdate = this.enableProgressBarOnDiv(Replay.PLAYER2_PROGRESS_DIV_ID,
            Replay.CONSTANTS.purple);
    }

    public gameUpdated(update: GameUpdate) {

        if (this.gameFinished) {
            return;
        }

        if (update.score.length > 0) {
            update.score[0].playerId = '' + update.score[0].playerId;
        }
        if (update.score.length > 1) {
            update.score[1].playerId = '' + update.score[1].playerId;
        }

        this.bufferedGameUpdates.push(update);
        console.log('Received update', this.bufferedGameUpdates.length, 'in buffer');
    }

    public ready(cb: () => void) {

        this.displayFightDiv.innerText = '';

        this.player1ProgressBarUpdate(0);
        this.player2ProgressBarUpdate(0);

        window.setTimeout(() => {
            this.displayFight(cb);
        }, 1000);
    }

    public playNext(): boolean {

        const update = this.bufferedGameUpdates.shift();

        if (update === undefined) {
            console.log('Nothing to process !');
            return true;
        }

        this.processUpdate(update);
        return false;
    }

    private displayFight(cb: () => void) {

        this.displayFightDiv.innerText = 'Fight !';
        this.displayFightDiv.style.fontSize = Replay.CONSTANTS.drawFightStartFontSize + 'px';

        $(this.displayFightDiv).animate(
            {
                'font-size': Replay.CONSTANTS.drawFightStopFontSize
            },
            Replay.CONSTANTS.drawFightDuration,
            () => {
                this.displayFightDiv.style.display = 'none';
                cb();
            });
    }

    private processUpdate(update: GameUpdate) {

        for (const m of update.memory) {

            console.log(m);

            this.currentMemory[m.address] = m.value;
            this.currentOwners[m.address] = m.cause;
        }

        this.drawOnlyDiff(update.memory);

        for (const i in update.processes) {
            this.drawIP(update.processes[i], this.lastGameUpdate ? this.lastGameUpdate.processes[i] : undefined);
        }

        for (const s of update.score) {
            this.currentScores[s.playerId] = s.score;
            this.changeScoreText(s.playerId, s.score);
        }

        this.lastGameUpdate = update;
    }

    private enableProgressBarOnDiv(divID: string, color: string) {

        // Constants below
        const width = 199;
        const height = 500;
        const fillPercent = 10;
        const waterHeight = Math.ceil(fillPercent * height / 100);
        const waveHeight = 3;
        const waveAnimatationTime = 4000 + 5000 * Math.random();
        const waveStartOffset = -100;
        const waveCount = 2; // number of full waves
        const waveMaskLength = 100;

        // Body of the method
        const element = $('#' + divID);
        const randId = _.uniqueId('liquid_');

        const chart = d3.select(element[0])
                        .append('svg')
                        .attr('class', 'waterProgressBar')
                        .attr('width', width)
                        .attr('height', height);

        const gauge = chart.append('g')
                            .attr('transform', 'translate(0,0)')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('width', width)
                            .attr('height', height);

        const waveLength = waveMaskLength * 2 / waveCount;
        const waveClipCount = 1 + waveCount;
        const waveClipWidth = waveLength * waveClipCount;

        // Data for building the clip wave area.
        const data = [];
        for (let i = 0; i <= 40 * waveClipCount; i++) {
            data.push({
                x: i / (40 * waveClipCount),
                y: (i / (40))
            });
        }

        // Scales for controlling the size of the clipping path.
        const waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
        const waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

        // Scales for controlling the position of the clipping path.

        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.

        const waveAnimateScale = d3.scaleLinear()
            .range([0, waveClipWidth - waveMaskLength * 2]) // Push the clip area one full wave then snap back.
            .domain([0, 1]);

        // The clipping wave area.
        const clipArea = d3.area()
            .x((d) => {
                return waveScaleX((d as any).x);
            })
            .y0((d) => {
                return waveScaleY(Math.sin(Math.PI * 2 * (1 - waveCount) + (d as any).y * 2 * Math.PI));
            });

        clipArea.y1(() => {
                return height;
            });

        const waveGroup = gauge.append('defs')
            .append('clipPath')
            .attr('id', 'clipWave' + randId);

        const wave = waveGroup.append('path')
            .datum(data)
            .attr('d', clipArea as any)
            .attr('T', 0);

        // The inner circle with the clipping wave attached.
        const fillGroup = gauge.append('g').attr('clip-path', 'url(#clipWave' + randId + ')');

        fillGroup.append('image')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 200)
            .attr('height', 531)
            .style('opacity', 0.1)
            .attr('href', '/images/water_texture.gif');

        // Draw the wave shape
        fillGroup.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .style('fill', color)
            .style('opacity', 0.5);

        waveGroup.attr('transform', 'translate(' + waveStartOffset + ',' + (height - waterHeight) + ')');

        const animateWave = () => {
            if (this.stopWavesAnimation) {
                return;
            }

            wave.attr('transform', 'translate(' + waveAnimateScale((wave.attr('T') as any)) + ',0)');
            wave.transition()
                .duration(waveAnimatationTime * (1 - (wave.attr('T') as any)))
                .ease(d3.easeLinear)
                .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                .attr('T', 1)
                .on('end', () => {
                    wave.attr('T', 0);
                    animateWave();
                });
        };

        animateWave();

        function changeHeightFn(newPercentage: number) {
            const newWaterHeight = Math.ceil(newPercentage * height / 100);
            waveGroup.transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .attr('transform', 'translate(' + waveStartOffset + ',' + (height - newWaterHeight) + ')');
        }

        return changeHeightFn;
    }

    private changeScoreText(playerID: string, value: number) {

        // find which DOM element we need to update
        let divToChange: HTMLDivElement;
        let functionToUpdateProgressBar: (n: number) => void;
        if (playerID === '0') {
            divToChange = this.player1Score;
            functionToUpdateProgressBar = this.player1ProgressBarUpdate;
        } else if (playerID === '1') {
            divToChange = this.player2Score;
            functionToUpdateProgressBar = this.player2ProgressBarUpdate;
        } else {
            throw new Error('Cannot change player\'s score, only player 0 or 1 supported.');
        }

        // check if we are actually changing the value
        if (divToChange.innerHTML === '' + value) {
            return;
        }

        // clip by max value
        if (value >= Replay.CONSTANTS.scoreMaxValue) {
            value = Replay.CONSTANTS.scoreMaxValue;
        }

        divToChange.innerHTML = '' + value;
        functionToUpdateProgressBar(Math.ceil(100 * value / Replay.CONSTANTS.scoreMaxValue));
        divToChange.style.fontSize = Replay.CONSTANTS.scoreUpdateStartFontSize;
        divToChange.style.color = Replay.CONSTANTS.gold;
        const jQueryDiv = $(divToChange);

        if (value !== Replay.CONSTANTS.scoreMaxValue) {
            jQueryDiv.stop().animate({
                'font-size': Replay.CONSTANTS.scoreUpdateStopFontSize,
                'color': Replay.CONSTANTS.gray,
            }, Replay.CONSTANTS.scoreUpdateDuration);
        } else {
            this.gameFinished = true;

            // freeze
            jQueryDiv.stop().animate({
                'font-size': Replay.CONSTANTS.scoreUpdateWinFontSize,
            }, Replay.CONSTANTS.scoreUpdateDuration);

            // display winner
            this.displayWinnerAfter(Replay.CONSTANTS.drawWinnerBeforeTimeOut);
        }

        this.stopWavesAnimation = true;
    }

    private getDivFromDomOrDie(id: string): HTMLDivElement {
        const div = document.getElementById(id);
        if (div === null) {
            throw new Error('Could not get div ' + id);
        }
        return div as HTMLDivElement;
    }

    private drawOneMemoryRegion(col: number, line: number, isFull: boolean, color: string|undefined) {

        if (color === undefined) {
            color = this.getCaseColor(col, line);
        }

        this.drawingContext.beginPath();
        this.drawingContext.strokeStyle = color;

        const x = 2 + col * Replay.CONSTANTS.outerBoxSize;
        const y = 2 + line * Replay.CONSTANTS.outerBoxSize;
        const width = Replay.CONSTANTS.boxSize;

        this.drawingContext.rect(x, y, width, width);
        this.drawingContext.stroke();

        if (isFull) {
            this.drawingContext.fillStyle = color;
            this.drawingContext.fill();
        }
    }

    private getCaseColor(col: number, row: number) {

        const index = row * this.memoryWidth + col;
        const memOp = this.currentMemory[index];
        const owner = this.currentOwners[index];

        console.log(memOp.op);

        if (memOp.op === OpCode.MINE) {
            return Replay.CONSTANTS.gold;
        }

        if (owner === 0) {
            return Replay.CONSTANTS.blue;
        }

        if (owner === 1) {
            return Replay.CONSTANTS.purple;
        }

        return Replay.CONSTANTS.gray;
    }

    private drawAll() {

        const drawFullBoxes = false;

        for (let line = 0; line < this.memoryWidth; line++) {
            for (let col = 0; col < this.memoryWidth; col++) {

                this.eraseAtPosition(line, col);
                this.drawOneMemoryRegion(line, col, drawFullBoxes, Replay.CONSTANTS.gray);
            }
        }
    }

    private eraseAtPosition(col: number, line: number) {

        const eraseColor = 'rgba(0,0,0,1)';
        const x = 1 + col * Replay.CONSTANTS.outerBoxSize;
        const y = 1 + line * Replay.CONSTANTS.outerBoxSize;
        const width = Replay.CONSTANTS.boxSize + 2;

        this.drawingContext.beginPath();
        this.drawingContext.strokeStyle = eraseColor;
        this.drawingContext.fillStyle = eraseColor;
        this.drawingContext.rect(x, y, width, width);
        this.drawingContext.stroke();
        this.drawingContext.fill();
    }

    private drawIP(proc: Process, prevProc?: Process) {
        let col: number;
        let line: number;

        if (prevProc) {
            col = prevProc.instructionPointer % this.memoryWidth;
            line = (prevProc.instructionPointer - col) / this.memoryWidth;

            this.eraseAtPosition(col, line);
            this.drawOneMemoryRegion(col, line, false, undefined);
        }

        col = proc.instructionPointer % this.memoryWidth;
        line = (proc.instructionPointer - col) / this.memoryWidth;
        this.drawOneMemoryRegion(col, line, false, '#fff');
    }

    private drawOnlyDiff(memUpdates: MemoryUpdate[]) {

        let drawFullBoxes = false;

        if (this.lastGameUpdate) {
            // remove old memory zones still showed as 'diff' (fullsquare)
            for (const memUpdate of this.lastGameUpdate.memory) {

                const col = memUpdate.address % this.memoryWidth;
                const line = (memUpdate.address - col) / this.memoryWidth;

                this.eraseAtPosition(col, line);
                this.drawOneMemoryRegion(col, line, drawFullBoxes, undefined);
            }
        }

        drawFullBoxes = true;

        // draw new changes
        for (const memUpdate of memUpdates) {

            const col = memUpdate.address % this.memoryWidth;
            const line = (memUpdate.address - col) / this.memoryWidth;

            this.eraseAtPosition(col, line);
            this.drawOneMemoryRegion(col, line, drawFullBoxes, undefined);
        }
    }

    private displayWinnerAfter(duration: number) {

        // updates now the texts
        if (this.currentScores['0'] === this.currentScores['1']) {
            this.displayWinnerDiv.innerHTML = 'DRAW';
        } else if (this.currentScores['0'] < this.currentScores['1']) {
            this.displayWinnerDiv.innerHTML = this.player1Name.innerText + ' WINS';
            $(this.player1Name).addClass('gold');
        } else if (this.currentScores['0'] > this.currentScores['1']) {
            this.displayWinnerDiv.innerHTML = this.player2Name.innerText + ' WINS';
            $(this.player2Name).addClass('gold');
        } else {
            throw new Error('displayWinnerAfter only handles two players');
        }

        // splash after timer
        window.setTimeout(() => {
        this.displayWinnerDiv.style.display = 'block';
        $(this.displayWinnerDiv).animate({
            'font-size': Replay.CONSTANTS.drawWinnerFinalFontSize},
            Replay.CONSTANTS.drawWinnerAnimationLengthInMs);
        }, duration);
    }
}

const mockConfig = new GameConfig();
mockConfig.nPlayers = 2;
mockConfig.memorySize = 2116;

let p1Name = (window as any).PLAYER_0_NAME;
let p2Name = (window as any).PLAYER_1_NAME;

if (p1Name === p2Name) {
    p1Name += ' 1';
    p2Name += ' 2';
}

// tslint:disable-next-line:object-literal-key-quotes
mockConfig.playerNames = { '0': p1Name, '1': p2Name };

const mockUpdate = new GameUpdate();
mockUpdate.processes = [];
mockUpdate.processes[0] = new Process();
mockUpdate.processes[0].processId = '0';
mockUpdate.processes[0].instructionPointer = 0;
mockUpdate.processes[0].isAlive = true;
mockUpdate.processes[1] = new Process();
mockUpdate.processes[1].processId = '1';
mockUpdate.processes[1].instructionPointer = 100;
mockUpdate.processes[1].isAlive = false;
mockUpdate.score = [];
mockUpdate.score[0] = new Score();
mockUpdate.score[0].playerId = '0';
mockUpdate.score[0].score = 0;
mockUpdate.score[1] = new Score();
mockUpdate.score[1].playerId = '1';
mockUpdate.score[1].score = 0;

const replay = new Replay();
replay.init(mockConfig, mockUpdate);

// function mockGenDiff(col: number, line: number, score: number) {

//     const memoryWidth = replay.getMemoryWidth();
//     const output: MemoryUpdate[] = [];
//     const maxNDiffsPerCall = 5;
//     const nDiffPlayer1 = Math.ceil(maxNDiffsPerCall * Math.random());

//     for (let i = 0; i < nDiffPlayer1; i++) {
//         if (col >= memoryWidth) {
//             col = 0;
//             line++;
//         }
//         if (line >= memoryWidth) {
//             line = 0;
//         }

//         const op = Instruction.NOP();
//         op.op = OpCode.MINE;

//         const update = new MemoryUpdate();
//         update.address = line * memoryWidth + col;
//         update.value = op;

//         output.push(update);

//         col++;
//     }

//     const gameUpdate = new GameUpdate();
//     gameUpdate.memory = output;

//     gameUpdate.score = [];
//     gameUpdate.score[0] = new Score();
//     gameUpdate.score[0].playerId = '0';
//     gameUpdate.score[0].score = score;
//     gameUpdate.score[1] = new Score();
//     gameUpdate.score[1].playerId = '1';
//     gameUpdate.score[1].score = 10 + score;

//     replay.gameUpdated(gameUpdate);

//     if (score > 100) {
//         return;
//     }

//     mockGenDiff(col, line, score + 5);

// }
function autoPlay() {
    const done = replay.playNext();
    if (!done) {
        window.setTimeout(autoPlay, 100);
    }
}

function serverReady(update: GetGameResponse) {

    update.log.forEach((u) => replay.gameUpdated(u));
    replay.ready(autoPlay);
}

function waitForServer(gameID: string) {
    console.log('Polling game ' + gameID);
    $.get('/api/game/' + gameID).done((res) => {
        console.log('Done', res);

        const casted = res as GetGameResponse;
        if (casted.isOver) {
            serverReady(casted);
        } else {
            setTimeout(() => waitForServer(gameID), 1000);
        }
    });
}

waitForServer((window as any).GAME_ID);
