import * as React from 'react';
import { CRT_GLITCH_TEXT_LG, COLOR_PRIMARY } from 'frontend/style';
import styled from 'styled-components';

const Title = styled.h2`
    ${CRT_GLITCH_TEXT_LG}
    color: ${COLOR_PRIMARY};
    margin-top: 0px;
`;

const CODEMIRROR_CSS_CONSTANTS = {
    keyword: 'cm-keyword',
    number: 'cm-number',
    reference: 'cm-property',
    string: 'cm-string'
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
            switch(token){
                case 'A':
                case 'B':
                case 'offset':
                case 'condition':
                    return <Token value={token+' '} class={CODEMIRROR_CSS_CONSTANTS.number} />
                case '%id':
                    return <Token value={token+' '} class={CODEMIRROR_CSS_CONSTANTS.string} />
                case '1':
                case '2':
                    return <Token value={token+' '} class={CODEMIRROR_CSS_CONSTANTS.number} />
                case 'b(1)':
                    return <Token value={token+' '} class={CODEMIRROR_CSS_CONSTANTS.reference} />
                default:
                    return <Token value={token+' '} class={CODEMIRROR_CSS_CONSTANTS.keyword} />
            }
        });

        return reactComponents
    }
}


const tooltipsLongTexts = {
    mine: 'Generates 1 victory point. Use `mine %id` verbatim, %id gets replaced with your champion\'s player ID.',
    add: 'Adds `B` to `A`, stores into `A`.',
    sub: ''
}

export class EditorCheatSheet extends React.Component {

    /** @override */ public render() {
    return <div className="EditorCheatSheet cm-s-isotope"> 
        <Title>CheatSheet</Title>
        <p>Hover over the text for tips!</p>
        <p className="CheatSheet_ul_header"><Instruction value="A,B,offset"/> can be either:</p>
        <ul>
            <li>immediate: <Instruction value="add 1 2"/></li>
            <li>referenced: <Instruction value="add b(1) 2"/></li>
        </ul>
        <p className="CheatSheet_ul_header">Possible instructions:</p>
        <ul>
            <li><Instruction value="mine %id" tooltip={tooltipsLongTexts.mine}/></li>
            <li><Instruction value="add A B" tooltip={tooltipsLongTexts.add} /></li>
            <li>add A B</li>
            <li>sub A B</li>
            <li>mul A B</li>
            <li>div A B</li>
            <li>mod A B</li>
            <li>jmp offset</li>
            <li>jz offset condition</li>
            <li>jnz offset condition</li>
            <li>se A B</li>
            <li>sne A B</li>
        </ul>
    </div>
    }
}