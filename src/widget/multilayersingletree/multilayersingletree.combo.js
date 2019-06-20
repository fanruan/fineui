/**
 * 多层级下拉单选树
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreeCombo
 * @extends BI.Widget
 */
BI.MultiLayerSingleTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-singletree-combo",
            isDefaultInit: false,
            height: 24,
            text: "",
            itemsCreator: BI.emptyFn,
            items: [],
            value: "",
            attributes: {
                tabIndex: 0
            },
            allowEdit: false
        });
    },

    render: function () {
        var self = this, o = this.options;

        this.storeValue = BI.isArray(o.value) ? o.value[0] : o.value;
        var combo = (o.itemsCreator === BI.emptyFn) ? this._getSyncConfig() : this._getAsyncConfig();

        return (!o.allowEdit && o.itemsCreator === BI.emptyFn) ? combo : {
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

    _getBaseConfig: function () {
        var self = this, o = this.options;
        return {
            type: "bi.combo",
            container: o.container,
            adjustLength: 2,
            ref: function (_ref) {
                self.combo = _ref;
            },
            popup: {
                el: {
                    type: "bi.multilayer_single_tree_popup",
                    isDefaultInit: o.isDefaultInit,
                    itemsCreator: o.itemsCreator,
                    items: o.items,
                    ref: function (_ref) {
                        self.trigger && self.trigger.getSearcher().setAdapter(_ref);
                    },
                    listeners: [{
                        eventName: BI.MultiLayerSingleTreePopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(this.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_CHANGE);
                        }
                    }]
                },
                value: o.value,
                maxHeight: 400
            }
        };
    },

    _getSyncConfig: function () {
        var o = this.options;
        var baseConfig = this._getBaseConfig();
        baseConfig.el = {
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items,
            value: o.value
        };
        return baseConfig;
    },

    _getAsyncConfig: function () {
        var self = this, o = this.options;
        var config = this._getBaseConfig();
        return BI.extend(config, {
            el: {
                type: "bi.multilayer_single_tree_trigger",
                allowEdit: o.allowEdit,
                cls: "multilayer-single-tree-trigger",
                ref: function (_ref) {
                    self.trigger = _ref;
                },
                items: o.items,
                itemsCreator: o.itemsCreator,
                height: o.height - 2,
                text: o.text,
                value: o.value,
                tipType: o.tipType,
                warningTitle: o.warningTitle,
                title: o.title,
                listeners: [{
                    eventName: BI.MultiLayerSingleTreeTrigger.EVENT_CHANGE,
                    action: function () {
                        self.setValue(this.getValue());
                        self.combo.hideView();
                        self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_CHANGE);
                    }
                }]
            },
            hideChecker: function (e) {
                return self.triggerBtn.element.find(e.target).length === 0;
            },
            listeners: [{
                eventName: BI.Combo.EVENT_AFTER_HIDEVIEW,
                action: function () {
                    self.trigger.stopEditing();
                }
            }, {
                eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.populate();
                }
            }]
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.storeValue = v[0];
        this.combo.setValue(v);
    },

    getValue: function () {
        return [this.storeValue];
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});

BI.MultiLayerSingleTreeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_combo", BI.MultiLayerSingleTreeCombo);