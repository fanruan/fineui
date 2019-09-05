/**
 * Created by windy on 2018/01/23.
 */
describe("dateFunctionTest", function () {

    before(function () {

    });

    /**
     * test_author_windy
     */
    it("getWeekNumber", function () {
        expect(BI.print(BI.getDate(2005, 0, 1), "%Y-%W")).to.equal("2004-53");
        expect(BI.print(BI.getDate(2005, 0, 2), "%Y-%W")).to.equal("2004-53");
        expect(BI.print(BI.getDate(2005, 11, 31), "%Y-%W")).to.equal("2005-52");
        expect(BI.print(BI.getDate(2007, 0, 1), "%Y-%W")).to.equal("2007-01");
        expect(BI.print(BI.getDate(2007, 11, 30), "%Y-%W")).to.equal("2007-52");
        expect(BI.print(BI.getDate(2007, 11, 31), "%Y-%W")).to.equal("2008-01");
        expect(BI.print(BI.getDate(2008, 0, 1), "%Y-%W")).to.equal("2008-01");
        expect(BI.print(BI.getDate(2008, 11, 28), "%Y-%W")).to.equal("2008-52");
        expect(BI.print(BI.getDate(2008, 11, 29), "%Y-%W")).to.equal("2009-01");
        expect(BI.print(BI.getDate(2008, 11, 30), "%Y-%W")).to.equal("2009-01");
        expect(BI.print(BI.getDate(2008, 11, 31), "%Y-%W")).to.equal("2009-01");
        expect(BI.print(BI.getDate(2009, 0, 1), "%Y-%W")).to.equal("2009-01");
        expect(BI.print(BI.getDate(2009, 11, 31), "%Y-%W")).to.equal("2009-53");
        expect(BI.print(BI.getDate(2010, 0, 1), "%Y-%W")).to.equal("2009-53");
        expect(BI.print(BI.getDate(2010, 0, 2), "%Y-%W")).to.equal("2009-53");
        expect(BI.print(BI.getDate(2010, 0, 3), "%Y-%W")).to.equal("2009-53");
    });
});
