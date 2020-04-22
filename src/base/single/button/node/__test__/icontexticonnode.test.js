/**
 * @author Kobi
 * @date 2020/4/21
 */

describe("IconTextIconNodeTest", function () {

    /**
     * test_author_kobi
     */
    it("setText", function () {
        var iconTextIconNode = BI.Test.createWidget({
            type: "bi.icon_text_icon_node"
        });
        iconTextIconNode.setText("AAA");
        expect(iconTextIconNode.element.find(".bi-text").text()).to.equal("AAA");
        iconTextIconNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("getText", function () {
        var iconTextIconNode = BI.Test.createWidget({
            type: "bi.icon_text_icon_node",
            text: "AAA",
        });
        expect(iconTextIconNode.getText()).to.equal("AAA");
        iconTextIconNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("setValue", function () {
        var iconTextIconNode = BI.Test.createWidget({
            type: "bi.icon_text_icon_node"
        });
        iconTextIconNode.setValue("AAA");
        expect(iconTextIconNode.element.find(".bi-text").text()).to.equal("AAA");
        iconTextIconNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("readonly下的setValue", function () {
        var iconTextIconNode = BI.Test.createWidget({
            type: "bi.icon_text_icon_node",
            value: "AAA",
            readonly: true
        });
        iconTextIconNode.setValue("BBB");
        expect(iconTextIconNode.element.find(".bi-text").text()).to.equal("AAA");
        iconTextIconNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("getValue", function () {
        var iconTextIconNode = BI.Test.createWidget({
            type: "bi.icon_text_icon_node",
            value: "AAA"
        });
        expect(iconTextIconNode.getValue()).to.equal("AAA");
        iconTextIconNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("doRedMark和unRedMark", function () {
        var iconTextIconNode = BI.Test.createWidget({
            type: "bi.icon_text_icon_node",
            text: "要标红的AAA",
        });
        iconTextIconNode.doRedMark("AAA");
        expect(iconTextIconNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        iconTextIconNode.unRedMark();
        expect(iconTextIconNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        iconTextIconNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("Click点击触发事件", function (done) {
        var iconTextIconNode = BI.Test.createWidget({
            type: "bi.icon_text_icon_node",
            text: "AAA",
            handler: function () {
                this.setText("click");
            }
        });
        BI.nextTick(function () {
            iconTextIconNode.element.click();
            expect(iconTextIconNode.element.find(".bi-text").text()).to.equal("click");
            iconTextIconNode.destroy();
            done();
        });
    });

});
