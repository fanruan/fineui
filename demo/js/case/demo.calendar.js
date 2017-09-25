Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        var date = new Date();
        return {
            type: "bi.calendar",
            ref: function () {
                self.calendar = this;
            },
            logic: {
                dynamic: false
            },
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        }
    },

    mounted: function () {
        var date = new Date();
        this.calendar.setValue({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        })
    }
});
BI.shortcut("demo.calendar", Demo.Func);