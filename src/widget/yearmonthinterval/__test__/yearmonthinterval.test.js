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
            type: "bi.dynamic_year_month_combo",
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
});