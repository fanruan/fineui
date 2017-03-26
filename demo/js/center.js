Demo.Center = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.tab",
            ref: function () {
                self.tab = this;
            },
            defaultShowIndex: "demo.face",
            cardCreator: function (v) {
                return BI.createWidget({
                    type: v
                });
            }
        }
    },

    setValue: function (v) {
        this.tab.setSelect(v);
    }
});
$.shortcut("demo.center", Demo.Center);