(function (mod) {
    mod(CodeMirror);
})(function (CodeMirror) {
    var Pos = CodeMirror.Pos;

    function forEach(arr, f) {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
    }

    function arrayContains(arr, item) {
        if (!Array.prototype.indexOf) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === item) {
                    return true;
                }
            }
            return false;
        }
        return arr.indexOf(item) != -1;
    }

    function scriptHint(editor, keywords, getToken, options) {
        // Find the token at the cursor
        var cur = editor.getCursor(), token = getToken(editor, cur);
        if (/\b(?:string)\b/.test(token.type)) {
            return;
        }
        token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

        if (!/^[\w$_]*$/.test(token.string)) {
            token = {
                start: cur.ch, end: cur.ch, string: "", state: token.state,
                type: token.string == "." ? "property" : null
            };
        } else if (token.end > cur.ch) {
            token.end = cur.ch;
            token.string = token.string.slice(0, cur.ch - token.start);
        }

        var tprop = token;
        // If it is a property, find out what it is a property of.
        while (tprop.type == "property") {
            tprop = getToken(editor, Pos(cur.line, tprop.start));
            if (tprop.string != ".") return;
            tprop = getToken(editor, Pos(cur.line, tprop.start));
            if (!context) var context = [];
            context.push(tprop);
        }
        return {
            list: getCompletions(token, context, keywords, options),
            from: Pos(cur.line, token.start),
            to: Pos(cur.line, token.end)
        };
    }

    function getFormulaKeywords() {
        return FormulaCollections;
    }

    function formulaHint(editor, options) {
        return scriptHint(editor, getFormulaKeywords(),
            function (e, cur) {
                return e.getTokenAt(cur);
            },
            options);
    };
    CodeMirror.registerHelper("hint", "formula", formulaHint);

    function getCompletions(token, context, keywords, options) {
        var found = [], start = token.string;
        if (!start) {
            return found;
        }
        function maybeAdd(str) {
            if (str.lastIndexOf(start, 0) == 0 && !arrayContains(found, str)) {
                found.push(str);
            }
        }

        if (context && context.length) {
            context.pop();
        } else {
            forEach(keywords, maybeAdd);
        }
        return found;
    }
});