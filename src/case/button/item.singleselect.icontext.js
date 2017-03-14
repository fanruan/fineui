/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.SingleSelectIconTextItem
 * @extends BI.BasicButton
 */
BI.SingleSelectIconTextItem = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectIconTextItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-icon-text-item bi-list-item-active",
            iconClass: "",
            hgap: 10,
            height: 25
        })
    },
    _init: function () {
        BI.SingleSelectIconTextItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.icon_text_item",
            element: this.element,
            cls: o.iconClass,
            once: o.once,
            selected: o.selected,
            height: o.height,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
        this.text.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    isSelected: function () {
        return this.text.isSelected();
    },

    setSelected: function (b) {
        this.text.setSelected(b);
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SingleSelectIconTextItem.superclass.doClick.apply(this, arguments);
    }
});

$.shortcut("bi.single_select_icon_text_item", BI.SingleSelectIconTextItem);