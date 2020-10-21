/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/3
 */

describe("search_text_value_combo", function () {

    var items;
    before(function () {
         items = BI.map(BI.makeArray(100, null), function(idx, v) {
            return {
                text: idx,
                value: idx,
                title: idx
            };
        });
    });

    /**
     *   test_author_windy
     **/
    it("setValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.search_text_value_combo",
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
            type: "bi.search_text_value_combo",
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
            type: "bi.search_text_value_combo",
            width: 220,
            items: items
        });
        widget.element.find(".bi-search-text-value-trigger").click();
        // 为什么要delay 300呢，因为按钮有debounce
        BI.delay(function () {
            widget.element.find(".bi-single-select-item:contains(10)").click();
            expect(widget.getValue()[0]).to.equal(10);
            widget.destroy();
            done();
        }, 300);
    });

    /**
     *   test_author_windy
     **/
    it("搜索选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.search_text_value_combo",
            width: 220,
            items: items
        });
        BI.nextTick(function () {
            widget.element.find(".bi-search-text-value-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(widget.element.find(".bi-search-text-value-trigger .bi-input"), "2", 50, function () {
                    BI.nextTick(function () {
                        widget.element.find(".bi-search-text-value-popup .bi-single-select-item")[0].click();
                        expect(widget.getValue()[0]).to.deep.equal(2);
                        widget.destroy();
                        done();
                    });
                });
            });
        });
    });
});

