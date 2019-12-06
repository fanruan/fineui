/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/12/6
 */

describe("标红test", function () {

    /**
     * test_author_windy
     */
    it("无多音字标红", function () {
        var a = BI.Test.createWidget({
            type: "bi.layout",
        });
        a.element.__textKeywordMarked__("无多音字", "w");
        expect(a.element.html()).to.equal("<span class=\"bi-keyword-red-mark\">无</span>多音字");
        a.destroy();
    });

    /**
     * test_author_windy
     */
    it("含有多音字标红", function () {
        var a = BI.Test.createWidget({
            type: "bi.layout",
        });
        a.element.__textKeywordMarked__("长期协议", "z");
        expect(a.element.html()).to.equal("<span class=\"bi-keyword-red-mark\">长</span>期协议");
        a.element.__textKeywordMarked__("长期协议", "c");
        expect(a.element.html()).to.equal("<span class=\"bi-keyword-red-mark\">长</span>期协议");
        a.destroy();
    });

    /**
     * test_author_windy
     */
    it("多音字错位标红", function () {
        var a = BI.Test.createWidget({
            type: "bi.layout",
        });
        a.element.__textKeywordMarked__("呵呵呵", "h");
        expect(a.element.html()).to.equal("<span class=\"bi-keyword-red-mark\">呵</span><span class=\"bi-keyword-red-mark\">呵</span><span class=\"bi-keyword-red-mark\">呵</span>");
        a.element.__textKeywordMarked__("呵呵呵", "hh");
        expect(a.element.html()).to.equal("<span class=\"bi-keyword-red-mark\">呵呵</span>呵");
        a.element.__textKeywordMarked__("呵呵呵", "hhh");
        expect(a.element.html()).to.equal("<span class=\"bi-keyword-red-mark\">呵呵呵</span>");
        a.destroy();
    });

    /**
     * test_author_windy
     */
    it("原文和拼音都匹配标红", function () {
        var a = BI.Test.createWidget({
            type: "bi.layout",
        });
        a.element.__textKeywordMarked__("啊a", "a");
        expect(a.element.html()).to.equal("<span class=\"bi-keyword-red-mark\">啊</span><span class=\"bi-keyword-red-mark\">a</span>");
        a.element.__textKeywordMarked__("a啊", "a");
        expect(a.element.html()).to.equal("<span class=\"bi-keyword-red-mark\">a</span><span class=\"bi-keyword-red-mark\">啊</span>");
        a.destroy();
    });
});