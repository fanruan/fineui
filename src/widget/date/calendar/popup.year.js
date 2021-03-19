/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.YearPopup
 * @extends BI.Trigger
 */
BI.YearPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.YearPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-popup",
            behaviors: {},
            min: "1900-01-01", // 最小日期
            max: "2099-12-31" // 最大日期
        });
    },

    _createYearCalendar: function (v) {
        var o = this.options, y = this._year;

        var calendar = BI.createWidget({
            type: "bi.year_calendar",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max,
            logic: {
                dynamic: true
            },
            year: y + v * 12
        });
        calendar.setValue(this._year);
        return calendar;
    },

    _init: function () {
        BI.YearPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.selectedYear = this._year = BI.getDate().getFullYear();

        this.backBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 24,
            height: 24,
            value: -1
        });

        this.preBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 24,
            height: 24,
            value: 1
        });

        this.navigation = BI.createWidget({
            type: "bi.navigation",
            element: this,
            single: true,
            logic: {
                dynamic: true
            },
            tab: {
                cls: "year-popup-navigation bi-high-light bi-split-top",
                height: 24,
                items: [this.backBtn, this.preBtn]
            },
            cardCreator: BI.bind(this._createYearCalendar, this),
            afterCardCreated: function () {
                this.setValue(self.selectedYear);
            }
        });

        this.navigation.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedYear = this.getValue();
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            self.fireEvent(BI.YearPopup.EVENT_CHANGE, self.selectedYear);
        });

        if(BI.isKey(o.value)){
            this.setValue(o.value);
        }
    },

    _checkMin: function () {
        var calendar = this.navigation.getSelectedCard();
        if (BI.isNotNull(calendar)) {
            calendar.setMinDate(this.options.min);
        }
    },

    _checkMax: function () {
        var calendar = this.navigation.getSelectedCard();
        if (BI.isNotNull(calendar)) {
            calendar.setMaxDate(this.options.max);
        }
    },

    setMinDate: function (minDate) {
        if (BI.isNotEmptyString(this.options.min)) {
            this.options.min = minDate;
            this._checkMin();
        }
    },

    setMaxDate: function (maxDate) {
        if (BI.isNotEmptyString(this.options.max)) {
            this.options.max = maxDate;
            this._checkMax();
        }
    },

    getValue: function () {
        return this.selectedYear;
    },

    setValue: function (v) {
        var o = this.options;
        v = BI.parseInt(v);
        // 切换年不受范围限制
        // 对于年控件来说，只要传入的minDate和maxDate的year区间包含v就是合法的
        // var startDate = BI.parseDateTime(o.min, "%Y-%X-%d");
        // var endDate = BI.parseDateTime(o.max, "%Y-%X-%d");
        // if (BI.checkDateVoid(v, 1, 1, BI.print(BI.getDate(startDate.getFullYear(), 0, 1), "%Y-%X-%d"), BI.print(BI.getDate(endDate.getFullYear(), 0, 1), "%Y-%X-%d"))[0]) {
        //     v = BI.getDate().getFullYear();
        // }

        this.selectedYear = v;
        this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
        this.navigation.setValue(v);
    }
});
BI.YearPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.year_popup", BI.YearPopup);