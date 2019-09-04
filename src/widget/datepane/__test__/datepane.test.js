/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/2
 */

describe("DatePane", function () {

    /**
     * test_author_windy
     */
    it("defaultValue", function () {
        var datePane = BI.Test.createWidget({
            type: "bi.dynamic_date_pane",
            value: {
                type: 1,
                value: {
                    year: 2017,
                    month: 12,
                    day: 11
                }
            },
        });
        expect(datePane.element.find(".bi-year-combo .bi-label").text()).to.equal("2017");
        expect(datePane.element.find(".bi-month-combo .bi-label").text()).to.equal("12");
        expect(datePane.element.find(".bi-calendar .bi-list-item-select.active .bi-text").text()).to.equal("11");
        datePane.destroy();
    });

    /**
     * test_author_windy
     */
    it("setStaticValue", function () {
        var datePane = BI.Test.createWidget({
            type: "bi.dynamic_date_pane",
        });
        datePane.setValue({
            type: 1,
            value: {
                year: 2017,
                month: 12,
                day: 11
            }
        });
        expect(datePane.element.find(".bi-year-combo .bi-label").text()).to.equal("2017");
        expect(datePane.element.find(".bi-month-combo .bi-label").text()).to.equal("12");
        expect(datePane.element.find(".bi-calendar .bi-list-item-select.active .bi-text").text()).to.equal("11");
        datePane.destroy();
    });

    /**
     * test_author_windy
     */
    it("setDynamicValue", function () {
        var datePane = BI.Test.createWidget({
            type: "bi.dynamic_date_pane",
        });
        datePane.setValue({
            type: 2,
            value: {
                year: -1,
                month: 1,
                quarter: -1,
                week: 1,
                day: 1
            }
        });
        expect(datePane.element.find(".bi-line-segment-button.active").text()).to.equal("动态时间");

        datePane.setValue({
            type: 2,
            value: {
                workDay: 1
            }
        });
        expect(datePane.element.find(".bi-line-segment-button.active").text()).to.equal("动态时间");
        datePane.destroy();
    });

    /**
     * test_author_windy
     */
    it("getStaticValue", function (done) {
        var datePane = BI.Test.createWidget({
            type: "bi.dynamic_date_pane",
            value: {
                type: 1,
                value: {
                    year: 2019,
                    month: 3,
                    day: 30
                }
            }
        });
        BI.nextTick(function () {
            datePane.element.find(".bi-month-combo .bi-date-triangle-trigger").click();
            datePane.element.find(".bi-month-combo .bi-list-item-select").get(2).click();
            BI.nextTick(function () {
                datePane.element.find(".bi-calendar:visible .bi-list-item-select :contains(27)").parent().click();
                expect(datePane.getValue()).to.deep.equal({
                    type: 1,
                    value: {
                        year: 2019,
                        month: 2,
                        day: 27
                    }
                });
                datePane.destroy();
                done();
            })
        });
    });

    /**
     * test_author_windy
     */
    it("getDynamicValue", function (done) {
        var datePane = BI.Test.createWidget({
            type: "bi.dynamic_date_pane",
            value: {
                type: 2,
                value: {}
            }
        });
        BI.nextTick(function () {
            // 先点到静态时间再到动态时间
            datePane.element.find(".bi-linear-segment .bi-line-segment-button").get(0).click();
            datePane.element.find(".bi-linear-segment .bi-line-segment-button").get(1).click();
            BI.nextTick(function () {
                datePane.element.find(".bi-multi-select-item.active").click();
                datePane.element.find(".bi-multi-select-item").click();
                expect(datePane.getValue()).to.deep.equal({
                    type: 2,
                    value: {
                        workDay: -0
                    }
                });
                datePane.destroy();
                done();
            })
        });
    });
});
