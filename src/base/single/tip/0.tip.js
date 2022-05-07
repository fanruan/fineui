/**
 * guy
 * tip提示
 * zIndex在10亿级别
 * @class BI.Tip
 * @extends BI.Single
 * @abstract
 */
BI.Tip = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Tip.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-tip",
            zIndex: BI.zIndex_tip
        });
    },

    _init: function () {
        BI.Tip.superclass._init.apply(this, arguments);
        this.element.css({zIndex: this.options.zIndex});
    }
});