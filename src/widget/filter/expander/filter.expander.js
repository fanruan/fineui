/**
 * @class BI.FilterExpander
 * @extend BI.AbstractFilterItem
 * 过滤树的一个expander节点
 */
!(function () {
    var FilterExpander = BI.inherit(BI.AbstractFilterItem, {
        _constant: {
            EXPANDER_WIDTH: 20
        },

        props: {
            baseCls: "bi-filter-item bi-filter-expander",
            el: {},
            popup: {}
        },

        render: function () {
            var self = this, o = this.options;
            var value = o.value, text = "";
            if (value === BI.Filter.FILTER_TYPE.AND) {
                text = BI.i18nText("BI-Basic_And");
            } else {
                text = BI.i18nText("BI-Basic_Or");
            }
            return {
                type: "bi.horizontal_adapt",
                cls: "filter-item-empty-item",
                verticalAlign: BI.VerticalAlign.Middle,
                items: [{
                    type: "bi.text_button",
                    cls: "condition-and-or",
                    text: text,
                    value: value,
                    id: o.id,
                    width: this._constant.EXPANDER_WIDTH,
                    height: "100%",
                    ref: function (_ref) {
                        self.expander = _ref;
                    },
                    listeners: [{
                        eventName: BI.TextButton.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, "", self);
                        }
                    }]
                }, BI.extend(o.popup, {
                    ref: function (_ref) {
                        self.conditionsView = _ref;
                    },
                    listeners: [{
                        eventName: BI.Controller.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                        }
                    }]
                })]
            };
        },

        getValue: function () {
            return {
                type: this.expander.getValue(),
                value: this.conditionsView.getValue(),
                id: this.options.id
            };
        },

        populate: function () {
            this.conditionsView.populate.apply(this.conditionsView, arguments);
        }
    });
    BI.shortcut("bi.filter_expander", FilterExpander);
}());