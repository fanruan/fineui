/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/24
 */

// TODO 展示类控件测什么没想好标记一下
describe("ListView && VirtualList", function () {

    /**
     * test_author_windy
     */
    it("ListView初始化测试", function () {
        var a = BI.Test.createWidget({
            type: "bi.list_view",
            el: {
                type: "bi.left"
            },
            items: BI.map(BI.range(0, 100), function (i, item) {
                return BI.extend({}, item, {
                    type: "bi.label",
                    width: 200,
                    height: 200,
                    text: (i + 1)
                });
            })
        });
        a.destroy();
    });


    /**
     * test_author_windy
     */
    it("VirtualList初始化测试", function () {
        var a = BI.Test.createWidget({
            type: "bi.virtual_list",
            items: BI.map(BI.range(0, 100), function (i, item) {
                return BI.extend({}, item, {
                    type: "bi.label",
                    height: 30,
                    text: (i + 1) + "." + item.text
                });
            })
        });
        a.destroy();
    });
});