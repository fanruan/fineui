/**
 * 带有一个占位
 *
 * Created by GUY on 2015/9/11.
 * @class BI.BlankIconIconTextItem
 * @extends BI.BasicButton
 */
BI.BlankIconIconTextItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.BlankIconIconTextItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-blank-icon-text-item",
            logic: {
                dynamic: false
            },
            iconCls1: "",
            iconCls2: "",
            blankWidth: 0,
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
            columnSize: [o.blankWidth, o.leftIconWrapperWidth || o.height, o.rightIconWrapperWidth || o.height, "fill"],
            items: [{
                type: "bi.layout",
                width: o.blankWidth
            }, {
                type: "bi.icon_label",
                cls: o.iconCls1,
                width: o.leftIconWrapperWidth || o.height,
                height: o.height,
                iconWidth: o.iconWidth,
                iconHeight: o.iconHeight
            }, {
                type: "bi.icon_label",
                cls: o.iconCls2,
                width: o.rightIconWrapperWidth || o.height,
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
            }]
        };
    },

    doClick: function () {
        BI.BlankIconIconTextItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.BlankIconIconTextItem.EVENT_CHANGE, this.getValue(), this);
        }
    },

    setSelected: function (b) {
        BI.BlankIconIconTextItem.superclass.setSelected.apply(this, arguments);
        this.icon1.setSelected(b);
        this.icon2.setSelected(b);
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
    }
});
BI.BlankIconIconTextItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.blank_icon_icon_text_item", BI.BlankIconIconTextItem);
