/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/17
 */

describe("CollectionTest", function () {

    /**
     * test_author_windy
     */
    it("collection", function () {
        var items = [];
        var cellCount = 100;
        for (var i = 0; i < cellCount; i++) {
            items[i] = {
                type: "bi.label",
                text: i
            };
        }
        var grid = BI.Test.createWidget({
            type: "bi.collection_view",
            width: 400,
            height: 300,
            items: items,
            cellSizeAndPositionGetter: function (index) {
                return {
                    x: index % 10 * 50,
                    y: Math.floor(index / 10) * 50,
                    width: 50,
                    height: 50
                };
            }
        });
        // TODO 列表展示类控件不知道该测什么，先标记一下
        grid.destroy();
    });
});