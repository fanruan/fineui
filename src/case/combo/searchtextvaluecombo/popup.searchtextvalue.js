/**
 * Created by Windy on 2018/2/5.
 */
BI.SearchTextValueComboPopup = BI.inherit(BI.Pane, {

    props: {
        baseCls: "bi-search-text-value-popup"
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical",
            vgap: 5,
            items: [{
                type: "bi.button_group",
                ref: function () {
                    self.popup = this;
                },
                items: this._formatItems(o.items),
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
                layouts: [{
                    type: "bi.vertical"
                }],
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                value: o.value,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function (type, val, obj) {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                        if (type === BI.Events.CLICK) {
                            self.fireEvent(BI.SearchTextValueComboPopup.EVENT_CHANGE, val, obj);
                        }
                    }
                }]
            }]
        };
    },

    _formatItems: function (items) {
        var o = this.options;
        return BI.map(items, function (i, item) {
            return BI.extend({
                type: "bi.single_select_item",
                textAlign: o.textAlign,
                title: item.title || item.text
            }, item);
        });
    },

    // mounted之后做check
    mounted: function() {
        this.check();
    },

    populate: function (find, match, keyword) {
        var items = BI.concat(find, match);
        BI.SearchTextValueComboPopup.superclass.populate.apply(this, items);
        this.popup.populate(this._formatItems(items), keyword);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.SearchTextValueComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.search_text_value_combo_popup", BI.SearchTextValueComboPopup);
