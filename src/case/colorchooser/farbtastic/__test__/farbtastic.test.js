/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/20
 */
describe("FarbtasticTest", function () {

    /**
     * test_author_windy
     */
    it("Farbtastic", function () {
        var a = BI.Test.createWidget({
            type: "bi.farbtastic",
            height: 200,
            width: 200
        });
        a.setValue("#d56c6c");
        expect(a.getValue()).to.equal("#d56c6c");
        a.destroy();
    });
});