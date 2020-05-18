/**
 * @author Kobi
 * @date 2020/5/12
 */

describe("test node.mid.plus", function () {

    /**
     *   test_author_kobi
     **/
    it("doRedMark 和 unRedMark", function () {
        var widget = BI.Test.createWidget({
            type: "bi.mid_plus_group_node",
            text: "要标红的AAA",
        });
        widget.doRedMark("AAA");
        expect(widget.element.find(".bi-keyword-red-mark").length).to.not.equal(0);
        widget.unRedMark();
        expect(widget.element.find(".bi-keyword-red-mark").length).to.equal(0);
        widget.destroy();
    });

    /**
     *   test_author_kobi
     **/
    it("doClick", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.mid_plus_group_node",
            text: "AAA",
        });
        BI.nextTick(function () {
            widget.element.click();
            expect(widget.element.find(".tree-expand-icon-type3").length).to.not.equal(0);
            BI.delay(function () {
                BI.nextTick(function () {
                    widget.element.click();
                    expect(widget.element.find(".tree-expand-icon-type3").length).to.equal(0);
                    widget.destroy();
                    done();
                });
            }, 300);
        });
    });

    /**
     *   test_author_kobi
     **/
    it("点击图标", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.mid_plus_group_node",
            text: "AAA",
        });
        BI.nextTick(function () {
            widget.checkbox.element.click();
            expect(widget.element.find(".tree-expand-icon-type3").length).to.not.equal(0);
            BI.delay(function () {
                BI.nextTick(function () {
                    widget.checkbox.element.click();
                    expect(widget.element.find(".tree-expand-icon-type3").length).to.equal(0);
                    widget.destroy();
                    done();
                });
            }, 300);
        });
    });
});
