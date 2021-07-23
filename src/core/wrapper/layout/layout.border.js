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
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
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
                    this.getWidgetByName(this._getChildName("north")).element.height(item.height / BI.pixRatio + BI.pixUnit)
                        .css({
                            position: "absolute",
                            top: (item.top || 0) / BI.pixRatio + BI.pixUnit,
                            left: (item.left || 0) / BI.pixRatio + BI.pixUnit,
                            right: (item.right || 0) / BI.pixRatio + BI.pixUnit,
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
                    this.getWidgetByName(this._getChildName("south")).element.height(item.height / BI.pixRatio + BI.pixUnit)
                        .css({
                            position: "absolute",
                            bottom: (item.bottom || 0) / BI.pixRatio + BI.pixUnit,
                            left: (item.left || 0) / BI.pixRatio + BI.pixUnit,
                            right: (item.right || 0) / BI.pixRatio + BI.pixUnit,
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
                    this.getWidgetByName(this._getChildName("west")).element.width(item.width / BI.pixRatio + BI.pixUnit)
                        .css({
                            position: "absolute",
                            left: (item.left || 0) / BI.pixRatio + BI.pixUnit,
                            top: top / BI.pixRatio + BI.pixUnit,
                            bottom: bottom / BI.pixRatio + BI.pixUnit,
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
                    this.getWidgetByName(this._getChildName("east")).element.width(item.width / BI.pixRatio + BI.pixUnit)
                        .css({
                            position: "absolute",
                            right: (item.right || 0) / BI.pixRatio + BI.pixUnit,
                            top: top / BI.pixRatio + BI.pixUnit,
                            bottom: bottom / BI.pixRatio + BI.pixUnit,
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
                        top: top / BI.pixRatio + BI.pixUnit,
                        bottom: bottom / BI.pixRatio + BI.pixUnit,
                        left: left / BI.pixRatio + BI.pixUnit,
                        right: right / BI.pixRatio + BI.pixUnit
                    });
            }
        }
    },

    update: function (opt) {
    },

    populate: function (items) {
        BI.BorderLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.border", BI.BorderLayout);
