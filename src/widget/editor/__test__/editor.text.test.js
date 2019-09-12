/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/9
 */
describe("textEditor", function () {

    /**
     * test_author_windy
     */
    it("defaultValue", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.text_editor",
            width: 300,
            value: "12345",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        expect(editor.element.find(".bi-water-mark").text()).to.equal("添加合法性判断");
        expect(editor.element.find(".bi-input").val()).to.equal("12345");
        editor.focus();
        BI.Test.triggerKeyDown(editor.element.find(".bi-input"), "8", 56, function () {
            expect(editor.element.find(".bi-bubble .bubble-text:first-child").text()).to.equal("长度必须大于4");
            editor.destroy();
            done();
        })
    });

    /**
     * test_author_windy
     */
    it("setValue", function () {
        var editor = BI.Test.createWidget({
            type: "bi.text_editor",
            width: 300,
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        editor.setValue("12345");
        expect(editor.element.find(".bi-input").val()).to.equal("12345");
        editor.destroy();
    });

    /**
     * test_author_windy
     */
    it("setErrorText", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.text_editor",
            width: 300,
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        editor.setErrorText("xin_error");
        editor.focus();
        BI.Test.triggerKeyDown(editor.element.find(".bi-input"), "8", 56, function () {
            expect(editor.element.find(".bi-bubble .bubble-text:first-child").text()).to.equal("xin_error");
            editor.destroy();
            done();
        });
    });

    /**
     * test_author_windy
     */
    it("setWatermark", function () {
        var editor = BI.Test.createWidget({
            type: "bi.text_editor",
            width: 300,
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        editor.setWaterMark("xin_water");
        expect(editor.element.find(".bi-water-mark").text()).to.equal("xin_water");
        editor.destroy();
    });

    /**
     * test_author_windy
     */
    it("getValue", function () {
        var editor = BI.Test.createWidget({
            type: "bi.text_editor",
            width: 300,
            value: "12346",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        expect(editor.getValue()).to.equal("12346");
        editor.destroy();
    });


    /**
     * test_author_windy
     */
    it("defaultValue1", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.small_text_editor",
            width: 300,
            value: "12345",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        expect(editor.element.find(".bi-water-mark").text()).to.equal("添加合法性判断");
        expect(editor.element.find(".bi-input").val()).to.equal("12345");
        editor.focus();
        BI.Test.triggerKeyDown(editor.element.find(".bi-input"), "8", 56, function () {
            expect(editor.element.find(".bi-bubble .bubble-text:first-child").text()).to.equal("长度必须大于4");
            editor.destroy();
            done();
        })
    });

    /**
     * test_author_windy
     */
    it("setValue1", function () {
        var editor = BI.Test.createWidget({
            type: "bi.small_text_editor",
            width: 300,
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        editor.setValue("12345");
        expect(editor.element.find(".bi-input").val()).to.equal("12345");
        editor.destroy();
    });


    /**
     * test_author_windy
     */
    it("getValue1", function () {
        var editor = BI.Test.createWidget({
            type: "bi.small_text_editor",
            width: 300,
            value: "12346",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        expect(editor.getValue()).to.equal("12346");
        editor.destroy();
    });

});