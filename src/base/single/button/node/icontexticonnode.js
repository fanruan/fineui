/**
 * guy
 * Created by GUY on 2015/9/9.
 * @class BI.IconTextIconNode
 * @extends BI.NodeButton
 */
BI.IconTextIconNode = BI.inherit(BI.NodeButton, {
    _const: {
        commonWidth: 25
    },

    _defaultConfig: function () {
        var conf = BI.IconTextIconNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-text-icon-node",
            logic: {
                dynamic: false
            },
            iconCls1: "close-ha-font",
            iconCls2: "close-ha-font",
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        })
    },
    _init: function () {
        BI.IconTextIconNode.superclass._init.apply(this, arguments);
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
        })

        var icon1 = BI.createWidget({
            type: "bi.center_adapt",
            cls: o.iconCls1,
            width: c.commonWidth,
            items: [{
                el: {
                    type: "bi.icon",
                    width: o.iconWidth,
                    height: o.iconHeight
                }
            }]
        })
        var blank = BI.createWidget({
            type: "bi.layout",
            width: c.commonWidth
        })
        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: {
                    type: "bi.center_adapt",
                    cls: o.iconCls2,
                    width: c.commonWidth,
                    items: [{
                        el: {
                            type: "bi.icon",
                            width: o.iconWidth,
                            height: o.iconHeight
                        }
                    }]
                },
                top: 0,
                bottom: 0,
                right: 0
            }]
        })

        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", icon1, this.text, blank)
        }))));
    },

    doClick: function () {
        BI.IconTextIconNode.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconTextIconNode.EVENT_CHANGE, this.getValue(), this);
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
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
BI.IconTextIconNode.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.icon_text_icon_node", BI.IconTextIconNode);