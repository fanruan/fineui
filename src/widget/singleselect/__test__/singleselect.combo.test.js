/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/1/16
 */
describe("single_select_combo", function () {

    var items = BI.map(BI.makeArray(1000, null), function(idx, v) {
        return {
            text: idx,
            value: idx,
            title: idx
        };
    });

    var itemSelectorGetter = function (array) {
        return BI.map(array, function (idx, num) {
            return ".bi-single-select-popup-view .bi-loader .bi-button-group .bi-single-select-item:nth-child(" + num + ")";
        });
    };

    var searchItemSelectorGetter = function (array) {
        return BI.map(array, function (idx, num) {
            return ".bi-single-select-search-pane .bi-loader .bi-button-group .bi-single-select-item:nth-child(" + num + ")";
        });
    };

    /**
     *   test_author_windy
     **/
    it("setValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.single_select_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            }
        });
        widget.setValue(1);
        expect(widget.getValue()).to.equal(1);
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("getValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.single_select_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            },
            value: 1
        });
        expect(widget.getValue()).to.equal(1);
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("点选选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.single_select_combo",
            allowNoSelect: true,
            width: 220,
            itemsCreator: function (op, callback) {
                callback({
                    items: items,
                    hasNext: false
                });
            }
        });
        widget.populate();
        widget.element.find(".bi-single-select-trigger").click();
        // 为什么要delay 300呢，因为按钮有debounce
        BI.delay(function () {
            // 点选1
            BI.each(itemSelectorGetter([1]), function (idx, selector) {
                widget.element.find(selector).click();
            });
            expect(widget.getValue()).to.equal(0);
            widget.destroy();
            done();
        }, 300);
    });

    /**
     *   test_author_windy
     **/
    it("搜索选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.single_select_combo",
            allowNoSelect: true,
            width: 220,
            itemsCreator: function (op, callback) {
                callback({
                    items: items,
                    hasNext: false
                });
            }
        });
        BI.nextTick(function () {
            widget.element.find(".bi-single-select-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(widget.element.find(".bi-single-select-trigger .bi-input"), "2", 50, function () {
                    BI.nextTick(function () {
                        BI.each(searchItemSelectorGetter([3]), function (idx, selector) {
                            widget.element.find(selector).click();
                        });
                        expect(widget.getValue()).to.equal(2);
                        widget.destroy();
                        done();
                    });
                });
            });
        });
    });
});