/**
 * guy
 * 两个icon和一行数 组成的一行listitem
 *
 * Created by GUY on 2015/9/9.
 * @class BI.IconTextIconItem
 * @extends BI.BasicButton
 */
BI.IconTextIconItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.IconTextIconItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-text-icon-item",
            logic: {
                dynamic: false
            },
            iconCls1: "",
            iconCls2: "",
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },

    render: function () {
        var self = this, o = this.options;

        return {
            type: "bi.vertical_adapt",
            columnSize: [o.leftIconWrapperWidth || o.height, "fill", o.rightIconWrapperWidth || o.height],
            items: [{
                type: "bi.icon_label",
                cls: o.iconCls1,
                width: o.leftIconWrapperWidth || o.height,
                height: o.height,
                iconWidth: o.iconWidth,
                iconHeight: o.iconHeight
            }, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.text = _ref;
                    },
                    textAlign: "left",
                    hgap: o.textHgap,
                    vgap: o.textVgap,
                    lgap: o.textLgap,
                    rgap: o.textRgap,
                    text: o.text,
                    value: o.value,
                    keyword: o.keyword,
                    height: o.height
                }
            }, {
                type: "bi.icon_label",
                cls: o.iconCls2,
                width: o.rightIconWrapperWidth || o.height,
                height: o.height,
                iconWidth: o.iconWidth,
                iconHeight: o.iconHeight
            }]
        };
    },

    doClick: function () {
        BI.IconTextIconItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconTextIconItem.EVENT_CHANGE, this.getValue(), this);
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    }
});
BI.IconTextIconItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_icon_item", BI.IconTextIconItem);
