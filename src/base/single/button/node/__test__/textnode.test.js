/**
 * @author Kobi
 * @date 2020/4/21
 */

describe("TextNodeTest", function () {

    /**
     * test_author_kobi
     */
    it("setText", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.text_node"
        });
        textNode.setText("AAA");
        expect(textNode.element.children(".bi-text").text()).to.equal("AAA");
        textNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("getText", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.text_node",
            text: "AAA",
            whiteSpace: "normal"
        });
        expect(textNode.getText()).to.equal("AAA");
        textNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("setValue", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.text_node"
        });
        textNode.setValue("AAA");
        expect(textNode.element.children(".bi-text").text()).to.equal("AAA");
        textNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("readonly下的setValue", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.text_node",
            value: "AAA",
            readonly: true
        });
        textNode.setValue("BBB");
        expect(textNode.element.children(".bi-text").text()).to.equal("AAA");
        textNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("getValue", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.text_node",
            value: "AAA"
        });
        expect(textNode.getValue()).to.equal("AAA");
        textNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("doRedMark和unRedMark", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.text_node",
            text: "要标红的AAA",
        });
        textNode.doRedMark("AAA");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        textNode.unRedMark();
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        textNode.destroy();
    });

    /**
     * test_author_kobi
     */
    it("Click点击触发事件", function (done) {
        var textNode = BI.Test.createWidget({
            type: "bi.text_node",
            text: "AAA",
            handler: function () {
                this.setText("click");
            }
        });
        BI.nextTick(function () {
            textNode.element.click();
            expect(textNode.element.children(".bi-text").text()).to.equal("click");
            textNode.destroy();
            done();
        });
    });


});
