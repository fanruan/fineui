/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/17
 */
describe("SegmentTest", function () {

    /**
     * test_author_windy
     */
    it("segment", function () {
        var a = BI.Test.createWidget({
            type: "bi.segment",
            items: [{
                text: "1",
                value: 1
            }, {
                text: "2",
                value: 2
            }, {
                text: "3",
                value: 3
            }]
        });
        a.setValue(2);
        expect(a.getValue()[0]).to.equal(2);
        a.setEnable(false);
        a.setEnabledValue(3);
        a.setValue(3);
        expect(a.getValue()[0]).to.equal(3);
        a.destroy();
    });
});