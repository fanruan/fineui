/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/4
 */

describe("all_value_chooser_combo", function () {

    var items = BI.map(BI.makeArray(1000, null), function(idx, v) {
        return {
            text: idx,
            value: idx,
            title: idx
        };
    });

    var itemSelectorGetter = function (array) {
        return BI.map(array, function (idx, num) {
            return ".bi-multi-select-popup-view .bi-loader .bi-button-group .bi-multi-select-item:nth-child(" + num + ")";
        });
    };

    var searchItemSelectorGetter = function (array) {
        return BI.map(array, function (idx, num) {
            return ".bi-multi-select-search-pane .bi-loader .bi-button-group .bi-multi-select-item:nth-child(" + num + ")";
        });
    };

    /**
     *   test_author_windy
     **/
    it("setValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.all_value_chooser_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            }
        });
        widget.setValue([1, 2]);
        expect(widget.getValue()).to.deep.equal([1, 2]);
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("点选选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.all_value_chooser_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            }
        });
        widget.element.find(".bi-multi-select-trigger").click();
        // 为什么要delay 300呢，因为按钮有debounce
        BI.delay(function () {
            // 点选1、2、3
            BI.each(itemSelectorGetter([1,2,3]), function (idx, selector) {
                widget.element.find(selector).click();
            });
            expect(widget.getValue()).to.deep.equal([0, 1, 2]);
            done();
        }, 300);
    });
});