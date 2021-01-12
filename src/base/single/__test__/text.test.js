/**
 * Created by windy on 2018/01/23.
 */
describe("TextTest", function () {

    /**
     * test_author_windy
     */
    it("setText", function () {
        var text = BI.Test.createWidget({
            type: "bi.text"
        });
        text.setText("AAA");
        expect(text.element.text()).to.equal("AAA");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("setStyle", function () {
        var text = BI.Test.createWidget({
            type: "bi.text"
        });
        text.setStyle({"color": "red"});
        expect(text.element.getStyle("color")).to.equal("rgb(255, 0, 0)");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("高亮doHighlight", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "AAA",
            highLight: true
        });
        expect(text.element.getStyle("color")).to.equal("rgb(54, 133, 242)");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("标红doRedMark", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "我是要标红的A",
            keyword: "A"
        });
        expect(text.element.children(".bi-keyword-red-mark").length).to.not.equal(0);
        text.destroy();
    });


    /**
     * test_author_windy
     */
    it("取消高亮undoHighlight", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "AAA",
            highLight: true
        });
        text.unHighLight();
        expect(text.element.getStyle("color")).to.not.equal("rgb(54, 133, 242)");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("取消标红undoRedMark", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "我是要标红的A",
            keyword: "A"
        });
        text.unRedMark();
        expect(text.element.children(".bi-keyword-red-mark").length).to.equal(0);
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("setValue", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            value: "AAA",
        });
        text.setValue("value");
        expect(text.element.text()).to.equal("value");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("gap测试", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "我是要标红的A",
            vgap: 10,
            hgap: 10
        });
        expect(text.element.css("padding")).to.equal("10px");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("空格测试", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "我是要标红的 A",
        });
        expect(text.element.text()).to.equal("我是要标红的 A");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("lineHeight和height", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "我是A",
            lineHeight: 12,
            height: 24
        });
        expect(text.element.css("height")).to.equal("24px");
        expect(text.element.css("line-height")).to.equal("12px");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("handler", function (done) {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "我是A",
            handler: function () {
                text.setText("handler");
            }
        });
        BI.nextTick(function () {
            text.text.element.click();
            expect(text.text.element.text()).to.equal("handler");
            text.destroy();
            done();
        });
    });

    /**
     * test_author_windy
     */
    it("text的value属性", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "",
            value: "aaaa"
        });
        expect(text.element.text()).to.equal("");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("text的value属性1", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            value: "aaaa"
        });
        expect(text.element.text()).to.equal("aaaa");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("text的value属性2", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: null,
            value: "aaaa"
        });
        expect(text.element.text()).to.equal("");
        text.destroy();
    });
});
