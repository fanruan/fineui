!(function () {
    var needHideWhenAnotherComboOpen = {};
    var currentOpenedCombos = {};
    /**
     * @class BI.Combo
     * @extends BI.Widget
     */
    BI.Combo = BI.inherit(BI.Bubble, {
        _const: {
            TRIANGLE_LENGTH: 12
        },
        _defaultConfig: function () {
            var conf = BI.Combo.superclass._defaultConfig.apply(this, arguments);
            return BI.extend(conf, {
                baseCls: (conf.baseCls || "") + " bi-combo" + (BI.isIE() ? " hack" : ""),
                attributes: {
                    tabIndex: -1
                },
                trigger: "click", // click || hover || click-hover || ""
                toggle: true,
                direction: "bottom", // top||bottom||left||right||top,left||top,right||bottom,left||bottom,right||right,innerRight||right,innerLeft||innerRight||innerLeft
                logic: {
                    dynamic: true
                },
                container: null, // popupview放置的容器，默认为this.element
                isDefaultInit: false,
                destroyWhenHide: false,
                hideWhenBlur: true,
                hideWhenAnotherComboOpen: false,
                hideWhenClickOutside: true,
                showArrow: false,
                isNeedAdjustHeight: true, // 是否需要高度调整
                isNeedAdjustWidth: true,
                stopEvent: false,
                stopPropagation: false,
                adjustLength: 0, // 调整的距离
                adjustXOffset: 0,
                adjustYOffset: 0,
                hideChecker: BI.emptyFn,
                offsetStyle: "left", // left,right,center
                el: {},
                popup: {},
                comboClass: "bi-combo-popup",
                hoverClass: "bi-combo-hover",
                belowMouse: false
            });
        },

        render: function () {
            var self = this, o = this.options;
            this._initCombo();
            // 延迟绑定事件，这样可以将自己绑定的事情优先执行
            BI.nextTick(this._initPullDownAction.bind(this));
            this.combo.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                if (self.isEnabled() && self.isValid()) {
                    if (type === BI.Events.EXPAND) {
                        self._popupView();
                    }
                    if (type === BI.Events.COLLAPSE) {
                        self._hideView();
                    }
                    if (type === BI.Events.EXPAND) {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                        self.fireEvent(BI.Combo.EVENT_EXPAND);
                    }
                    if (type === BI.Events.COLLAPSE) {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                        self.isViewVisible() && self.fireEvent(BI.Combo.EVENT_COLLAPSE);
                    }
                    if (type === BI.Events.CLICK) {
                        self.fireEvent(BI.Combo.EVENT_TRIGGER_CHANGE, obj);
                    }
                }
            });

            self.element.on("mouseenter." + self.getName(), function (e) {
                if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                    self.element.addClass(o.hoverClass);
                }
            });
            self.element.on("mouseleave." + self.getName(), function (e) {
                if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                    self.element.removeClass(o.hoverClass);
                }
            });

            BI.createWidget(BI.extend({
                element: this
            }, BI.LogicFactory.createLogic("vertical", BI.extend(o.logic, {
                items: [
                    {el: this.combo}
                ]
            }))));
            o.isDefaultInit && (this._assertPopupView());
            BI.Resizers.add(this.getName(), BI.bind(function (e) {
                // 如果resize对象是combo的子元素，则不应该收起，或交由hideChecker去处理
                if (this.isViewVisible()) {
                    BI.isNotNull(e) ? this._hideIf(e) : this._hideView();
                }
            }, this));
        },

        _assertPopupView: function () {
            var self = this, o = this.options;
            if (this.popupView == null) {
                this.popupView = BI.createWidget(BI.isFunction(this.options.popup) ? this.options.popup() : this.options.popup, {
                    type: "bi.popup_view",
                    showArrow: o.showArrow,
                    value: o.value
                }, this);
                this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                    if (type === BI.Events.CLICK) {
                        self.combo.setValue(self.getValue());
                        self.fireEvent(BI.Bubble.EVENT_CHANGE, value, obj);
                    }
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                });
                this.popupView.setVisible(false);
                BI.nextTick(function () {
                    self.fireEvent(BI.Bubble.EVENT_AFTER_INIT);
                });
            }
        },

        _hideView: function (e) {
            var o = this.options;
            this.fireEvent(BI.Combo.EVENT_BEFORE_HIDEVIEW);
            if (this.options.destroyWhenHide === true) {
                this.popupView && this.popupView.destroy();
                this.popupView = null;
                this._rendered = false;
            } else {
                this.popupView && this.popupView.invisible();
            }

            if (!e || !this.combo.element.__isMouseInBounds__(e)) {
                this.element.removeClass(this.options.hoverClass);
                // 应对bi-focus-shadow在收起时不失焦
                this.element.blur();
            }

            this.element.removeClass(this.options.comboClass);
            delete needHideWhenAnotherComboOpen[this.getName()];
            delete currentOpenedCombos[this.getName()];

            o.hideWhenClickOutside && BI.Widget._renderEngine.createElement(document).unbind("mousedown." + this.getName()).unbind("mousewheel." + this.getName());
            BI.EVENT_BLUR && o.hideWhenBlur && BI.Widget._renderEngine.createElement(window).unbind("blur." + this.getName());
            this.fireEvent(BI.Combo.EVENT_AFTER_HIDEVIEW);
        },

        _popupView: function (e) {
            var self = this, o = this.options;
            this._assertPopupViewRender();
            this.fireEvent(BI.Combo.EVENT_BEFORE_POPUPVIEW);
            // popupVisible是为了获取其宽高, 放到可视范围之外以防止在IE下闪一下
            this.popupView.css({left: -999999999, top: -99999999});
            this.popupView.visible();
            BI.each(needHideWhenAnotherComboOpen, function (i, combo) {
                if (i !== self.getName()) {
                    if (combo && combo._hideIf(e, true) === true) {
                        delete needHideWhenAnotherComboOpen[i];
                    }
                }
            });
            currentOpenedCombos[this.getName()] = this;
            this.options.hideWhenAnotherComboOpen && (needHideWhenAnotherComboOpen[this.getName()] = this);
            this.adjustWidth(e);
            this.adjustHeight(e);

            this.element.addClass(this.options.comboClass);
            o.hideWhenClickOutside && BI.Widget._renderEngine.createElement(document).unbind("mousedown." + this.getName()).unbind("mousewheel." + this.getName());
            o.hideWhenClickOutside && BI.Widget._renderEngine.createElement(document).unbind("mousewheel." + this.getName());
            BI.EVENT_BLUR && o.hideWhenBlur && BI.Widget._renderEngine.createElement(window).unbind("blur." + this.getName());

            o.hideWhenClickOutside && BI.Widget._renderEngine.createElement(document).bind("mousedown." + this.getName(), BI.bind(this._hideIf, this)).bind("mousewheel." + this.getName(), BI.bind(this._hideIf, this));
            o.hideWhenClickOutside && BI.Widget._renderEngine.createElement(document).bind("mousewheel." + this.getName(), BI.bind(this._hideIf, this));
            BI.EVENT_BLUR && o.hideWhenBlur && BI.Widget._renderEngine.createElement(window).bind("blur." + this.getName(), BI.bind(this._hideIf, this));
            this.fireEvent(BI.Combo.EVENT_AFTER_POPUPVIEW);
        },

        adjustHeight: function (e) {
            var o = this.options, p = {};
            if (!this.popupView) {
                return;
            }
            var isVisible = this.popupView.isVisible();
            this.popupView.visible();
            var combo = (o.belowMouse && BI.isNotNull(e)) ? {
                element: {
                    offset: function () {
                        return {
                            left: e.pageX,
                            top: e.pageY
                        };
                    },
                    bounds: function () {
                        // offset为其相对于父定位元素的偏移
                        return {
                            x: e.offsetX,
                            y: e.offsetY,
                            width: 0,
                            height: 24
                        };
                    },
                    outerWidth: function () {
                        return 0;
                    },
                    outerHeight: function () {
                        return 24;
                    }
                }
            } : this.combo;
            switch (o.direction) {
                case "bottom":
                case "bottom,right":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, (o.adjustYOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.isNeedAdjustHeight, ["bottom", "top", "right", "left"], o.offsetStyle);
                    break;
                case "top":
                case "top,right":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, (o.adjustYOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.isNeedAdjustHeight, ["top", "bottom", "right", "left"], o.offsetStyle);
                    break;
                case "left":
                case "left,bottom":
                    p = BI.DOM.getComboPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.adjustYOffset, o.isNeedAdjustHeight, ["left", "right", "bottom", "top"], o.offsetStyle);
                    break;
                case "right":
                case "right,bottom":
                    p = BI.DOM.getComboPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "bottom", "top"], o.offsetStyle);
                    break;
                case "top,left":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, (o.adjustYOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.isNeedAdjustHeight, ["top", "bottom", "left", "right"], o.offsetStyle);
                    break;
                case "bottom,left":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, (o.adjustYOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.isNeedAdjustHeight, ["bottom", "top", "left", "right"], o.offsetStyle);
                    break;
                case "left,top":
                    p = BI.DOM.getComboPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.adjustYOffset, o.isNeedAdjustHeight, ["left", "right", "top", "bottom"], o.offsetStyle);
                    break;
                case "right,top":
                    p = BI.DOM.getComboPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "top", "bottom"], o.offsetStyle);
                    break;
                case "right,innerRight":
                    p = BI.DOM.getComboPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "innerRight", "innerLeft", "bottom", "top"], o.offsetStyle);
                    break;
                case "right,innerLeft":
                    p = BI.DOM.getComboPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "innerLeft", "innerRight", "bottom", "top"], o.offsetStyle);
                    break;
                case "innerRight":
                    p = BI.DOM.getComboPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.adjustYOffset, o.isNeedAdjustHeight, ["innerRight", "innerLeft", "right", "left", "bottom", "top"], o.offsetStyle);
                    break;
                case "innerLeft":
                    p = BI.DOM.getComboPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.adjustYOffset, o.isNeedAdjustHeight, ["innerLeft", "innerRight", "left", "right", "bottom", "top"], o.offsetStyle);
                    break;
                case "top,custom":
                case "custom,top":
                    p = BI.DOM.getTopAdaptPosition(combo, this.popupView, (o.adjustYOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.isNeedAdjustHeight);
                    p.dir = "top";
                    break;
                case "custom,bottom":
                case "bottom,custom":
                    p = BI.DOM.getBottomAdaptPosition(combo, this.popupView, (o.adjustYOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0), o.isNeedAdjustHeight);
                    p.dir = "bottom";
                    break;
                case "left,custom":
                case "custom,left":
                    p = BI.DOM.getLeftAdaptPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0));
                    delete p.top;
                    delete p.adaptHeight;
                    p.dir = "left";
                    break;
                case "custom,right":
                case "right,custom":
                    p = BI.DOM.getRightAdaptPosition(combo, this.popupView, (o.adjustXOffset + o.adjustLength) + (o.showArrow ? this._const.TRIANGLE_LENGTH : 0));
                    delete p.top;
                    delete p.adaptHeight;
                    p.dir = "right";
                    break;
            }

            if ("adaptHeight" in p) {
                this.resetListHeight(p["adaptHeight"]);
            }
            var width = this.combo.element.outerWidth();
            var height = this.combo.element.outerHeight();
            this.popupView.setDirection && this.popupView.setDirection(p.dir, {
                width: width,
                height: height,
                offsetStyle: o.offsetStyle,
                adjustXOffset: o.adjustXOffset,
                adjustYOffset: o.adjustYOffset,
                offset: this.combo.element.offset()
            });
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
            this.position = p;
            this.popupView.setVisible(isVisible);
        },

        destroyed: function () {
            BI.Widget._renderEngine.createElement(document)
                .unbind("click." + this.getName())
                .unbind("mousedown." + this.getName())
                .unbind("mousewheel." + this.getName())
                .unbind("mouseenter." + this.getName())
                .unbind("mouseleave." + this.getName());
            BI.Widget._renderEngine.createElement(window)
                .unbind("blur." + this.getName());
            BI.Resizers.remove(this.getName());
            this.popupView && this.popupView._destroy();
            delete needHideWhenAnotherComboOpen[this.getName()];
            delete currentOpenedCombos[this.getName()];
        }
    });
    BI.Combo.closeAll = function () {
        BI.each(currentOpenedCombos, function (i, combo) {
            if (combo) {
                combo.hideView();
            }
        });
        currentOpenedCombos = {};
        needHideWhenAnotherComboOpen = {};
    };
    BI.Combo.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
    BI.Combo.EVENT_CHANGE = "EVENT_CHANGE";
    BI.Combo.EVENT_EXPAND = "EVENT_EXPAND";
    BI.Combo.EVENT_COLLAPSE = "EVENT_COLLAPSE";
    BI.Combo.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


    BI.Combo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
    BI.Combo.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
    BI.Combo.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
    BI.Combo.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";

    BI.shortcut("bi.combo", BI.Combo);
}());
