/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/27
 */

describe("NumberInterval", function () {

    /**
     * test_author_windy
     */
    it("setValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.number_interval",
        });
        widget.setValue({
            max: 10,
            min: 2,
            closeMin: true,
            closeMax: true
        });
        expect(widget.getValue()).to.deep.equal({
            max: "10",
            min: "2",
            closeMin: true,
            closeMax: true
        });
        widget.destroy();
    });

    /**
     * test_author_windy
     */
    it("defaultValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.number_interval",
            max: 10,
            min: 2,
            closeMin: true,
            closeMax: true
        });
        expect(widget.getValue()).to.deep.equal({
            max: "10",
            min: "2",
            closeMin: true,
            closeMax: true
        });
        widget.destroy();
    });

    /**
     * test_author_windy
     */
    it("输入报错单editor输入不合法报错", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.number_interval",
            width: 200,
            height: 24
        });
        widget.element.find(".number-interval-small-editor .bi-input").click();
        BI.Test.triggerKeyDown(widget.element.find(".number-interval-small-editor .bi-input"), "A", 65, function () {
            expect(widget.element.children(".bi-tip").length).to.not.equal(0);
            widget.destroy();
            done();
        });
    });


    /**
     * test_author_windy
     */
    it("输入报错区间不合法报错", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.number_interval",
            width: 200,
            height: 24
        });
        widget.element.find(".number-interval-small-editor .bi-input").click();
        BI.Test.triggerKeyDown(widget.element.find(".number-interval-small-editor .bi-input"), "2", 50, function () {
            widget.element.find(".number-interval-big-editor .bi-input").click();
            BI.Test.triggerKeyDown(widget.element.find(".number-interval-big-editor .bi-input"), "1", 49, function () {
                expect(widget.element.children(".bi-tip").length).to.not.equal(0);
                widget.destroy();
                done();
            });
        });
    });
});