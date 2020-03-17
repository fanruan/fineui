/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/17
 */

describe("LinkTest", function () {

    /**
     * test_author_windy
     */
    it("link", function () {
        var a = BI.Test.createWidget({
            type: "bi.link"
        });
        expect(a.element.is('a')).to.equal(true);
        a.destroy();
    });
});