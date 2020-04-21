/**
 * @author Kobi
 * @date 2020/4/21
 */

describe("IconTextNodeTest", function () {

    it("setText", function () {
        var iconTextNode = BI.Test.createWidget({
            type: "bi.icon_text_node"
        });
        iconTextNode.setText("AAA");
        expect(iconTextNode.element.find(".bi-text").text()).to.equal("AAA");
        iconTextNode.destroy();
    });

    it("getText", function () {
        var iconTextNode = BI.Test.createWidget({
            type: "bi.icon_text_node",
            text: "AAA",
        });
        expect(iconTextNode.getText()).to.equal("AAA");
        iconTextNode.destroy();
    });

    it("setValue", function () {
        var iconTextNode = BI.Test.createWidget({
            type: "bi.icon_text_node"
        });
        iconTextNode.setValue("AAA");
        expect(iconTextNode.element.find(".bi-text").text()).to.equal("AAA");
        iconTextNode.destroy();
    });

    it("readonly下的setValue", function () {
        var iconTextNode = BI.Test.createWidget({
            type: "bi.icon_text_node",
            value: "AAA",
            readonly: true
        });
        iconTextNode.setValue("BBB");
        expect(iconTextNode.element.find(".bi-text").text()).to.equal("AAA");
        iconTextNode.destroy();
    });

    it("getValue", function () {
        var iconTextNode = BI.Test.createWidget({
            type: "bi.icon_text_node",
            value: "AAA"
        });
        expect(iconTextNode.getValue()).to.equal("AAA");
        iconTextNode.destroy();
    });

    it("doRedMark和unRedMark", function () {
        var iconTextNode = BI.Test.createWidget({
            type: "bi.icon_text_node",
            text: "要标红的AAA",
        });
        iconTextNode.doRedMark("AAA");
        expect(iconTextNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        iconTextNode.unRedMark();
        expect(iconTextNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        iconTextNode.destroy();
    });

    it("Click点击触发事件", function (done) {
        var iconTextNode = BI.Test.createWidget({
            type: "bi.icon_text_node",
            text: "AAA",
            handler: function () {
                this.setText("click");
            }
        });
        BI.nextTick(function () {
            iconTextNode.element.click();
            expect(iconTextNode.element.find(".bi-text").text()).to.equal("click");
            iconTextNode.destroy();
            done();
        });
    });

});
