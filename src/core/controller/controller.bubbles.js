/**
 * 气泡图控制器
 * 控制气泡图的显示方向
 *
 * Created by GUY on 2015/8/21.
 * @class
 */
BI.BubblesController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.BubblesController.superclass._defaultConfig.apply(this, arguments), {});
    },

    _const: {
        bubbleHeight: 18
    },

    _init: function () {
        BI.BubblesController.superclass._init.apply(this, arguments);
        var self = this;
        this.bubblesManager = {};
        this.storeBubbles = {};
        BI.Resizers.add("bubbleController" + BI.uniqueId(), function () {
            BI.each(self.bubblesManager, function (name) {
                self.remove(name);
            });
            self.bubblesManager = {};
            self.storeBubbles = {};
        });
    },

    _createBubble: function (direct, text, level, height, fixed) {
        return BI.createWidget({
            type: fixed === false ? "bi.bubble_view" : "bi.bubble",
            text: text,
            level: level,
            height: height || 18,
            direction: direct
        });
    },

    _getOffsetLeft: function (name, context, offsetStyle) {
        var left = 0;
        if ("center" === offsetStyle) {
            left = context.element.offset().left + (context.element.bounds().width - this.get(name).element.bounds().width) / 2;
            if (left < 0) {
                left = 0;
            }
            return left;
        }
        if ("right" === offsetStyle) {
            left = context.element.offset().left + context.element.bounds().width - this.get(name).element.bounds().width;
            if (left < 0) {
                left = 0;
            }
            return left;
        }
        return context.element.offset().left;
    },

    _getOffsetTop: function (name, context, offsetStyle) {
        var top = 0;
        if ("center" === offsetStyle) {
            top = context.element.offset().top + (context.element.bounds().height - this.get(name).element.bounds().height) / 2;
            if (top < 0) {
                top = 0;
            }
            return top;
        } else if ("right" === offsetStyle) {
            top = context.element.offset().top + context.element.bounds().height - this.get(name).element.bounds().height;
            if (top < 0) {
                top = 0;
            }
            return top;
        }
        return context.element.offset().top;
    },

    _getLeftPosition: function (name, context, offsetStyle) {
        var position = BI.DOM.getLeftPosition(context, this.get(name));
        position.top = this._getOffsetTop(name, context, offsetStyle);
        return position;
    },

    _getBottomPosition: function (name, context, offsetStyle) {
        var position = BI.DOM.getBottomPosition(context, this.get(name));
        position.left = this._getOffsetLeft(name, context, offsetStyle);
        return position;
    },

    _getTopPosition: function (name, context, offsetStyle) {
        var position = BI.DOM.getTopPosition(context, this.get(name));
        position.left = this._getOffsetLeft(name, context, offsetStyle);
        return position;
    },

    _getRightPosition: function (name, context, offsetStyle) {
        var position = BI.DOM.getRightPosition(context, this.get(name));
        position.top = this._getOffsetTop(name, context, offsetStyle);
        return position;
    },

    /**
     *
     * @param name
     * @param text
     * @param context
     * @param offsetStyle center, left, right三种类型， 默认left
     * @returns {BI.BubblesController}
     */
    show: function (name, text, context, opt) {
        opt || (opt = {});
        var container = opt.container || context;
        var offsetStyle = opt.offsetStyle || "left";
        var level = opt.level || "error";
        var adjustYOffset = opt.adjustYOffset || 0;
        var adjustXOffset = opt.adjustXOffset || 0;
        var fixed = opt.fixed !== false;
        if (!this.storeBubbles[name]) {
            this.storeBubbles[name] = {};
        }
        if (!this.storeBubbles[name]["top"]) {
            this.storeBubbles[name]["top"] = this._createBubble("top", text, level, null, fixed);
        }
        BI.createWidget({
            type: "bi.absolute",
            element: container,
            items: [{
                el: this.storeBubbles[name]["top"]
            }]
        });
        this.set(name, this.storeBubbles[name]["top"]);

        // 如果是非固定位置（fixed）的bubble
        if (fixed === false) {
            var bubble = this.storeBubbles[name]["top"];
            var bounds = bubble.element.bounds();
            if (BI.DOM.isTopSpaceEnough(context, this.get(name), adjustYOffset)) {
                var top = -(bounds.height + adjustYOffset);
                switch (offsetStyle) {
                    case "center":
                        bubble.element.css({
                            left: (context.element.bounds().width - bounds.width) / 2 + adjustXOffset,
                            top: top
                        });
                        break;
                    case "right":
                        bubble.element.css({
                            right: adjustXOffset,
                            top: top
                        });
                        break;
                    default:
                        bubble.element.css({
                            left: adjustXOffset,
                            top: top
                        });
                        break;
                }
            } else {
                var bottom = -(bounds.height + adjustYOffset);
                switch (offsetStyle) {
                    case "center":
                        bubble.element.css({
                            left: (context.element.bounds().width - bounds.width) / 2 + adjustXOffset,
                            bottom: bottom
                        });
                        break;
                    case "right":
                        bubble.element.css({
                            right: adjustXOffset,
                            bottom: bottom
                        });
                        break;
                    default:
                        bubble.element.css({
                            left: adjustXOffset,
                            bottom: bottom
                        });
                        break;
                }
            }
            return this;
        }
        var position = this._getTopPosition(name, context, offsetStyle);
        this.get(name).element.css({left: position.left + adjustXOffset, top: position.top - adjustYOffset});
        if (!BI.DOM.isTopSpaceEnough(context, this.get(name), adjustYOffset)) {
            this.get(name).invisible();
            if (!this.storeBubbles[name]["left"]) {
                this.storeBubbles[name]["left"] = this._createBubble("left", text, level, 30, fixed);
            }
            BI.createWidget({
                type: "bi.absolute",
                element: container,
                items: [{
                    el: this.storeBubbles[name]["left"]
                }]
            });
            this.set(name, this.storeBubbles[name]["left"]);
            var position = this._getLeftPosition(name, context, offsetStyle);
            this.get(name).element.css({left: position.left - adjustXOffset, top: position.top - adjustYOffset});
            if (!BI.DOM.isLeftSpaceEnough(context, this.get(name), adjustXOffset)) {
                this.get(name).invisible();
                if (!this.storeBubbles[name]["right"]) {
                    this.storeBubbles[name]["right"] = this._createBubble("right", text, level, 30, fixed);
                }
                BI.createWidget({
                    type: "bi.absolute",
                    element: container,
                    items: [{
                        el: this.storeBubbles[name]["right"]
                    }]
                });
                this.set(name, this.storeBubbles[name]["right"]);
                var position = this._getRightPosition(name, context, offsetStyle);
                this.get(name).element.css({left: position.left + adjustXOffset, top: position.top - adjustYOffset});
                if (!BI.DOM.isRightSpaceEnough(context, this.get(name), adjustXOffset)) {
                    this.get(name).invisible();
                    if (!this.storeBubbles[name]["bottom"]) {
                        this.storeBubbles[name]["bottom"] = this._createBubble("bottom", text, level, null, fixed);
                    }
                    BI.createWidget({
                        type: "bi.absolute",
                        element: container,
                        items: [{
                            el: this.storeBubbles[name]["bottom"]
                        }]
                    });
                    this.set(name, this.storeBubbles[name]["bottom"]);
                    var position = this._getBottomPosition(name, context, offsetStyle);
                    this.get(name).element.css({
                        left: position.left + adjustXOffset,
                        top: position.top + adjustYOffset
                    });
                }
            }
        }
        return this;
    },

    hide: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.get(name).invisible();
        return this;
    },

    add: function (name, bubble) {
        if (this.has(name)) {
            return this;
        }
        this.set(name, bubble);
        return this;
    },

    get: function (name) {
        return this.bubblesManager[name];
    },

    set: function (name, bubble) {
        this.bubblesManager[name] = bubble;
    },

    has: function (name) {
        return this.bubblesManager[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        BI.each(this.storeBubbles[name], function (dir, bubble) {
            bubble.destroy();
        });
        delete this.storeBubbles[name];
        delete this.bubblesManager[name];
        return this;
    }
});
