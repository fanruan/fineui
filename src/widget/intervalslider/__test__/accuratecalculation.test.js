/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/5/14
 */
describe("accuratecalculation", function () {

    /**
     * test_author_windy
     */
    it("add", function () {
        var calculation = new BI.AccurateCalculationModel();


    });

    /**
     * test_author_windy
     */
    it("sub", function () {
        var calculation = new BI.AccurateCalculationModel();
        expect(calculation.accurateSubtraction(0.124, 2345.678)).to.equal(-2345.554);
        expect(calculation.accurateSubtraction(-0.124, -2345.678)).to.equal(2345.554);
        expect(calculation.accurateSubtraction(0.124, -2345.678)).to.equal(2345.802);
        expect(calculation.accurateSubtraction(-2345.678, 0.124)).to.equal(-2345.802);

    });

    /**
     * test_author_windy
     */
    it("mul", function () {
        var calculation = new BI.AccurateCalculationModel();
        expect(calculation.accurateSubtraction(0.124, 2345.678)).to.equal(-2345.554);
        expect(calculation.accurateSubtraction(-0.124, -2345.678)).to.equal(2345.554);
        expect(calculation.accurateSubtraction(0.124, -2345.678)).to.equal(2345.802);
        expect(calculation.accurateSubtraction(-2345.678, 0.124)).to.equal(-2345.802);

    });

    /**
     * test_author_windy
     */
    it("div", function () {
        var calculation = new BI.AccurateCalculationModel();


    });
});