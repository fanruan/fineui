/**
 * Created by User on 2017/3/22.
 */
Demo.HorizontalFloat = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal-float"
    },

    _createLayout: function () {
        return BI.createWidget({
            type: "bi.horizontal_float",
            vgap: 10,
            items: [{
                type: "bi.label",
                text: "Horizontal Float左右自适应",
                cls: "layout-bg1",
                width: 100
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
BI.shortcut("demo.horizontal_float", Demo.HorizontalFloat);