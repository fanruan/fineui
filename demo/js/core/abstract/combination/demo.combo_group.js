Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    child: [{
        type: "bi.combo_group",
        el: {
            type: "bi.icon_text_icon_item",
            text: "2010年",
            value: 2010,
            height: 25,
            iconCls: "close-ha-font"
        },
        children: [{
            type: "bi.single_select_item",
            height: 25,
            text: "一月",
            value: 11
        }, {
            type: "bi.icon_text_icon_item",
            height: 25,
            text: "二月",
            value: 12,
            iconCls1: "close-ha-font",
            iconCls2: "close-ha-font",
            children: [{type: "bi.single_select_item", text: "一号", value: 101, height: 25}]
        }]
    }, {
        text: "2011年", value: 2011
    }, {
        text: "2012年", value: 2012, iconCls: "close-ha-font"
    }, {
        text: "2013年", value: 2013
    }, {
        text: "2014年", value: 2014, iconCls: "close-ha-font"
    }, {
        text: "2015年", value: 2015, iconCls: "close-ha-font"
    }],

    _createBottom: function () {
        var childCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.text_button",
                cls: "button-combo",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.button_tree",
                    items: BI.createItems(BI.deepClone(this.child), {
                        type: "bi.single_select_item",
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });
        childCombo.setValue(BI.deepClone(this.child)[0].children[0].value);

        return BI.createWidget({
            type: "bi.left",
            items: [childCombo],
            hgap: 20,
            vgap: 20
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 1,
            items: [{
                column: 0,
                row: 0,
                el: this._createBottom()
            }]
        };
    }
});
BI.shortcut("demo.combo_group", Demo.Func);
