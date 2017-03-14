/**
 *
 * 切换显示或隐藏面板
 *
 * Created by GUY on 2015/11/2.
 * @class BI.Switcher
 * @extends BI.Widget
 */
BI.Switcher = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Switcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-switcher",
            direction: BI.Direction.Top,
            trigger: "click",
            toggle: true,
            el: {},
            popup: {},
            adapter: null,
            masker: {},
            switcherClass: "bi-switcher-popup",
            hoverClass: "bi-switcher-hover"
        })
    },

    _init: function () {
        BI.Switcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._initSwitcher();
        this._initPullDownAction();
        this.switcher.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
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
                    self.fireEvent(BI.Switcher.EVENT_TRIGGER_CHANGE, value, obj);
                }
            }
        });

        this.element.hover(function () {
            if (self.isEnabled() && self.switcher.isEnabled()) {
                self.element.addClass(o.hoverClass);
            }
        }, function () {
            if (self.isEnabled() && self.switcher.isEnabled()) {
                self.element.removeClass(o.hoverClass);
            }
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this.element,
            items: [
                {el: this.switcher}
            ]
        });
        o.isDefaultInit && (this._assertPopupView());
    },

    _toggle: function () {
        this._assertPopupView();
        if (this.isExpanded()) {
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
                        if (self.isEnabled() && self.switcher.isEnabled()) {
                            self._popupView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, '', self.switcher);
                            self.fireEvent(BI.Switcher.EVENT_EXPAND);
                        }
                    }, function () {
                        if (self.isEnabled() && self.switcher.isEnabled() && o.toggle) {
                            self._hideView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, '', self.switcher);
                            self.fireEvent(BI.Switcher.EVENT_COLLAPSE);
                        }
                    });
                    break;
                default :
                    if (e) {
                        self.element.off(e + "." + self.getName()).on(e + "." + self.getName(), BI.debounce(function (e) {
                            if (self.switcher.element.__isMouseInBounds__(e)) {
                                if (self.isEnabled() && self.switcher.isEnabled()) {
                                    o.toggle ? self._toggle() : self._popupView();
                                    if (self.isExpanded()) {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, '', self.switcher);
                                        self.fireEvent(BI.Switcher.EVENT_EXPAND);
                                    } else {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, '', self.switcher);
                                        self.fireEvent(BI.Switcher.EVENT_COLLAPSE);
                                    }
                                }
                            }
                        }, BI.EVENT_RESPONSE_TIME, true));
                    }
                    break;
            }
        })
    },

    _initSwitcher: function () {
        this.switcher = BI.createWidget(this.options.el);
    },

    _assertPopupView: function () {
        var self = this, o = this.options;
        if (!this._created) {
            this.popupView = BI.createWidget(o.popup, {
                type: "bi.button_group",
                element: o.adapter && BI.Maskers.create(this.getName(), o.adapter, BI.extend({container: this}, o.masker)),
                cls: "switcher-popup",
                layouts: [{
                    type: "bi.vertical",
                    hgap: 0,
                    vgap: 0
                }]
            });
            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                if (type === BI.Events.CLICK) {
                    self.fireEvent(BI.Switcher.EVENT_CHANGE, value, obj);
                }
            });
            if (o.direction !== BI.Direction.Custom && !o.adapter) {
                BI.createWidget({
                    type: "bi.vertical",
                    scrolly: false,
                    element: this.element,
                    items: [
                        {el: this.popupView}
                    ]
                });
            }
            this._created = true;
            BI.nextTick(function () {
                self.fireEvent(BI.Switcher.EVENT_AFTER_INIT);
            });
        }
    },

    _hideView: function () {
        this.fireEvent(BI.Switcher.EVENT_BEFORE_HIDEVIEW);
        var self = this, o = this.options;
        o.adapter ? BI.Maskers.hide(self.getName()) : (self.popupView && self.popupView.setVisible(false));
        BI.nextTick(function () {
            o.adapter ? BI.Maskers.hide(self.getName()) : (self.popupView && self.popupView.setVisible(false));
            self.element.removeClass(o.switcherClass);
            self.fireEvent(BI.Switcher.EVENT_AFTER_HIDEVIEW);
        });
    },

    _popupView: function () {
        var self = this, o = this.options;
        this._assertPopupView();
        this.fireEvent(BI.Switcher.EVENT_BEFORE_POPUPVIEW);
        o.adapter ? BI.Maskers.show(this.getName()) : self.popupView.setVisible(true);
        BI.nextTick(function (name) {
            o.adapter ? BI.Maskers.show(name) : self.popupView.setVisible(true);
            self.element.addClass(o.switcherClass);
            self.fireEvent(BI.Switcher.EVENT_AFTER_POPUPVIEW);
        }, this.getName());
    },

    populate: function (items) {
        this._assertPopupView();
        this.popupView.populate.apply(this.popupView, arguments);
        this.switcher.populate.apply(this.switcher, arguments);
    },

    setEnable: function (arg) {
        BI.Switcher.superclass.setEnable.apply(this, arguments);
        this.switcher && this.switcher.setEnable(arg);
        this.popupView && this.popupView.setEnable(arg);
        !arg && this._hideView();
    },

    setValue: function (v) {
        this._assertPopupView();
        this.switcher.setValue(v);
        this.popupView && this.popupView.setValue(v);
    },

    getValue: function () {
        this._assertPopupView();
        return this.popupView ? this.popupView.getValue() : [];
    },

    isViewVisible: function () {
        return this.isEnabled() && this.switcher.isEnabled() &&
            (this.options.adapter ? BI.Maskers.isVisible(this.getName()) : (this.popupView && this.popupView.isVisible()));
    },

    isExpanded: function () {
        return this.isViewVisible();
    },

    showView: function () {
        if (this.isEnabled() && this.switcher.isEnabled()) {
            this._popupView();
        }
    },

    hideView: function () {
        this._hideView();
    },

    getView: function () {
        return this.popupView;
    },

    adjustView: function () {
        this.isViewVisible() && BI.Maskers.show(this.getName());
    },

    doBehavior: function () {
        this._assertPopupView();
        this.popupView && this.popupView.doBehavior.apply(this.popupView, arguments);
    },

    getAllLeaves: function () {
        return this.popupView && this.popupView.getAllLeaves();
    },

    getNodeById: function (id) {
        if (this.switcher.attr("id") === id) {
            return this.switcher;
        }
        return this.popupView && this.popupView.getNodeById(id);
    },

    getNodeByValue: function (value) {
        if (this.switcher.getValue() === value) {
            return this.switcher;
        }
        return this.popupView && this.popupView.getNodeByValue(value);
    },

    empty: function () {
        this.popupView && this.popupView.empty();
    },

    destroy: function () {
        BI.Switcher.superclass.destroy.apply(this, arguments);
    }
});
BI.Switcher.EVENT_EXPAND = "EVENT_EXPAND";
BI.Switcher.EVENT_COLLAPSE = "EVENT_COLLAPSE";
BI.Switcher.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.Switcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.Switcher.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


BI.Switcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.Switcher.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.Switcher.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
BI.Switcher.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";

$.shortcut("bi.switcher", BI.Switcher);