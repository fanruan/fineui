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
        var o = this.options, c = this._const;
        var blank = BI.createWidget({
            type: "bi.layout",
            width: o.blankWidth,
            height: o.height
        });
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
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
        this.icon1 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls1,
            forceNotSelected: true,
            width: o.height,
            height: o.height
        });
        this.icon2 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls2,
            forceNotSelected: true,
            width: o.height,
            height: o.height
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", blank, this.icon1, this.icon2, this.text)
        }))));
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
