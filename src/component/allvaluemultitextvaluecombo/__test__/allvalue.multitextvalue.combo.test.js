/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/4
 */

describe("all_value_multi_text_value_combo", function () {

    var items = BI.map(BI.makeArray(1000, null), function(idx, v) {
        return {
            text: idx,
            value: idx,
            title: idx
        };
    });

    /**
     *   test_author_windy
     **/
    it("setValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.all_value_multi_text_value_combo",
            width: 220,
            items: items
        });
        widget.setValue([1, 2]);
        expect(widget.getValue()).to.deep.equal([1, 2]);
        widget.destroy();
    });
});