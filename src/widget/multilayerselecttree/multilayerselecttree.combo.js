/**
 * @class BI.MultiLayerSelectTreeCombo
 * @extends BI.Widget
 */
BI.MultiLayerSelectTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSelectTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-select-tree-combo",
            isDefaultInit: false,
            height: 24,
            text: "",
            itemsCreator: BI.emptyFn,
            items: [],
            value: "",
            allowEdit: false,
            allowSearchValue: false,
            allowInsertValue: false,
            isNeedAdjustWidth: true
        });
    },

    _init: function () {
        var o = this.options;
        if (this._shouldWrapper()) {
            o.height -= 2;
            BI.isNumeric(o.width) && (o.width -= 2);
        }
        BI.MultiLayerSelectTreeCombo.superclass._init.apply(this, arguments);
    },

    render: function () {
        var self = this, o = this.options;

        var combo = (o.itemsCreator === BI.emptyFn) ? this._getSyncConfig() : this._getAsyncConfig();

        return this._shouldWrapper() ? combo : {
            type: "bi.absolute",
            items: [{
                el: combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    cls: "trigger-icon-button",
                    ref: function (_ref) {
                        self.triggerBtn = _ref;
                    },
                    width: o.height,
                    height: o.height,
                    handler: function () {
                        if (self.combo.isViewVisible()) {
                            self.combo.hideView();
                        } else {
                            self.combo.showView();
                        }
                    }
                },
                right: 0,
                bottom: 0,
                top: 0
            }]
        };
    },

    _shouldWrapper: function () {
        var o = this.options;
        return !o.allowEdit && o.itemsCreator === BI.emptyFn;
    },

    _getBaseConfig: function () {
        var self = this, o = this.options;
        return {
            type: "bi.combo",
            cls: (o.simple ? "bi-border-bottom" : "bi-border") + " bi-border-radius",
            container: o.container,
            destroyWhenHide: o.destroyWhenHide,
            adjustLength: 2,
            ref: function (_ref) {
                self.combo = _ref;
            },
            popup: {
                el: {
                    type: "bi.multilayer_select_tree_popup",
                    isDefaultInit: o.isDefaultInit,
                    itemsCreator: o.itemsCreator,
                    items: o.items,
                    ref: function (_ref) {
                        self.trigger && self.trigger.getSearcher().setAdapter(_ref);
                    },
                    listeners: [{
                        eventName: BI.MultiLayerSelectTreePopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(this.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_CHANGE);
                            self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_CLICK_ITEM, self.combo.getValue());
                        }
                    }],
                    onLoaded: function () {
                        BI.nextTick(function () {
                            self.combo.adjustWidth();
                            self.combo.adjustHeight();
                        });
                    }
                },
                value: o.value,
                maxHeight: 400,
                maxWidth: o.isNeedAdjustWidth ? "auto" : 500,
                minHeight: 240
            },
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            listeners: [{
                eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_BEFORE_POPUPVIEW);
                }
            }]
        };
    },

    _getSearchConfig: function() {
        var self = this, o = this.options;
        return {
            el: {
                type: "bi.multilayer_select_tree_trigger",
                container: o.container,
                allowInsertValue: o.allowInsertValue,
                allowSearchValue: o.allowSearchValue,
                allowEdit: o.allowEdit,
                cls: "multilayer-select-tree-trigger",
                ref: function (_ref) {
                    self.trigger = _ref;
                },
                items: o.items,
                itemsCreator: o.itemsCreator,
                valueFormatter: o.valueFormatter,
                watermark: o.watermark,
                height: o.height - (o.simple ? 1 : 2),
                text: o.text,
                value: o.value,
                tipType: o.tipType,
                warningTitle: o.warningTitle,
                title: o.title,
                listeners: [{
                    eventName: BI.MultiLayerSelectTreeTrigger.EVENT_CHANGE,
                    action: function () {
                        self.setValue(this.getValue());
                        self.combo.hideView();
                        self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_CHANGE);
                        self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_CLICK_ITEM, self.combo.getValue());
                    }
                }, {
                    eventName: BI.MultiLayerSelectTreeTrigger.EVENT_FOCUS,
                    action: function () {
                        self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_FOCUS);
                    }
                }, {
                    eventName: BI.MultiLayerSelectTreeTrigger.EVENT_BLUR,
                    action: function () {
                        self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_BLUR);
                    }
                }, {
                    eventName: BI.MultiLayerSelectTreeTrigger.EVENT_SEARCHING,
                    action: function () {
                        self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_SEARCHING);
                    }
                }, {
                    eventName: BI.MultiLayerSelectTreeTrigger.EVENT_ADD_ITEM,
                    action: function () {
                        var value = self.trigger.getSearcher().getKeyword();
                        self.combo.setValue([value]);
                        self.combo.hideView();
                        self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_CHANGE);
                    }
                }]
            },
            toggle: !o.allowEdit,
            hideChecker: function (e) {
                // 新增传配置container后对应hideChecker的修改
                // IE11下，popover(position: fixed)下放置下拉控件(position: fixed), 滚动的时候会异常卡顿
                // 通过container参数将popup放置于popover之外解决此问题, 其他下拉控件由于元素少或者有分页，所以
                // 卡顿不明显, 先在此做尝试, 并在FineUI特殊处理待解决文档中标记跟踪
                return (o.container && self.trigger.getSearcher().isSearching() && self.trigger.getSearcher().getView().element.find(e.target).length > 0) ? false : self.triggerBtn.element.find(e.target).length === 0;

            },
            listeners: [{
                eventName: BI.Combo.EVENT_AFTER_HIDEVIEW,
                action: function () {
                    self.trigger.stopEditing();
                }
            }, {
                eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_BEFORE_POPUPVIEW);
                }
            }]
        }
    },

    _getSyncConfig: function () {
        var o = this.options, self = this;
        var baseConfig = this._getBaseConfig();
        return BI.extend(baseConfig, o.allowEdit ? this._getSearchConfig() : {
            el: {
                type: "bi.single_tree_trigger",
                ref: function(_ref) {
                    self.textTrigger = _ref;
                },
                text: o.text,
                height: o.height,
                items: o.items,
                value: o.value
            }
        });
    },

    _getAsyncConfig: function () {
        var config = this._getBaseConfig();
        return BI.extend(config, this._getSearchConfig());
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    getSearcher: function () {
        return this.trigger ? this.trigger.getSearcher() : this.textTrigger.getTextor();
    },

    populate: function (items) {
        this.combo.populate(items);
    },

    focus: function () {
        this.trigger.focus();
    },

    blur: function () {
        this.trigger.blur();
    },

    showView: function () {
        this.combo.showView();
    },

    setWaterMark: function (v) {
        this.trigger.setWaterMark(v);
    }
});

BI.MultiLayerSelectTreeCombo.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiLayerSelectTreeCombo.EVENT_BLUR = "EVENT_BLUR";
BI.MultiLayerSelectTreeCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiLayerSelectTreeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiLayerSelectTreeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiLayerSelectTreeCombo.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.shortcut("bi.multilayer_select_tree_combo", BI.MultiLayerSelectTreeCombo);
