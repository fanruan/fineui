/**
 * @Author: lei.wang
 * @Maintainers: lei.wang
 * @Date: 2019-04-16
 */
describe("core-function-test", function () {
    /**
     * test_author_lei.wang
     */
    it("createDistinctName-支持字符串数组", function () {
        var names = ["name", "name1"];
        expect(BI.Func.createDistinctName(names, "name")).to.equal("name2");
        expect(BI.Func.createDistinctName(names, "name2")).to.equal("name2");
    });

    /**
     * test_author_lei.wang
     */
    it("createDistinctName-支持对象数组数组", function () {
        var names = [{ name: "name" }, { name: "name1" }];
        expect(BI.Func.createDistinctName(names, "name")).to.equal("name2");
        expect(BI.Func.createDistinctName(names, "name2")).to.equal("name2");
    });
});