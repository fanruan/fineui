/**
 *
 * @class BI.SingleSelectCombo
 * @extends BI.Single
 */
BI.SingleSelectCombo = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-combo",
            allowNoSelect: false,
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 24,
            allowEdit: true
        });
    },

    _init: function () {
        var self = this, o = this.options;
        BI.SingleSelectCombo.superclass._init.apply(this, arguments);

        var assertShowValue = function () {
            BI.isKey(self._startValue) && (self.storeValue = self._startValue);
            self.trigger.getSearcher().setState(self.storeValue);
        };
        this.storeValue = o.value;
        // 标记正在请求数据
        this.requesting = false;

        this.trigger = BI.createWidget({
            type: "bi.single_select_trigger",
            height: o.height,
            // adapter: this.popup,
            allowNoSelect: o.allowNoSelect,
            allowEdit: o.allowEdit,
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (res) {
                    if (op.times === 1 && BI.isNotNull(op.keywords)) {
                        // 预防trigger内部把当前的storeValue改掉
                        self.trigger.setValue(self.getValue());
                    }
                    callback.apply(self, arguments);
                });
            },
            text: o.text,
            value: this.storeValue
        });

        this.trigger.on(BI.SingleSelectTrigger.EVENT_FOCUS, function () {
            self.fireEvent(BI.SingleSelectCombo.EVENT_FOCUS);
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_BLUR, function () {
            self.fireEvent(BI.SingleSelectCombo.EVENT_BLUR);
        });

        this.trigger.on(BI.SingleSelectTrigger.EVENT_START, function () {
            self._setStartValue();
            this.getSearcher().setValue(self.storeValue);
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_STOP, function () {
            self._setStartValue();
            self.fireEvent(BI.SingleSelectCombo.EVENT_STOP);
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_SEARCHING, function (keywords) {
            var last = BI.last(keywords);
            keywords = BI.initial(keywords || []);
            if (keywords.length > 0) {
                self._joinKeywords(keywords, function () {
                    if (BI.endWith(last, BI.BlankSplitChar)) {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                        self.combo.populate();
                        self._setStartValue();
                    } else {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                    }
                });
            }
            self.fireEvent(BI.SingleSelectCombo.EVENT_SEARCHING);
        });

        this.trigger.on(BI.SingleSelectTrigger.EVENT_CHANGE, function (value, obj) {
            self.storeValue = this.getValue();
            assertShowValue();
            self._defaultState();
        });
        this.trigger.on(BI.SingleSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            cls: "bi-border bi-border-radius",
            container: o.container,
            toggle: false,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: "bi.single_select_popup_view",
                allowNoSelect: o.allowNoSelect,
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.SingleSelectPopupView.EVENT_CHANGE,
                    action: function () {
                        self.storeValue = this.getValue();
                        self._adjust(function () {
                            assertShowValue();
                            self._defaultState();
                        });
                        self.fireEvent(BI.SingleSelectCombo.EVENT_CLICK_ITEM);
                    }
                }],
                itemsCreator: o.itemsCreator,
                valueFormatter: o.valueFormatter,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.combo.adjustWidth();
                        self.combo.adjustHeight();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            },
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            },
            value: o.value
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            this.setValue(self.storeValue);
            BI.nextTick(function () {
                self.populate();
            });
        });
        // 当退出的时候如果还在处理请求，则等请求结束后再对外发确定事件
        this.wants2Quit = false;
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            // important:关闭弹出时又可能没有退出编辑状态
            self.trigger.stopEditing();
            if (self.requesting === true) {
                self.wants2Quit = true;
            } else {
                self.fireEvent(BI.SingleSelectCombo.EVENT_CONFIRM);
            }
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "single-select-trigger-icon-button"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    _assertValue: function (val) {},

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        this.requesting = true;
        o.itemsCreator({
            type: BI.SingleSelectCombo.REQ_GET_ALL_DATA,
            keywords: keywords
        }, function (ob) {
            var values = BI.map(ob.items, "value");
            digest(values);
        });

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    BI.remove(self.storeValue.value, val);
                }
            });
            self._adjust(callback);
        }
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        if (!this._count) {
            o.itemsCreator({
                type: BI.SingleSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                self._count = res.count;
                adjust();
                callback();
            });
        } else {
            adjust();
            callback();

        }

        function adjust () {
            if (self.wants2Quit === true) {
                self.fireEvent(BI.SingleSelectCombo.EVENT_CONFIRM);
                self.wants2Quit = false;
            }
            self.requesting = false;
        }
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.popup.setStartValue(value);
    },

    setValue: function (v) {
        this.storeValue = v;
        this._assertValue(this.storeValue);
        this.combo.setValue(this.storeValue);
    },

    getValue: function () {
        return this.storeValue;
    },

    populate: function () {
        this._count = null;
        this.combo.populate.apply(this.combo, arguments);
    }
});

BI.extend(BI.SingleSelectCombo, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.SingleSelectCombo.EVENT_BLUR = "EVENT_BLUR";
BI.SingleSelectCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.SingleSelectCombo.EVENT_STOP = "EVENT_STOP";
BI.SingleSelectCombo.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.SingleSelectCombo.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.SingleSelectCombo.EVENT_CONFIRM = "EVENT_CONFIRM";

BI.shortcut("bi.single_select_combo", BI.SingleSelectCombo);
