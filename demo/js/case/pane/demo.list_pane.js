Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.list_pane",
            ref: function () {
                self.pane = this;
            },
            itemsCreator: function (op, callback) {
                setTimeout(function () {
                    callback(BI.createItems(BI.deepClone(Demo.CONSTANTS.ITEMS), {
                        type: "bi.multi_select_item",
                        height: 25
                    }))
                }, 2000)
            },
            el: {
                type: "bi.button_group",
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        }
    },

    mounted: function () {
        this.pane.populate();
    }
});
BI.shortcut("demo.list_pane", Demo.Func);