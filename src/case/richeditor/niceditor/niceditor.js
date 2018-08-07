/**
 * 富文本编辑器
 *
 * Created by GUY on 2017/9/15.
 * @class BI.NicEditor
 * @extends BI.Widget
 */
!(function () {
    function isIE11Below () {
        if (!BI.isIE()) {
            return false;
        }
        return BI.getIEVersion() < 11;
    }
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
            var self = this;
            var found = false;
            this.instance.saveRng();
            do {
                if (t.nodeName !== "svg" && t.className && t.className.indexOf && t.className.indexOf(prefix) != -1) {
                    return;
                    // return false;
                }
                if (this.instance.checkToolbar(t)) {
                    // 如果是点击在toolbar内恢复选取(IE中出现的问题)
                    BI.defer(function () {
                        self.instance.restoreRng();
                    });
                    return;
                }
            } while (t = t.parentNode);
            this.fireEvent("blur", t);
            this.lastSelectedInstance = this.selectedInstance || this.lastSelectedInstance;
            this.selectedInstance = null;
            // return false;
        },

        focus: function () {
            this.instance.focus();
        },

        bindToolbar: function (toolbar) {
            this.instance.bindToolbar(toolbar);
        },

        setValue: function (v) {
            v = v || ( isIE11Below() ? "" : "<br>");
            v = v.startWith("<p") ? v : "<p>" + v + "</p>";
            this.instance.setContent(v);
        },

        getValue: function () {
            return this.instance.getContent();
        },

        getContentHeight: function () {
            return this.instance.getContentHeight();
        },

        getInstance: function () {
            return this.instance;
        },

        destroyed: function () {
            $(document).unbind("mousedown." + this.getName());
        }
    });
    BI.NicEditor.EVENT_SELECTED = "selected";
    BI.NicEditor.EVENT_BLUR = "blur";
    BI.NicEditor.EVENT_FOCUS = "focus";
    BI.NicEditor.EVENT_KEYDOWN = "keydown";
    BI.NicEditor.EVENT_KEYUP = "keyup";
    BI.shortcut("bi.nic_editor", BI.NicEditor);

    var prefix = "niceditor-";

    var nicEditorInstance = BI.inherit(BI.Layout, {
        isSelected: false,
        _init: function () {
            nicEditorInstance.superclass._init.apply(this, arguments);
            var o = this.options;
            var initValue = o.value || "<br>";
            initValue = initValue.startWith("<p>") ? initValue : "<p>" + initValue + "</p>";
            this.ne = this.options.ne;
            this.elm = BI.createWidget({
                type: "bi.layout",
                width: o.width - 8,
                scrollable: false
            });
            this.elm.element.css({
                minHeight: BI.isNumber(o.height) ? (o.height - 8) + "px" : o.height,
                outline: "none",
                padding: "0 10px",
                wordWrap: "break-word"
            }).html(initValue);

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
            this.elm.element.on("keydown", BI.bind(this.keyDown, this));
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
            var range = this.getRng();
            if (!this._isChildOf(this.getSelectionContainerElem(range), this.element[0])) {
                return;
            }
            this.savedRange = range;
            this.savedSel = this.getSel();
        },

        getSelectionContainerElem: function (range) {
            if (range) {
                var elem = range.commonAncestorContainer;
                return elem.nodeType === 1 ? elem : elem.parentNode;
            }
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

        restoreRngAndClearRange: function () {
            if (this.savedRange) {
                this.savedRange.setStart(this.savedRange.endContainer, this.savedRange.endOffset);
                this.selRng(this.savedRange, this.savedSel);
            }
        },

        keyDown: function (e, t) {
            if (e.keyCode === 8) {
                var html = this.elm.element.html().toLowerCase().trim();
                if (html === "<p><br></p>" || html === "<p></p>") {
                    e.preventDefault()
                    return;
                }
            }
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
            this.ne.fireEvent("keyup", e);

            if (e.keyCode !== 8) {
                return;
            }
            var newLine;
            var html = this.elm.element.html().toLowerCase().trim();
            if (!html || html === '<br>') {
                newLine = $(this._getNewLine());
                this.elm.element.html('');
                this.elm.element.append(newLine);
                this.setFocus(newLine[0]);
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

        getContentHeight: function () {
            return this.elm.element.height();
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
            var range = this.savedRange || this.getRng();

            try {
                // w3c
                if (document.queryCommandState("insertHTML")) {
                    this.nicCommand("insertHTML", html);
                } else {
                    throw new Error("Does not support this command");
                }
            } catch(e) {
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

        bindToolbar: function (toolbar) {
            this.toolbar = toolbar;
        },

        checkToolbar: function (element) {
            return this.toolbar && this.toolbar.element[0] === element;
        },

        nicCommand: function (cmd, args) {
            document.execCommand(cmd, false, args);
        },

        initSelection: function (newLine) {
            var newLineHtml = this._getNewLine();
            var el = this.elm.element;
            var children = el.children();
            if (!children.length) {
                // 如果编辑器区域无内容，添加一个空行，重新设置选区
                el.append(newLineHtml);
                this.initSelection();
                return;
            }
            
            var last = children.last();

            if (newLine) {
                // 新增一个空行
                var html = last.html().toLowerCase();
                var nodeName = last.nodeName;
                if ((html !== "<br>" && html !== "<br\/>") || nodeName !== "P") {
                    // 最后一个元素不是空行，添加一个空行，重新设置选区
                    el.append(newLineHtml);
                    this.initSelection();
                    return;
                }
            }

            this.setFocus(last[0]);
        },

        _getNewLine: function () {
            return isIE11Below() ? "<p></p>" : "<p><br></p>";
        },

        _isChildOf: function(child, parent) {
            var parentNode;
            if(child && parent) {
                parentNode = child.parentNode;
                while(parentNode) {
                    if(parent === parentNode) {
                        return true;
                    }
                    parentNode = parentNode.parentNode;
                }
            }
            return false;
        }
    });
}());
