import * as React from 'react';
import { Instruction, nop, OpCode } from '../../../model/Instruction';
import * as CONSTANTS from '../constants';
import { Process } from '../../../model/GameUpdate';
import { IPrintableMemoryCell } from '../redux/state';

interface IMemoryMapProps {
    memory: IPrintableMemoryCell[];
    memoryWidth: number;
    processes: Process[];
    changedCells: number[][];
    stateID: number;
}

export class MemoryMap extends React.Component<IMemoryMapProps> {

    private ctx: CanvasRenderingContext2D;

    componentDidMount() {
        const canvas = this.refs.thecanvas as HTMLCanvasElement;
        this.ctx = canvas.getContext('2d');
        this.ctx.lineWidth = CONSTANTS.lineWidth;
        this.drawAll();
    }

    componentDidUpdate(oldProps: IMemoryMapProps, newProps: IMemoryMapProps) {
        for (let line = 0; line < this.props.memoryWidth; line++) {
            for (let col = 0; col < this.props.memoryWidth; col++) {
                const address = line * this.props.memoryWidth + col;
                if (this.hasDifferenceAtAddress(oldProps, address)) {
                    this.drawCellDiff(col, line);
                }
            }
        }

        for (const i in oldProps.processes) {
            this.eraseIP(oldProps.processes[i]);
        }
        for (const i in this.props.processes) {
            this.drawIP(this.props.processes[i]);
        }
    }

    render() {
        return <canvas id="memoryMapCanvas" ref="thecanvas" width={CONSTANTS.canvasSize} height={CONSTANTS.canvasSize}></canvas>
    }

    private drawAll() {
        for (let line = 0; line < this.props.memoryWidth; line++) {
            for (let col = 0; col < this.props.memoryWidth; col++) {
                this.eraseAtPosition(line, col);
                this.drawOneMemoryRegion(line, col, false, this.getCaseColor(col, line));
            }
        }
    }

    private hasDifferenceAtAddress(oldProps: IMemoryMapProps, address: number) {
        return oldProps.memory[address] !== this.props.memory[address]; 
    }

    private drawCellDiff(col: number, line: number) {
        const address = line * this.props.memoryWidth + col;

        // draw new changes
        this.eraseAtPosition(col, line);
        if (this.props.memory[address].changed > 0) {
            this.drawOneMemoryRegion(col, line, true, CONSTANTS.lightGray);
            this.drawOneMemoryRegion(col, line, false, this.getCaseColor(col, line));
        } else {
            this.drawOneMemoryRegion(col, line, false, this.getCaseColor(col, line));
        }
    }

    private eraseIP(proc: Process) {
        const col = proc.instructionPointer % this.props.memoryWidth;
        const line = (proc.instructionPointer - col) / this.props.memoryWidth;
        this.drawCellDiff(col, line);
    }

    private drawIP(proc: Process) {
        const col = proc.instructionPointer % this.props.memoryWidth;
        const line = (proc.instructionPointer - col) / this.props.memoryWidth;
        this.drawOneMemoryRegion(col, line, true, CONSTANTS.ipColor[proc.processId]);
    }

    private eraseAtPosition(col: number, line: number) {
        const eraseColor = 'black';
        const x = 1 + col * CONSTANTS.outerBoxSize;
        const y = 1 + line * CONSTANTS.outerBoxSize;
        const width = CONSTANTS.boxSize + 2;

        this.ctx.beginPath();
        this.ctx.strokeStyle = eraseColor;
        this.ctx.fillStyle = eraseColor;
        this.ctx.rect(x, y, width, width);
        this.ctx.stroke();
        this.ctx.fill();
    }

    private getCaseColor(col: number, row: number) {
        const index = row * this.props.memoryWidth + col;
        const { instr, owner } = this.props.memory[index];

        if (instr.op === OpCode.MINE) {
            return instr.a.value === 0 ? CONSTANTS.blueGold : CONSTANTS.purpleGold;
        }
        if (owner === 0) {
            return CONSTANTS.blue;
        }
        if (owner === 1) {
            return CONSTANTS.purple;
        }

        return CONSTANTS.gray;
    }

    private drawOneMemoryRegion(col: number, line: number, isFull: boolean, color: string) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;

        const x = 2 + col * CONSTANTS.outerBoxSize;
        const y = 2 + line * CONSTANTS.outerBoxSize;
        const width = CONSTANTS.boxSize;

        
        if (isFull) {
            this.ctx.rect(x + 1, y + 1, width - 2, width - 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.rect(x, y, width, width);
            this.ctx.stroke();
        }
    }
}