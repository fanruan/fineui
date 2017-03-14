/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.BorderLayout
 * @extends BI.Layout
 */
BI.BorderLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.BorderLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-border-layout",
            items: {}
        });
    },
    _init: function () {
        BI.BorderLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function(regions){
        var item;
        var top = 0;
        var bottom = 0;
        var left = 0;
        var right = 0;
        if ("north" in regions) {
            item = regions["north"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this.getName() + "north")) {
                        var w = BI.createWidget(item);
                        this.addWidget(this.getName() + "north", w);
                    }
                    this.getWidgetByName(this.getName() + "north").element.height(item.height)
                        .css({
                            "position": "absolute",
                            "top": (item.top || 0),
                            "left": (item.left || 0),
                            "right": (item.right || 0),
                            "bottom": "initial"
                        });
                }
                top = (item.height || 0) + (item.top || 0) + (item.bottom || 0);
            }
        }
        if ("south" in regions) {
            item = regions["south"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this.getName() + "south")) {
                        var w = BI.createWidget(item);
                        this.addWidget(this.getName() + "south", w);
                    }
                    this.getWidgetByName(this.getName() + "south").element.height(item.height)
                        .css({
                            "position": "absolute",
                            "bottom": (item.bottom || 0),
                            "left": (item.left || 0),
                            "right": (item.right || 0),
                            "top": "initial"
                        });
                }
                bottom = (item.height || 0) + (item.top || 0) + (item.bottom || 0);
            }
        }
        if ("west" in regions) {
            item = regions["west"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this.getName() + "west")) {
                        var w = BI.createWidget(item);
                        this.addWidget(this.getName() + "west", w);
                    }
                    this.getWidgetByName(this.getName() + "west").element.width(item.width)
                        .css({
                            "position": "absolute",
                            "left": (item.left || 0),
                            top: top,
                            bottom: bottom,
                            "right": "initial"
                        });
                }
                left = (item.width || 0) + (item.left || 0) + (item.right || 0);
            }
        }
        if ("east" in regions) {
            item = regions["east"];
            if (item != null) {
                if (item.el) {
                    if (!this.hasWidget(this.getName() + "east")) {
                        var w = BI.createWidget(item);
                        this.addWidget(this.getName() + "east", w);
                    }
                    this.getWidgetByName(this.getName() + "east").element.width(item.width)
                        .css({
                            "position": "absolute",
                            "right": (item.right || 0),
                            top: top,
                            bottom: bottom,
                            "left": "initial"
                        });
                }
                right = (item.width || 0) + (item.left || 0) + (item.right || 0);
            }
        }
        if ("center" in regions) {
            item = regions["center"];
            if (item != null) {
                if (!this.hasWidget(this.getName() + "center")) {
                    var w = BI.createWidget(item);
                    this.addWidget(this.getName() + "center", w);
                }
                this.getWidgetByName(this.getName() + "center").element
                    .css({"position": "absolute", "top": top, "bottom": bottom, "left": left, "right": right});
            }
        }
    },

    populate: function (items) {
        BI.BorderLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.border', BI.BorderLayout);