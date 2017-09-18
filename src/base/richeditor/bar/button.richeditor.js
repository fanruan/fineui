/**
 * 颜色选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbar
 * @extends BI.Widget
 */
BI.RichEditorAction = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorAction.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20,
            command: "",
            disabled: true
        });
    },

    _init: function () {
        BI.RichEditorAction.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        o.editor.on(BI.NicEditor.EVENT_SELECTED, function (ins, target) {
            self.setEnable(true);
            self.checkNodes(target);
        });
        o.editor.on(BI.NicEditor.EVENT_BLUR, function () {
            self.setEnable(false);
        });
        o.editor.on(BI.NicEditor.EVENT_KEY, BI.bind(this.key, this));
    },

    checkNodes: function (e) {
        if (!e) {
            return false;
        }
        var elm = e;
        do {
            if (this.options.tags && this.options.tags.contains(elm.nodeName)) {
                this.activate();
                return true;
            }
        } while (elm = elm.parentNode && elm.className && elm.className.indexOf("bi-nic-editor") >= -1);
        elm = e;
        while (elm.nodeType == 3) {
            elm = elm.parentNode;
        }
        if (this.options.css) {
            for (var itm in this.options.css) {
                if ($(elm).css(itm) == this.options.css[itm]) {
                    this.activate();
                    return true;
                }
            }
        }
        this.deactivate();
        return false;
    },

    key: function () {

    },

    activate: function () {
    },

    deactivate: function () {
    },

    doCommand: function (args) {
        if (this.options.command) {
            this.options.editor.nicCommand(this.options.command, args);
        }
        this.options.editor.fireEvent("buttonClick", this);
    }
});