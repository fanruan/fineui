/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/20
 */
describe("GridTest", function () {

    /**
     * test_author_windy
     */
    it("grid", function () {
        var items = [];
        var rowCount = 1000, columnCount = 100;
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: i + "-" + j
                };
            }
        }
        var grid = BI.createWidget({
            type: "bi.grid_view",
            width: 400,
            height: 300,
            estimatedRowSize: 30,
            estimatedColumnSize: 100,
            items: items,
            scrollTop: 100,
            rowHeightGetter: function () {
                return 30;
            },
            columnWidthGetter: function () {
                return 100;
            }
        });
        // TODO 性能展示类控件，不知道要测啥，标记一下
        grid.destroy();
    });
});