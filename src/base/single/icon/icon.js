/**
 * guy 图标
 * @class BI.Icon
 * @extends BI.Single
 */
BI.Icon = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Icon.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            tagName: "i",
            baseCls: (conf.baseCls || "") + " x-icon b-font horizon-center display-block"
        })
    },
    _init: function () {
        BI.Icon.superclass._init.apply(this, arguments);
    }
});
$.shortcut("bi.icon", BI.Icon);