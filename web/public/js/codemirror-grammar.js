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

        function nextUntilUnescaped(stream, end) {
            var escaped = false, next;
            while ((next = stream.next()) != null) {
                if (next === end && !escaped) {
                    return false;
                }
                escaped = !escaped && next === "\\";
            }
            return escaped;
        }

        return {
            startState: function() {
                return {
                    expectIdent: false
                };
            },
    
            token: function(stream, state) {

                if (state.expectIdent) {
                    stream.eatWhile(/\w/);
                    state.expectIdent = false;
                    return "variable";
                }
        
                if (stream.eatSpace()) {
                    return null;
                }
        
                var style, cur, ch = stream.next();

                if (ch === lineCommentStartSymbol) {
                    stream.skipToEnd();
                    return "comment";
                }

                if (ch === '(') {
                    return "braket";
                }
        
                if (ch === ')') {
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
                    if (stream.eat(":")) {
                        return 'tag';
                    }
                    cur = stream.current().toLowerCase();
                    if (cur === 'a' || cur === 'b') {
                        return 'property';
                    }
                    if (opcodes.indexOf(cur) !== -1) {
                        return 'keyword';
                    }
                    return 'invalid';
                }
            },
        
            lineComment: lineCommentStartSymbol
        };
    });
  
});