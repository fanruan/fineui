/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/4
 */

describe("DateCombo", function () {

    /**
     * test_author_windy
     */
    it("defaultValue", function () {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_combo",
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23
                }
            }
        });
        expect(dateCombo.element.find(".bi-date-trigger .bi-label").text()).to.equal("2018-02-23");
        dateCombo.destroy();
    });

    /**
     * test_author_windy
     */
    it("测试输入值收起下拉清空值下拉出现", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23
                }
            }
        });
        BI.nextTick(function () {
            dateCombo.element.find(".bi-date-trigger .bi-basic-button").click();
            // 输入8, 检查popup是否收起
            BI.Test.triggerKeyDown(dateCombo.element.find(".bi-date-trigger .bi-input"), "8", 56, function () {
                BI.nextTick(function () {
                    expect(dateCombo.element.find(".bi-date-trigger + .bi-popup-view").css("display")).to.equal("none");
                    // 清空输入, 检查popup是否弹出
                    BI.Test.triggerKeyDown(dateCombo.element.find(".bi-date-trigger .bi-input"), "", BI.KeyCode.BACKSPACE, function () {
                        BI.nextTick(function () {
                            expect(dateCombo.element.find(".bi-date-trigger + .bi-popup-view").css("display")).to.equal("block");
                            dateCombo.destroy();
                            done();
                        });
                    });
                });
            });
        });

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
        dateCombo.element.find(".bi-date-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-calendar:visible .bi-list-item-select :contains(5)").parent().click();
            expect(dateCombo.element.find(".bi-date-trigger + .bi-popup-view").css("display")).to.equal("none");
            dateCombo.destroy();
            done();
        })

    });


    /**
     * test_author_windy
     */
    it("trigger的输入日期后confirm", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23
                }
            }
        });
        BI.nextTick(function () {
            dateCombo.element.find(".bi-date-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                var input = dateCombo.element.find(".bi-date-trigger .bi-input");
                input.val("2017-1-1");
                BI.Test.triggerKeyDown(dateCombo.element.find(".bi-date-trigger .bi-input"), null, BI.KeyCode.ENTER, function () {
                    BI.delay(function () {
                        expect(dateCombo.element.find(".bi-date-trigger .bi-text-button").text()).to.equal("2017-01-01");
                        dateCombo.destroy();
                        done();
                    }, 300);
                });
            });
        })

    });
});