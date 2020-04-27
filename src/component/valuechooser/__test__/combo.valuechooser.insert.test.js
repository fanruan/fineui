/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/23
 */
describe("value_chooser_insert_combo", function () {

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
            type: "bi.value_chooser_insert_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            }
        });
        widget.setValue({
            type: 1,
            value: [1, 2]
        });
        expect(widget.getValue()).to.deep.equal({
            type: 1,
            value: [1, 2]
        });
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("getValue", function () {
        var widget = BI.Test.createWidget({
            type: "bi.value_chooser_insert_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            },
            value: {
                type: 2,
                value: [1, 2, 3]
            }
        });
        expect(widget.getValue()).to.deep.equal({
            type: 2,
            value: [1, 2, 3]
        });
        widget.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("点选选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.value_chooser_insert_combo",
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
            // 点全选
            widget.element.find(".bi-multi-select-popup-view .bi-label:contains(全选)").click();
            // 取消勾选1、2、3
            BI.delay(function () {
                BI.each(itemSelectorGetter([1,2,3]), function (idx, selector) {
                    widget.element.find(selector).click();
                });
                expect(widget.getValue()).to.deep.equal({
                    type: 2,
                    value: [0, 1, 2]
                });
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
            type: "bi.value_chooser_insert_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            }
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
                        expect(widget.getValue()).to.deep.equal({
                            type: 1,
                            value: [2, 12]
                        });
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
    it("新增值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.value_chooser_insert_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            }
        });
        BI.nextTick(function () {
            widget.element.find(".bi-multi-select-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(widget.element.find(".bi-multi-select-trigger .bi-input"), "z", 50, function () {
                    BI.nextTick(function () {
                        widget.element.find(".bi-text-button:contains(+点击新增\"z\")").click();
                        expect(widget.getValue()).to.deep.equal({
                            type: 1,
                            value: ["z"]
                        });
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
            type: "bi.value_chooser_insert_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback(items);
            },
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

    /**
     *   test_author_windy
     **/
    it("BI-64399", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.value_chooser_insert_combo",
            width: 220,
            itemsCreator: function (op, callback) {
                callback([{
                    text: "A",
                    value: "A",
                    title: "A"
                }, {
                    text: "AA",
                    value: "AA",
                    title: "AA"
                }, {
                    text: "a1",
                    value: "a1",
                    title: "a1"
                }]);
            }
        });

        widget.element.find(".bi-multi-select-trigger").click();
        // 为什么要delay 300呢，因为按钮有debounce
        BI.delay(function () {
            // 点选a1
            BI.each(itemSelectorGetter([3]), function (idx, selector) {
                widget.element.find(selector).click();
            });
            widget.element.find(".bi-multi-select-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(widget.element.find(".bi-multi-select-trigger .bi-input"), "A", 65, function () {
                    BI.nextTick(function () {
                        expect(widget.element.find(".bi-multi-select-search-pane .multi-select-toolbar").css("display")).to.equal("block");
                        widget.destroy();
                        done();
                    });
                });
            });
        }, 300);
    });
});