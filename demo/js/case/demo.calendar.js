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
        var self = this, d = new Date();
        this.YEAR = d.getFullYear();
        this.MONTH = d.getMonth();
        this.DAY = d.getDate();

        this.selectedTime = {
            year: this.YEAR,
            month: this.MONTH,
            day: this.DAY
        };

        var tip = BI.createWidget({
            type: "bi.label"
        });

        var nav = BI.createWidget({
            type: "bi.navigation",
            element: this,
            tab: {
                height: 30,
                items: [{
                    once: false,
                    text: "后退",
                    value: -1,
                    cls: "mvc-button layout-bg3"
                },tip, {
                    once: false,
                    text: "前进",
                    value: 1,
                    cls: "mvc-button layout-bg4"
                }]
            },
            cardCreator: BI.bind(this._createNav, this),

            afterCardCreated: function(){

            },

            afterCardShow: function(){
                this.setValue(self.selectedTime);
            }
        })

        nav.on(BI.Navigation.EVENT_CHANGE, function(){
            self.selectedTime = nav.getValue();
            tip.setText(self._stringfyTimeObject(self.selectedTime));
        });
        tip.setText(this._stringfyTimeObject(this.selectedTime));
    }
});
$.shortcut("demo.calendar", Demo.Func);