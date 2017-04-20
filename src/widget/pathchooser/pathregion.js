/**
 * 路径选择区域
 *
 * Created by GUY on 2015/12/4.
 * @class BI.PathRegion
 * @extends BI.Widget
 */
BI.PathRegion = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PathRegion.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-path-region bi-background",
            width: 80,
            title: ""
        })
    },

    _init: function () {
        BI.PathRegion.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.zIndex = 100;
        var title = BI.createWidget({
            type: "bi.label",
            text: o.title,
            title: o.title,
            height: 30
        });
        title.element.css("zIndex", this.zIndex--);
        this.items = [];
        this.vertical = BI.createWidget({
            type: "bi.vertical",
            element: this,
            bgap: 5,
            hgap: 10,
            items: [title]
        })
    },

    hasItem: function (val) {
        return BI.any(this.items, function (i, item) {
            return val === item.getValue();
        });
    },

    addItem: function (value, text) {
        if (BI.isKey(value)) {
            var label = BI.createWidget({
                type: "bi.label",
                cls: "path-region-label bi-card bi-border bi-list-item-active",
                text: text,
                value: value,
                title: text || value,
                height: 22
            });
        } else {
            var label = BI.createWidget({
                type: "bi.layout",
                height: 24
            });
        }
        label.element.css("zIndex", this.zIndex--);
        this.items.push(label);
        this.vertical.addItem(label);
        if (this.items.length === 1) {
            this.setSelect(0, value);
        }
    },

    reset: function () {
        BI.each(this.items, function (i, item) {
            item.element.removeClass("active");
        });
    },

    setSelect: function (index, value) {
        this.reset();
        if (this.items.length <= 0) {
            return;
        }
        if (this.items.length === 1) {
            this.items[0].element.addClass("active");
            return;
        }
        if (this.items[index].attr("value") === value) {
            this.items[index].element.addClass("active");
        }
    },

    setValue: function (value) {
        this.setSelect(this.getIndexByValue(value), value);
    },

    getValueByIndex: function (idx) {
        return this.items[idx].attr("value");
    },

    getIndexByValue: function (value) {
        return BI.findIndex(this.items, function (i, item) {
            return item.attr("value") === value;
        });
    },

    getValue: function () {
        var res;
        BI.any(this.items, function (i, item) {
            if (item.element.hasClass("active")) {
                res = item.getValue();
                return true;
            }
        });
        return res;
    }
});
BI.PathRegion.EVENT_CHANGE = "PathRegion.EVENT_CHANGE";
BI.shortcut("bi.path_region", BI.PathRegion);