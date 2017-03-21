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
            defaultShowIndex: 0,
            cardCreator: function (v) {
                if (v === 0) {
                    return BI.createWidget({
                        type: "demo.face"
                    })
                }
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