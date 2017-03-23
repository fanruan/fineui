/**
 * Created by User on 2017/3/22.
 */
Demo.TdLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-td"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.td",
                columnSize: [100, 100, ""],
                items: BI.createItems([
                    [{
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg1"
                        }
                    }, {
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg2"
                        }
                    }, {
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg3"
                        }
                    }], [{
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg5"
                        }
                    }, {
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg6"
                        }
                    }, {
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg7"
                        }
                    }]
                ], {
                    whiteSpace: "normal"
                })
            }]
        }
    }
});
$.shortcut("demo.td", Demo.TdLayout);