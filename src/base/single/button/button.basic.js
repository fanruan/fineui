/**
 * guy
 * @class BI.BasicButton
 * @extends BI.Single
 *
 * 一般的button父级
 */
BI.BasicButton = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.BasicButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-basic-button" + (conf.invalid ? "" : " cursor-pointer") + ((BI.isIE() && BI.getIEVersion() < 10) ? " hack" : ""),
            // el: {} // 可以通过el来创建button元素
            value: "",
            stopEvent: false,
            stopPropagation: false,
            selected: false,
            once: false, // 点击一次选中有效,再点无效
            forceSelected: false, // 点击即选中, 选中了就不会被取消,与once的区别是forceSelected不影响事件的触发
            forceNotSelected: false, // 无论怎么点击都不会被选中
            disableSelected: false, // 使能选中

            shadow: false,
            isShadowShowingOnSelected: false,  // 选中状态下是否显示阴影
            trigger: null,
            handler: BI.emptyFn,
            bubble: null
        });
    },

    _init: function () {
        var self = this;
        var opts = this.options;
        opts.selected = BI.isFunction(opts.selected) ? this.__watch(opts.selected, function (context, newValue) {
            self.setSelected(newValue);
        }) : opts.selected;
        BI.BasicButton.superclass._init.apply(this, arguments);

        if (opts.shadow) {
            this._createShadow();
        }
        if (opts.level) {
            this.element.addClass("button-" + opts.level);
        }
    },

    _initRef: function () {
        if (this.options.selected === true) {
            this.setSelected(true);
        }
        // 延迟绑定事件，这样可以将自己绑定的事情优先执行
        BI.nextTick(this.bindEvent.bind(this));
        BI.BasicButton.superclass._initRef.apply(this, arguments);
    },

    // 默认render方法
    render: function () {
        return this.options.el;
    },

    _createShadow: function () {
        var self = this, o = this.options;

        var assertMask = function () {
            if (!self.$mask) {
                self.$mask = BI.createWidget(BI.isObject(o.shadow) ? o.shadow : {}, {
                    type: "bi.layout",
                    cls: "bi-button-mask"
                });
                self.$mask.invisible();
                BI.createWidget({
                    type: "bi.absolute",
                    element: self,
                    items: [{
                        el: self.$mask,
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }]
                });
            }
        };

        this.element.mouseup(function () {
            if (!self._hover && !o.isShadowShowingOnSelected) {
                assertMask();
                self.$mask.invisible();
            }
        });
        this.element.on("mouseenter." + this.getName(), function (e) {
            if (self.element.__isMouseInBounds__(e)) {
                if (self.isEnabled() && !self._hover && (o.isShadowShowingOnSelected || !self.isSelected())) {
                    assertMask();
                    self.$mask.visible();
                }
            }
        });
        this.element.on("mousemove." + this.getName(), function (e) {
            if (!self.element.__isMouseInBounds__(e)) {
                if (self.isEnabled() && !self._hover) {
                    assertMask();
                    self.$mask.invisible();
                }
            }
        });
        this.element.on("mouseleave." + this.getName(), function () {
            if (self.isEnabled() && !self._hover) {
                assertMask();
                self.$mask.invisible();
            }
        });
    },

    bindEvent: function () {
        var self = this;
        var o = this.options, hand = this.handle();
        if (!hand) {
            return;
        }
        hand = hand.element;
        var triggerArr = (o.trigger || "").split(",");
        BI.each(triggerArr, function (idx, trigger) {
            switch (trigger) {
                case "mouseup":
                    var mouseDown = false;
                    hand.mousedown(function () {
                        mouseDown = true;
                    });
                    hand.mouseup(function (e) {
                        if (mouseDown === true) {
                            clk(e);
                        }
                        mouseDown = false;
                        ev(e);
                    });
                    break;
                case "mousedown":
                    var mouseDown = false;
                    var selected = false;
                    hand.mousedown(function (e) {
                        // if (e.button === 0) {
                        BI.Widget._renderEngine.createElement(document).bind("mouseup." + self.getName(), function (e) {
                            // if (e.button === 0) {
                            if (BI.DOM.isExist(self) && !hand.__isMouseInBounds__(e) && mouseDown === true && !selected) {
                                // self.setSelected(!self.isSelected());
                                self._trigger();
                            }
                            mouseDown = false;
                            BI.Widget._renderEngine.createElement(document).unbind("mouseup." + self.getName());
                            // }
                        });
                        if (mouseDown === true) {
                            return;
                        }
                        if (self.isSelected()) {
                            selected = true;
                        } else {
                            clk(e);
                        }
                        mouseDown = true;
                        ev(e);
                        // }
                    });
                    hand.mouseup(function (e) {
                        // if (e.button === 0) {
                        if (BI.DOM.isExist(self) && mouseDown === true && selected === true) {
                            clk(e);
                        }
                        mouseDown = false;
                        selected = false;
                        BI.Widget._renderEngine.createElement(document).unbind("mouseup." + self.getName());
                        // }
                    });
                    break;
                case "dblclick":
                    hand.dblclick(clk);
                    break;
                case "lclick":
                    var mouseDown = false;
                    var interval;
                    hand.mousedown(function (e) {
                        BI.Widget._renderEngine.createElement(document).bind("mouseup." + self.getName(), function (e) {
                            interval && clearInterval(interval);
                            interval = null;
                            mouseDown = false;
                            BI.Widget._renderEngine.createElement(document).unbind("mouseup." + self.getName());
                        });
                        if (mouseDown === true) {
                            return;
                        }
                        if (!self.isEnabled() || (self.isOnce() && self.isSelected())) {
                            return;
                        }
                        interval = setInterval(function () {
                            if (self.isEnabled()) {
                                self.doClick();
                            }
                        }, 180);
                        mouseDown = true;
                        ev(e);
                    });
                    break;
                default:
                    if (o.stopEvent || o.stopPropagation) {
                        hand.mousedown(function (e) {
                            ev(e);
                        });
                    }
                    hand.click(clk);
                    // enter键等同于点击
                    o.attributes && o.attributes.zIndex >= 0 && hand.keyup(function (e) {
                        if (e.keyCode === BI.KeyCode.ENTER) {
                           clk(e);
                        }
                    });
                    break;
            }
        });

        // 之后的300ms点击无效
        var onClick = BI.debounce(this._doClick, BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });

        function ev (e) {
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
        }

        function clk (e) {
            ev(e);
            if (!self.isEnabled() || (self.isOnce() && self.isSelected())) {
                return;
            }
            if (BI.isKey(o.bubble) || BI.isFunction(o.bubble)) {
                if (BI.isNull(self.combo)) {
                    var popup;
                    BI.createWidget({
                        type: "bi.absolute",
                        element: self,
                        items: [{
                            el: {
                                type: "bi.bubble_combo",
                                trigger: "",
                                // bubble的提示不需要一直存在在界面上
                                destroyWhenHide: true,
                                ref: function () {
                                    self.combo = this;
                                },
                                el: {
                                    type: "bi.layout",
                                    height: "100%"
                                },
                                popup: {
                                    type: "bi.text_bubble_bar_popup_view",
                                    text: getBubble(),
                                    ref: function () {
                                        popup = this;
                                    },
                                    listeners: [{
                                        eventName: BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON,
                                        action: function (v) {
                                            self.combo.hideView();
                                            if (v) {
                                                onClick.apply(self, arguments);
                                            }
                                        }
                                    }]
                                },
                                listeners: [{
                                    eventName: BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW,
                                    action: function () {
                                        popup.populate(getBubble());
                                    }
                                }]
                            },
                            left: 0,
                            right: 0,
                            bottom: 0,
                            top: 0
                        }]
                    });
                }
                if (self.combo.isViewVisible()) {
                    self.combo.hideView();
                } else {
                    self.combo.showView();
                }
                return;
            }
            onClick.apply(self, arguments);
        }

        function getBubble () {
            var bubble = self.options.bubble;
            if (BI.isFunction(bubble)) {
                return bubble();
            }
            return bubble;
        }
    },

    _trigger: function (e) {
        var o = this.options;
        if (!this.isEnabled()) {
            return;
        }
        if (!this.isDisableSelected()) {
            this.isForceSelected() ? this.setSelected(true) :
                (this.isForceNotSelected() ? this.setSelected(false) :
                    this.setSelected(!this.isSelected()));
        }
        if (this.isValid()) {
            var v = this.getValue();
            o.handler.call(this, v, this, e);
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, v, this, e);
            this.fireEvent(BI.BasicButton.EVENT_CHANGE, v, this);
            if (o.action) {
                BI.Actions.runAction(o.action, "click", o, this);
            }
            BI.Actions.runGlobalAction("click", o, this);
        }
    },

    _doClick: function (e) {
        if (this.isValid()) {
            this.beforeClick(e);
        }
        this._trigger(e);
        if (this.isValid()) {
            this.doClick(e);
        }
    },

    beforeClick: function () {

    },

    doClick: function () {

    },

    handle: function () {
        return this;
    },

    hover: function () {
        this._hover = true;
        this.handle().element.addClass("hover");
        if (this.options.shadow) {
            this.$mask && this.$mask.setVisible(true);
        }
    },

    dishover: function () {
        this._hover = false;
        this.handle().element.removeClass("hover");
        if (this.options.shadow) {
            this.$mask && this.$mask.setVisible(false);
        }
    },

    setSelected: function (b) {
        var o = this.options;
        o.selected = b;
        if (b) {
            this.handle().element.addClass("active");
        } else {
            this.handle().element.removeClass("active");
        }
        if (o.shadow && !o.isShadowShowingOnSelected) {
            this.$mask && this.$mask.setVisible(false);
        }
        this.options.setSelected && this.options.setSelected.call(this, b);
    },

    isSelected: function () {
        return this.options.selected;
    },

    isOnce: function () {
        return this.options.once;
    },

    isForceSelected: function () {
        return this.options.forceSelected;
    },

    isForceNotSelected: function () {
        return this.options.forceNotSelected;
    },

    isDisableSelected: function () {
        return this.options.disableSelected;
    },

    setText: function (text) {
        this.options.text = text;
        this.options.setText && this.options.setText.call(this, text);
    },

    getText: function () {
        return this.options.text;
    },

    _setEnable: function (enable) {
        BI.BasicButton.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.element.addClass("base-disabled disabled");
        }
        if (!enable) {
            if (this.options.shadow) {
                this.$mask && this.$mask.setVisible(false);
            }
        }
    },

    empty: function () {
        BI.Widget._renderEngine.createElement(document).unbind("mouseup." + this.getName());
        BI.BasicButton.superclass.empty.apply(this, arguments);
    }
});
BI.BasicButton.EVENT_CHANGE = "BasicButton.EVENT_CHANGE";
BI.shortcut("bi.basic_button", BI.BasicButton);
