/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/17
 */

describe("PagerTest", function () {

    /**
     * test_author_windy
     */
    it("allCountPager", function () {
        var a = BI.Test.createWidget({
            type: "bi.all_count_pager",
            pages: 3,
            curr: 1,
            count: 1000
        });
        a.setCount(888);
        expect(a.element.find(".row-count").text()).to.equal("888");
        a.setAllPages(777);
        a.setValue(4);
        expect(a.element.find(".bi-input").val()).to.equal("4");
        expect(a.getCurrentPage()).to.equal(4);
        expect(a.hasPrev()).to.equal(false);
        expect(a.hasNext()).to.equal(true);
        a.populate();
        expect(a.element.find(".bi-input").val()).to.equal("4");
        a.setPagerVisible(false);
        expect(a.element.find(".bi-pager").css("display")).to.equal("none");
        a.destroy();
    });


    /**
     * test_author_windy
     */
    it("directionPager", function () {
        var a = BI.Test.createWidget({
            type: "bi.direction_pager",
            horizontal: {
                pages: false, // 总页数
                curr: 1, // 初始化当前页， pages为数字时可用

                hasPrev: function (v) {
                    return v > 1;
                },
                hasNext: function () {
                    return true;
                },
                firstPage: 1
            },
            vertical: {
                pages: false, // 总页数
                curr: 1, // 初始化当前页， pages为数字时可用

                hasPrev: function (v) {
                    return v > 1;
                },
                hasNext: function () {
                    return true;
                },
                firstPage: 1
            }
        });
        a.populate();
        a.setVPage(2);
        expect(a.getVPage()).to.equal(1);
        a.setHPage(2);
        expect(a.getHPage()).to.equal(1);
        expect(a.hasVNext()).to.equal(true);
        expect(a.hasHNext()).to.equal(true);
        expect(a.hasVPrev()).to.equal(false);
        expect(a.hasHPrev()).to.equal(false);
        a.setHPagerVisible(false)
        a.setVPagerVisible(false)
        expect(a.element.find(".bi-pager").css("display")).to.equal("none");
        a.clear();
        a.destroy();
    });
});