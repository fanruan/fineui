/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueDownListCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },


    beforeMount:function(){
        this.refs.setValue(2);
    },

    render: function () {

        var self = this;

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.label",
                cls: "layout-bg2",
                text: "分组+二级",
                width: 300
            }, {
                type: "bi.text_value_down_list_combo",
                text: "天气热死了",
                width: 300,
                ref: function (_ref) {
                    self.refs = _ref;
                },
                items: [
                    [{
                        el: {
                            text: "MVC-1",
                            value: 1
                        },
                        children: [{
                            text: "MVC-1-1",
                            value: 11
                        }]
                    }],
                    [{
                        text: "MVC-2",
                        value: 2
                    }, {
                        text: "MVC-3",
                        value: 3
                    }]
                ]
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.text_value_down_list_combo", Demo.TextValueDownListCombo);