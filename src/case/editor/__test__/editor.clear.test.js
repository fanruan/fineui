/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/5/13
 */
describe("clear_editor", function () {

    /**
     * test_author_windy
     */
    it("clear-editor", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.clear_editor",
            width: 300,
            value: "12345",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        editor.setWaterMark("AAAAA");
        expect(editor.element.find(".bi-water-mark").text()).to.equal("AAAAA");
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
    it("clear", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.clear_editor",
            width: 300,
            value: "12345",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        BI.nextTick(function () {
            editor.element.find(".search-close-h-font").click();
            expect(editor.element.find(".bi-input").val()).to.equal("");
            editor.destroy();
            done();
        });
    });

    /**
     * test_author_windy
     */
    it("setValue", function () {
        var editor = BI.Test.createWidget({
            type: "bi.clear_editor",
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
    it("getValue", function () {
        var editor = BI.Test.createWidget({
            type: "bi.clear_editor",
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
    it("getValue1", function () {
        var editor = BI.Test.createWidget({
            type: "bi.clear_editor",
            width: 300,
            value: "12346 7890",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        expect(editor.getValue()).to.equal("12346 7890");
        editor.destroy();
    });

});