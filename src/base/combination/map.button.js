/**
 * value作为key值缓存button，  不支持顺序读写
 * 适合用于频繁增删的一组button
 * Created by GUY on 2015/8/10.
 * @class BI.ButtonMap
 * @extends BI.ButtonTree
 */

BI.ButtonMap = BI.inherit(BI.ButtonTree, {
    _defaultConfig: function () {
        return BI.extend(BI.ButtonMap.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-button-map"
        })
    },

    _init: function () {
        BI.ButtonMap.superclass._init.apply(this, arguments);
    },

    _createBtns: function (items) {
        var self = this, o = this.options;
        var buttons = BI.createWidgets(BI.createItems(items, {type: "bi.text_button", once: o.chooseType === 0}));
        var keys = BI.map(items, function (i, item) {
            item = BI.stripEL(item);
            if (!(item.id || item.value)) {
                throw new Error("item必须包含id或value属性");
            }
            return item.id || item.value;
        });
        return BI.object(keys, buttons);
    },

    setValue: function (v) {
        var self = this;
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
        var self = this;
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
        //所有已存在的和新添加的
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
        //创建新元素
        args[0] = willCreated;
        var newBtns = this._btnsCreator.apply(this, args);

        //整理
        var array = [];
        BI.each(items, function (i, item) {
            item = BI.stripEL(item);
            var button = self.buttons[val(item)] || newBtns[val(item)];
            linkHashMap.add(val(item), button);
            array.push(button);
        });
        this.buttons = linkHashMap.map;

        BI.DOM.hang(this.buttons);
        this.empty();

        var packages = this._packageItems(items, this._packageBtns(array));
        BI.createWidget(BI.extend({element: this}, this._packageLayout(packages)));
    },

    getIndexByValue: function (value) {
        throw new Error("不能使用getIndexByValue方法");
    }
});
BI.ButtonMap.EVENT_CHANGE = "EVENT_CHANGE";

$.shortcut("bi.button_map", BI.ButtonMap);