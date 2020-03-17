/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/17
 */

describe("ImgTest", function () {

    /**
     * test_author_windy
     */
    it("img", function () {
        var a = BI.Test.createWidget({
            type: "bi.img",
            iconWidth: 36,
            iconHeight: 36
        });
        a.setSrc("test.png");
        expect(a.element.attr("src")).to.equal("test.png");
        expect(a.getSrc()).to.equal("test.png");
        a.destroy();
    });
});