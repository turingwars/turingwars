import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { Assembler } from '../../../assembler/Assembler';
import { CompilerError } from '../../../assembler/CompileError';
import '../../codemirror-grammar';
import { api } from '../../services/api';
import { BackButton } from '../widgets/BackButton';


interface IEditorProps {
    championID: string;
}

interface IEditorState {
    value: string;
    championName: string;
}

const asm = new Assembler();

export class EditorScreen extends React.Component<IEditorProps, IEditorState> {

    /** @override */ public state = {
        value: '',
        championName: ''
    };

    private markers: CodeMirror.TextMarker[] = [];

    private instance: CodeMirror.Editor | undefined;

    /** @override */ public render() {
        return (
            <div>
                <h1 id="title1">Hello Editor</h1>
                <input type="text"
                        value={this.state.championName}
                        onChange={(championName) => this.setState({ championName: championName.target.value })} />
                <CodeMirror
                    value={this.state.value}
                    options={{
                        mode: 'twc',
                        theme: 'isotope',
                        lineNumbers: true
                    }}
                    onBeforeChange={(_editor, _data, value) => {
                        this.setState({value});
                    }}
                    onChange={(_editor, _data, value) => {
                        this.checkCode(value);
                    }}
                    editorDidMount={(editor) => this.instance = editor }
                />
                <BackButton />
                <button onClick={this._saveChampion}>Save</button>
            </div>
        );
    }

    /** @override */ public componentDidMount() {
        this.loadChampion().catch((e) => { throw e; });
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

    private async loadChampion() {
        const res = await api.getHero({ params: {id: this.props.championID }});
        this.setState({
            championName: res.data.name,
            value: res.data.program
        });
    }

    private _saveChampion = async () => {
        const championRequest = {
            id: this.props.championID,
            program: this.state.value,
            name: this.state.championName
        };

        await api.saveHero({
            params: { id: this.props.championID },
            body: championRequest });
    }
}
