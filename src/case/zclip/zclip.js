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
        var self = this, o = this.options;
        FR.$defaultImport('/com/fr/bi/web/js/third/jquery.zclip.js', 'js');
        BI.nextTick(function () {
            self.element.zclip({
                path: FR.servletURL + "?op=resource&resource=/com/fr/bi/web/resources/ZeroClipboard.swf",
                copy: o.copy,
                beforeCopy: o.beforeCopy,
                afterCopy: o.afterCopy
            });
        });
    }
});

$.shortcut("bi.zero_clip", BI.ZeroClip);