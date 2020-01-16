/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/1/14
 */

describe("YearCombo", function () {

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
            type: "bi.dynamic_year_combo",
            value: {
                type: 1,
                value: {
                    year: 2018
                }
            }
        });
        BI.nextTick(function () {
            expect(dateCombo.element.find(".bi-year-trigger .bi-label").text()).to.equal("2018年");
            dateCombo.destroy();
            done();
        });

    });

    /**
     * test_author_windy
     */
    it("测试输入值收起下拉清空值下拉出现", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_combo",
            width: 220,
            height: 30
        });
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-trigger .bi-basic-button").click();
            // 输入8, 检查popup是否收起
            BI.Test.triggerKeyDown(dateCombo.element.find(".bi-year-trigger .bi-input"), "2", 50, function () {
                BI.nextTick(function () {
                    expect(dateCombo.element.find(".bi-year-trigger + .bi-popup-view").css("display")).to.equal("none");
                    // 清空输入, 检查popup是否弹出
                    BI.Test.triggerKeyDown(dateCombo.element.find(".bi-year-trigger .bi-input"), "", BI.KeyCode.BACKSPACE, function () {
                        BI.nextTick(function () {
                            expect(dateCombo.element.find(".bi-year-trigger + .bi-popup-view").css("display")).to.equal("block");
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
            type: "bi.dynamic_year_combo",
            width: 220,
            height: 30
        });
        // 点击日期，是否收起下拉
        dateCombo.element.find(".bi-year-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-card .bi-list-item-select:first-child").click();
            expect(dateCombo.element.find(".bi-year-trigger + .bi-popup-view").css("display")).to.equal("none");
            dateCombo.destroy();
            done();
        })

    });

    /**
     * test_author_windy
     */
    it("下拉后直接点击外部的触发的confirm", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_combo",
            width: 220,
            height: 30,
        });
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                var input = dateCombo.element.find(".bi-year-trigger .bi-input");
                BI.Test.triggerKeyDown(input, null, BI.KeyCode.ENTER, function () {
                    BI.delay(function () {
                        expect(dateCombo.element.find(".bi-year-trigger + .bi-popup-view").css("display")).to.equal("none");
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
    it("点击清空", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 1
                }
            }
        });
        dateCombo.element.find(".bi-year-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-popup .bi-text:contains(清除)").parent().click();
            expect(BI.isNull(dateCombo.getValue())).to.equal(true);
            dateCombo.destroy();
            done();
        })
    });

    /**
     * test_author_windy
     */
    it("点击本年", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_combo",
            width: 220,
            height: 30
        });
        dateCombo.element.find(".bi-year-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-popup .bi-text:contains(今年)").parent().click();
            var date = BI.getDate();
            expect(dateCombo.getValue()).to.deep.equal({
                type: 1,
                value: {
                    year: date.getFullYear()
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
            type: "bi.dynamic_year_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018
                }
            }
        });
        dateCombo.element.find(".bi-year-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-popup .bi-text:contains(确定)").parent().click();
            expect(dateCombo.getValue()).to.deep.equal({
                type: 1,
                value: {
                    year: 2018
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
            type: "bi.dynamic_year_combo",
            width: 220,
            height: 30,
            value: {
                type: 2,
                value: {
                    year: -1
                }
            }
        });
        expect(dateCombo.getValue()).to.deep.equal({
            type: 2,
            value: {
                year: -1
            }
        });
        dateCombo.destroy();
    });


    /**
     * test_author_windy
     */
    it("trigger的输入日期后confirm", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_year_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018
                }
            }
        });
        BI.nextTick(function () {
            dateCombo.element.find(".bi-year-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                var input = dateCombo.element.find(".bi-year-trigger .bi-input");
                input.val("2017");
                BI.Test.triggerKeyDown(dateCombo.element.find(".bi-year-trigger .bi-input"), null, BI.KeyCode.ENTER, function () {
                    BI.delay(function () {
                        expect(dateCombo.element.find(".bi-year-trigger .bi-text-button").text()).to.equal("2017");
                        dateCombo.destroy();
                        done();
                    }, 300);
                });
            });
        })

    });
});