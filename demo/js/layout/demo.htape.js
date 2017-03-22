/**
 * Created by User on 2017/3/22.
 */
Demo.HtapeLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-htape"
    },
    render: function () {
        return {
            type: "bi.htape",
            items : [
                {
                    width: 100,
                    el : {
                        type : 'bi.label',
                        text : '1',
                        cls: "layout-bg1"
                    }
                }, {
                    width: 200,
                    el : {
                        type : 'bi.label',
                        text : '2',
                        cls: "layout-bg2"
                    }
                }, {
                    width: 'fill',
                    el : {
                        type : 'bi.label',
                        text : '3',
                        cls: "layout-bg3"
                    }
                }
            ]
        }
    }
});
$.shortcut("demo.htape", Demo.HtapeLayout);