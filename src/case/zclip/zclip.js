/**
 * 复制
 * Created by GUY on 2016/2/16.
 * @class BI.ZeroClip
 * @extends BI.BasicButton
 */
BI.ZeroClip = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.ZeroClip.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-zero-clip",
            copy: BI.emptyFn,
            beforeCopy: BI.emptyFn,
            afterCopy: BI.emptyFn
        })
    },

    _init: function () {
        BI.ZeroClip.superclass._init.apply(this, arguments);
    },

    mounted: function () {
        var self = this, o = this.options;
        this.element.zclip({
            path: BI.resourceURL + "/ZeroClipboard.swf",
            copy: o.copy,
            beforeCopy: o.beforeCopy,
            afterCopy: o.afterCopy
        });
    }
});

BI.shortcut("bi.zero_clip", BI.ZeroClip);