/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/12/23
 */

describe("YearQuarterCombo", function () {

    before(function () {
        BI.holidays = {
            "2010-02-28": true,
            "2010-02-27": true
        };
    });

    /**
     * test_author_windy
     */
    it("defaultValue", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_quarter_combo",
            value: {
                type: 1,
                value: {
                    year: 2018,
                    quarter: 1
                }
            }
        });
        BI.nextTick(function () {
            expect(dateCombo.element.find(".bi-year-quarter-trigger .bi-center-layout:first-child .bi-label").text()).to.equal("2018年1季度");
            dateCombo.destroy();
            done();
        });

    });

    /**
     * test_author_windy
     */
    it("测试输入值收起下拉清空值下拉出现", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_quarter_combo",
            width: 220,
            height: 30
        });
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-quarter-trigger .bi-basic-button").click();
            // 输入8, 检查popup是否收起
            BI.Test.triggerKeyDown(dateCombo.element.find(".bi-year-quarter-trigger .bi-input"), "4", 52, function () {
                BI.nextTick(function () {
                    expect(dateCombo.element.find(".bi-year-quarter-trigger + .bi-popup-view").css("display")).to.equal("none");
                    // 清空输入, 检查popup是否弹出
                    BI.Test.triggerKeyDown(dateCombo.element.find(".bi-year-quarter-trigger .bi-input"), "", BI.KeyCode.BACKSPACE, function () {
                        BI.nextTick(function () {
                            expect(dateCombo.element.find(".bi-year-quarter-trigger + .bi-popup-view").css("display")).to.equal("block");
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
            type: "bi.dynamic_year_quarter_combo",
            width: 220,
            height: 30
        });
        // 点击日期，是否收起下拉
        dateCombo.element.find(".bi-year-quarter-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-static-year-quarter-card .bi-list-item-select:first-child").click();
            expect(dateCombo.element.find(".bi-year-quarter-trigger + .bi-popup-view").css("display")).to.equal("none");
            dateCombo.destroy();
            done();
        })

    });

    /**
     * test_author_windy
     */
    it("下拉后直接点击外部的触发的confirm", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_quarter_combo",
            width: 220,
            height: 30,
        });
        // 点击日期，是否收起下拉
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-quarter-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                $("body").mousedown();
                BI.delay(function () {
                    expect(dateCombo.element.find(".bi-year-quarter-trigger + .bi-popup-view").css("display")).to.equal("none");
                    dateCombo.destroy();
                    done();
                }, 300);
            })
        });
    });


    /**
     * test_author_windy
     */
    it("点击清空", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_quarter_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    quarter: 1
                }
            }
        });
        dateCombo.element.find(".bi-year-quarter-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-quarter-popup .bi-text:contains(清除)").parent().click();
            expect(BI.isNull(dateCombo.getValue())).to.equal(true);
            dateCombo.destroy();
            done();
        })
    });

    /**
     * test_author_windy
     */
    it("点击本季度", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_quarter_combo",
            width: 220,
            height: 30
        });
        dateCombo.element.find(".bi-year-quarter-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-quarter-popup .bi-text:contains(本季度)").parent().click();
            var date = BI.getDate();
            expect(dateCombo.getValue()).to.deep.equal({
                type: 1,
                value: {
                    year: date.getFullYear(),
                    quarter: BI.getQuarter(date)
                }
            });
            dateCombo.destroy();
            done();
        })
    });


    /**
     * test_author_windy
     */
    it("点击确定", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_quarter_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    quarter: 1
                }
            }
        });
        dateCombo.element.find(".bi-year-quarter-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-quarter-popup .bi-text:contains(确定)").parent().click();
            expect(dateCombo.getValue()).to.deep.equal({
                type: 1,
                value: {
                    year: 2018,
                    quarter: 1
                }
            });
            dateCombo.destroy();
            done();
        })
    });

    /**
     * test_author_windy
     */
    it("测试动态默认值", function () {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_quarter_combo",
            width: 220,
            height: 30,
            value: {
                type: 2,
                value: {
                    year: -1,
                    quarter: -1
                }
            }
        });
        expect(dateCombo.getValue()).to.deep.equal({
            type: 2,
            value: {
                year: -1,
                quarter: -1
            }
        });
        dateCombo.destroy();
    });


    /**
     * test_author_windy
     */
    it("trigger的输入日期后confirm", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_quarter_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    quarter: 1
                }
            }
        });
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-quarter-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                var input = dateCombo.element.find(".bi-year-quarter-trigger .bi-input");
                input.val("2");
                BI.Test.triggerKeyDown(dateCombo.element.find(".bi-year-quarter-trigger .bi-input"), null, BI.KeyCode.ENTER, function () {
                    BI.delay(function () {
                        expect(dateCombo.element.find(".bi-year-quarter-trigger .bi-text-button").text()).to.equal("2018年2季度");
                        dateCombo.destroy();
                        done();
                    }, 300);
                });
            });
        })

    });
});