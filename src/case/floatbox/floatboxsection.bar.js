/**
 * 有确定取消按钮的弹出层
 * @class BI.BarPopoverSection
 * @extends BI.PopoverSection
 * @abstract
 */
BI.BarPopoverSection = BI.inherit(BI.PopoverSection, {
    _defaultConfig: function () {
        return BI.extend(BI.BarPopoverSection.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText(BI.i18nText("BI-Basic_Sure")), BI.i18nText(BI.i18nText("BI-Basic_Cancel"))]
        })
    },

    _init: function () {
        BI.BarPopoverSection.superclass._init.apply(this, arguments);
    },

    rebuildSouth: function (south) {
        var self = this, o = this.options;
        this.sure = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[0],
            warningTitle: o.warningTitle,
            height: 30,
            value: 0,
            handler: function (v) {
                self.end();
                self.close(v);
            }
        });
        this.cancel = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[1],
            height: 30,
            value: 1,
            level: 'ignore',
            handler: function (v) {
                self.close(v);
            }
        });
        BI.createWidget({
            type: 'bi.right_vertical_adapt',
            element: south,
            hgap: 5,
            items: [this.cancel, this.sure]
        });
    },

    setConfirmButtonEnable: function(v){
        this.sure.setEnable(!!v);
    }
});