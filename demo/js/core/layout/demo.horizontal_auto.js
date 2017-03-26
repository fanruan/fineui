/**
 * Created by User on 2017/3/22.
 */
Demo.HorizontalAuto = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal-auto"
    },

    _createLayout: function () {
        return BI.createWidget({
            type: "bi.horizontal_auto",
            vgap: 10,
            items: [{
                type: "bi.label",
                text: "Horizontal Auto左右自适应",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "Horizontal Auto左右自适应",
                cls: "layout-bg2",
                width: 300,
                height: 30
            }]
        })
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
            }]
        }
    }
});
$.shortcut("demo.horizontal_auto", Demo.HorizontalAuto);