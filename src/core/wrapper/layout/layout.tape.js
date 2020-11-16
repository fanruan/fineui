/**
 * 水平tape布局
 * @class BI.HTapeLayout
 * @extends BI.Layout
 */
BI.HTapeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HTapeLayout.superclass.props.apply(this, arguments), {
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
                    el: {type: "bi.button", text: "button1"}
                },
                {
                    width: "fill",
                    el: {type: "bi.button", text: "button2"}
                },
                {
                    width: 200,
                    el: {type: "bi.button", text: "button3"}
                }
            ]
        });
    },
    render: function () {
        BI.HTapeLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },
    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        BI.each(items, function (i, item) {
            if (!self.hasWidget(self._getChildName(i))) {
                var w = BI._lazyCreateWidget(item);
                self.addWidget(self._getChildName(i), w);
            } else {
                w = self.getWidgetByName(self._getChildName(i));
            }
            w.element.css({position: "absolute", top: (item.vgap || 0) + (item.tgap || 0) + o.vgap + o.tgap + "px", bottom: (item.bgap || 0) + (item.vgap || 0) + o.vgap + o.bgap + "px"});
        });

        var left = {}, right = {};
        left[0] = 0;
        right[items.length - 1] = 0;

        BI.any(items, function (i, item) {
            var w = self.getWidgetByName(self._getChildName(i));
            if (BI.isNull(left[i])) {
                left[i] = left[i - 1] + items[i - 1].width + (items[i - 1].lgap || 0) + 2 * (items[i - 1].hgap || 0) + o.hgap + o.lgap + o.rgap;
            }
            if (item.width < 1 && item.width >= 0) {
                w.element.css({left: left[i] * 100 + "%", width: item.width * 100 + "%"});
            } else {
                w.element.css({
                    left: left[i] + (item.lgap || 0) + (item.hgap || 0) + o.hgap + o.lgap + "px",
                    width: BI.isNumber(item.width) ? item.width : ""
                });
            }
            if (!BI.isNumber(item.width)) {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            var w = self.getWidgetByName(self._getChildName(i));
            if (BI.isNull(right[i])) {
                right[i] = right[i + 1] + items[i + 1].width + (items[i + 1].rgap || 0) + 2 * (items[i + 1].hgap || 0) + o.hgap + o.lgap + o.rgap;
            }
            if (item.width < 1 && item.width >= 0) {
                w.element.css({right: right[i] * 100 + "%", width: item.width * 100 + "%"});
            } else {
                w.element.css({
                    right: right[i] + (item.rgap || 0) + (item.hgap || 0) + o.hgap + o.rgap + "px",
                    width: BI.isNumber(item.width) ? item.width : ""
                });
            }
            if (!BI.isNumber(item.width)) {
                return true;
            }
        });
    },

    update: function () {
        var updated;
        BI.each(this._children, function (i, child) {
            updated = child.update() || updated;
        });
        return updated;
    },

    populate: function (items) {
        BI.HTapeLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.htape", BI.HTapeLayout);

/**
 * 垂直tape布局
 * @class BI.VTapeLayout
 * @extends BI.Layout
 */
BI.VTapeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.VTapeLayout.superclass.props.apply(this, arguments), {
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
                    el: {type: "bi.button", text: "button1"}
                },
                {
                    height: "fill",
                    el: {type: "bi.button", text: "button2"}
                },
                {
                    height: 200,
                    el: {type: "bi.button", text: "button3"}
                }
            ]
        });
    },
    render: function () {
        BI.VTapeLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        BI.each(items, function (i, item) {
            if (!self.hasWidget(self._getChildName(i))) {
                var w = BI._lazyCreateWidget(item);
                self.addWidget(self._getChildName(i), w);
            } else {
                w = self.getWidgetByName(self._getChildName(i));
            }
            w.element.css({position: "absolute", left: (item.lgap || 0) + (item.hgap || 0) + o.hgap + o.lgap + "px", right: + (item.hgap || 0) + (item.rgap || 0) + o.hgap + o.rgap + "px"});
        });

        var top = {}, bottom = {};
        top[0] = 0;
        bottom[items.length - 1] = 0;

        BI.any(items, function (i, item) {
            var w = self.getWidgetByName(self._getChildName(i));
            if (BI.isNull(top[i])) {
                top[i] = top[i - 1] + items[i - 1].height + (items[i - 1].tgap || 0) + 2 * (items[i - 1].vgap || 0) + o.vgap + o.tgap + o.bgap;
            }
            if (item.height < 1 && item.height >= 0) {
                w.element.css({top: top[i] * 100 + "%", height: item.height * 100 + "%"});
            } else {
                w.element.css({
                    top: top[i] + (item.vgap || 0) + (item.tgap || 0) + o.vgap + o.tgap + "px",
                    height: BI.isNumber(item.height) ? item.height : ""
                });
            }
            if (!BI.isNumber(item.height)) {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            var w = self.getWidgetByName(self._getChildName(i));
            if (BI.isNull(bottom[i])) {
                bottom[i] = bottom[i + 1] + items[i + 1].height + (items[i + 1].bgap || 0) + 2 * (items[i + 1].vgap || 0) + o.vgap + o.tgap + o.bgap;
            }
            if (item.height < 1 && item.height >= 0) {
                w.element.css({bottom: bottom[i] * 100 + "%", height: item.height * 100 + "%"});
            } else {
                w.element.css({
                    bottom: bottom[i] + (item.vgap || 0) + (item.bgap || 0) + o.vgap + o.bgap + "px",
                    height: BI.isNumber(item.height) ? item.height : ""
                });
            }
            if (!BI.isNumber(item.height)) {
                return true;
            }
        });
    },

    update: function () {
    },

    populate: function (items) {
        BI.VTapeLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.vtape", BI.VTapeLayout);
