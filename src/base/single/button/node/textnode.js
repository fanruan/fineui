/**
 * guy
 *
 * Created by GUY on 2015/9/9.
 * @class BI.TextNode
 * @extends BI.NodeButton
 */
BI.TextNode = BI.inherit(BI.NodeButton, {

    _defaultConfig: function () {
        var conf = BI.TextNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-node",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        })
    },
    _init: function () {
        BI.TextNode.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this.element,
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textHeight: o.whiteSpace == "nowrap" ? o.height : o.textHeight,
            height: o.height,
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            py: o.py
        });
    },

    doClick: function () {
        BI.TextNode.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TextNode.EVENT_CHANGE, this.getValue(), this);
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
BI.TextNode.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_node", BI.TextNode);