/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/5/8
 */
describe("leafTest", function () {

    /**
     * test_author_windy
     */
    it("标红与高亮", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.first_tree_leaf_item",
            id: "1",
            pId: "-1",
            layer: 0,
            height: 24,
            text: "ABC",
            keyword: "B"
        });
        textNode.doRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        textNode.unRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        textNode.doHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.not.equal(0);
        textNode.unHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.equal(0);
        textNode.destroy();
    });

    /**
     * test_author_windy
     */
    it("function", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.first_tree_leaf_item",
            id: "1",
            pId: "-1"
        });
        expect(textNode.getId()).to.equal("1");
        expect(textNode.getPId()).to.equal("-1");
        textNode.destroy();
    });


    /**
     * test_author_windy
     */
    it("标红与高亮1", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.last_tree_leaf_item",
            id: "1",
            pId: "-1",
            layer: 0,
            height: 24,
            text: "ABC",
            keyword: "B"
        });
        textNode.doRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        textNode.unRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        textNode.doHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.not.equal(0);
        textNode.unHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.equal(0);
        textNode.destroy();
    });

    /**
     * test_author_windy
     */
    it("function1", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.last_tree_leaf_item",
            id: "1",
            pId: "-1"
        });
        expect(textNode.getId()).to.equal("1");
        expect(textNode.getPId()).to.equal("-1");
        textNode.destroy();
    });


    /**
     * test_author_windy
     */
    it("标红与高亮12", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.mid_tree_leaf_item",
            id: "1",
            pId: "-1",
            layer: 0,
            height: 24,
            text: "ABC",
            keyword: "B"
        });
        textNode.doRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        textNode.unRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        textNode.doHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.not.equal(0);
        textNode.unHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.equal(0);
        textNode.destroy();
    });

    /**
     * test_author_windy
     */
    it("function12", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.mid_tree_leaf_item",
            id: "1",
            pId: "-1"
        });
        expect(textNode.getId()).to.equal("1");
        expect(textNode.getPId()).to.equal("-1");
        textNode.destroy();
    });

    /**
     * test_author_windy
     */
    it("标红与高亮123", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.icon_tree_leaf_item",
            id: "1",
            pId: "-1",
            layer: 0,
            height: 24,
            text: "ABC",
            keyword: "B"
        });
        textNode.doRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        textNode.unRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        textNode.doHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.not.equal(0);
        textNode.unHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.equal(0);
        textNode.destroy();
    });

    /**
     * test_author_windy
     */
    it("function123", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.icon_tree_leaf_item",
            id: "1",
            pId: "-1"
        });
        expect(textNode.getId()).to.equal("1");
        expect(textNode.getPId()).to.equal("-1");
        textNode.destroy();
    });


    /**
     * test_author_windy
     */
    it("标红与高亮1234", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.multilayer_icon_tree_leaf_item",
            id: "1",
            pId: "-1",
            layer: 0,
            height: 24,
            text: "ABC",
            keyword: "B"
        });
        textNode.doRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        textNode.unRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        textNode.doHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.not.equal(0);
        textNode.unHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.equal(0);
        textNode.destroy();
    });

    /**
     * test_author_windy
     */
    it("function1234", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.multilayer_icon_tree_leaf_item",
            id: "1",
            pId: "-1"
        });
        expect(textNode.getId()).to.equal("1");
        expect(textNode.getPId()).to.equal("-1");
        textNode.destroy();
    });


    /**
     * test_author_windy
     */
    it("标红与高亮12345", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.tree_text_leaf_item",
            id: "1",
            pId: "-1",
            layer: 0,
            height: 24,
            text: "ABC",
            keyword: "B"
        });
        textNode.doRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        textNode.unRedMark("C");
        expect(textNode.element.find(".bi-keyword-red-mark").length).to.equal(0);
        textNode.doHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.not.equal(0);
        textNode.unHighLight("C");
        expect(textNode.element.find(".bi-high-light").length).to.equal(0);
        textNode.destroy();
    });

    /**
     * test_author_windy
     */
    it("function12345", function () {
        var textNode = BI.Test.createWidget({
            type: "bi.tree_text_leaf_item",
            id: "1",
            pId: "-1"
        });
        expect(textNode.getId()).to.equal("1");
        expect(textNode.getPId()).to.equal("-1");
        textNode.destroy();
    });

});