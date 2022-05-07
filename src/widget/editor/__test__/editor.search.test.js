/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/9
 */

describe("searchEditor", function () {

    /**
     * test_author_windy
     */
    it("defaultValue", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.search_editor",
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
    it("clear", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.search_editor",
            width: 300,
            value: "12345",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        BI.nextTick(function () {
            editor.element.find(".close-font").click();
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
            type: "bi.search_editor",
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
            type: "bi.search_editor",
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
    it("getKeywords", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.search_editor",
            width: 300
        });
        editor.focus();
        BI.Test.triggerKeyDown(editor.element.find(".bi-input"), "8 8", 56, function () {
            expect(editor.getKeywords()).to.deep.equal(["8", "8"]);
            editor.destroy();
            done();
        })
    });


    /**
     * test_author_windy
     */
    it("defaultValue1", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.small_search_editor",
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
    it("clear1", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.small_search_editor",
            width: 300,
            value: "12345",
            watermark: "添加合法性判断",
            errorText: "长度必须大于4",
            validationChecker: function () {
                return this.getValue().length > 4;
            }
        });
        BI.nextTick(function () {
            editor.element.find(".close-font").click();
            expect(editor.element.find(".bi-input").val()).to.equal("");
            editor.destroy();
            done();
        });
    });

    /**
     * test_author_windy
     */
    it("setValue1", function () {
        var editor = BI.Test.createWidget({
            type: "bi.small_search_editor",
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
            type: "bi.small_search_editor",
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
    it("getKeywords1", function (done) {
        var editor = BI.Test.createWidget({
            type: "bi.search_editor",
            width: 300
        });
        editor.focus();
        BI.Test.triggerKeyDown(editor.element.find(".bi-input"), "8 8", 56, function () {
            expect(editor.getKeywords()).to.deep.equal(["8", "8"]);
            editor.destroy();
            done();
        })
    });

});