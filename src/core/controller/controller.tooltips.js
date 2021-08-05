/**
 * tooltip控制器
 * 控制tooltip的显示,  且页面中只有一个tooltip显示
 *
 * Created by GUY on 2015/9/8.
 * @class BI.TooltipsController
 * @extends BI.Controller
 */
BI.TooltipsController = BI.inherit(BI.Controller, {
    init: function () {
        this.tooltipsManager = {};
        this.showingTips = {};// 存储正在显示的tooltip
    },

    _createTooltip: function (text, level) {
        return BI.createWidget({
            type: "bi.tooltip",
            text: text,
            level: level,
            stopEvent: true
        });
    },

    // opt: {container: '', belowMouse: false}
    show: function (e, name, text, level, context, opt) {
        opt || (opt = {});
        var self = this;
        BI.each(this.showingTips, function (i, tip) {
            self.hide(i);
        });
        this.showingTips = {};
        if (!this.has(name)) {
            this.create(name, text, level, opt.container || "body");
        }
        if (!opt.belowMouse) {
            var offset = context.element.offset();
            var bounds = context.element.bounds();
            if (bounds.height === 0 || bounds.width === 0) {
                return;
            }
            var top = offset.top + bounds.height + 5;
        }
        var tooltip = this.get(name);
        tooltip.setText(text);
        tooltip.element.css({
            left: "0px",
            top: "0px"
        });
        tooltip.visible();
        tooltip.element.height(tooltip.element[0].scrollHeight);
        this.showingTips[name] = true;
        // scale影响要计算在内
        // var scale = context.element.offset().left / context.element.get(0).getBoundingClientRect().left;
        // var x = (e.pageX || e.clientX) * scale + 15, y = (e.pageY || e.clientY) * scale + 15;
        var x = (e.pageX || e.clientX) + 15, y = (e.pageY || e.clientY) + 15;
        if (x + tooltip.element.outerWidth() > BI.Widget._renderEngine.createElement("body").outerWidth()) {
            x -= tooltip.element.outerWidth() + 15;
        }
        var bodyHeight = BI.Widget._renderEngine.createElement("body").outerHeight();
        if (y + tooltip.element.outerHeight() > bodyHeight || top + tooltip.element.outerHeight() > bodyHeight) {
            y -= tooltip.element.outerHeight() + 15;
            !opt.belowMouse && (y = Math.min(y, offset.top - tooltip.element.outerHeight() - 5));
        } else {
            !opt.belowMouse && (y = Math.max(y, top));
        }
        tooltip.element.css({
            left: x < 0 ? 0 : x / BI.pixRatio + BI.pixUnit,
            top: y < 0 ? 0 : y / BI.pixRatio + BI.pixUnit
        });
        tooltip.element.hover(function () {
            self.remove(name);
            context.element.trigger("mouseleave.title" + context.getName());
        });
        return this;
    },

    hide: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        delete this.showingTips[name];
        this.get(name).element.hide(0, callback);
        this.get(name).invisible();
        return this;
    },

    create: function (name, text, level, context) {
        if (!this.has(name)) {
            var tooltip = this._createTooltip(text, level);
            this.add(name, tooltip);
            BI.createWidget({
                type: "bi.absolute",
                element: context || "body",
                items: [{
                    el: tooltip
                }]
            });
            tooltip.invisible();
        }
        return this.get(name);
    },

    add: function (name, bubble) {
        if (this.has(name)) {
            return this;
        }
        this.set(name, bubble);
        return this;
    },

    get: function (name) {
        return this.tooltipsManager[name];
    },

    set: function (name, bubble) {
        this.tooltipsManager[name] = bubble;
    },

    has: function (name) {
        return this.tooltipsManager[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.tooltipsManager[name].destroy();
        delete this.tooltipsManager[name];
        return this;
    },

    removeAll: function () {
        BI.each(this.tooltipsManager, function (name, tooltip) {
            tooltip.destroy();
        });
        this.tooltipsManager = {};
        this.showingTips = {};
        return this;
    }
});
