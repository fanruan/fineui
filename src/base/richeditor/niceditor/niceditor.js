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
            $(document.body).mousedown(BI.bind(this.selectCheck, this));
            BI.createWidget({
                type: "bi.vertical",
                element: this,
                items: [{
                    type: "bi.layout",
                    height: 1
                }, this.instance = this.addInstance()]
            })
        },

        addInstance: function () {
            var o = this.options;
            var conf = {
                ne: this,
                height: o.height - 1,
                maxHeight: o.maxHeight ? o.maxHeight : null
            };
            if (this.element[0].contentEditable || !!window.opera) {
                var newInstance = new nicEditorInstance(conf);
            } else {
                var newInstance = new nicEditorIFrameInstance(conf);
            }
            return newInstance;
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
                if (t.className && t.className.indexOf(prefix) != -1) {
                    return;
                    // return false;
                }
            } while (t = t.parentNode);
            this.fireEvent('blur', this.selectedInstance, t);
            this.lastSelectedInstance = this.selectedInstance;
            this.selectedInstance = null;
            // return false;
        },

        setValue: function (v) {
            this.instance.setContent(v);
        },

        getValue: function () {
            return this.instance.getContent();
        }
    });
    BI.NicEditor.EVENT_SELECTED = "selected";
    BI.NicEditor.EVENT_BLUR = "blur";
    BI.shortcut('bi.nic_editor', BI.NicEditor);

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
                margin: "4px",
                minHeight: (o.height - 8) + "px",
                outline: "none"
            }).html(o.value);

            this.element.css("maxHeight", (o.maxHeight) ? o.maxHeight + 'px' : null);

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
            this.elm.element.attr("contentEditable", true);
            if (this.getContent() == "") {
                this.setContent("<br />");
            }
            this.instanceDoc = document.defaultView;
            this.elm.element.on('mousedown', BI.bind(this.selected, this));
            this.elm.element.on('keypress', BI.bind(this.keyDown, this));
            this.elm.element.on('focus', BI.bind(this.selected, this));
            this.elm.element.on('blur', BI.bind(this.blur, this));
            this.elm.element.on('keyup', BI.bind(this.selected, this));
            this.ne.fireEvent('add', this);
        },

        disable: function () {
            this.elm.element.attr("contentEditable", false);
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
            } else {
                return (this.getSel().type == "Control") ? r.item(0) : r.parentElement();
            }
        },

        saveRng: function () {
            this.savedRange = this.getRng();
            this.savedSel = this.getSel();
        },

        restoreRng: function () {
            if (this.savedRange) {
                this.selRng(this.savedRange, this.savedSel);
            }
        },

        keyDown: function (e, t) {
            if (e.ctrlKey) {
                this.ne.fireEvent('key', this, e);
            }
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
                        this.ne.fireEvent('blur', selInstance, t);
                    }
                    this.ne.selectedInstance = this;
                    this.ne.fireEvent('focus', selInstance, t);
                }
                this.ne.fireEvent('selected', selInstance, t);
                this.isFocused = true;
                this.elm.element.addClass(prefix + 'selected');
            }
            // return false;
        },

        blur: function () {
            this.isFocused = false;
            this.elm.element.removeClass(prefix + 'selected');
        },

        saveContent: function () {
            this.ne.fireEvent('save', this);
            this.e.element.value(this.getContent());
        },

        getElm: function () {
            return this.elm;
        },

        getContent: function () {
            this.content = this.getElm().element.html();
            this.ne.fireEvent('get', this);
            return this.content;
        },

        setContent: function (e) {
            this.content = e;
            this.ne.fireEvent('set', this);
            this.elm.element.html(this.content);
        },

        nicCommand: function (cmd, args) {
            document.execCommand(cmd, false, args);
        }
    });

    var nicEditorIFrameInstance = BI.inherit(nicEditorInstance, {
        savedStyles: [],

        start: function () {
            var o = this.options;
            var c = this.elm.element.html().replace(/^\s+|\s+$/g, '');
            this.elm.element.html("");
            (!c) ? c = "<br />" : c;
            this.initialContent = c;

            this.elmFrame = $('iframe').attr({
                'src': 'javascript:;',
                'frameBorder': 0,
                'allowTransparency': 'true',
                'scrolling': 'no'
            }).css({height: '100px', width: '100%'}).addClass(prefix + 'frame').appendTo(this.elm.element);

            this.elmFrame.css({width: (o.width - 4) + 'px'});

            var styleList = ['font-size', 'font-family', 'font-weight', 'color'];
            for (var item in styleList) {
                this.savedStyles[BI.camelize(item)] = this.elm.element.css(item);
            }

            setTimeout(BI.bind(this.initFrame, this), 50);
        },

        disable: function () {
            this.elm.element.html(this.getContent());
        },

        initFrame: function () {
            var fd = $(this.elmFrame.contentWindow.document)[0];
            fd.designMode = "on";
            fd.open();
            var css = this.ne.options.externalCSS;
            fd.write('<html><head>' + ((css) ? '<link href="' + css + '" rel="stylesheet" type="text/css" />' : '') + '</head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">' + this.initialContent + '</body></html>');
            fd.close();
            this.frameDoc = $(fd);

            this.frameWin = $(this.elmFrame[0].contentWindow);
            this.frameContent = $(this.frameWin[0].document.body).css(this.savedStyles);
            this.instanceDoc = this.frameWin[0].document.defaultView;

            this.heightUpdate();
            this.frameDoc.on('mousedown', BI.bind(this.selected, this));
            this.frameDoc.on('keyup', BI.bind(this.heightUpdate, this));
            this.frameDoc.on('keydown', BI.bind(this.keyDown, this));
            this.frameDoc.on('keyup', BI.bind(this.selected, this));
            this.ne.fireEvent('add', this);
        },

        getElm: function () {
            return this.frameContent;
        },

        setContent: function (c) {
            this.content = c;
            this.ne.fireEvent('set', this);
            this.frameContent.html(this.content);
            this.heightUpdate();
        },

        getSel: function () {
            return (this.frameWin[0]) ? this.frameWin[0].getSelection() : this.frameDoc[0].selection;
        },

        heightUpdate: function () {
            this.elmFrame[0].style.height = Math.max(this.frameContent[0].offsetHeight, this.options.height - 8) + 'px';
        },

        nicCommand: function (cmd, args) {
            this.frameDoc.execCommand(cmd, false, args);
            setTimeout(BI.bind(this.heightUpdate, this), 100);
        }
    })
}());
