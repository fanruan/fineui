!(function () {
    var needHideWhenAnotherComboOpen = {};
    /**
     * @class BI.Combo
     * @extends BI.Widget
     */
    BI.Combo = BI.inherit(BI.Widget, {
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
                    { el: this.combo }
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

        _toggle: function (e) {
            this._assertPopupViewRender();
            if (this.popupView.isVisible()) {
                this._hideView(e);
            } else {
                if (this.isEnabled()) {
                    this._popupView(e);
                }
            }
        },

        _initPullDownAction: function () {
            var self = this, o = this.options;
            var evs = (this.options.trigger || "").split(",");
            var st = function (e) {
                if (o.stopEvent) {
                    e.stopEvent();
                }
                if (o.stopPropagation) {
                    e.stopPropagation();
                }
            };

            var enterPopup = false;

            function hide(e) {
                if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid() && o.toggle === true) {
                    self._hideView(e);
                    self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.combo);
                    self.fireEvent(BI.Combo.EVENT_COLLAPSE);
                }
                self.popupView && self.popupView.element.off("mouseenter." + self.getName()).off("mouseleave." + self.getName());
                enterPopup = false;
            }

            BI.each(evs, function (i, ev) {
                switch (ev) {
                    case "hover":
                        self.element.on("mouseenter." + self.getName(), function (e) {
                            if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                                self._popupView(e);
                                self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.combo);
                                self.fireEvent(BI.Combo.EVENT_EXPAND);
                            }
                        });
                        self.element.on("mouseleave." + self.getName(), function (e) {
                            if (self.popupView) {
                                self.popupView.element.on("mouseenter." + self.getName(), function (e) {
                                    enterPopup = true;
                                    self.popupView.element.on("mouseleave." + self.getName(), function (e) {
                                        hide(e);
                                    });
                                    self.popupView.element.off("mouseenter." + self.getName());
                                });
                                BI.defer(function () {
                                    if (!enterPopup) {
                                        hide(e);
                                    }
                                }, 50);
                            }
                        });
                        break;
                    case "click":
                        var debounce = BI.debounce(function (e) {
                            if (self.combo.element.__isMouseInBounds__(e)) {
                                if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                                    // if (!o.toggle && self.isViewVisible()) {
                                    //     return;
                                    // }
                                    o.toggle ? self._toggle(e) : self._popupView(e);
                                    if (self.isViewVisible()) {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.combo);
                                        self.fireEvent(BI.Combo.EVENT_EXPAND);
                                    } else {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.combo);
                                        self.fireEvent(BI.Combo.EVENT_COLLAPSE);
                                    }
                                }
                            }
                        }, BI.EVENT_RESPONSE_TIME, {
                            "leading": true,
                            "trailing": false
                        });
                        self.element.off(ev + "." + self.getName()).on(ev + "." + self.getName(), function (e) {
                            debounce(e);
                            st(e);
                        });
                        break;
                    case "click-hover":
                        var debounce = BI.debounce(function (e) {
                            if (self.combo.element.__isMouseInBounds__(e)) {
                                if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                                    // if (self.isViewVisible()) {
                                    //     return;
                                    // }
                                    self._popupView(e);
                                    if (self.isViewVisible()) {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.combo);
                                        self.fireEvent(BI.Combo.EVENT_EXPAND);
                                    }
                                }
                            }
                        }, BI.EVENT_RESPONSE_TIME, {
                            "leading": true,
                            "trailing": false
                        });
                        self.element.off("click." + self.getName()).on("click." + self.getName(), function (e) {
                            debounce(e);
                            st(e);
                        });
                        self.element.on("mouseleave." + self.getName(), function (e) {
                            if (self.popupView) {
                                self.popupView.element.on("mouseenter." + self.getName(), function (e) {
                                    enterPopup = true;
                                    self.popupView.element.on("mouseleave." + self.getName(), function (e) {
                                        hide(e);
                                    });
                                    self.popupView.element.off("mouseenter." + self.getName());
                                });
                                BI.delay(function () {
                                    if (!enterPopup) {
                                        hide(e);
                                    }
                                }, 50);
                            }
                        });
                        break;
                }
            });
        },

        _initCombo: function () {
            this.combo = BI.createWidget(this.options.el, {
                value: this.options.value
            });
        },

        _assertPopupView: function () {
            var self = this, o = this.options;
            if (this.popupView == null) {
                this.popupView = BI.createWidget(this.options.popup, {
                    type: "bi.popup_view",
                    value: o.value
                }, this);
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
                    element: this.options.container || this,
                    items: [
                        { el: this.popupView }
                    ]
                });
                this._rendered = true;
            }
        },

        _hideIf: function (e, skipTriggerChecker) {
            // if (this.element.__isMouseInBounds__(e) || (this.popupView && this.popupView.element.__isMouseInBounds__(e))) {
            //     return;
            // }
            // BI-10290 公式combo双击公式内容会收起
            if (e && ((skipTriggerChecker !== true && this.element.find(e.target).length > 0)
                || (this.popupView && this.popupView.element.find(e.target).length > 0)
                || e.target.className === "CodeMirror-cursor" || BI.Widget._renderEngine.createElement(e.target).closest(".CodeMirror-hints").length > 0)) {// BI-9887 CodeMirror的公式弹框需要特殊处理下
                var directions = this.options.direction.split(",");
                if (BI.contains(directions, "innerLeft") || BI.contains(directions, "innerRight")) {
                    // popup可以出现在trigger内部的combo，滚动时不需要消失，而是调整位置
                    this.adjustWidth();
                    this.adjustHeight();
                }

                return;
            }
            var isHide = this.options.hideChecker.apply(this, [e]);
            if (isHide === false) {
                return;
            }
            this._hideView(e);
            return true;
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

            BI.Widget._renderEngine.createElement(document).unbind("mousedown." + this.getName()).unbind("mousewheel." + this.getName());
            BI.EVENT_BLUR && o.hideWhenBlur && BI.Widget._renderEngine.createElement(window).unbind("blur." + this.getName());
            this.fireEvent(BI.Combo.EVENT_AFTER_HIDEVIEW);
        },

        _popupView: function (e) {
            var self = this, o = this.options;
            this._assertPopupViewRender();
            this.fireEvent(BI.Combo.EVENT_BEFORE_POPUPVIEW);
            // popupVisible是为了获取其宽高, 放到可视范围之外以防止在IE下闪一下
            this.popupView.css({ left: -999999999, top: -99999999 });
            this.popupView.visible();
            BI.each(needHideWhenAnotherComboOpen, function (i, combo) {
                if (i !== self.getName()) {
                    if (combo && combo._hideIf(e, true) === true) {
                        delete needHideWhenAnotherComboOpen[i];
                    }
                }
            });
            this.options.hideWhenAnotherComboOpen && (needHideWhenAnotherComboOpen[this.getName()] = this);
            this.adjustWidth(e);
            this.adjustHeight(e);

            this.element.addClass(this.options.comboClass);
            BI.Widget._renderEngine.createElement(document).unbind("mousedown." + this.getName()).unbind("mousewheel." + this.getName());
            BI.EVENT_BLUR && o.hideWhenBlur && BI.Widget._renderEngine.createElement(window).unbind("blur." + this.getName());

            BI.Widget._renderEngine.createElement(document).bind("mousedown." + this.getName(), BI.bind(this._hideIf, this)).bind("mousewheel." + this.getName(), BI.bind(this._hideIf, this));
            BI.EVENT_BLUR && o.hideWhenBlur && BI.Widget._renderEngine.createElement(window).bind("blur." + this.getName(), BI.bind(this._hideIf, this));
            this.fireEvent(BI.Combo.EVENT_AFTER_POPUPVIEW);
        },

        adjustWidth: function (e) {
            var o = this.options;
            if (!this.popupView) {
                return;
            }
            if (o.isNeedAdjustWidth === true) {
                this.resetListWidth("");
                var width = this.popupView.element.outerWidth();
                var maxW = this.element.outerWidth() || o.width;
                // BI-93885 最大列宽算法调整
                if (maxW < 500) {
                    if (width >= 500) {
                        maxW = 500;
                    } else if(width > maxW) {
                        // 防止小数导致差那么一点
                        maxW = width + 1;
                    }
                }

                // if (width > maxW + 80) {
                //     maxW = maxW + 80;
                // } else if (width > maxW) {
                //     maxW = width;
                // }
                this.resetListWidth(maxW < 100 ? 100 : maxW);
            }
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
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ["bottom", "top", "right", "left"], o.offsetStyle);
                    break;
                case "top":
                case "top,right":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ["top", "bottom", "right", "left"], o.offsetStyle);
                    break;
                case "left":
                case "left,bottom":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["left", "right", "bottom", "top"], o.offsetStyle);
                    break;
                case "right":
                case "right,bottom":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "bottom", "top"], o.offsetStyle);
                    break;
                case "top,left":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ["top", "bottom", "left", "right"], o.offsetStyle);
                    break;
                case "bottom,left":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ["bottom", "top", "left", "right"], o.offsetStyle);
                    break;
                case "left,top":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["left", "right", "top", "bottom"], o.offsetStyle);
                    break;
                case "right,top":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "top", "bottom"], o.offsetStyle);
                    break;
                case "right,innerRight":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "innerRight", "innerLeft", "bottom", "top"], o.offsetStyle);
                    break;
                case "right,innerLeft":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "innerLeft", "innerRight", "bottom", "top"], o.offsetStyle);
                    break;
                case "innerRight":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["innerRight", "innerLeft", "right", "left", "bottom", "top"], o.offsetStyle);
                    break;
                case "innerLeft":
                    p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["innerLeft", "innerRight", "left", "right", "bottom", "top"], o.offsetStyle);
                    break;
                case "top,custom":
                case "custom,top":
                    p = BI.DOM.getTopAdaptPosition(combo, this.popupView, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight);
                    break;
                case "custom,bottom":
                case "bottom,custom":
                    p = BI.DOM.getBottomAdaptPosition(combo, this.popupView, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight);
                    break;
                case "left,custom":
                case "custom,left":
                    p = BI.DOM.getLeftAdaptPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength);
                    delete p.top;
                    delete p.adaptHeight;
                    break;
                case "custom,right":
                case "right,custom":
                    p = BI.DOM.getRightAdaptPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength);
                    delete p.top;
                    delete p.adaptHeight;
                    break;
            }

            if ("adaptHeight" in p) {
                this.resetListHeight(p["adaptHeight"]);
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
            this.position = p;
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
            this.combo.populate && this.combo.populate.apply(this.combo, arguments);
        },

        _setEnable: function (arg) {
            BI.Combo.superclass._setEnable.apply(this, arguments);
            if (arg === true) {
                this.element.removeClass("base-disabled disabled");
            } else if (arg === false) {
                this.element.addClass("base-disabled disabled");
            }
            !arg && this.element.removeClass(this.options.hoverClass);
            !arg && this.isViewVisible() && this._hideView();
        },

        setValue: function (v) {
            this.combo.setValue(v);
            if (BI.isNull(this.popupView)) {
                this.options.popup.value = v;
            } else {
                this.popupView.setValue(v);
            }
        },

        getValue: function () {
            if (BI.isNull(this.popupView)) {
                return this.options.popup.value;
            } else {
                return this.popupView.getValue();
            }
        },

        isViewVisible: function () {
            return this.isEnabled() && this.combo.isEnabled() && !!this.popupView && this.popupView.isVisible();
        },

        showView: function (e) {
            // 减少popup 调整宽高的次数
            if (this.isEnabled() && this.combo.isEnabled() && !this.isViewVisible()) {
                this._popupView(e);
            }
        },

        hideView: function (e) {
            this._hideView(e);
        },

        getView: function () {
            return this.popupView;
        },

        getPopupPosition: function () {
            return this.position;
        },

        toggle: function () {
            this._toggle();
        },

        destroyed: function () {
            BI.Widget._renderEngine.createElement(document)
                .unbind("click." + this.getName())
                .unbind("mousedown." + this.getName())
                .unbind("mousewheel." + this.getName())
                .unbind("mouseenter." + this.getName())
                .unbind("mousemove." + this.getName())
                .unbind("mouseleave." + this.getName());
            BI.Widget._renderEngine.createElement(window)
                .unbind("blur." + this.getName());
            BI.Resizers.remove(this.getName());
            this.popupView && this.popupView._destroy();
            delete needHideWhenAnotherComboOpen[this.getName()];
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

    BI.shortcut("bi.combo", BI.Combo);
}());
