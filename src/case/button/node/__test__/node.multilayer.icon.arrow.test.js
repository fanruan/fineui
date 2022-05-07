/**
 * @author Kobi
 * @date 2020/5/12
 */

describe("test node.multilayer.icon.arrow", function () {

    /**
     *   test_author_kobi
     **/
    it("doRedMark 和 unRedMark", function () {
        var widget = BI.Test.createWidget({
            type: "bi.multilayer_icon_arrow_node",
            text: "要标红的AAA",
            layer: 3,
        });
        expect(widget.isOnce()).to.equal(true);
        widget.doRedMark("AAA");
        expect(widget.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        widget.unRedMark();
        expect(widget.element.find(".bi-keyword-red-mark").length).to.equal(0);
        widget.destroy();
    });

    /**
     *   test_author_kobi
     **/
    it("isSelected 和 setSelected", function () {
        var widget = BI.Test.createWidget({
            type: "bi.multilayer_icon_arrow_node",
            text: "AAA",
            layer: 3,
        });
        widget.setSelected(true);
        expect(widget.element.find(".active").length).to.not.equal(0);
        expect(widget.isSelected()).to.equal(true);
        widget.destroy();
    });

    /**
     *   test_author_kobi
     **/
    it("doClick", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multilayer_icon_arrow_node",
            text: "AAA",
            layer: 3,
        });
        BI.nextTick(function () {
            widget.element.click();
            expect(widget.isSelected()).to.equal(true);
            widget.destroy();
            done();
        });
    });

    /**
     *   test_author_kobi
     **/
    it("点击图标", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multilayer_icon_arrow_node",
            text: "AAA",
            layer: 3,
        });
        BI.nextTick(function () {
            widget.node.element.click();
            expect(widget.element.find(".expander-down-font").length).to.not.equal(0);
            widget.destroy();
            done();
        });
    });
});
