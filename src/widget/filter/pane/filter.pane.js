/**
 * @class BI.FilterPane
 * @extend BI.Widget
 * 过滤面板
 */
!(function () {
    var FilterPane = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-filter-pane",
            expander: {},
            items: [],
            itemsCreator: BI.emptyFn
        },

        render: function () {
            var self = this, o = this.options;
            return {
                type: "bi.custom_tree",
                cls: BI.isNotEmptyArray(o.items) ? "bi-border-top bi-border-left" : "",
                expander: BI.extend({
                    type: "bi.filter_expander",
                    el: {},
                    popup: {
                        type: "bi.custom_tree"
                    }
                }, o.expander),
                el: {
                    type: "bi.filter_list",
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                    layouts: [{
                        type: "bi.vertical",
                        scrolly: false
                    }]
                },
                items: o.items,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent("EVENT_CHANGE", arguments);
                    }
                }],
                ref: function (_ref) {
                    self.tree = _ref;
                }
            };
        },

        populate: function (items) {
            if (BI.isNotEmptyArray(items)) {
                this.element.addClass("bi-border-top bi-border-left");
            } else {
                this.element.removeClass("bi-border-top bi-border-left");
            }
            this.tree.populate.apply(this.tree, arguments);
        },

        getValue: function () {
            return this.tree.getValue();
        }
    });
    BI.shortcut("bi.filter_pane", FilterPane);
}());