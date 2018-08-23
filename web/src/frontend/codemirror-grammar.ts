import * as CodeMirror from 'codemirror';

CodeMirror.defineMode('twc', (_config, _parserConfig) => {

    const lineCommentStartSymbol = ';';

    const opcodes = [
        'dat',
        'mov',
        'add',
        'addb',
        'sub',
        'subb',
        'mul',
        'div',
        'divb',
        'mod',
        'modb',
        'jmp',
        'jz',
        'jnz',
        'nop',
        'se',
        'sne',
        'mine'
    ];

    const brackets = [ '(', ')', ':' ];

    const opcodesWithLabel = [ 'jmp', 'jz', 'jnz' ];

    return {
        startState() {
            return {
                expectIdent: false,
                expectJumpLocation: false
            };
        },

        token: (stream: any, state: any) => {

            if (state.expectIdent) {
                stream.eatWhile(/\w/);
                state.expectIdent = false;
                return 'string';
            }

            if (stream.eatSpace()) {
                return null;
            }

            let allowLabels = false;
            if (state.expectJumpLocation) {
                state.expectJumpLocation = false;
                allowLabels = true;
            }

            let cur;
            const ch = stream.next();

            if (ch === lineCommentStartSymbol) {
                stream.skipToEnd();
                return 'comment';
            }

            if (brackets.indexOf(ch) !== -1) {
                return 'braket';
            }

            if (ch === '%') {
                state.expectIdent = true;
                return 'atom';
            }

            if (/\d/.test(ch)) {
                if (ch === '0' && stream.eat('x')) {
                    stream.eatWhile(/[0-9a-fA-F]/);
                    return 'number';
                }
                stream.eatWhile(/\d/);
                return 'number';
            }

            if (ch === ',') {
                return 'invalid';
            }

            if (/\w/.test(ch)) {
                stream.eatWhile(/\w/);
                if (stream.peek() === ':') {
                    return allowLabels ? 'invalid' : 'variable';
                }
                cur = stream.current().toLowerCase();
                if (cur === 'a' || cur === 'b') {
                    return 'property';
                }
                if (opcodes.indexOf(cur) !== -1) {
                    if (opcodesWithLabel.indexOf(cur) !== -1) {
                        state.expectJumpLocation = true;
                        stream.eatSpace();
                    }
                    return 'keyword';
                }
                return allowLabels ? 'variable' : 'invalid';
            }
            return 'invalid';
        },

        lineComment: lineCommentStartSymbol
    };
});
