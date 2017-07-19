/**
 * Created by Urthur on 2017/7/18.
 */
Demo.CustomDateTime = BI.inherit(BI.Widget, {
    props: {
    },
    render: function () {
        return {
            type: "bi.custom_date_time_combo",
        };
    }
});
BI.shortcut("demo.custom_date_time", Demo.CustomDateTime);