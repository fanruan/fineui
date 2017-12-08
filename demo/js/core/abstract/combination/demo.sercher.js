Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            height: 25,
            handler: function (v) {

            }
        });
    },

    render: function () {
        var self = this;
        var items = [{
            text: "2010年", value: 2010, py: "2010n", title: "1111111111111111111111111111111111"
        }, {
            text: "2011年", value: 2011, py: "2011n", title: "1111111111111111111111111111111111"
        }, {
            text: "2012年", value: 2012, py: "2012n", title: "1111111111111111111111111111111111"
        }, {
            text: "2013年", value: 2013, py: "2013n", title: "1111111111111111111111111111111111"
        }, {
            text: "2014年", value: 2014, py: "2014n", title: "1111111111111111111111111111111111"
        }, {
            text: "2015年", value: 2015, py: "2015n", title: "1111111111111111111111111111111111"
        }, {
            text: "2016年", value: 2016, py: "2016n", title: "1111111111111111111111111111111111"
        }, {
            text: "2017年", value: 2017, py: "2017n", title: "1111111111111111111111111111111111"
        }];

        var adapter = BI.createWidget({
            type: "bi.button_group",
            cls: "layout-bg1",
            items: this._createItems(items),
            chooseType: 1,
            behaviors: {},
            layouts: [{
                type: "bi.vertical"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: adapter,
                top: 50,
                left: 50,
                width: 200,
                height: 100
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    width: 200,
                    height: 30,
                    items: [{
                        el: {
                            type: "bi.searcher",
                            adapter: adapter,
                            width: 200,
                            height: 30
                        },
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }]
                },
                top: 100,
                left: 300
            }]
        });
    }
});
BI.shortcut("demo.searcher", Demo.Func);