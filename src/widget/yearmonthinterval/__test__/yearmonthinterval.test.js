/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/1/16
 */
describe("YearMonthInterval", function () {

    before(function () {
        BI.holidays = {
            "2010-02-28": true,
            "2010-02-27": true
        };
    });

    /**
     * test_author_windy
     */
    it("defaultValue", function () {
        var dateCombo = BI.Test.createWidget({
            type: "bi.year_month_interval",
            value: {
                start: {
                    type: 2,
                    value: {
                        year: -1,
                        month: 1
                    }
                },
                end: {
                    type: 1,
                    value: {
                        year: 2018,
                        month: 1
                    }
                }
            }
        });
        expect(dateCombo.getValue()).eql({
            start: {
                type: 2,
                value: {
                    year: -1,
                    month: 1
                }
            },
            end: {
                type: 1,
                value: {
                    year: 2018,
                    month: 1
                }
            }
        });
        dateCombo.destroy();

    });

    /**
     * test_author_windy
     */
    it("setValue", function () {
        var dateCombo = BI.Test.createWidget({
            type: "bi.year_month_interval",
            width: 220,
            height: 30
        });
        dateCombo.setValue({
            start: {
                type: 2,
                value: {
                    year: -1,
                    month: 1
                }
            },
            end: {
                type: 1,
                value: {
                    year: 2018,
                    month: 1
                }
            }
        });
        expect(dateCombo.getValue()).eql({
            start: {
                type: 2,
                value: {
                    year: -1,
                    month: 1
                }
            },
            end: {
                type: 1,
                value: {
                    year: 2018,
                    month: 1
                }
            }
        });
        dateCombo.destroy();

    });

    /**
     * test_author_windy
     */
    it("错误提示", function (done) {
        var testText;
        var dateCombo = BI.Test.createWidget({
            type: "bi.year_month_interval",
            width: 220,
            height: 30,
            value: {
                start: {
                    type: 2,
                    value: {
                        year: -1,
                        month: 1
                    }
                },
                end: {
                    type: 1,
                    value: {
                        year: 2018,
                        month: 1
                    }
                }
            },
            listeners: [{
                eventName: "EVENT_ERROR",
                action: function () {
                    testText = "ERROR"
                }
            }]
        });
        dateCombo.element.find(".first-element .pull-down-font").click();
        BI.delay(function () {
            dateCombo.element.find(".bi-text-button:contains(确定)").click();
            expect(testText).to.equal("ERROR");
            dateCombo.destroy();
            done();
        }, 300);

    });
});