import * as React from 'react';
import { COLOR_PRIMARY } from 'frontend/style';
import styled from 'styled-components';

const Title = styled.h2`
    color: ${COLOR_PRIMARY};
    margin-top: 0px;
`;

const CheatSheetDiv = styled.div`
    float: right;
    padding-left: 10px;
    padding-right: 10px;
    width: 25%;
    text-shadow: none;
`;

const CheatSheetUl = styled.ul`
    padding: 0;
    margin-top: 0px;
    list-style-type: none;
`;

const CheatSheetUlTitle = styled.p`
    margin-bottom: 5px;
`;

const CheatSheetLink = styled.a`
    color: #f09609;
`;

const CODEMIRROR_CSS_CONSTANTS = {
    keyword: 'cm-keyword',
    number: 'cm-number',
    reference: 'cm-property',
    string: 'cm-string',
    variable: 'cm-variable'
};

interface ITokenProps {
    value: string;
    tooltip?: string;
    class?: string;
}

class Token extends React.Component<ITokenProps> {
    /** @override */ public render() {
        if(this.props.tooltip !== undefined) {
            return <span data-tooltip={this.props.tooltip} className={this.props.class}>{this.props.value}</span>
        }
        return <span className={this.props.class}>{this.props.value}</span>
    }
}

interface IInstructionProps {
    value: string;
    tooltip?: string;
}

class Instruction extends React.Component<IInstructionProps> {
    /** @override */ public render() {
        const tokens = this.props.value.split(/[\s|,]/)
        
        const reactComponents = tokens.map((token) => {
            let style: string = ''
            switch(token){
                case 'A':
                case 'B':
                case 'offset':
                case 'condition':
                case '4':
                    style = CODEMIRROR_CSS_CONSTANTS.number;
                    break;
                case '%id':
                    style = CODEMIRROR_CSS_CONSTANTS.string;
                    break;
                case 'a(4)':
                    style = CODEMIRROR_CSS_CONSTANTS.reference;
                    break;
                case 'A-field':
                case 'B-field':
                case 'field':
                    style = CODEMIRROR_CSS_CONSTANTS.variable;
                    break;
                default:
                    style = CODEMIRROR_CSS_CONSTANTS.keyword;
                    break;
            }
            return <Token value={token+' '} class={style} key={token}/>
        });

        if(this.props.tooltip !== undefined){
            return <span data-tooltip={this.props.tooltip}>{reactComponents}</span>
        }

        return reactComponents
    }
}


const tooltips = {
    jmp4: 'Jumps by exactly 4 cells.',
    jmp_a4: 'Reads the A-field of the instruction in 4 cells, and jumps by that many cells.',
    mine: 'Generates 1 victory point. Use `mine %id` verbatim, %id gets replaced with your champion\'s player ID.',
    add: 'Computes `A` + `B`, stores into `A`. `A` must be a reference.',
    sub: 'Computes `A` - `B`, stores into `A`. `A` must be a reference.',
    mul: 'Computes `A` * `B`, stores into `A`. `A` must be a reference.',
    div: 'Computes `A` / `B`, stores into `A`. `A` must be a reference.',
    mod: 'Computes `A` \% `B`, stores into `A`. `A` must be a reference.',
    jmp: 'Jumps by `offset` cells. `offset` can be negative.',
    jz: 'Jumps by `offset` cells if `condition` evaluates to 0.',
    jnz: 'Jumps by `offset` cells if `condition` does not evaluate to 0.',
    se: 'Skips next instruction if the instructions at positions `A` and `B` are equal.',
    sne: 'Skips next instruction if the instructions at positions `A` and `B` are different.',
}

export class EditorCheatSheet extends React.Component {

    /** @override */ public render() {
    return <CheatSheetDiv className="cm-s-isotope"> 
        <Title>CheatSheet</Title>
        <p>Hover over the text for tips! Full reference <CheatSheetLink href="https://github.com/turingwars/turingwars/wiki">here</CheatSheetLink>.</p>
        
        <CheatSheetUlTitle>Possible instructions:</CheatSheetUlTitle>
        <CheatSheetUl>
            <li><Instruction value="mine %id" tooltip={tooltips.mine}/></li>
            <li><Instruction value="add" tooltip={tooltips.add} /> / <Instruction value="sub" tooltip={tooltips.sub} /> / <Instruction value="mul" tooltip={tooltips.mul} /> / <Instruction value="div" tooltip={tooltips.div} /> / <Instruction value="mod A B" tooltip={tooltips.mod} /></li>
            <li><Instruction value="jmp offset" tooltip={tooltips.jmp}/></li>
            <li><Instruction value="jz" tooltip={tooltips.jz}/> / <Instruction value="jnz offset condition" tooltip={tooltips.jnz}/></li>
            <li><Instruction value="se" tooltip={tooltips.se}/> / <Instruction value="sne A B" tooltip={tooltips.sne}/></li>
        </CheatSheetUl>
        <CheatSheetUlTitle>All instructions have an opcode (e.g., <Instruction value="add"/>,<Instruction value="jmp"/>), a <Instruction value="A-field"/> and a <Instruction value="B-field"/>.</CheatSheetUlTitle>
        
        <CheatSheetUlTitle>A <Instruction value="field"/> can be either:</CheatSheetUlTitle>
        <CheatSheetUl>
            <li>immediate: <Instruction value="jmp 4" tooltip={tooltips.jmp4}/></li>
            <li>referenced: <Instruction value="jmp a(4)" tooltip={tooltips.jmp_a4}/></li>
        </CheatSheetUl>
    </CheatSheetDiv>
    }
}