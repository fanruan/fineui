/**
 * 有确定取消按钮的弹出层
 * @class BI.BarFloatSection
 * @extends BI.FloatSection
 * @abstract
 */
BI.BarFloatSection = BI.inherit(BI.FloatSection, {
    _defaultConfig: function () {
        return BI.extend(BI.BarFloatSection.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText(BI.i18nText("BI-Sure")), BI.i18nText("BI-Cancel")]
        })
    },

    _init: function () {
        BI.BarFloatSection.superclass._init.apply(this, arguments);
        var self = this;
        var flatten = ["_init", "_defaultConfig", "_vessel", "_render", "getName", "listenEnd", "local", "refresh", "load", "change"];
        flatten = BI.makeObject(flatten, true);
        BI.each(this.constructor.caller.caller.caller.caller.prototype, function (key) {
            if (flatten[key]) {
                return;
            }
            var f = self[key];
            if (BI.isFunction(f)) {
                self[key] = BI.bind(function () {
                    if (this.model._start === true) {
                        this._F.push({f: f, arg: arguments});
                        return;
                    }
                    return f.apply(this, arguments);
                }, self);
            }
        })
    },

    rebuildSouth: function (south) {
        var self = this, o = this.options;
        this.sure = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[0],
            height: 30,
            value: 0,
            handler: function (v) {
                self.end();
                self.close(v);
            }
        });
        this.cancel = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[1],
            height: 30,
            value: 1,
            level: 'ignore',
            handler: function (v) {
                self.close(v);
            }
        });
        BI.createWidget({
            type: 'bi.right_vertical_adapt',
            element: south,
            hgap: 5,
            items: [this.cancel, this.sure]
        });
    }
});

/**
 * 有确定取消按钮的弹出层
 * @class BI.BarPopoverSection
 * @extends BI.PopoverSection
 * @abstract
 */
BI.BarPopoverSection = BI.inherit(BI.PopoverSection, {
    _defaultConfig: function () {
        return BI.extend(BI.BarPopoverSection.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText(BI.i18nText("BI-Sure")), BI.i18nText(BI.i18nText("BI-Cancel"))]
        })
    },

    _init: function () {
        BI.BarPopoverSection.superclass._init.apply(this, arguments);
    },

    rebuildSouth: function (south) {
        var self = this;
        this.sure = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[0],
            height: 30,
            value: 0,
            handler: function (v) {
                self.end();
                self.close(v);
            }
        });
        this.cancel = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[1],
            height: 30,
            value: 1,
            level: 'ignore',
            handler: function (v) {
                self.close(v);
            }
        });
        BI.createWidget({
            type: 'bi.right_vertical_adapt',
            element: south,
            hgap: 5,
            items: [this.cancel, this.sure]
        });
    }
});