/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/2/17
 */

describe("TimeCombo", function () {

    /**
     * test_author_windy
     */
    it("defaultValue", function (done) {
        var timeCombo = BI.Test.createWidget({
            type: "bi.time_combo",
            value: {
                hour: 12,
                minute: 0,
                second: 0
            },
            width: 300
        });
        BI.nextTick(function () {
            expect(timeCombo.element.find(".bi-time-trigger .bi-label").text()).to.equal("12:00:00");
            timeCombo.destroy();
            done();
        });
    });

    /**
     * test_author_windy
     */
    it("测试输入值收起下拉清空值下拉出现", function (done) {
        var timeCombo = BI.Test.createWidget({
            type: "bi.time_combo",
            allowEdit: true,
            value: {
                hour: 12,
                minute: 0,
                second: 0
            },
            width: 300
        });
        BI.nextTick(function () {
            timeCombo.element.find(".bi-time-trigger .bi-basic-button").click();
            // 输入8, 检查popup是否收起
            BI.Test.triggerKeyDown(timeCombo.element.find(".bi-time-trigger .bi-input"), "1", 49, function () {
                BI.nextTick(function () {
                    expect(timeCombo.element.find(".bi-time-trigger + .bi-popup-view").css("display")).to.equal("none");
                    // 清空输入, 检查popup是否弹出
                    BI.Test.triggerKeyDown(timeCombo.element.find(".bi-time-trigger .bi-input"), "", BI.KeyCode.BACKSPACE, function () {
                        BI.nextTick(function () {
                            expect(timeCombo.element.find(".bi-time-trigger + .bi-popup-view").css("display")).to.equal("block");
                            timeCombo.destroy();
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
    it("下拉后直接点击外部的触发的confirm", function (done) {
        var timeCombo = BI.Test.createWidget({
            type: "bi.time_combo",
            width: 220,
            height: 30,
        });
        // 点击日期，是否收起下拉
        BI.nextTick(function () {
            timeCombo.element.find(".bi-time-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                var input = timeCombo.element.find(".bi-time-trigger .bi-input");
                BI.Test.triggerKeyDown(input, null, BI.KeyCode.ENTER, function () {
                    BI.delay(function () {
                        expect(timeCombo.element.find(".bi-time-trigger + .bi-popup-view").css("display")).to.equal("none");
                        timeCombo.destroy();
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
        var timeCombo = BI.Test.createWidget({
            type: "bi.time_combo",
            width: 220,
            height: 30,
            value: {
                hour: 12,
                minute: 0,
                second: 0
            },
        });
        timeCombo.element.find(".bi-time-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            timeCombo.element.find(".bi-date-time-popup .bi-text:contains(清空)").parent().click();
            expect(BI.isNull(timeCombo.getValue())).to.equal(true);
            timeCombo.destroy();
            done();
        })
    });


    /**
     * test_author_windy
     */
    it("点击确定", function (done) {
        var timeCombo = BI.Test.createWidget({
            type: "bi.time_combo",
            width: 220,
            height: 30,
            value: {
                hour: 12,
                minute: 0,
                second: 0
            },
        });
        timeCombo.element.find(".bi-time-trigger .bi-basic-button").click();
        BI.nextTick(function () {
            timeCombo.element.find(".bi-date-time-popup .bi-text:contains(确定)").parent().click();
            expect(timeCombo.getValue()).to.deep.equal({
                hour: 12,
                minute: 0,
                second: 0
            });
            timeCombo.destroy();
            done();
        })
    });


    /**
     * test_author_windy
     */
    it("trigger的输入日期后confirm", function (done) {
        var timeCombo = BI.Test.createWidget({
            type: "bi.time_combo",
            width: 220,
            height: 30,
            value: {
                hour: 12,
                minute: 0,
                second: 0
            },
        });
        BI.nextTick(function () {
            timeCombo.element.find(".bi-time-trigger .bi-basic-button").click();
            BI.nextTick(function () {
                var input = timeCombo.element.find(".bi-time-trigger .bi-input");
                input.val("11:11:11");
                BI.Test.triggerKeyDown(timeCombo.element.find(".bi-time-trigger .bi-input"), null, BI.KeyCode.ENTER, function () {
                    BI.delay(function () {
                        expect(timeCombo.element.find(".bi-time-trigger .bi-text-button").text()).to.equal("11:11:11");
                        timeCombo.destroy();
                        done();
                    }, 300);
                });
            });
        })

    });
});