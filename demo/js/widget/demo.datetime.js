/**
 * Created by Urthur on 2017/7/18.
 */
Demo.CustomDateTime = BI.inherit(BI.Widget, {
    props: {
    },
    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.custom_date_time_combo",
                    ref: function (_ref) {
                        self.customDateTime =  _ref;
                        var value, date, dateStr;
                        self.customDateTime.on(BI.CustomDateTimeCombo.EVENT_CONFIRM, function () {
                            value = this.getValue();
                            date = new Date(value.year,value.month,value.day,value.hour,value.minute,value.second);
                            dateStr = date.print("%Y-%X-%d %H:%M:%S");
                            BI.Msg.alert("日期", dateStr);
                        });
                        self.customDateTime.on(BI.CustomDateTimeCombo.EVENT_CANCEL, function () {
                            value = this.getValue();
                            date = new Date(value.year,value.month,value.day,value.hour,value.minute,value.second);
                            dateStr = date.print("%Y-%X-%d %H:%M:%S");
                            BI.Msg.alert("日期", dateStr);
                        });
                    }
                },
                top: 200,
                left: 200
            }]
        };
    }
});
BI.shortcut("demo.custom_date_time", Demo.CustomDateTime);