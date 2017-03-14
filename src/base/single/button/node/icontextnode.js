/**
 * guy
 * Created by GUY on 2015/9/9.
 * @class BI.IconTextNode
 * @extends BI.NodeButton
 */
BI.IconTextNode = BI.inherit(BI.NodeButton, {
    _const: {
        commonWidth: 25
    },

    _defaultConfig: function () {
        var conf = BI.IconTextNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-text-node",
            logic: {
                dynamic: false
            },
            cls: "close-ha-font",
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        })
    },
    _init: function () {
        BI.IconTextNode.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
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
        })
        this.icon = BI.createWidget({
            type: "bi.center_adapt",
            width: c.commonWidth,
            items: [{
                el: {
                    type: "bi.icon",
                    width: o.iconWidth,
                    height: o.iconHeight
                }
            }]
        })

        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", this.icon, this.text)
        }))));
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

    doClick: function () {
        BI.IconTextNode.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconTextNode.EVENT_CHANGE, this.getValue(), this);
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    }
});
BI.IconTextNode.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.icon_text_node", BI.IconTextNode);