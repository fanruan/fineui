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
            baseCls: "bi-arrangement-block bi-mask"
        });
    }
});
BI.shortcut('bi.arrangement_block', BI.ArrangementBlock);