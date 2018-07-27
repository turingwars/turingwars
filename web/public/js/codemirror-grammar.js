// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    // TWC: turing wars code
    CodeMirror.defineMode("twc", function(_config, parserConfig) {

        var lineCommentStartSymbol = ";";

        var opcodes = [
            "dat",
            "mov",
            "add",
            "addb",
            "sub",
            "subb",
            "mul",
            "div",
            "divb",
            "mod",
            "modb",
            "jmp",
            "jz",
            "jnz",
            "nop",
            "se",
            "sne",
            "mine"
        ];

        var brackets = [ '(', ')', ':' ];

        var opcodesWithLabel = [ 'jmp', 'jz', 'jnz' ];

        return {
            startState: function() {
                return {
                    expectIdent: false,
                    expectJumpLocation: false
                };
            },
    
            token: function(stream, state) {

                if (state.expectIdent) {
                    stream.eatWhile(/\w/);
                    state.expectIdent = false;
                    return "string";
                }
        
                if (stream.eatSpace()) {
                    return null;
                }

                let allowLabels = false;
                if (state.expectJumpLocation) {
                    console.log('Allow');
                    state.expectJumpLocation = false;
                    allowLabels = true;
                }
        
                var cur, ch = stream.next();

                if (ch === lineCommentStartSymbol) {
                    stream.skipToEnd();
                    return "comment";
                }

                if (brackets.indexOf(ch) !== -1) {
                    return "braket";
                }

                if (ch === '%') {
                    state.expectIdent = true;
                    return "atom";
                }
        
                if (/\d/.test(ch)) {
                    if (ch === "0" && stream.eat("x")) {
                        stream.eatWhile(/[0-9a-fA-F]/);
                        return "number";
                    }
                    stream.eatWhile(/\d/);
                    return "number";
                }

                if (ch === ',') {
                    return "invalid";
                }
        
                if (/\w/.test(ch)) {
                    stream.eatWhile(/\w/);
                    if (stream.peek() === ":") {
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
            },
        
            lineComment: lineCommentStartSymbol
        };
    });
  
});