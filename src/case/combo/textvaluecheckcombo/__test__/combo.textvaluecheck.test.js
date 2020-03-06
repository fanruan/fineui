/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/5
 */

describe("text_value_check_combo", function () {

    var items = BI.map(BI.makeArray(11, null), function(idx, v) {
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
            type: "bi.text_value_check_combo",
            width: 220,
            height: 24,
            items: items
        });
        widget.setValue(2);
        expect(widget.getValue()[0]).to.equal(2);
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("getValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.text_value_check_combo",
            width: 220,
            items: items,
            value: 2
        });
        expect(widget.getValue()[0]).to.equal(2);
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("点选选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.text_value_check_combo",
            width: 220,
            items: items
        });
        widget.element.find(".bi-select-text-trigger").click();
        // 为什么要delay 300呢，因为按钮有debounce
        BI.delay(function () {
            widget.element.find(".bi-single-select-item:contains(10)").click();
            expect(widget.getValue()[0]).to.equal(10);
            widget.destroy();
            done();
        }, 300);
    });
});