/**
 * 下拉
 * @class BI.Trigger
 * @extends BI.Single
 * @abstract
 */
BI.Trigger = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Trigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-trigger cursor-pointer",
            height: 24
        });
    },

    _init: function () {
        BI.Trigger.superclass._init.apply(this, arguments);
    },

    setKey: function () {

    },

    getKey: function () {

    },
});