/**
 * 过滤条件抽象类
 *
 * @class BI.AbstractFilterItem
 * @extend BI.Widget
 */
BI.AbstractFilterItem = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.AbstractFilterItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-filter-item"
        })
    },

    _init: function () {
        BI.AbstractFilterItem.superclass._init.apply(this, arguments);
    },

    isSelectedCondition: function () {
        return this.emptyItem && this.emptyItem.isVisible();
    },

    setSelectedCondition: function (b) {
        if (!!b) {
            if (!this.emptyItem) {
                this.emptyItem = BI.createWidget({
                    type: "bi.absolute",
                    height: 40,
                    cls: "filter-item-empty-item",
                    items: [{
                        el: {
                            type: "bi.center_adapt",
                            cls: "empty-filter-item-leaf"
                        }
                    }],
                    hgap: 10,
                    vgap: 5
                });
                BI.createWidget({
                    type: "bi.vertical",
                    element: this,
                    items: [this.emptyItem],
                    scrolly: false
                });
            }
        }
        this.emptyItem && this.emptyItem.setVisible(b);
    }
});