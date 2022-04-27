/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/12/31
 */
BI.ValueChooserNoBarCombo = BI.inherit(BI.AbstractValueChooser, {

    props: {
        baseCls: "bi-value-chooser-combo",
        width: 200,
        height: 24,
        items: null,
        itemsCreator: BI.emptyFn,
        cache: true
    },

    render: function () {
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }

        return {
            type: "bi.multi_select_no_bar_combo",
            simple: o.simple,
            allowEdit: o.allowEdit,
            text: o.text,
            value: this._assertValue(o.value),
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height,
            ref: function(_ref) {
                self.combo = _ref;
            },
            listeners: [{
                eventName: BI.MultiSelectCombo.EVENT_FOCUS,
                action: function () {
                    self.fireEvent(BI.ValueChooserNoBarCombo.EVENT_FOCUS);
                }
            }, {
                eventName: BI.MultiSelectCombo.EVENT_BLUR,
                action: function () {
                    self.fireEvent(BI.ValueChooserNoBarCombo.EVENT_BLUR);
                }
            }, {
                eventName: BI.MultiSelectCombo.EVENT_STOP,
                action: function () {
                    self.fireEvent(BI.ValueChooserNoBarCombo.EVENT_STOP);
                }
            }, {
                eventName: BI.MultiSelectCombo.EVENT_CLICK_ITEM,
                action: function () {
                    self.fireEvent(BI.ValueChooserNoBarCombo.EVENT_CLICK_ITEM);
                }
            }, {
                eventName: BI.MultiSelectCombo.EVENT_SEARCHING,
                action: function () {
                    self.fireEvent(BI.ValueChooserNoBarCombo.EVENT_SEARCHING);
                }
            }, {
                eventName: BI.MultiSelectCombo.EVENT_CONFIRM,
                action: function () {
                    self.fireEvent(BI.ValueChooserNoBarCombo.EVENT_CONFIRM);
                }
            }]
        }
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    getAllValue: function() {
        return this.getValue();
    },

    populate: function (items) {
        // 直接用combo的populate不会作用到AbstractValueChooser上
        if (BI.isNotNull(items)) {
            this.items = items;
        }
        this.combo.populate();
    }
});

BI.ValueChooserNoBarCombo.EVENT_BLUR = "EVENT_BLUR";
BI.ValueChooserNoBarCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.ValueChooserNoBarCombo.EVENT_STOP = "EVENT_STOP";
BI.ValueChooserNoBarCombo.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.ValueChooserNoBarCombo.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.ValueChooserNoBarCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.value_chooser_no_bar_combo", BI.ValueChooserNoBarCombo);
