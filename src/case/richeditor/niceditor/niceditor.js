/**
 * 富文本编辑器
 *
 * Created by GUY on 2017/9/15.
 * @class BI.NicEditor
 * @extends BI.Widget
 */
!(function () {
    BI.NicEditor = BI.inherit(BI.Widget, {
        _defaultConfig: function () {
            return BI.extend(BI.NicEditor.superclass._defaultConfig.apply(this, arguments), {
                baseCls: "bi-nic-editor"
            });
        },
        _init: function () {
            BI.NicEditor.superclass._init.apply(this, arguments);
            var o = this.options;
            $(document).bind("mousedown." + this.getName(), BI.bind(this.selectCheck, this));
            BI.createWidget({
                type: "bi.vertical",
                element: this,
                items: [this.instance = this.addInstance()]
            });
        },

        addInstance: function () {
            var o = this.options;
            var conf = {
                ne: this,
                height: o.height,
                maxHeight: o.maxHeight ? o.maxHeight : null,
                readOnly: o.readOnly
            };
            if (this.element[0].contentEditable || !!window.opera) {
                var newInstance = new nicEditorInstance(conf);
            } else {
                console.error("不支持此浏览器");
            }
            return newInstance;
        },

        insertElem: function ($elem) {
            if (this.selectedInstance) {
                this.selectedInstance.insertElem($elem);
            }
        },

        insertHTML: function (html) {
            if (this.selectedInstance) {
                this.selectedInstance.insertHTML(html);
            }
        },

        nicCommand: function (cmd, args) {
            if (this.selectedInstance) {
                this.selectedInstance.nicCommand(cmd, args);
            }
        },

        selectCheck: function (e) {
            var t = e.target;
            var found = false;
            do {
                if (t.nodeName !== "svg" && t.className && t.className.indexOf(prefix) != -1) {
                    return;
                    // return false;
                }
            } while (t = t.parentNode);
            this.fireEvent("blur", t);
            this.lastSelectedInstance = this.selectedInstance;
            this.selectedInstance = null;
            // return false;
        },

        focus: function () {
            this.instance.focus();
        },

        setValue: function (v) {
            this.instance.setContent(v);
        },

        getValue: function () {
            return this.instance.getContent();
        },

        destroyed: function () {
            $(document).unbind("mousedown." + this.getName());
        }
    });
    BI.NicEditor.EVENT_SELECTED = "selected";
    BI.NicEditor.EVENT_BLUR = "blur";
    BI.NicEditor.EVENT_FOCUS = "focus";
    BI.NicEditor.EVENT_KEYDOWN = "keydown";
    BI.shortcut("bi.nic_editor", BI.NicEditor);

    var prefix = "niceditor-";

    var nicEditorInstance = BI.inherit(BI.Layout, {
        isSelected: false,
        _init: function () {
            nicEditorInstance.superclass._init.apply(this, arguments);
            var o = this.options;
            this.ne = this.options.ne;
            this.elm = BI.createWidget({
                type: "bi.layout",
                width: o.width - 8,
                scrollable: false
            });
            this.elm.element.css({
                minHeight: BI.isNumber(o.height) ? (o.height - 8) + "px" : o.height,
                outline: "none",
                padding: "0 10px"
            }).html(o.value);

            if(o.readOnly) {
                this.elm.element.attr("contentEditable", false);
                this.elm.element.css("word-break", "break-all");
            }

            this.element.css("maxHeight", (o.maxHeight) ? o.maxHeight + "px" : null);

            this.e = BI.createWidget({
                type: "bi.layout",
                invisible: true,
                tagName: "textarea"
            });
            BI.createWidget({
                type: "bi.default",
                element: this,
                scrolly: true,
                items: [this.elm, this.e]
            });

            this.ne.on("blur", BI.bind(this.blur, this));

            this.start();
            this.blur();
        },

        start: function () {
            this.elm.element.attr("contentEditable", this.options.readOnly !== true);
            if (this.getContent() == "") {
                // this.setContent("<br />");
            }
            this.instanceDoc = document.defaultView;
            this.elm.element.on("mousedown", BI.bind(this.selected, this));
            this.elm.element.on("keyup", BI.bind(this.keyDown, this));
            // this.elm.element.on("keydown", BI.bind(this.keyDown, this));
            this.elm.element.on("focus", BI.bind(this.selected, this));
            this.elm.element.on("blur", BI.bind(this.blur, this));
            this.elm.element.on("keyup", BI.bind(this.selected, this));
            this.ne.fireEvent("add");
        },

        getSel: function () {
            return (window.getSelection) ? window.getSelection() : document.selection;
        },

        getRng: function () {
            var s = this.getSel();
            if (!s || s.rangeCount === 0) {
                return;
            }
            return (s.rangeCount > 0) ? s.getRangeAt(0) : s.createRange();
        },

        selRng: function (rng, s) {
            if (window.getSelection) {
                s.removeAllRanges();
                s.addRange(rng);
            } else {
                rng.select();
            }
        },

        selElm: function () {
            var r = this.getRng();
            if (!r) {
                return;
            }
            if (r.startContainer) {
                var contain = r.startContainer;
                if (r.cloneContents().childNodes.length == 1) {
                    for (var i = 0; i < contain.childNodes.length; i++) {
                        var rng = contain.childNodes[i].ownerDocument.createRange();
                        rng.selectNode(contain.childNodes[i]);
                        if (r.compareBoundaryPoints(Range.START_TO_START, rng) != 1 &&
                            r.compareBoundaryPoints(Range.END_TO_END, rng) != -1) {
                            return contain.childNodes[i];
                        }
                    }
                }
                return contain;
            }
            return (this.getSel().type == "Control") ? r.item(0) : r.parentElement();

        },

        saveRng: function () {
            this.savedRange = this.getRng();
            this.savedSel = this.getSel();
        },

        setFocus: function (el) {
            try {
                el.focus();
            } catch (e) {

            }
            if (!window.getSelection) {
                var rng;
                try {
                    el.focus();
                } catch (e) {

                }
                rng = document.selection.createRange();
                rng.moveStart("character", -el.innerText.length);
                var text = rng.text;
                for (var i = 0; i < el.innerText.length; i++) {
                    if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
                        result = i + 1;
                    }
                }
            } else {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        },

        restoreRng: function () {
            if (this.savedRange) {
                this.selRng(this.savedRange, this.savedSel);
            }
        },

        keyDown: function (e, t) {
            this.ne.fireEvent("keydown", e);
        },

        selected: function (e) {
            var t = e.target;
            if (!t && !(t = this.selElm())) {
                t = this.selElm();
            }
            if (!e.ctrlKey) {
                var selInstance = this.ne.selectedInstance;
                if (selInstance != this) {
                    if (selInstance) {
                        this.ne.fireEvent("blur", e);
                    }
                    this.ne.selectedInstance = this;
                    this.ne.fireEvent("focus", e);
                }
                this.ne.fireEvent("selected", e);
                this.isFocused = true;
                this.elm.element.addClass(prefix + "selected");
            }
            // return false;
        },

        focus: function () {
            this.setFocus(this.elm.element[0]);
            this.nicCommand("selectAll");
        },

        blur: function () {
            this.isFocused = false;
            this.elm.element.removeClass(prefix + "selected");
        },

        saveContent: function () {
            this.ne.fireEvent("save");
            this.e.element.value(this.getContent());
        },

        getElm: function () {
            return this.elm;
        },

        getContent: function () {
            this.content = this.getElm().element.html();
            this.ne.fireEvent("get");
            return this.content;
        },

        setContent: function (e) {
            this.content = e;
            this.ne.fireEvent("set");
            this.elm.element.html(this.content);
        },

        insertElem: function ($elem) {
            var range = this.getRng();

            if (range.insertNode) {
                range.deleteContents();
                range.insertNode($elem);
            }
        },

        insertHTML: function (html) {
            var range = this.getRng();

            try {
                this.nicCommand("insertHTML", html);
            } finally {
                if (range.insertNode) {
                    // IE
                    range.deleteContents();
                    range.insertNode($(html)[0]);
                } else if (range.pasteHTML) {
                    // IE <= 10
                    range.pasteHTML(html);
                }
            }
        },

        nicCommand: function (cmd, args) {
            document.execCommand(cmd, false, args);
        }
    });
}());
