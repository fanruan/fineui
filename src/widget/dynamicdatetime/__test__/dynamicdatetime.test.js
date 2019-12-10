/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/4
 */

describe("DateTimeCombo", function () {

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
            type: "bi.dynamic_date_time_combo",
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23,
                    hour: 12,
                    minute: 12,
                    second: 12
                }
            }
        });
        BI.nextTick(function () {
            expect(dateCombo.element.find(".bi-date-time-trigger .bi-label").text()).to.equal("2018-02-23 12:12:12");
            dateCombo.destroy();
            done();
        })
    });

    /**
     * test_author_windy
     */
    it("测试输入值收起下拉清空值下拉出现", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_time_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23,
                    hour: 12,
                    minute: 12,
                    second: 12
                }
            }
        });
        BI.nextTick(function () {
            dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
            // 输入8, 检查popup是否收起
            BI.Test.triggerKeyDown(dateCombo.element.find(".bi-date-time-trigger .bi-input"), "8", 56, function () {
                BI.nextTick(function () {
                    expect(dateCombo.element.find(".bi-date-time-trigger + .bi-popup-view").length).to.equal(0);
                    // 清空输入, 检查popup是否弹出
                    BI.Test.triggerKeyDown(dateCombo.element.find(".bi-date-time-trigger .bi-input"), "", BI.KeyCode.BACKSPACE, function () {
                        BI.nextTick(function () {
                            expect(dateCombo.element.find(".bi-date-time-trigger + .bi-popup-view").css("display")).to.equal("block");
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
            type: "bi.dynamic_date_time_combo",
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
            type: "bi.dynamic_date_time_combo",
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
                        expect(dateCombo.element.find(".bi-date-time-trigger + .bi-popup-view").length).to.equal(0);
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
            type: "bi.dynamic_date_time_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23,
                    hour: 12,
                    minute: 12,
                    second: 12
                }
            }
        });
        dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-dynamic-date-time-popup .bi-text:contains(清除)").parent().click();
            expect(BI.isNull(dateCombo.getValue())).to.equal(true);
            dateCombo.destroy();
            done();
        })
    });

    /**
     * test_author_windy
     */
    it("点击今天", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_time_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23,
                    hour: 12,
                    minute: 12,
                    second: 12
                }
            }
        });
        dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-dynamic-date-time-popup .bi-text:contains(今天)").parent().click();
            var date = BI.getDate();
            expect(dateCombo.getValue()).to.deep.equal({
                type: 1,
                value: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                    hour: 0,
                    minute: 0,
                    second: 0
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
            type: "bi.dynamic_date_time_combo",
            width: 220,
            height: 30,
            value: {
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23,
                    hour: 12,
                    minute: 12,
                    second: 12
                }
            }
        });
        dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            dateCombo.element.find(".bi-dynamic-date-time-popup .bi-text:contains(确定)").parent().click();
            expect(dateCombo.getValue()).to.deep.equal({
                type: 1,
                value: {
                    year: 2018,
                    month: 2,
                    day: 23,
                    hour: 12,
                    minute: 12,
                    second: 12
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
            type: "bi.dynamic_date_time_combo",
            width: 220,
            height: 30,
            value: {
                type: 2,
                value: {
                    year: -1,
                    month: 1,
                    quarter: -1,
                    week: 1,
                    day: -1,
                    position: 2
                }
            }
        });
        dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
        expect(dateCombo.getValue()).to.deep.equal({
            type: 2,
            value: {
                year: -1,
                month: 1,
                quarter: -1,
                week: 1,
                day: -1,
                position: 2
            }
        });
        dateCombo.destroy();
    });

    /**
     * test_author_windy
     */
    it("测试工作日动态默认值", function () {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_time_combo",
            width: 220,
            height: 30,
            value: {
                type: 2,
                value: {
                    workDay: -1
                }
            }
        });
        expect(dateCombo.getValue()).to.deep.equal({
            type: 2,
            value: {
                workDay: -1
            }
        });
        dateCombo.destroy();
    });


    /**
     * test_author_windy
     */
    it("trigger的输入日期后confirm", function (done) {
        var dateCombo = BI.Test.createWidget({
            type: "bi.dynamic_date_time_combo",
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
            dateCombo.element.find(".bi-date-time-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                var input = dateCombo.element.find(".bi-date-time-trigger .bi-input");
                input.val("2017-1-1");
                BI.Test.triggerKeyDown(dateCombo.element.find(".bi-date-time-trigger .bi-input"), null, BI.KeyCode.ENTER, function () {
                    BI.delay(function () {
                        expect(dateCombo.element.find(".bi-date-time-trigger .bi-text-button").text()).to.equal("2017-01-01 00:00:00");
                        dateCombo.destroy();
                        done();
                    }, 300);
                });
            });
        })

    });
});