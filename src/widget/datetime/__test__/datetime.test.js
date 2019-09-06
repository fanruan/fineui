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
        expect(dateCombo.element.find(".bi-date-time-trigger .bi-label").text()).to.equal("2018-02-23 12:12:12");
        dateCombo.destroy();
    });

    /**
     * test_author_windy
     */
    it("trigger的confirm-下拉面板选值confirm", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_combo",
            width: 220,
            height: 30
        });
        // 点击日期，是否收起下拉
        dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-calendar:visible .bi-list-item-select :contains(5)").parent().click();
            expect(dateCombo.element.find(".bi-date-time-trigger + .bi-popup-view").css("display")).to.equal("block");
            dateCombo.destroy();
            done();
        })

    });

    /**
     * test_author_windy
     */
    it("下拉后直接点击外部的触发的confirm", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_combo",
            width: 220,
            height: 30,
        });
        // 点击日期，是否收起下拉
        BI.nextTick(function () {
            dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                var input = dateCombo.element.find(".bi-date-time-trigger .bi-input");
                BI.Test.triggerKeyDown(input, null, BI.KeyCode.ENTER, function () {
                    BI.delay(function () {
                        expect(dateCombo.element.find(".bi-date-time-trigger + .bi-popup-view").css("display")).to.equal("none");
                        dateCombo.destroy();
                        done();
                    }, 300);
                });
            })
        });
    });


    /**
     * test_author_windy
     */
    it("点击确定", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_combo",
            width: 220,
            height: 30,
            value: {
                year: 2018,
                month: 2,
                day: 23
            }
        });
        dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-dynamic-date-popup .bi-text:contains(确定)").parent().click();
            expect(dateCombo.getValue()).to.deep.equal({
                year: 2018,
                month: 2,
                day: 23
            });
            dateCombo.destroy();
            done();
        })
    });
});