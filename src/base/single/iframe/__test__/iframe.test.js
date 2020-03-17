/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/17
 */

describe("IframeTest", function () {

    /**
     * test_author_windy
     */
    it("directionPager", function () {
        var a = BI.Test.createWidget({
            type: "bi.iframe"
        });
        a.setSrc("http://www.baidu.com");
        a.setName("testIFrame");
        expect(a.element.attr("src"), "http://www.baidu.com");
        expect(a.getSrc(), "http://www.baidu.com");
        expect(a.getName(), "testIFrame");
        a.destroy();
    });
});