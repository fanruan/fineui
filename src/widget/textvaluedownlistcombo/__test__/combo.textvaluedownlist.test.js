/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/2/17
 */

describe("TextValueDownListCombo", function () {

    /**
     * test_author_windy
     */
    it("defaultValue", function () {
        var downListCombo = BI.Test.createWidget({
            type: "bi.text_value_down_list_combo",
            adjustLength: 10,
            items: [[{
                text: "属于",
                value: 1,
                cls: "dot-e-font"
            }, {
                text: "不属于",
                value: 2,
                cls: "dot-e-font"
            }], [{
                el: {
                    text: "大于",
                    value: 3,
                    iconCls1: "dot-e-font"
                },
                value: 3,
                children: [{
                    text: "固定值",
                    value: 4,
                    cls: "dot-e-font"
                }, {
                    text: "平均值",
                    value: 5,
                    cls: "dot-e-font"
                }]
            }]]
        });
        downListCombo.setValue(2);
        expect(downListCombo.getValue()[0]).to.deep.equal(2);
        downListCombo.destroy();
    });


    /**
     * test_author_windy
     */
    it("点击父亲选值", function (done) {
        var downListCombo = BI.Test.createWidget({
            type: "bi.text_value_down_list_combo",
            height: 30,
            width: 300,
            items: [[{
                text: "属于",
                value: 1,
                cls: "dot-e-font"
            }, {
                text: "不属于",
                value: 2,
                cls: "dot-e-font"
            }], [{
                el: {
                    text: "大于",
                    value: 3,
                    iconCls1: "dot-e-font"
                },
                value: 3,
                children: [{
                    text: "固定值",
                    value: 4,
                    cls: "dot-e-font"
                }, {
                    text: "平均值",
                    value: 5,
                    cls: "dot-e-font"
                }]
            }]]
        });
        downListCombo.element.find(".pull-down-font").click();
        BI.nextTick(function () {
            downListCombo.element.find(".bi-down-list-group:first-child .bi-down-list-item").click();
            expect(downListCombo.getValue()[0]).to.deep.equal(2);
            downListCombo.destroy();
            done();
        });
    });


    /**
     * test_author_windy
     */
    it("点击儿子选值", function (done) {
        var downListCombo = BI.Test.createWidget({
            type: "bi.text_value_down_list_combo",
            height: 30,
            width: 30,
            items: [[{
                text: "属于",
                value: 1,
                cls: "dot-e-font"
            }, {
                text: "不属于",
                value: 2,
                cls: "dot-e-font"
            }], [{
                el: {
                    text: "大于",
                    value: 3,
                    iconCls1: "dot-e-font"
                },
                value: 3,
                children: [{
                    text: "固定值",
                    value: 4,
                    cls: "dot-e-font"
                }, {
                    text: "平均值",
                    value: 5,
                    cls: "dot-e-font"
                }]
            }]]
        });
        downListCombo.element.find(".pull-down-font").click();
        BI.Test.triggerMouseover(downListCombo.element.find(".bi-down-list-group:last-child .bi-down-list-group-item"), function () {
            BI.nextTick(function () {
                downListCombo.element.find(".child-down-list-item:first-child").click();
                expect(downListCombo.getValue()[0]).to.deep.equal(4);
                downListCombo.destroy();
                done();
            });
        });
    });
});