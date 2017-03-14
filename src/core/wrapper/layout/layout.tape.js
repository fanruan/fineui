/**
 * 水平tape布局
 * @class BI.HTapeLayout
 * @extends BI.Layout
 */
BI.HTapeLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HTapeLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-h-tape-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: [
                {
                    width: 100,
                    el: {type: 'bi.button', text: 'button1'}
                },
                {
                    width: 'fill',
                    el: {type: 'bi.button', text: 'button2'}
                },
                {
                    width: 200,
                    el: {type: 'bi.button', text: 'button3'}
                }
            ]
        });
    },
    _init: function () {
        BI.HTapeLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },
    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        BI.each(items, function (i, item) {
            if (!self.hasWidget(self.getName() + i + "")) {
                var w = BI.createWidget(item);
                self.addWidget(self.getName() + i + "", w);
            } else {
                w = self.getWidgetByName(self.getName() + i + "");
            }
            w.element.css({"position": "absolute", top: o.vgap + o.tgap + "px", bottom: o.vgap + o.bgap + "px"});
        });

        var left = {}, right = {};
        left[0] = 0;
        right[items.length - 1] = 0;

        BI.any(items, function (i, item) {
            var w = self.getWidgetByName(self.getName() + i + "");
            if (BI.isNull(left[i])) {
                left[i] = left[i - 1] + items[i - 1].width + 2 * o.hgap + o.lgap + o.rgap;
            }
            if (item.width < 1 && item.width >= 0) {
                w.element.css({"left": left[i] * 100 + "%", width: item.width * 100 + "%"})
            } else {
                w.element.css({
                    "left": left[i] + o.hgap + o.lgap + "px",
                    width: BI.isNumber(item.width) ? item.width : ""
                });
            }
            if (!BI.isNumber(item.width)) {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            var w = self.getWidgetByName(self.getName() + i + "");
            if (BI.isNull(right[i])) {
                right[i] = right[i + 1] + items[i + 1].width + 2 * o.hgap + o.lgap + o.rgap;
            }
            if (item.width < 1 && item.width >= 0) {
                w.element.css({"right": right[i] * 100 + "%", width: item.width * 100 + "%"})
            } else {
                w.element.css({
                    "right": right[i] + o.hgap + o.rgap + "px",
                    width: BI.isNumber(item.width) ? item.width : ""
                });
            }
            if (!BI.isNumber(item.width)) {
                return true;
            }
        })
    },

    populate: function (items) {
        BI.HTapeLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.htape', BI.HTapeLayout);

/**
 * 垂直tape布局
 * @class BI.VTapeLayout
 * @extends BI.Layout
 */
BI.VTapeLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.VTapeLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-v-tape-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: [
                {
                    height: 100,
                    el: {type: 'bi.button', text: 'button1'}
                },
                {
                    height: 'fill',
                    el: {type: 'bi.button', text: 'button2'}
                },
                {
                    height: 200,
                    el: {type: 'bi.button', text: 'button3'}
                }
            ]
        });
    },
    _init: function () {
        BI.VTapeLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        BI.each(items, function (i, item) {
            if (!self.hasWidget(self.getName() + i + "")) {
                var w = BI.createWidget(item);
                self.addWidget(self.getName() + i + "", w);
            } else {
                w = self.getWidgetByName(self.getName() + i + "");
            }
            w.element.css({"position": "absolute", left: o.hgap + o.lgap + "px", right: o.hgap + o.rgap + "px"});
        });

        var top = {}, bottom = {};
        top[0] = 0;
        bottom[items.length - 1] = 0;

        BI.any(items, function (i, item) {
            var w = self.getWidgetByName(self.getName() + i + "");
            if (BI.isNull(top[i])) {
                top[i] = top[i - 1] + items[i - 1].height + 2 * o.vgap + o.tgap + o.bgap;
            }
            if (item.height < 1 && item.height >= 0) {
                w.element.css({"top": top[i] * 100 + "%", height: item.height * 100 + "%"})
            } else {
                w.element.css({
                    "top": top[i] + o.vgap + o.tgap + "px",
                    height: BI.isNumber(item.height) ? item.height : ""
                });
            }
            if (!BI.isNumber(item.height)) {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            var w = self.getWidgetByName(self.getName() + i + "");
            if (BI.isNull(bottom[i])) {
                bottom[i] = bottom[i + 1] + items[i + 1].height + 2 * o.vgap + o.tgap + o.bgap;
            }
            if (item.height < 1 && item.height >= 0) {
                w.element.css({"bottom": bottom[i] * 100 + "%", height: item.height * 100 + "%"})
            } else {
                w.element.css({
                    "bottom": bottom[i] + o.vgap + o.bgap + "px",
                    height: BI.isNumber(item.height) ? item.height : ""
                });
            }
            if (!BI.isNumber(item.height)) {
                return true;
            }
        })
    },

    populate: function (items) {
        BI.VTapeLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.vtape', BI.VTapeLayout);