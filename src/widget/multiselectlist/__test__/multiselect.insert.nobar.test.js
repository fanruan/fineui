/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/6/2
 */
describe("multi_list_insert_no_bar_pane", function () {

    var items = BI.map(BI.makeArray(100, null), function(idx, v) {
        return {
            text: idx,
            value: idx,
            title: idx
        };
    });

    var itemSelectorGetter = function (array) {
        return BI.map(array, function (idx, num) {
            return ".popup-multi-select-list .bi-loader .bi-button-group .bi-multi-select-item:nth-child(" + num + ")";
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
            type: "bi.multi_select_insert_no_bar_list",
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
    it("点选选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_insert_no_bar_list",
            width: 220,
            itemsCreator: function (op, callback) {
                callback({
                    items: items,
                    hasNext: false
                });
            }
        });
        widget.populate();
        BI.nextTick(function () {
            // 点选1、2、3
            BI.each(itemSelectorGetter([1,2,3]), function (idx, selector) {
                widget.element.find(selector).click();
            });
            // 取消勾选1、2、3
            BI.delay(function () {
                BI.each(itemSelectorGetter([1,2,3]), function (idx, selector) {
                    widget.element.find(selector).click();
                });
                var value = widget.getValue();
                delete value.assist;
                expect(value).to.deep.equal([]);
                widget.destroy();
                done();
            }, 300);
        });
    });

    /**
     *   test_author_windy
     **/
    it("搜索选值", function (done) {
        var widget = BI.Test.createWidget({
            type: "bi.multi_select_insert_no_bar_list",
            width: 220,
            itemsCreator: function (op, callback) {
                if (op.keywords) {
                    callback({
                        items: [{
                            text: "2",
                            value: "2",
                            title: "2"
                        }, {
                            text: "12",
                            value: "12",
                            title: "12"
                        }],
                        hasNext: false
                    });
                } else {
                    callback({
                        items: items,
                        hasNext: false
                    });
                }
            }
        });
        widget.element.find(".bi-water-mark").click();
        // 这边为啥要加呢，因为input的setValue中有nextTick
        BI.nextTick(function () {
            BI.Test.triggerKeyDown(widget.element.find(".bi-input"), "2", 50, function () {
                BI.nextTick(function () {
                    BI.each(searchItemSelectorGetter([1,2]), function (idx, selector) {
                        widget.element.find(selector).click();
                    });
                    var value = widget.getValue();
                    delete value.assist;
                    expect(value).to.deep.equal(["2", "12"]);
                    widget.destroy();
                    done();
                });
            });
        });
    });
});