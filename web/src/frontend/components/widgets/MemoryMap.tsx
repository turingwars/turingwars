import * as React from 'react';
import { Process } from 'shared/model/GameUpdate';
import { OpCode } from 'shared/model/Instruction';
// TODO: Widgets should not reference Redux
import { IPrintableMemoryCell } from 'frontend/redux/replay/state';
import { COLOR_INSTR_MINE, COLOR_INSTR_MINE_P1, COLOR_INSTR_MINE_P2, COLOR_INSTR_NOP, COLOR_P1, COLOR_P2, COLOR_CHANGED_INSTR } from 'frontend/style';
import styled from 'styled-components';




const LINE_WIDTH = 1;
const BOX_SIZE = 10;
const OUTER_BOX_SIZE = 13;
const CANVAS_SIZE = 520;

function playerColor(playerId: 0 | 1) {
    return playerId === 0 ? COLOR_P1 : COLOR_P2;
}

function playerMineInstructionColor(playerId: 0 | 1) {
    return playerId === 0 ? COLOR_INSTR_MINE_P1 : COLOR_INSTR_MINE_P2;
}

function isValidPlayerNumber(p: number): p is 0 | 1 {
    return p === 0 || p === 1;
}

interface IMemoryMapProps {
    memory: IPrintableMemoryCell[];
    memoryWidth: number;
    processes: Process[];
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

const MemoryMapCanvas = styled.canvas`
    width: 520px;
    height: 520px;
    border: 15px solid #222;
    padding: 0px;
    margin: 0px 5px;
`;

export class MemoryMap extends React.Component<IMemoryMapProps> {

    private ctx: CanvasRenderingContext2D;
    private canvasRef = React.createRef<HTMLCanvasElement>();

    /** @override */
    public componentDidMount() {
        this.ctx = this.getRenderingContext();
        this.ctx.lineWidth = LINE_WIDTH;
        this.drawAll();
    }

    /** @override */
    public componentDidUpdate(oldProps: IMemoryMapProps, _newProps: IMemoryMapProps) {
        for (let address = 0; address < this.props.memory.length; address++) {
            if (this.hasDifferenceAtAddress(oldProps, address)) {
                this.drawCell(address);
            }
        }

        this.eraseIPs(oldProps.processes);
        this.drawIPs(this.props.processes);
    }

    /** @override */
    public render() {
        return <MemoryMapCanvas
                innerRef={this.canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE} />;
    }

    private getRenderingContext() {
        if (this.canvasRef.current == null) {
            throw new Error("Cannot obtain the canvas reference!");
        }
        const ctx = this.canvasRef.current.getContext('2d');
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
            this.fillCell(cell, COLOR_CHANGED_INSTR);
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
        this.fillCell(cell1, playerColor(0));

        // Draw second process
        const cell2 = this.addrToCell(proc2.instructionPointer);
        if (proc1.instructionPointer === proc2.instructionPointer) {
            this.fillHalfCell(cell2, playerColor(1));
        } else {
            this.fillCell(cell2, playerColor(1));
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
            const playerId = cell.instr.a.value;
            if (isValidPlayerNumber(playerId)) {
                return playerMineInstructionColor(playerId);
            }
            return COLOR_INSTR_MINE;
        }
        if (isValidPlayerNumber(cell.owner)) {
            return playerColor(cell.owner);
        }
        return COLOR_INSTR_NOP;

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
        const left = 1 + cell.col * OUTER_BOX_SIZE;
        const top = 1 + cell.line * OUTER_BOX_SIZE;
        const width = BOX_SIZE;

        return { left, top, width };
    }
}
