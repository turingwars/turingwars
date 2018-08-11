import * as React from 'react';

import { Process } from '../../../model/GameUpdate';
import { OpCode } from '../../../model/Instruction';
import * as CONSTANTS from '../constants';
import { IPrintableMemoryCell } from '../redux/state';

interface IMemoryMapProps {
    memory: IPrintableMemoryCell[];
    memoryWidth: number;
    processes: Process[];
    changedCells: number[][];
}

interface CellCoordinates {
    col: number;
    line: number;
}

interface CellPixelRect {
    left: number;
    top: number;
    width: number;
    // height: number = width;
}

export class MemoryMap extends React.Component<IMemoryMapProps> {

    private ctx: CanvasRenderingContext2D;

    /** @override */ public componentDidMount() {
        this.ctx = this.getRenderingContext();
        this.ctx.lineWidth = CONSTANTS.lineWidth;
        this.drawAll();
    }

    /** @override */ public componentDidUpdate(oldProps: IMemoryMapProps, _newProps: IMemoryMapProps) {
        for (let address = 0; address < this.props.memory.length; address++) {
            if (this.hasDifferenceAtAddress(oldProps, address)) {
                this.drawCell(address);
            }
        }

        this.eraseIPs(oldProps.processes);
        this.drawIPs(this.props.processes);
    }

    /** @override */ public render() {
        return <canvas
                id="memoryMapCanvas"
                ref="thecanvas"
                width={CONSTANTS.canvasSize}
                height={CONSTANTS.canvasSize}></canvas>;
    }

    private getRenderingContext() {
        const canvas = this.refs.thecanvas as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx == null) {
            throw new Error("Cannot obtain the canvas rendering context!");
        }
        return ctx;
    }

    private drawAll() {
        for (let address = 0; address < this.props.memory.length; address++) {
            this.drawCell(address);
        }
    }

    private hasDifferenceAtAddress(oldProps: IMemoryMapProps, address: number) {
        return oldProps.memory[address] !== this.props.memory[address];
    }

    private drawCell(address: number) {
        const cell = this.addrToCell(address);
        this.eraseAtPosition(cell);
        if (this.props.memory[address].changed > 0) {
            this.fillCell(cell, CONSTANTS.lightGray);
            this.strokeCell(cell, this.getCellColor(this.props.memory[address]));
        } else {
            this.strokeCell(cell, this.getCellColor(this.props.memory[address]));
        }
    }

    private eraseIPs(procs: Process[]) {
        for (const proc of procs) {
            this.drawCell(proc.instructionPointer);
        }
    }

    private drawIPs(procs: Process[]) {
        if (procs.length < 2) {
            return;
        }
        const proc1 = procs[0];
        const proc2 = procs[1];

        // Draw first process
        const cell1 = this.addrToCell(proc1.instructionPointer);
        this.fillCell(cell1, CONSTANTS.playerColor[0]);

        // Draw second process
        const cell2 = this.addrToCell(proc2.instructionPointer);
        if (proc1.instructionPointer === proc2.instructionPointer) {
            this.fillHalfCell(cell2, CONSTANTS.playerColor[1]);
        } else {
            this.fillCell(cell2, CONSTANTS.playerColor[1]);
        }
    }

    private eraseAtPosition(cell: CellCoordinates) {
        const rect = this.cellRect(cell);
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        // Extra offsets: 1 px for the border width and 1px to clean the inter-cell gap
        this.ctx.rect(rect.left - 2, rect.top - 2, rect.width + 4, rect.width + 4);
        this.ctx.fill();
    }

    private getCellColor(cell: IPrintableMemoryCell) {
        if (cell.instr.op === OpCode.MINE) {
            return cell.instr.a.value === 0 ? CONSTANTS.blueGold : CONSTANTS.purpleGold;
        }
        if (cell.owner === 0) {
            return CONSTANTS.blue;
        }
        if (cell.owner === 1) {
            return CONSTANTS.purple;
        }
        return CONSTANTS.gray;
    }

    private strokeCell(cell: CellCoordinates, color: string) {
        const rect = this.cellRect(cell);

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.rect(rect.left, rect.top, rect.width, rect.width);
        this.ctx.stroke();
    }

    private fillCell(cell: CellCoordinates, color: string) {
        const rect = this.cellRect(cell);

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        // Inset by 1 px to leave space for the 2px-wide border which follows the rect
        this.ctx.rect(rect.left + 1, rect.top + 1, rect.width - 2, rect.width - 2);
        this.ctx.fill();
    }

    private fillHalfCell(cell: CellCoordinates, color: string) {
        const { left, top, width} = this.cellRect(cell);
        const right = left + width - 1;
        const bottom = top + width - 1;

        this.ctx.beginPath();
        this.ctx.moveTo(right, top);
        this.ctx.lineTo(right, bottom);
        this.ctx.lineTo(left + 1, bottom);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    private addrToCell(addr: number): CellCoordinates {
        const col = addr % this.props.memoryWidth;
        const line = (addr - col) / this.props.memoryWidth;
        return { col, line };
    }

    private cellRect(cell: CellCoordinates): CellPixelRect {
        const left = 1 + cell.col * CONSTANTS.outerBoxSize;
        const top = 1 + cell.line * CONSTANTS.outerBoxSize;
        const width = CONSTANTS.boxSize;

        return { left, top, width };
    }
}
