/**
 * Created by User on 2017/3/22.
 */
Demo.SingleSelectCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-single-select-combo"
    },

    _createSingleSelectCombo: function () {
        var self = this;
        var widget = BI.createWidget({
            type: "bi.single_select_combo",
            itemsCreator: BI.bind(this._itemsCreator, this),
            width: 200,
            ref: function () {
                self.SingleSelectCombo = this;
            },
            value: "柳州市针织总厂"
        });

        widget.populate();

        widget.on(BI.SingleSelectCombo.EVENT_CONFIRM, function () {
            BI.Msg.toast(JSON.stringify(this.getValue()));
        });

        return widget;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * 100; items[i] && i < times * 100; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * 100 < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this;
        var items = Demo.CONSTANTS.ITEMS;
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
        if (options.type == BI.SingleSelectCombo.REQ_GET_ALL_DATA) {
            callback({
                items: items
            });
            return;
        }
        if (options.type == BI.SingleSelectCombo.REQ_GET_DATA_LENGTH) {
            callback({count: items.length});
            return;
        }
        BI.delay(function () {
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }, 1000);
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            scrolly: false,
            items: [{
                el: this._createSingleSelectCombo(),
                right: "50%",
                top: 10
            }, {
                el: {

                    type: "bi.button",
                    text: "setValue(\"柳州市针织总厂\")",
                    handler: function () {
                        self.SingleSelectCombo.setValue("柳州市针织总厂");
                    }
                }
            }]
        };
    }
});
BI.shortcut("demo.single_select_combo", Demo.SingleSelectCombo);