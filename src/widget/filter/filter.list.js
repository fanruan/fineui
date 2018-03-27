/**
 * Created by windy on 2017/3/28.
 */
!(function () {
    var FilterList = BI.inherit(BI.ButtonTree, {
        props: {
            baseCls: "bi-button-map"
        },

        _createBtns: function (items) {
            var o = this.options;
            var buttons = BI.createWidgets(BI.createItems(items, {type: "bi.text_button", once: o.chooseType === 0}));
            var keys = BI.map(items, function (i, item) {
                item = BI.stripEL(item);
                if (!(item.id || item.value)) {
                    throw new Error("item must have 'id' or 'value' as its property");
                }
                return item.id || item.value;
            });
            return BI.zipObject(keys, buttons);
        },

        setValue: function (v) {
            v = BI.isArray(v) ? v : [v];
            BI.each(this.buttons, function (val, item) {
                if (!BI.isFunction(item.setSelected)) {
                    item.setValue(v);
                    return;
                }
                if (v.contains(val)) {
                    item.setSelected && item.setSelected(true);
                } else {
                    item.setSelected && item.setSelected(false);
                }
            });
        },

        setNotSelectedValue: function (v) {
            v = BI.isArray(v) ? v : [v];
            BI.each(this.buttons, function (val, item) {
                if (!BI.isFunction(item.setSelected)) {
                    item.setNotSelectedValue(v);
                    return;
                }
                if (v.contains(val)) {
                    item.setSelected && item.setSelected(false);
                } else {
                    item.setSelected && item.setSelected(true);
                }
            });
        },

        populate: function (items) {
            var self = this;
            var args = [].slice.call(arguments);
            var linkHashMap = new BI.LinkHashMap();
            var val = function (item) {
                return item.id || item.value;
            };
            if (!this.buttons) {
                this.buttons = {};
            }
            // 所有已存在的和新添加的
            var willCreated = [];
            BI.each(items, function (i, item) {
                item = BI.stripEL(item);
                if (self.buttons[val(item)]) {
                    var ob = self.buttons[val(item)];
                    args[0] = item.items;
                    args[2] = item;
                    ob.populate && ob.populate.apply(ob, args);
                } else {
                    willCreated.push(item);
                }
            });
            // 创建新元素
            args[0] = willCreated;
            var newBtns = this._btnsCreator.apply(this, args);

            // 整理
            var array = [];
            BI.each(items, function (i, item) {
                item = BI.stripEL(item);
                var button = self.buttons[val(item)] || newBtns[val(item)];
                linkHashMap.add(val(item), button);
                array.push(button);
            });
            this.buttons = linkHashMap.map;

            BI.DOM.hang(this.buttons);
            this.element.empty();

            var packages = this._packageItems(items, this._packageBtns(array));
            BI.createWidget(BI.extend({element: this}, this._packageLayout(packages)));
        },

        getIndexByValue: function () {
            throw new Error("Can not use getIndexByValue");
        }
    });
    BI.shortcut("bi.filter_list", FilterList);
}());