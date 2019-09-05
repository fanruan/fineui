/**
 * Created by windy on 2018/01/23.
 */
describe("ALinkTest", function () {

    /**
     * test_author_windy
     */
    it("A初始化测试", function () {
        var a = BI.Test.createWidget({
            type: "bi.a",
            text: "CCC"
        });
        expect(a.element.is('a')).to.equal(true);
    });

    /**
     * test_author_windy
     */
    it("A的el测试", function () {
        var a = BI.Test.createWidget({
            type: "bi.a",
            text: "DDD",
            el: {
                type: "bi.label"
            }
        });
        expect(a.element.is('a') && a.element.hasClass("bi-label")).to.equal(true);
    });
});
