/**
 * Created by Windy on 2018/2/2.
 */
BI.SearchTextValueCombo = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-search-text-value-combo",
        height: 30,
        text: "",
        items: []
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.combo",
                    adjustLength: 2,
                    toggle: false,
                    ref: function () {
                        self.combo = this;
                    },
                    el: {
                        type: "bi.search_text_value_trigger",
                        ref: function () {
                            self.trigger = this;
                        },
                        items: o.items,
                        height: o.height - 2,
                        text: o.text,
                        value: o.value,
                        listeners: [{
                            eventName: BI.SearchTextValueTrigger.EVENT_CHANGE,
                            action: function () {
                                self.setValue(this.getValue());
                                self.combo.hideView();
                                self.fireEvent(BI.SearchTextValueCombo.EVENT_CHANGE);
                            }
                        }]
                    },
                    popup: {
                        el:{
                            type: "bi.text_value_combo_popup",
                            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
                            value: o.value,
                            items: o.items,
                            ref: function () {
                                self.popup = this;
                                self.trigger.getSearcher().setAdapter(self.popup);
                            },
                            listeners: [{
                                eventName: BI.TextValueComboPopup.EVENT_CHANGE,
                                action: function () {
                                    self.setValue(this.getValue());
                                    self.combo.hideView();
                                    self.fireEvent(BI.SearchTextValueCombo.EVENT_CHANGE);
                                }
                            }]
                        },
                        maxHeight: 302
                    },
                    listeners: [{
                        eventName: BI.Combo.EVENT_AFTER_HIDEVIEW,
                        action: function(){
                            self.trigger.stopEditing();
                        }
                    }],
                    hideChecker: function (e) {
                        return self.triggerBtn.element.find(e.target).length === 0;
                    }
                },
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    cls: "trigger-icon-button",
                    ref: function () {
                        self.triggerBtn = this;
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
        }
    },

    populate: function (items) {
        this.combo.populate(items);
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    }
});
BI.SearchTextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.search_text_value_combo", BI.SearchTextValueCombo);