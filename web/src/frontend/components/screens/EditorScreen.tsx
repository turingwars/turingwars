import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { connect } from 'react-redux';
import { Assembler } from 'shared/assembler/Assembler';
import { CompilerError } from 'shared/assembler/CompileError';
import 'frontend/codemirror-grammar';
import { loadCode, unloadCode } from 'frontend/redux/editor/actions';
import { State } from 'frontend/redux/state';
import { navigateTo, ROUTE_HOME, ROUTE_PLAYTEST, ROUTE_PUBLISH_HERO } from 'frontend/services/navigation';
import { ActionsRow } from 'frontend/components/layout/ActionsRow';
import { Button } from 'frontend/components/widgets/Button';
import { BaseScreen } from './BaseScreen';
import { EditorCheatSheet } from '../layout/EditorCheatSheet';


const asm = new Assembler();

const mapStateToProps = (state: State) => {
    return state.editor;
};

const mapDispatchToProps = {
    unloadCode,
    loadCode
};

type EditorScreenProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const EditorScreen = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<EditorScreenProps> {

    private markers: CodeMirror.TextMarker[] = [];

    private instance: CodeMirror.Editor | undefined;

    /** @override */ public render() {
        return <BaseScreen title="Hero creator">
            <EditorCheatSheet></EditorCheatSheet>
            <CodeMirror
                value={this.props.code || ''}
                options={{
                    mode: 'twc',
                    theme: 'isotope',
                    lineNumbers: true,
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
                <Button url={`#${ROUTE_HOME}`}>◄ Home</Button>
                <Button onClick={this.discardHandler}>Discard</Button>
                <Button url={`#${ROUTE_PUBLISH_HERO}`}>Publish</Button>
                <Button onClick={this.playtestHandler}>Test ►</Button>
            </ActionsRow>

        </BaseScreen>
    }

    private discardHandler = () => {
        this.props.unloadCode();
        navigateTo(ROUTE_HOME);
    }

    private playtestHandler = () => {
        navigateTo(ROUTE_PLAYTEST);
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
