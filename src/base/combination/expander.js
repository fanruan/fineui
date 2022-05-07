/**
 *
 * 某个可以展开的节点
 *
 * Created by GUY on 2015/9/10.
 * @class BI.Expander
 * @extends BI.Widget
 */
BI.Expander = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Expander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-expander",
            trigger: "click",
            toggle: true,
            // direction: "bottom", //top,bottom四个方向
            isDefaultInit: false, // 是否默认初始化子节点
            el: {},
            popup: {},
            expanderClass: "bi-expander-popup",
            hoverClass: "bi-expander-hover"
        });
    },

    render: function () {
        var self = this, o = this.options;
        this._expanded = !!o.el.open;
        this._initExpander();
        // 延迟绑定事件，这样可以将自己绑定的事情优先执行
        BI.nextTick(this._initPullDownAction.bind(this));
        this.expander.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (self.isEnabled() && self.isValid()) {
                if (type === BI.Events.EXPAND) {
                    self._popupView();
                }
                if (type === BI.Events.COLLAPSE) {
                    self._hideView();
                }
                if (type === BI.Events.EXPAND) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.fireEvent(BI.Expander.EVENT_EXPAND);
                }
                if (type === BI.Events.COLLAPSE) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.isViewVisible() && self.fireEvent(BI.Expander.EVENT_COLLAPSE);
                }
                if (type === BI.Events.CLICK) {
                    self.fireEvent(BI.Expander.EVENT_TRIGGER_CHANGE, value, obj);
                }
            }
        });

        this.element.hover(function () {
            if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid()) {
                self.element.addClass(o.hoverClass);
            }
        }, function () {
            if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid()) {
                self.element.removeClass(o.hoverClass);
            }
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [
                {el: this.expander}
            ]
        });
        o.isDefaultInit && this._assertPopupView();
        if (this.expander.isOpened() === true) {
            this._popupView();
        }
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
        BI.each(evs, function (i, e) {
            switch (e) {
                case "hover":
                    self.element[e](function (e) {
                        if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid()) {
                            self._popupView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.expander);
                            self.fireEvent(BI.Expander.EVENT_EXPAND);
                        }
                    }, function () {
                        if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid() && o.toggle) {
                            self._hideView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.expander);
                            self.fireEvent(BI.Expander.EVENT_COLLAPSE);
                        }
                    });
                    break;
                case "click":
                    if (e) {
                        self.element.off(e + "." + self.getName()).on(e + "." + self.getName(), BI.debounce(function (e) {
                            if (self.expander.element.__isMouseInBounds__(e)) {
                                if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid()) {
                                    o.toggle ? self._toggle() : self._popupView();
                                    if (self.isExpanded()) {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.expander);
                                        self.fireEvent(BI.Expander.EVENT_EXPAND);
                                    } else {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.expander);
                                        self.fireEvent(BI.Expander.EVENT_COLLAPSE);
                                    }
                                }
                            }
                        }, BI.EVENT_RESPONSE_TIME, {
                            "leading": true,
                            "trailing": false
                        }));
                    }
                    break;
            }
        });
    },

    _initExpander: function () {
        this.expander = BI.createWidget(this.options.el);
    },

    _assertPopupView: function () {
        var self = this, o = this.options;
        if (this.popupView == null) {
            this.popupView = BI.createWidget(this.options.popup, {
                type: "bi.button_group",
                cls: "expander-popup",
                layouts: [{
                    type: "bi.vertical",
                    hgap: 0,
                    vgap: 0
                }],
                value: o.value
            }, this);
            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                if (type === BI.Events.CLICK) {
                    // self.setValue(self.getValue());
                    self.fireEvent(BI.Expander.EVENT_CHANGE, value, obj);
                }
            });
            this.popupView.setVisible(this.isExpanded());
            BI.nextTick(function () {
                self.fireEvent(BI.Expander.EVENT_AFTER_INIT);
            });
        }
    },

    _assertPopupViewRender: function () {
        this._assertPopupView();
        if (!this._rendered) {
            BI.createWidget({
                type: "bi.vertical",
                scrolly: false,
                element: this,
                items: [
                    {el: this.popupView}
                ]
            });
            this._rendered = true;
        }
    },

    _hideView: function () {
        this.fireEvent(BI.Expander.EVENT_BEFORE_HIDEVIEW);
        this._expanded = false;
        this.expander.setOpened(false);
        this.popupView && this.popupView.invisible();
        this.element.removeClass(this.options.expanderClass);

        this.fireEvent(BI.Expander.EVENT_AFTER_HIDEVIEW);
    },

    _popupView: function () {
        this._assertPopupViewRender();
        this.fireEvent(BI.Expander.EVENT_BEFORE_POPUPVIEW);
        this._expanded = true;
        this.expander.setOpened(true);
        this.popupView.visible();
        this.element.addClass(this.options.expanderClass);
        this.fireEvent(BI.Expander.EVENT_AFTER_POPUPVIEW);
    },

    populate: function (items) {
        // this._assertPopupView();
        this.popupView && this.popupView.populate.apply(this.popupView, arguments);
        this.expander.populate && this.expander.populate.apply(this.expander, arguments);
    },

    _setEnable: function (arg) {
        BI.Expander.superclass._setEnable.apply(this, arguments);
        !arg && this.element.removeClass(this.options.hoverClass);
        !arg && this.isViewVisible() && this._hideView();
    },

    setValue: function (v) {
        this.expander.setValue(v);
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
        return this.isEnabled() && this.expander.isEnabled() && !!this.popupView && this.popupView.isVisible();
    },

    isExpanded: function () {
        return this._expanded;
    },

    showView: function () {
        if (this.isEnabled() && this.expander.isEnabled()) {
            this._popupView();
        }
    },

    hideView: function () {
        this._hideView();
    },

    getView: function () {
        return this.popupView;
    },

    getAllLeaves: function () {
        return this.popupView && this.popupView.getAllLeaves();
    },

    getNodeById: function (id) {
        if (this.expander.options.id === id) {
            return this.expander;
        }
        return this.popupView && this.popupView.getNodeById(id);
    },

    getNodeByValue: function (value) {
        if (this.expander.getValue() === value) {
            return this.expander;
        }
        return this.popupView && this.popupView.getNodeByValue(value);
    },

    destroy: function () {
        BI.Expander.superclass.destroy.apply(this, arguments);
    }
});
BI.Expander.EVENT_EXPAND = "EVENT_EXPAND";
BI.Expander.EVENT_COLLAPSE = "EVENT_COLLAPSE";
BI.Expander.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.Expander.EVENT_CHANGE = "EVENT_CHANGE";
BI.Expander.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


BI.Expander.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.Expander.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.Expander.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
BI.Expander.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";

BI.shortcut("bi.expander", BI.Expander);
