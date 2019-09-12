/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/12
 */


describe("month", function () {

    /**
     * test_author_windy
     */
    it("setValue", function () {
        var combo = BI.Test.createWidget({
            type: "bi.month_combo",
        });
        combo.setValue(11);
        expect(combo.getValue()).to.equal(11);
    });

    /**
     * test_author_windy
     */
    it("getValue", function () {
        var combo = BI.Test.createWidget({
            type: "bi.month_combo",
            value: 1
        });
        expect(combo.getValue()).to.equal(1);
    });
});