/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Segments = BI.inherit(BI.Widget, {

    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "默认风格"
            }, {
                type: "bi.segment",
                items: [{
                    text: "tab1",
                    value: 1,
                    selected: true
                }, {
                    text: "tab2",
                    value: 2
                }, {
                    text: "tab3 disabled",
                    disabled: true,
                    value: 3
                }]
            }],
            hgap: 50,
            vgap: 20
        }
    }
});

BI.shortcut("demo.segments", Demo.Segments);