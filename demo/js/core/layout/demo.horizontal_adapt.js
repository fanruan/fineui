/**
 * Created by User on 2017/3/22.
 */
Demo.HorizontalAdapt = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal-adapt"
    },

    _createLayout: function () {
        return BI.createWidget({
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.label",
                text: "例子1:可用做水平居中",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }]
        });
    },

    _createAdaptLayout: function () {
        return BI.createWidget({
            type: "bi.horizontal_adapt",
            columnSize: [300, "fill"],
            items: [{
                type: "bi.label",
                text: "例子2:用于水平适应布局",
                cls: "layout-bg1",
                height: 30
            }, {
                type: "bi.label",
                text: "水平自适应列",
                cls: "layout-bg2",
                height: 30
            }]
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 2,
            items: [{
                column: 0,
                row: 0,
                el: this._createLayout()
            }, {
                column: 0,
                row: 1,
                el: this._createAdaptLayout()
            }]
        };
    }
});
BI.shortcut("demo.horizontal_adapt", Demo.HorizontalAdapt);