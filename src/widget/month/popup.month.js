/**
 * 月份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.MonthPopup
 * @extends BI.Trigger
 */
BI.MonthPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MonthPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-month-popup"
        });
    },

    _init: function () {
        BI.MonthPopup.superclass._init.apply(this, arguments);
        var self = this;

        //纵向排列月
        var month = [0, 6, 1, 7, 2, 8, 3, 9, 4, 10, 5, 11];
        var items = [];
        items.push(month.slice(0, 2));
        items.push(month.slice(2, 4));
        items.push(month.slice(4, 6));
        items.push(month.slice(6, 8));
        items.push(month.slice(8, 10));
        items.push(month.slice(10, 12));
        items = BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return {
                    type: "bi.text_item",
                    cls: "bi-list-item-active",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    once: false,
                    forceSelected: true,
                    height: 23,
                    width: 38,
                    value: td,
                    text: td + 1
                };
            });
        });

        this.month = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems(items, {}),
            layouts: [BI.LogicFactory.createLogic("table", BI.extend({
                dynamic: true
            }, {
                columns: 2,
                rows: 6,
                columnSize: [1 / 2, 1 / 2],
                rowSize: 25
            })), {
                type: "bi.center_adapt",
                vgap: 1,
                hgap: 2
            }]
        });

        this.month.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MonthPopup.EVENT_CHANGE);
            }
        })
    },

    getValue: function () {
        return this.month.getValue()[0];
    },

    setValue: function (v) {
        this.month.setValue([v]);
    }
});
BI.MonthPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.month_popup", BI.MonthPopup);