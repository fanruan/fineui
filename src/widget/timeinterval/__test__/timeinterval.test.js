/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/2/18
 */

describe("DateInterval", function () {

    /**
     * test_author_windy
     */
    it("DateInterval_defaultValue", function () {
        var dateInterval = BI.Test.createWidget({
            type: "bi.date_interval",
            value: {
                start: {
                    type: 1,
                    value: {
                        year: 2018,
                        month: 1,
                        day: 12
                    }
                },
                end: {
                    type: 2,
                    value: {
                        year: -1,
                        position: 2
                    }
                }
            },
        });
        expect(dateInterval.element.find(".bi-date-trigger .bi-label").text()).to.equal("2018-01-122019-01-01");
        dateInterval.destroy();
    });

    /**
     * test_author_windy
     */
    it("TimeInterval_defaultValue", function () {
        var dateInterval = BI.Test.createWidget({
            type: "bi.time_interval",
            value: {
                start: {
                    type: 1,
                    value: {
                        year: 2018,
                        month: 1,
                        day: 12,
                        hour: 10,
                        minute: 10,
                        second: 10
                    }
                },
                end: {
                    type: 2,
                    value: {
                        year: -1,
                        position: 2
                    }
                }
            },
        });
        expect(dateInterval.element.find(".bi-date-time-trigger .bi-label").text()).to.equal("2018-01-12 10:10:102019-01-01 00:00:00");
        dateInterval.destroy();
    });

    /**
     * test_author_windy
     */
    it("TimePeriod_defaultValue", function () {
        var dateInterval = BI.Test.createWidget({
            type: "bi.time_periods",
            value: {
                start: {
                    hour: 7,
                    minute: 23,
                    second: 14
                },
                end: {
                    hour: 23,
                    minute: 34,
                    second: 32
                }
            },
        });
        expect(dateInterval.getValue()).to.deep.equal({
            "end": {
                "hour": 23,
                "minute": 34,
                "second": 32
            },
            "start": {
                "hour": 7,
                "minute": 23,
                "second": 14
            }
        });
        dateInterval.destroy();
    });
});