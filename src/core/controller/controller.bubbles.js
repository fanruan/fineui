/**
 * 气泡图控制器
 * 控制气泡图的显示方向
 *
 * Created by GUY on 2015/8/21.
 * @class
 */
BI.BubblesController = BI.inherit(BI.Controller, {
    init: function () {
        this.storeBubbles = {};
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
        // var fixed = opt.fixed !== false;

        if (!this.storeBubbles[name]) {
            this.storeBubbles[name] = BI.createWidget({
                type: "bi.label",
                cls: "bi-bubble" + " bubble-" + level,
                text: text,
                hgap: 5,
                height: 18
            });
        }
        var bubble = this.storeBubbles[name];

        BI.createWidget({
            type: "bi.default",
            element: container,
            items: [{
                el: bubble
            }]
        });
        BI.Popper.createPopper(context.element[0], bubble.element[0], {
            placement: ({
                left: "top-start",
                center: "top",
                right: "top-end"
            })[offsetStyle],
            strategy: "fixed",
            modifiers: [
                {
                    name: "offset",
                    options: {
                        offset: [adjustXOffset, adjustYOffset]
                    }
                }
            ]
        });
        return this;
    },

    hide: function (name) {
        this.remove(name);
    },

    has: function (name) {
        return this.storeBubbles[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.storeBubbles[name].destroy();
        delete this.storeBubbles[name];
        return this;
    }
});
