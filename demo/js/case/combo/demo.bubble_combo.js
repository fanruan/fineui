Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    _createNav: function(v){
        var m = this.MONTH, y = this.YEAR;
        m += v;
        while(m < 0){
            y--;
            m += 12;
        }
        while(m > 11){
            y++;
            m -= 12;
        }
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: false
            },
            year: y,
            month: m,
            day: this.DAY
        })
        calendar.setValue(this.selectedTime);
        return calendar;
    },

    _stringfyTimeObject: function(timeOb){
        return timeOb.year + "-" + (timeOb.month + 1) + "-" + timeOb.day;
    },

    render: function () {
        var self = this;
        var combo1 = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 25
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.makeArray(100, {
                        type: "bi.text_item",
                        height: 25,
                        text: "item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                maxHeight: 200
            }
        })
        var combo2 = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 25
            },
            popup: {
                type: "bi.bubble_bar_popup_view",
                el: {
                    type: "bi.button_group",
                    items: BI.makeArray(100, {
                        type: "bi.text_item",
                        height: 25,
                        text: "item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                maxHeight: 200,
                minWidth: 600
            }
        })
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: combo1,
                left: 100,
                top: 100
            }, {
                el: combo2,
                left: 100,
                bottom: 100
            }]
        })
    }
});
$.shortcut("demo.bubble_combo", Demo.Func);