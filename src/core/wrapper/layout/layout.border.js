/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.BorderLayout
 * @extends BI.Layout
 */
BI.BorderLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.BorderLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-border-layout",
            items: {}
        });
    },
    render: function () {
        BI.BorderLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加子组件");
    },

    stroke: function (regions) {
        var item;
        var top = 0;
        var bottom = 0;
        var left = 0;
        var right = 0;
        if ("north" in regions) {
            item = regions["north"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this._getChildName("north"))) {
                        var w = BI._lazyCreateWidget(item);
                        this.addWidget(this._getChildName("north"), w);
                    }
                    this.getWidgetByName(this._getChildName("north")).element.height(this._optimiseGap(item.height))
                        .css({
                            position: "absolute",
                            top: this._optimiseGap(item.top || 0),
                            left: this._optimiseGap(item.left || 0),
                            right: this._optimiseGap(item.right || 0),
                            bottom: "initial"
                        });
                }
                top = (item.height || 0) + (item.top || 0) + (item.bottom || 0);
            }
        }
        if ("south" in regions) {
            item = regions["south"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this._getChildName("south"))) {
                        var w = BI._lazyCreateWidget(item);
                        this.addWidget(this._getChildName("south"), w);
                    }
                    this.getWidgetByName(this._getChildName("south")).element.height(this._optimiseGap(item.height))
                        .css({
                            position: "absolute",
                            bottom: this._optimiseGap(item.bottom || 0),
                            left: this._optimiseGap(item.left || 0),
                            right: this._optimiseGap(item.right || 0),
                            top: "initial"
                        });
                }
                bottom = (item.height || 0) + (item.top || 0) + (item.bottom || 0);
            }
        }
        if ("west" in regions) {
            item = regions["west"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this._getChildName("west"))) {
                        var w = BI._lazyCreateWidget(item);
                        this.addWidget(this._getChildName("west"), w);
                    }
                    this.getWidgetByName(this._getChildName("west")).element.width(this._optimiseGap(item.width))
                        .css({
                            position: "absolute",
                            left: this._optimiseGap(item.left || 0),
                            top: this._optimiseGap(top),
                            bottom: this._optimiseGap(bottom),
                            right: "initial"
                        });
                }
                left = (item.width || 0) + (item.left || 0) + (item.right || 0);
            }
        }
        if ("east" in regions) {
            item = regions["east"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this._getChildName("east"))) {
                        var w = BI._lazyCreateWidget(item);
                        this.addWidget(this._getChildName("east"), w);
                    }
                    this.getWidgetByName(this._getChildName("east")).element.width(this._optimiseGap(item.width))
                        .css({
                            position: "absolute",
                            right: this._optimiseGap(item.right || 0),
                            top: this._optimiseGap(top),
                            bottom: this._optimiseGap(bottom),
                            left: "initial"
                        });
                }
                right = (item.width || 0) + (item.left || 0) + (item.right || 0);
            }
        }
        if ("center" in regions) {
            item = regions["center"];
            if (item != null) {
                if (!this.hasWidget(this._getChildName("center"))) {
                    var w = BI._lazyCreateWidget(item);
                    this.addWidget(this._getChildName("center"), w);
                }
                this.getWidgetByName(this._getChildName("center")).element
                    .css({
                        position: "absolute",
                        top: this._optimiseGap(top),
                        bottom: this._optimiseGap(bottom),
                        left: this._optimiseGap(left),
                        right: this._optimiseGap(right)
                    });
            }
        }
    },

    update: function (opt) {
        return this.forceUpdate(opt);
    },

    populate: function (items) {
        BI.BorderLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.border", BI.BorderLayout);
