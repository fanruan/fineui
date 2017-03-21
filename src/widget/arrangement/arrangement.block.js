/**
 * Arrangement的block面板
 *
 * Created by GUY on 2016/3/1.
 * @class BI.ArrangementBlock
 * @extends BI.Widget
 */
BI.ArrangementBlock = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ArrangementBlock.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-arrangement-block"
        });
    },

    _init: function () {
        BI.ArrangementBlock.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        
    }
});
$.shortcut('bi.arrangement_block', BI.ArrangementBlock);