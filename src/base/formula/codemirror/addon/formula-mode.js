(function (mod) {
    mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";

    CodeMirror.defineMode('formula', function () {
        function wordObj(words) {
            var o = {};
            for (var i = 0, e = words.length; i < e; ++i) o[words[i]] = true;
            return o;
        }

        var atoms = wordObj(['false', 'true']);
        var keywords = wordObj(FormulaCollections);

        function tokenBase(stream, state) {
            if (stream.eatSpace()) {
                return null;
            }
            var ch = stream.next();

            if (ch === '"' || ch === '\'') {
                nextUntilUnescaped(stream, ch);
                return "string";
            }
            if (/[\[\],\(\)]/.test(ch)) {
                return 'bracket';
            }

            // richie：暂时不需要解析操作符号
            //if (/[+\-*\/=<>!&|]/.test(ch)) {
            //  return 'operator';
            //}
            //if (/\d|\d./.test(ch)) {
            //    stream.eatWhile(/\d|\./);
            //    if (stream.eol() || !/\w/.test(stream.peek())) {
            //        return 'number';
            //    }
            //}



            stream.eatWhile(/[\w-]/);
            var word = stream.current();
            if (atoms.hasOwnProperty(word)) {
                return "atom";
            }
            if (keywords.hasOwnProperty(word)) {
                return "keyword";
            }
            return null;
        }

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

        function tokenize(stream, state) {
            return (state.tokens[0] || tokenBase)(stream, state);
        }

        return {
            startState: function () {
                return {tokens: []};
            },
            token: function (stream, state) {
                return tokenize(stream, state);
            },
            fold: "brace"
        };
    });
    CodeMirror.defineMIME("text/fx-formula", "formula");
});