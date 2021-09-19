/**
 * guy
 * 一个占位符和两个icon和一行数 组成的一行listitem
 *
 * Created by GUY on 2015/9/15.
 * @class BI.BlankIconTextIconItem
 * @extends BI.BasicButton
 */
BI.BlankIconTextIconItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.BlankIconTextIconItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-blank-icon-text-icon-item",
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
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });

        var icon1 = BI.createWidget({
            type: "bi.icon_label",
            cls: o.iconCls1,
            width: o.height,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.icon_label",
                    cls: o.iconCls2,
                    width: o.height,
                    height: o.height,
                    iconWidth: o.iconWidth,
                    iconHeight: o.iconHeight
                },
                top: 0,
                bottom: 0,
                right: 0
            }]
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", {
                type: "bi.layout",
                width: o.blankWidth
            }, icon1, this.text, {
                type: "bi.layout",
                width: o.height
            })
        }))));
    },

    doClick: function () {
        BI.BlankIconTextIconItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.BlankIconTextIconItem.EVENT_CHANGE, this.getValue(), this);
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
BI.BlankIconTextIconItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.blank_icon_text_icon_item", BI.BlankIconTextIconItem);
