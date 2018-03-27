/**
 * 过滤条件抽象类
 *
 * @class BI.AbstractFilterItem
 * @extend BI.Widget
 */
BI.AbstractFilterItem = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-filter-item bi-border-right bi-border-bottom"
    },

    isSelectedCondition: function () {
        return this.emptyItem && this.emptyItem.isVisible();
    },

    setSelectedCondition: function (b) {
        if (b) {
            if (!this.emptyItem) {
                this.emptyItem = BI.createWidget({
                    type: "bi.absolute",
                    height: 40,
                    cls: "filter-item-empty-item bi-border-top",
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
BI.extend(BI.AbstractFilterItem, {
    FILTER_OPERATION_FORMULA: 1,
    FILTER_OPERATION_CONDITION: 2,
    FILTER_OPERATION_CONDITION_AND: 3,
    FILTER_OPERATION_CONDITION_OR: 4,
    FILTER_OPERATION_FORMULA_AND: 5,
    FILTER_OPERATION_FORMULA_OR: 6
});