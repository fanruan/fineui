Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    _createNav: function (v) {
        return BI.createWidget({
            type: "bi.label",
            cls: "layout-bg" + BI.random(1, 8),
            text: "第" + v + "页"
        })
    },

    render: function () {
        return {
            type: "bi.navigation",
            defaultShowIndex: 0,
            tab: {
                height: 30,
                items: [{
                    once: false,
                    text: "后退",
                    value: -1,
                    cls: "mvc-button layout-bg3"
                }, {
                    once: false,
                    text: "前进",
                    value: 1,
                    cls: "mvc-button layout-bg4"
                }]
            },
            cardCreator: BI.bind(this._createNav, this)
        }
    }
});
BI.shortcut("demo.navigation", Demo.Func);