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
            attributes: {
                tabIndex: 1
            },
            iconCls: "",
            height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.icon_text_item",
            element: this,
            cls: o.iconCls,
            once: o.once,
            iconWrapperWidth: o.iconWrapperWidth,
            selected: o.selected,
            height: o.height,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            textHgap: o.textHgap,
            textVgap: o.textVgap,
            textLgap: o.textLgap,
            textRgap: o.textRgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
        this.text.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _setEnable: function (enable) {
        BI.SingleSelectIconTextItem.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.element.attr("tabIndex", 1);
        } else if (enable === false) {
            this.element.removeAttr("tabIndex");
        }
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
    }
});

BI.shortcut("bi.single_select_icon_text_item", BI.SingleSelectIconTextItem);
