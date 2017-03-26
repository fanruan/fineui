/**
 * Created by User on 2017/3/22.
 */
Demo.VerticalAdaptLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-vertical-adapt"
    },

    _createLayout: function () {
        return BI.createWidget({
            type: "bi.vertical_adapt",
            vgap: 10,
            items: [{
                type: "bi.label",
                text: "Vertical Adapt上下自适应",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "Vertical Adapt上下自适应",
                cls: "layout-bg2",
                width: 300,
                height: 30
            }]
        })
    },
    
    render: function () {
        return {
            type: "bi.grid",
            columns: 2,
            rows: 1,
            items: [{
                column: 0,
                row: 0,
                el: this._createLayout()
            }]
        }
    }
});
$.shortcut("demo.vertical_adapt", Demo.VerticalAdaptLayout);