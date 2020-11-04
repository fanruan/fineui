!(function () {
    var Widget = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-tree-expander-popup",
            layer: 0, // 第几层级
            el: {},
            isLastNode: false,
        },

        render: function () {

            var self = this;
            var o = this.options;

            this.popupView = BI.createWidget(o.el, this);

            this.popupView.on(BI.Controller.EVENT_CHANGE, function () {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            this.popupView.element.css("margin-left", -12 * o.layer);
            this.element.css("margin-left", 12 * o.layer);

            return {
                type: "bi.vertical",
                cls: !o.isLastNode ? "line" : "",
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
    });

    BI.shortcut("bi.tree_expander.popup", Widget);
}());
