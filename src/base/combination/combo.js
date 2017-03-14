/**
 * @class BI.Combo
 * @extends BI.Widget
 */
BI.Combo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.Combo.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-combo",
            trigger: "click",
            toggle: true,
            direction: "bottom", //top||bottom||left||right||top,left||top,right||bottom,left||bottom,right
            isDefaultInit: false,
            isNeedAdjustHeight: true,//是否需要高度调整
            isNeedAdjustWidth: true,
            adjustLength: 0,//调整的距离
            adjustXOffset: 0,
            adjustYOffset: 0,
            hideChecker: BI.emptyFn,
            offsetStyle: "left", //left,right,center
            el: {},
            popup: {},
            comboClass: "bi-combo-popup",
            hoverClass: "bi-combo-hover"
        })
    },

    _init: function () {
        BI.Combo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._initCombo();
        this._initPullDownAction();
        this.combo.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (self.isEnabled() && this.isEnabled()) {
                if (type === BI.Events.EXPAND) {
                    self._popupView();
                }
                if (type === BI.Events.COLLAPSE) {
                    self._hideView();
                }
                if (type === BI.Events.EXPAND || type === BI.Events.COLLAPSE) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                }

                if (type === BI.Events.CLICK) {
                    self.fireEvent(BI.Combo.EVENT_TRIGGER_CHANGE, obj);
                }
            }
        });

        self.element.on("mouseenter." + self.getName(), function (e) {
            if (self.isEnabled() && self.combo.isEnabled()) {
                self.element.addClass(o.hoverClass);
            }
        });
        self.element.on("mouseleave." + self.getName(), function (e) {
            if (self.isEnabled() && self.combo.isEnabled()) {
                self.element.removeClass(o.hoverClass);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this.element,
            items: [
                {el: this.combo}
            ]
        });
        o.isDefaultInit && (this._assertPopupView());
        BI.Resizers.add(this.getName(), BI.bind(function () {
            if (this.isViewVisible()) {
                this._hideView();
            }
        }, this));
    },

    _toggle: function () {
        this._assertPopupViewRender();
        if (this.popupView.isVisible()) {
            this._hideView();
        } else {
            if (this.isEnabled()) {
                this._popupView();
            }
        }
    },

    _initPullDownAction: function () {
        var self = this, o = this.options;
        var evs = this.options.trigger.split(",");
        BI.each(evs, function (i, ev) {
            switch (ev) {
                case "hover":
                    self.element.on("mouseenter." + self.getName(), function (e) {
                        if (self.isEnabled() && self.combo.isEnabled()) {
                            self._popupView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.combo);
                            self.fireEvent(BI.Combo.EVENT_EXPAND);
                        }
                    });
                    self.element.on("mouseleave." + self.getName(), function (e) {
                        if (self.isEnabled() && self.combo.isEnabled() && o.toggle === true) {
                            self._hideView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.combo);
                            self.fireEvent(BI.Combo.EVENT_COLLAPSE);
                        }
                    });
                    break;
                case "click":
                    if (ev) {
                        self.element.off(ev + "." + self.getName()).on(ev + "." + self.getName(), BI.debounce(function (e) {
                            if (self.combo.element.__isMouseInBounds__(e)) {
                                if (self.isEnabled() && self.combo.isEnabled()) {
                                    o.toggle ? self._toggle() : self._popupView();
                                    if (self.isViewVisible()) {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.combo);
                                        self.fireEvent(BI.Combo.EVENT_EXPAND);
                                    } else {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.combo);
                                        self.fireEvent(BI.Combo.EVENT_COLLAPSE);
                                    }
                                }
                            }
                        }, BI.EVENT_RESPONSE_TIME, true));
                    }
                    break;
            }
        })
    },

    _initCombo: function () {
        this.combo = BI.createWidget(this.options.el);
    },

    _assertPopupView: function () {
        var self = this;
        if (this.popupView == null) {
            this.popupView = BI.createWidget(this.options.popup, {
                type: "bi.popup_view"
            });
            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                if (type === BI.Events.CLICK) {
                    self.combo.setValue(self.getValue());
                    self.fireEvent(BI.Combo.EVENT_CHANGE, value, obj);
                }
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            this.popupView.setVisible(false);
            BI.nextTick(function () {
                self.fireEvent(BI.Combo.EVENT_AFTER_INIT);
            });
        }
    },

    _assertPopupViewRender: function () {
        this._assertPopupView();
        if (!this._rendered) {
            BI.createWidget({
                type: "bi.vertical",
                scrolly: false,
                element: this.element,
                items: [
                    {el: this.popupView}
                ]
            });
            this._rendered = true;
        }
    },

    _hideIf: function (e) {
        if (this.element.__isMouseInBounds__(e) || (this.popupView && this.popupView.element.__isMouseInBounds__(e))) {
            return;
        }
        if (this.element.find(e.target).length > 0) {
            return;
        }
        var isHide = this.options.hideChecker.apply(this, [e]);
        if (isHide === false) {
            return;
        }
        this._hideView();
    },

    _hideView: function () {
        this.fireEvent(BI.Combo.EVENT_BEFORE_HIDEVIEW);
        this.popupView && this.popupView.invisible();
        this.element.removeClass(this.options.comboClass);

        $(document).unbind("mousedown." + this.getName()).unbind("mousewheel." + this.getName());
        this.fireEvent(BI.Combo.EVENT_AFTER_HIDEVIEW);
    },

    _popupView: function () {
        this._assertPopupViewRender();
        this.fireEvent(BI.Combo.EVENT_BEFORE_POPUPVIEW);

        this.popupView.visible();
        this.adjustWidth();
        this.adjustHeight();

        this.element.addClass(this.options.comboClass);
        $(document).bind("mousedown." + this.getName(), BI.bind(this._hideIf, this)).bind("mousewheel." + this.getName(), BI.bind(this._hideIf, this));
        this.fireEvent(BI.Combo.EVENT_AFTER_POPUPVIEW);
    },

    adjustWidth: function () {
        var o = this.options;
        if (!this.popupView) {
            return;
        }
        if (o.isNeedAdjustWidth === true) {
            this.resetListWidth("");
            var width = this.popupView.element.outerWidth();
            var maxW = this.element.outerWidth() || o.width;
            if (width > maxW + 80) {
                maxW = maxW + 80;
            } else if (width > maxW) {
                maxW = width;
            }
            this.resetListWidth(maxW < 100 ? 100 : maxW);
        }
    },

    adjustHeight: function () {
        var o = this.options, p = {};
        if (!this.popupView) {
            return;
        }
        var isVisible = this.popupView.isVisible();
        this.popupView.visible();
        switch (o.direction) {
            case "bottom":
            case "bottom,right":
                p = $.getComboPosition(this.combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ['bottom', 'top', 'right', 'left'], o.offsetStyle);
                break;
            case "top":
            case "top,right":
                p = $.getComboPosition(this.combo, this.popupView, o.adjustYOffset || o.adjustLength,o.isNeedAdjustHeight, ['top', 'bottom', 'right', 'left'], o.offsetStyle);
                break;
            case "left":
            case "left,bottom":
                p = $.getComboPosition(this.combo, this.popupView, o.adjustXOffset|| o.adjustLength, o.adjustYOffset,o.isNeedAdjustHeight, ['left', 'right', 'bottom', 'top'], o.offsetStyle);
                break;
            case "right":
            case "right,bottom":
                p = $.getComboPosition(this.combo, this.popupView, o.adjustXOffset|| o.adjustLength, o.adjustYOffset,o.isNeedAdjustHeight, ['right', 'left', 'bottom', 'top'], o.offsetStyle);
                break;
            case "top,left":
                p = $.getComboPosition(this.combo, this.popupView,  o.adjustXOffset, o.adjustYOffset|| o.adjustLength,o.isNeedAdjustHeight, ['top', 'bottom', 'left', 'right'], o.offsetStyle);
                break;
            case "bottom,left":
                p = $.getComboPosition(this.combo, this.popupView,  o.adjustXOffset, o.adjustYOffset|| o.adjustLength,o.isNeedAdjustHeight, ['bottom', 'top', 'left', 'right'], o.offsetStyle);
                break;
            case "left,top":
                p = $.getComboPosition(this.combo, this.popupView,  o.adjustXOffset|| o.adjustLength, o.adjustYOffset,o.isNeedAdjustHeight, ['left', 'right', 'top', 'bottom'], o.offsetStyle);
                break;
            case "right,top":
                p = $.getComboPosition(this.combo, this.popupView, o.adjustXOffset|| o.adjustLength, o.adjustYOffset,o.isNeedAdjustHeight, ['right', 'left', 'top', 'bottom'], o.offsetStyle);
                break;
            case "top,custom":
            case "custom,top":
                p = $.getTopAdaptPosition(this.combo, this.popupView, o.adjustYOffset || o.adjustLength,o.isNeedAdjustHeight);
                break;
            case "custom,bottom":
            case "bottom,custom":
                p = $.getBottomAdaptPosition(this.combo, this.popupView, o.adjustYOffset || o.adjustLength,o.isNeedAdjustHeight);
                break;
            case "left,custom":
            case "custom,left":
                p = $.getLeftAdaptPosition(this.combo, this.popupView, o.adjustXOffset || o.adjustLength);
                delete p.top;
                delete p.adaptHeight;
                break;
            case "custom,right":
            case "right,custom":
                p = $.getRightAdaptPosition(this.combo, this.popupView, o.adjustXOffset || o.adjustLength);
                delete p.top;
                delete p.adaptHeight;
                break;
        }

        if ("adaptHeight" in p) {
            this.resetListHeight(p['adaptHeight']);
        }
        if ("left" in p) {
            this.popupView.element.css({
                left: p.left
            });
        }
        if ("top" in p) {
            this.popupView.element.css({
                top: p.top
            });
        }
        this.popupView.setVisible(isVisible);
    },

    resetListHeight: function (h) {
        this._assertPopupView();
        this.popupView.resetHeight && this.popupView.resetHeight(h);
    },

    resetListWidth: function (w) {
        this._assertPopupView();
        this.popupView.resetWidth && this.popupView.resetWidth(w);
    },

    populate: function (items) {
        this._assertPopupView();
        this.popupView.populate.apply(this.popupView, arguments);
        this.combo.populate.apply(this.combo, arguments);
    },

    setEnable: function (arg) {
        BI.Combo.superclass.setEnable.apply(this, arguments);
        this.combo && this.combo.setEnable(arg);
        this.popupView && this.popupView.setEnable(arg);
        !arg && this._hideView();
    },

    setValue: function (v) {
        this._assertPopupView();
        this.combo.setValue(v);
        this.popupView && this.popupView.setValue(v);
    },

    getValue: function () {
        this._assertPopupView();
        return this.popupView && this.popupView.getValue();
    },

    isViewVisible: function () {
        return this.isEnabled() && this.combo.isEnabled() && !!this.popupView && this.popupView.isVisible();
    },

    showView: function () {
        if (this.isEnabled() && this.combo.isEnabled()) {
            this._popupView();
        }
    },

    hideView: function () {
        this._hideView();
    },

    getView: function () {
        return this.popupView;
    },

    doBehavior: function () {
        this._assertPopupView();
        this.popupView && this.popupView.doBehavior.apply(this.popupView, arguments);
    },

    toggle: function () {
        this._toggle();
    },

    destroy: function () {
        $(document).unbind("mousedown." + this.getName())
            .unbind("mousewheel." + this.getName())
            .unbind("mouseenter." + this.getName())
            .unbind("mousemove." + this.getName())
            .unbind("mouseleave." + this.getName());
        BI.Resizers.remove(this.getName());
        BI.Combo.superclass.destroy.apply(this, arguments);
    }
});
BI.Combo.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.Combo.EVENT_CHANGE = "EVENT_CHANGE";
BI.Combo.EVENT_EXPAND = "EVENT_EXPAND";
BI.Combo.EVENT_COLLAPSE = "EVENT_COLLAPSE";
BI.Combo.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


BI.Combo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.Combo.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.Combo.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
BI.Combo.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";

$.shortcut("bi.combo", BI.Combo);