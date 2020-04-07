/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/6
 */

describe("DateTime", function () {

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
            type: "bi.date_time_combo",
            value: {
                year: 2018,
                month: 2,
                day: 23,
                hour: 12,
                minute: 12,
                second: 12
            }
        });
        expect(dateCombo.element.find(".bi-date-time-trigger .bi-label").text()).to.equal("2018-02-23 12:12:12");
        dateCombo.destroy();
    });

    /**
     * test_author_windy
     */
    it("点击确定选值", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.date_time_combo",
            value: {
                year: 2018,
                month: 2,
                day: 23,
                hour: 12,
                minute: 12,
                second: 12
            }
        });
        dateCombo.element.find(".bi-date-time-trigger").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-calendar:visible .bi-list-item-select :contains(16)").parent().click();
            dateCombo.element.find(".bi-date-time-popup .bi-text:contains(确定)").parent().click();
            expect(dateCombo.element.find(".bi-date-time-trigger .bi-label").text()).to.equal("2018-02-16 12:12:12");
            dateCombo.destroy();
            done();
        })
    });


    /**
     * test_author_windy
     */
    it("点击取消不选值", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.date_time_combo",
            value: {
                year: 2018,
                month: 2,
                day: 23,
                hour: 12,
                minute: 12,
                second: 12
            }
        });
        dateCombo.element.find(".bi-date-time-trigger").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-calendar:visible .bi-list-item-select :contains(16)").parent().click();
            dateCombo.element.find(".bi-date-time-popup .bi-text:contains(取消)").parent().click();
            expect(dateCombo.element.find(".bi-date-time-trigger .bi-label").text()).to.equal("2018-02-23 12:12:12");
            dateCombo.destroy();
            done();
        })
    });
});