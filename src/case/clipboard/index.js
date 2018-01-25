/**
 * 复制
 * Created by GUY on 2016/2/16.
 * @class BI.ClipBoard
 * @extends BI.BasicButton
 */
BI.ClipBoard = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.ClipBoard.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-clipboard",
            el: {},
            copy: BI.emptyFn,
            afterCopy: BI.emptyFn
        });
    },

    _init: function () {
        BI.ClipBoard.superclass._init.apply(this, arguments);
        BI.createWidget(this.options.el, {
            element: this
        });
    },

    mounted: function () {
        var self = this, o = this.options;
        if (window.Clipboard) {
            this.clipboard = new Clipboard(this.element[0], {
                text: function () {
                    return BI.isFunction(o.copy) ? o.copy() : o.copy;
                }
            });
            this.clipboard.on("success", o.afterCopy);
        } else {
            this.element.zclip({
                path: BI.resourceURL + "/ZeroClipboard.swf",
                copy: o.copy,
                beforeCopy: o.beforeCopy,
                afterCopy: o.afterCopy
            });
        }
    },

    destroyed: function () {
        this.clipboard && this.clipboard.destroy();
    }
});

BI.shortcut("bi.clipboard", BI.ClipBoard);