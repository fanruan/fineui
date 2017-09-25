/**
 * Created by Dailer on 2017/7/11.
 */
Demo.StaticCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },


    beforeMount: function () {
        this.refs.setValue(2);
    },

    render: function () {

        var self = this;

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.static_combo",
                text: "Value 不变",
                width: 300,
                ref: function (_ref) {
                    self.refs = _ref;
                },
                items: [
                    {
                        text: "MVC-1",
                        value: 1
                    }, {
                        text: "MVC-2",
                        value: 2
                    }, {
                        text: "MVC-3",
                        value: 3
                    }
                ]
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.static_combo", Demo.StaticCombo);