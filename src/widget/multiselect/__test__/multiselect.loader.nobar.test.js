/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/18
 */

describe("multi_select_no_bar_series", function () {

    var _getItemsByTimes, _itemsCreator, itemSelectorGetter, searchItemSelectorGetter, _hasNextByTimes, items;
    before(function () {
        _getItemsByTimes = function (items, times) {
            var res = [];
            for (var i = (times - 1) * 100; items[i] && i < times * 100; i++) {
                res.push(items[i]);
            }
            return res;
        };

        _hasNextByTimes = function (items, times) {
            return times * 100 < items.length;
        };

        _itemsCreator = function (options, callback) {
            var items = BI.map(BI.makeArray(100, null), function(idx, v) {
                return {
                    text: idx,
                    value: idx,
                    title: idx
                };
            });
            var keywords = (options.keywords || []).slice();
            if (options.keyword) {
                keywords.push(options.keyword);
            }
            BI.each(keywords, function (i, kw) {
                var search = BI.Func.getSearchResult(items, kw);
                items = search.match.concat(search.find);
            });
            if (options.selectedValues) {// 过滤
                var filter = BI.makeObject(options.selectedValues, true);
                items = BI.filter(items, function (i, ob) {
                    return !filter[ob.value];
                });
            }
            if (options.type == BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
                callback({
                    items: items
                });
                return;
            }
            if (options.type == BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
                callback({count: items.length});
                return;
            }
            callback({
                items: _getItemsByTimes(items, options.times),
                hasNext: _hasNextByTimes(items, options.times)
            });
        };

        itemSelectorGetter = function (array) {
            return BI.map(array, function (idx, num) {
                return ".bi-multi-select-popup-view .bi-loader .bi-button-group .bi-multi-select-item:nth-child(" + num + ")";
            });
        };

        searchItemSelectorGetter = function (array) {
            return BI.map(array, function (idx, num) {
                return ".bi-multi-select-search-pane .bi-loader .bi-button-group .bi-multi-select-item:nth-child(" + num + ")";
            });
        };

    })

    /**
     *   test_author_windy
     **/
    it("setValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator
        });
        widget.setValue([1, 2]);
        expect(widget.getValue()).to.deep.equal([1, 2]);
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("getValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator,
            value: [1, 2, 3]
        });
        expect(widget.getValue()).to.deep.equal([1, 2, 3]);
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("点选选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator
        });
        widget.element.find(".bi-multi-select-trigger").click();
        // 为什么要delay 300呢，因为按钮有debounce
        BI.delay(function () {
            // 点选1、2、3
            BI.each(itemSelectorGetter([1,2,3]), function (idx, selector) {
                widget.element.find(selector).click();
            });
            // 取消勾选1、2
            BI.delay(function () {
                BI.each(itemSelectorGetter([1,2]), function (idx, selector) {
                    widget.element.find(selector).click();
                });
                expect(widget.getValue()).to.deep.equal([2]);
                widget.destroy();
                done();
            }, 300);
        }, 300);
    });

    /**
     *   test_author_windy
     **/
    it("搜索选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator
        });
        BI.nextTick(function () {
            widget.element.find(".bi-multi-select-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(widget.element.find(".bi-multi-select-trigger .bi-input"), "2", 50, function () {
                    BI.nextTick(function () {
                        BI.each(searchItemSelectorGetter([1,2]), function (idx, selector) {
                            widget.element.find(selector).click();
                        });
                        expect(widget.getValue()).to.deep.equal([2, 12]);
                        widget.destroy();
                        done();
                    });
                });
            });
        });
    });

    /**
     *   test_author_windy
     **/
    it("查看已选", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_no_bar_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback({
                    items: items,
                    hasNext: false
                });
            },
            value: [1, 2]
        });
        BI.nextTick(function () {
            widget.element.find(".bi-multi-select-check-selected-button").click();
            BI.delay(function () {
                expect(widget.element.find(".display-list-item").length).to.equal(2);
                widget.destroy();
                done();
            }, 300);
        });
    });

    /**
     *   test_author_windy
     **/
    it("setValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_insert_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator
        });
        widget.setValue([1, 2]);
        expect(widget.getValue()).to.deep.equal([1, 2]);
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("getValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_insert_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator,
            value: [1, 2, 3]
        });
        expect(widget.getValue()).to.deep.equal([1, 2, 3]);
        widget.destroy();
    });


    /**
     *   test_author_windy
     **/
    it("点选选值1", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_insert_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator
        });
        widget.element.find(".bi-multi-select-trigger").click();
        // 为什么要delay 300呢，因为按钮有debounce
        BI.delay(function () {
            // 点选1、2、3
            BI.each(itemSelectorGetter([1,2,3]), function (idx, selector) {
                widget.element.find(selector).click();
            });
            // 取消勾选1、2、3
            BI.delay(function () {
                BI.each(itemSelectorGetter([1,2]), function (idx, selector) {
                    widget.element.find(selector).click();
                });
                expect(widget.getValue()).to.deep.equal([2]);
                widget.destroy();
                done();
            }, 300);
        }, 300);
    });

    /**
     *   test_author_windy
     **/
    it("搜索选值1", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_insert_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator
        });
        BI.nextTick(function () {
            widget.element.find(".bi-multi-select-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(widget.element.find(".bi-multi-select-trigger .bi-input"), "2", 50, function () {
                    BI.nextTick(function () {
                        BI.each(searchItemSelectorGetter([1,2]), function (idx, selector) {
                            widget.element.find(selector).click();
                        });
                        expect(widget.getValue()).to.deep.equal([2, 12]);
                        widget.destroy();
                        done();
                    });
                });
            });
        });
    });

    /**
     *   test_author_windy
     **/
    it("新增值1", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_insert_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator
        });
        BI.nextTick(function () {
            widget.element.find(".bi-multi-select-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(widget.element.find(".bi-multi-select-trigger .bi-input"), "z", 50, function () {
                    BI.nextTick(function () {
                        widget.element.find(".bi-text-button:contains(+点击新增\"z\")").click();
                        expect(widget.getValue()).to.deep.equal(["z"]);
                        widget.destroy();
                        done();
                    });
                });
            });
        });
    });

    /**
     *   test_author_windy
     **/
    it("查看已选1", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_insert_no_bar_combo",
            width: 220,
            itemsCreator: _itemsCreator,
            value: {
                type: 1,
                value: [1, 2]
            }
        });
        BI.nextTick(function () {
            widget.element.find(".bi-multi-select-check-selected-button").click();
            BI.delay(function () {
                expect(widget.element.find(".display-list-item").length).to.equal(2);
                widget.destroy();
                done();
            }, 300);
        });
    });
});