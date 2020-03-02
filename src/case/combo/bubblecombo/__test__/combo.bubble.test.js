/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/2
 */

describe("bubble_combo", function () {

    /**
     * test_author_windy
     */
    it("测试弹出收起", function (done) {
        var bubbleCombo = BI.Test.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 24
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.makeArray(100, {
                        type: "bi.text_item",
                        height: 24,
                        text: "item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                maxHeight: 200
            }
        });
        BI.nextTick(function () {
            bubbleCombo.element.find(".bi-button").click();
            expect(bubbleCombo.element.find(".bi-bubble-popup-view").css("display")).to.equal("block");
            bubbleCombo.destroy();
            done();
        })
    });

    /**
     * test_author_windy
     */
    it("测试弹出收起", function (done) {
        var bubbleCombo = BI.Test.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 24
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.makeArray(100, {
                        type: "bi.text_item",
                        height: 24,
                        text: "item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                maxHeight: 200
            }
        });
        BI.nextTick(function () {
            bubbleCombo.element.find(".bi-button").click();
            expect(bubbleCombo.element.find(".bi-bubble-popup-view").css("display")).to.equal("block");
            bubbleCombo.destroy();
            done();
        })
    });


    /**
     * test_author_windy
     */
    it("bubble_bar_popup_view", function (done) {
        var bubbleCombo = BI.Test.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 24
            },
            popup: {
                type: "bi.bubble_bar_popup_view",
                el: {
                    type: "bi.vertical",
                    height: 40
                }
            }
        });
        BI.nextTick(function () {
            bubbleCombo.element.find(".bi-button").click();
            expect(bubbleCombo.element.find(".bi-text:contains(确定)").length).to.equal(1);
            bubbleCombo.destroy();
            done();
        })
    });


    /**
     * test_author_windy
     */
    it("text_bubble_bar_popup_view", function (done) {
        var bubbleCombo = BI.Test.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 24
            },
            popup: {
                type: "bi.text_bubble_bar_popup_view",
                el: {
                    type: "bi.vertical",
                    height: 40
                }
            }
        });
        BI.nextTick(function () {
            bubbleCombo.element.find(".bi-button").click();
            expect(bubbleCombo.element.find(".bi-text:contains(确定)").length).to.equal(1);
            bubbleCombo.destroy();
            done();
        })
    });
});