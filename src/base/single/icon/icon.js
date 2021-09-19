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
        });
    },

    render: function () {
        if (BI.isIE9Below && BI.isIE9Below()) {
            this.element.addClass("hack");
        }
    }
});
BI.shortcut("bi.icon", BI.Icon);
