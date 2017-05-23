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
            text: "",
            afterCopy: BI.emptyFn
        })
    },

    _init: function () {
        BI.ClipBoard.superclass._init.apply(this, arguments);
    },

    mounted: function () {
        var self = this, o = this.options;
        this.clipboard = new Clipboard(this.element[0], {
            text: function () {
                return BI.isFunction(o.text) ? o.text() : o.text;
            }
        });
        this.clipboard.on("success", function (e) {
            o.afterCopy();
        })
    },

    destroyed: function () {
        this.clipboard.destroy();
    }
});

BI.shortcut("bi.clipboard", BI.ClipBoard);