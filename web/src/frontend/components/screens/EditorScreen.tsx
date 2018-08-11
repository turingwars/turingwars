import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { connect } from 'react-redux';
import { Assembler } from '../../../assembler/Assembler';
import { CompilerError } from '../../../assembler/CompileError';
import '../../codemirror-grammar';
import { loadCode, unloadCode } from '../../redux/editor/actions';
import { State } from '../../redux/state';
import { navigateTo, ROUTE_HOME } from '../../services/navigation';
import { ActionsRow } from '../layout/ActionsRow';
import { Button } from '../widgets/Button';
import { BaseScreen } from './BaseScreen';


const asm = new Assembler();

const mapStateToProps = (state: State) => {
    return state.editor;
};

const mapDispatchToProps = {
    unloadCode,
    loadCode
};

type EditorSreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const EditorScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<EditorSreenProps> {

    private markers: CodeMirror.TextMarker[] = [];

    private instance: CodeMirror.Editor | undefined;

    /** @override */ public render() {
        return <BaseScreen title="Hero creator">
            <CodeMirror
                value={this.props.code || ''}
                options={{
                    mode: 'twc',
                    theme: 'isotope',
                    lineNumbers: true
                }}
                onBeforeChange={(_editor, _data, value) => {
                    this.props.loadCode(value);
                }}
                onChange={(_editor, _data, value) => {
                    this.checkCode(value);
                }}
                editorDidMount={(editor) => this.instance = editor }
            />
            <ActionsRow>
                <Button href={`#${ROUTE_HOME}`}>◄ Home</Button>>
                <Button onClick={this.discardHandler}>Discard</Button>
                <Button>Test ►</Button>
            </ActionsRow>
        </BaseScreen>
    }

    private discardHandler = () => {
        this.props.unloadCode();
        navigateTo(ROUTE_HOME);
    }

    private checkCode(code: string) {
        this.markers.forEach((m) => m.clear());
        this.markers.length = 0;

        if (this.instance == null) {
            return;
        }
        try {
            console.log(asm.assemble(code));
        } catch (e) {
            if (e.errors) {
                this.reportCompilerErrors(e);
            }
        }
    }

    private reportCompilerErrors(e: CompilerError) {
        if (this.instance == null) return;
        for (const err of e.errors) {
            const pos = err.pos;

            const from = { line: pos.line - 1, ch: pos.ch };
            const to = { line: pos.line - 1, ch: pos.ch + 1};

            this.markers.push(this.instance.getDoc()
                .markText(from, to, {className: 'syntax-error', title: err.message}));
        }
    }

    // private _saveChampion = async () => {
    //     const championRequest = {
    //         id: this.props.championID,
    //         program: this.state.value,
    //         name: this.state.championName
    //     };

    //     await api.saveHero({
    //         params: { id: this.props.championID },
    //         body: championRequest });
    // }
});
