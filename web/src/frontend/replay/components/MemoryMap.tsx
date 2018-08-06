import * as React from 'react';
import { Instruction, nop, OpCode } from '../../../model/Instruction';
import { CONSTANTS } from '../constants';
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
        this.drawAll();
    }

    componentDidUpdate(oldProps: IMemoryMapProps, newProps: IMemoryMapProps) {
        this.drawChanged(oldProps);

        for (const i in this.props.processes) {
            this.drawIP(this.props.processes[i], oldProps.processes[i]);
        }
    }

    render() {
        return <canvas id="memoryMapCanvas" ref="thecanvas" width="600" height="600"></canvas>
    }

    private drawAll() {
        const drawFullBoxes = false;
        for (let line = 0; line < this.props.memoryWidth; line++) {
            for (let col = 0; col < this.props.memoryWidth; col++) {
                this.eraseAtPosition(line, col);
                this.drawOneMemoryRegion(line, col, drawFullBoxes);
            }
        }
    }

    private drawChanged(oldProps: IMemoryMapProps) {

        let drawFullBoxes = false;
        for (let line = 0; line < this.props.memoryWidth; line++) {
            for (let col = 0; col < this.props.memoryWidth; col++) {
                const address = line * this.props.memoryWidth + col;
                if (this.hasDifferenceAtAddress(oldProps, address)) {
                    this.drawCellDiff(col, line, oldProps);
                }
            }
        }
    }

    private hasDifferenceAtAddress(oldProps: IMemoryMapProps, address: number) {
        return oldProps.memory[address] !== this.props.memory[address]; 
    }

    private drawCellDiff(col: number, line: number, oldProps: IMemoryMapProps) {
        const address = line * this.props.memoryWidth + col;

        // draw new changes
        if (this.props.memory[address].changed > 0) {
            const col = address % this.props.memoryWidth;
            const line = (address - col) / this.props.memoryWidth;
            this.eraseAtPosition(col, line);
            this.drawOneMemoryRegion(col, line, true, undefined);
        } else {
            this.eraseAtPosition(col, line);
            this.drawOneMemoryRegion(col, line, false, undefined);
        }
    }

    private drawIP(proc: Process, prevProc: Process | undefined) {
        let col: number;
        let line: number;

        if (prevProc) {
            col = prevProc.instructionPointer % this.props.memoryWidth;
            line = (prevProc.instructionPointer - col) / this.props.memoryWidth;

            this.eraseAtPosition(col, line);
            this.drawOneMemoryRegion(col, line, this.props.memory[prevProc.instructionPointer].changed > 0, undefined);
        }

        col = proc.instructionPointer % this.props.memoryWidth;
        line = (proc.instructionPointer - col) / this.props.memoryWidth;
        this.drawOneMemoryRegion(col, line, false, '#fff');
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
        const {instr, owner } = this.props.memory[index];

        if (instr.op === OpCode.MINE) {
            return CONSTANTS.gold;
        }
        if (owner === 0) {
            return CONSTANTS.blue;
        }
        if (owner === 1) {
            return CONSTANTS.purple;
        }

        return CONSTANTS.gray;
    }

    private drawOneMemoryRegion(col: number, line: number, isFull: boolean, color?: string) {

        if (color === undefined) {
            color = this.getCaseColor(col, line);
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = color;

        const x = 2 + col * CONSTANTS.outerBoxSize;
        const y = 2 + line * CONSTANTS.outerBoxSize;
        const width = CONSTANTS.boxSize;

        this.ctx.rect(x, y, width, width);
        this.ctx.stroke();

        if (isFull) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
    }
}