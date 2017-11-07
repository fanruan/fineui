/**
 * guy
 * 这仅仅只是一个超类, 所有简单控件的基类
 * 1、类的控制，
 * 2、title的控制
 * 3、文字超过边界显示3个点
 * 4、cursor默认pointor
 * @class BI.Single
 * @extends BI.Widget
 * @abstract
 */
BI.Single = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.Single.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-single",
            readonly: false,
            title: null,
            warningTitle: null,
            tipType: null, // success或warning
            value: null
        })
    },

    _showToolTip: function (e, opt) {
        opt || (opt = {});
        var self = this;
        var type = this.getTipType() || (this.isEnabled() ? "success" : "warning");
        var title = type === "success" ? this.getTitle() : (this.getWarningTitle() || this.getTitle());
        if (BI.isKey(title)) {
            BI.Tooltips.show(e, this.getName(), title, type, this, opt);
        }
    },

    _hideTooltip: function () {
        var self = this;
        var tooltip = BI.Tooltips.get(this.getName());
        if (BI.isNotNull(tooltip)) {
            tooltip.element.fadeOut(200, function () {
                BI.Tooltips.remove(self.getName());
            });
        }
    },

    _init: function () {
        BI.Single.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isKey(o.title) || BI.isKey(o.warningTitle)
            || BI.isFunction(o.title) || BI.isFunction(o.warningTitle)) {
            this.enableHover();
        }
    },

    enableHover: function (opt) {
        opt || (opt = {});
        var self = this;
        if (!this._hoverBinded) {
            this.element.on("mouseenter.title" + this.getName(), function (e) {
                self._e = e;
                if (self.getTipType() === "warning" || (BI.isKey(self.getWarningTitle()) && !self.isEnabled())) {
                    self.timeout = BI.delay(function () {
                        self._showToolTip(self._e || e, opt);
                    }, 200);
                } else if (self.getTipType() === "success" || self.isEnabled()) {
                    self.timeout = BI.delay(function () {
                        self._showToolTip(self._e || e, opt);
                    }, 500);
                }
            });
            this.element.on("mousemove.title" + this.getName(), function (e) {
                self._e = e;
                if (!self.element.__isMouseInBounds__(e)) {
                    if (BI.isNotNull(self.timeout)) {
                        clearTimeout(self.timeout);
                    }
                    self._hideTooltip();
                }
            });
            this.element.on("mouseleave.title" + this.getName(), function () {
                self._e = null;
                if (BI.isNotNull(self.timeout)) {
                    clearTimeout(self.timeout);
                }
                self._hideTooltip();
            });
            this._hoverBinded = true;
        }
    },

    disabledHover: function () {
        //取消hover事件
        if (BI.isNotNull(this.timeout)) {
            clearTimeout(this.timeout);
        }
        this._hideTooltip();
        $(this.element).unbind("mouseenter.title" + this.getName())
            .unbind("mousemove.title" + this.getName())
            .unbind("mouseleave.title" + this.getName());
        this._hoverBinded = false;
    },

    populate: function (items) {
        this.items = items || [];
    },

    //opt: {container: '', belowMouse: false}
    setTitle: function (title, opt) {
        this.options.title = title;
        if (BI.isKey(title)) {
            this.enableHover(opt);
        } else {
            this.disabledHover();
        }
    },

    setWarningTitle: function (title, opt) {
        this.options.warningTitle = title;
        if (BI.isKey(title)) {
            this.enableHover(opt);
        } else {
            this.disabledHover();
        }
    },

    getTipType: function () {
        return this.options.tipType;
    },

    isReadOnly: function () {
        return !!this.options.readonly;
    },

    getTitle: function () {
        var title = this.options.title;
        if(BI.isFunction(title)) {
            return title();
        }
        return title;
    },

    getWarningTitle: function () {
        var title = this.options.warningTitle;
        if(BI.isFunction(title)) {
            return title();
        }
        return title;
    },

    setValue: function (val) {
        if (!this.options.readonly) {
            this.options.value = val;
        }
    },

    getValue: function () {
        return this.options.value;
    }
});