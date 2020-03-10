/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/3
 */

describe("color_chooser_test", function () {

    /**
     *   test_author_windy
     **/
    it("setValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.color_chooser",
            height: 24
        });
        widget.setValue("#69821b");
        expect(widget.getValue()).to.equal("#69821b");
        widget.destroy();
    });

    /**
     *  test_author_windy
     **/
    it("点选选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.color_chooser",
            height: 24
        });
        widget.element.find(".bi-color-chooser-trigger").click();
        BI.delay(function () {
            // 等300ms, button有debounce
            widget.element.find(".bi-color-picker .bi-color-picker-button:nth-child(3)").click();
            expect(widget.getValue()).to.equal("#e5e5e5");
            widget.destroy();
            done();
        }, 300);
    });

    /**
     *  test_author_windy
     **/
    it("默认值", function () {
        var widget = BI.Test.createWidget({
            type: "bi.color_chooser",
            height: 24,
            value: "#69821b"
        });
        expect(widget.getValue()).to.equal("#69821b");
        widget.destroy();
    });
});