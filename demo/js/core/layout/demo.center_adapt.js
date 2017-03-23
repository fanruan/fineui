Demo.CenterAdapt = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 2,
            items: [{
                column: 0,
                row: 0,
                el: this._createNoWidth()
            }, {
                column: 0,
                row: 1,
                el: this._createBottom()
            }]
        }
    },

    _createNoWidth: function () {
        return BI.createWidget({
            type: "bi.center_adapt",
            hgap: 10,
            items: [{
                type: "bi.label",
                text: "Center Adapt 1，center adapt布局只会影响容器内部的位置（水平和垂直居中）而不会影响到内部控件本身属性",
                cls: "layout-bg1",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 2，根据内部控件的宽度的比例来计算",
                cls: "layout-bg2",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 3，这些label都是没有宽度的",
                cls: "layout-bg3",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 4",
                cls: "layout-bg5",
                height: 30
            }]
        })
    },

    _createBottom: function () {
        return BI.createWidget({
            type: "bi.center_adapt",
            items: [{
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮-1",
                height: "100%",
                width: 160,
                cls: "layout-bg1"
            }, {
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮-2",
                height: 30,
                width: 160,
                cls: "layout-bg2"
            }, {
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮-3",
                height: 30,
                width: 160,
                cls: "layout-bg3"
            }, {
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮-4",
                height: 30,
                width: 160,
                cls: "layout-bg5"
            }]
        })
    },
});
$.shortcut("demo.center_adapt", Demo.CenterAdapt);