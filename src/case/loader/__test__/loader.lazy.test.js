/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/4/3
 */

describe("lazy_loader", function () {

    /**
     *   test_author_windy
     **/
    it("setValue", function () {
        var items = BI.map(BI.range(0, 100), function (idx, v) {
            return {
                type: "bi.single_select_item",
                text: v,
                value: v
            }
        });
        var widget = BI.Test.createWidget({
            type: "bi.lazy_loader",
            el: {
                layouts: [{
                    type: "bi.left",
                    hgap: 5
                }]
            }
        });
        widget.populate(items);
        expect(widget.getAllButtons().length).to.equal(100);
        widget.addItems([{
            type: "bi.single_select_item",
            text: 102,
            value: 102
        }, {
            type: "bi.single_select_item",
            text: 103,
            value: 103
        }]);
        expect(widget.getAllLeaves().length).to.equal(102);
        widget.setValue(102);
        expect(widget.getValue()[0]).to.equal(102);
        expect(widget.getSelectedButtons().length).to.equal(1);
        widget.setNotSelectedValue(102);
        expect(widget.getNotSelectedValue()[0]).to.equal(102);
        expect(widget.getNotSelectedButtons().length).to.equal(1);
        widget.destroy();
    });
});