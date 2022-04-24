!(function () {
    var Widget = BI.inherit(BI.Widget, {
        props: function () {
            return {
                baseCls: "bi-tree-expander-popup",
                layer: 0, // 第几层级
                el: {},
                isLastNode: false,
            };
        },

        render: function () {

            var self = this;
            var o = this.options;
            var offset = BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT / 2;

            this.popupView = BI.createWidget(BI.extend(o.el, {
                value: o.value
            }), this);

            this.popupView.on(BI.Controller.EVENT_CHANGE, function () {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            this.popupView.element.css("margin-left", -offset * o.layer);
            this.element.css("margin-left", offset * o.layer);

            return {
                type: "bi.vertical",
                cls: !o.isLastNode ? (BI.STYLE_CONSTANTS.LINK_LINE_TYPE === "solid" ? "line solid" : "line") : "",
                scrolly: null,
                items: [
                    this.popupView,
                ],
            };
        },

        setValue: function (v) {
            this.popupView.setValue(v);
        },

        getValue: function () {
            return this.popupview.getValue();
        },

        populate: function (items) {
            this.popupview.populate(items);
        },

        getAllLeaves: function () {
            return this.popupView && this.popupView.getAllLeaves();
        }
    });

    BI.shortcut("bi.tree_expander.popup", Widget);
}());
