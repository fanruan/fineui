/**
 * @author Kobi
 * @date 2020/4/21
 */

describe("TextIconNodeTest", function () {

    it("setText", function () {
        var textIconNode = BI.Test.createWidget({
            type: "bi.text_icon_node"
        });
        textIconNode.setText("AAA");
        expect(textIconNode.element.find(".bi-text").text()).to.equal("AAA");
        textIconNode.destroy();
    });

    it("getText", function () {
        var textIconNode = BI.Test.createWidget({
            type: "bi.text_icon_node",
            text: "AAA",
        });
        expect(textIconNode.getText()).to.equal("AAA");
        textIconNode.destroy();
    });

    it("setValue", function () {
        var textIconNode = BI.Test.createWidget({
            type: "bi.text_icon_node"
        });
        textIconNode.setValue("AAA");
        expect(textIconNode.element.find(".bi-text").text()).to.equal("AAA");
        textIconNode.destroy();
    });

    it("readonly下的setValue", function () {
        var textIconNode = BI.Test.createWidget({
            type: "bi.text_icon_node",
            value: "AAA",
            readonly: true
        });
        textIconNode.setValue("BBB");
        expect(textIconNode.element.find(".bi-text").text()).to.equal("AAA");
        textIconNode.destroy();
    });

    it("getValue", function () {
        var textIconNode = BI.Test.createWidget({
            type: "bi.text_icon_node",
            value: "AAA"
        });
        expect(textIconNode.getValue()).to.equal("AAA");
        textIconNode.destroy();
    });

    it("doRedMark和unRedMark", function () {
        var textIconNode = BI.Test.createWidget({
            type: "bi.text_icon_node",
            text: "要标红的AAA",
        });
        textIconNode.doRedMark("AAA");
        expect(textIconNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        textIconNode.unRedMark();
        expect(textIconNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        textIconNode.destroy();
    });

    it("Click点击触发事件", function (done) {
        var textIconNode = BI.Test.createWidget({
            type: "bi.text_icon_node",
            text: "AAA",
            handler: function () {
                this.setText("click");
            }
        });
        BI.nextTick(function () {
            textIconNode.element.click();
            expect(textIconNode.element.find(".bi-text").text()).to.equal("click");
            textIconNode.destroy();
            done();
        });
    });

});
