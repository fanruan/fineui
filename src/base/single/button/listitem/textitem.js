/**
 * guy
 * 一个button和一行数 组成的一行listitem
 *
 * Created by GUY on 2015/9/9.
 * @class BI.TextItem
 * @extends BI.BasicButton
 */
BI.TextItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.TextItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-item",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        })
    },
    _init: function () {
        BI.TextItem.superclass._init.apply(this, arguments);
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
        BI.TextItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TextItem.EVENT_CHANGE, this.getValue(), this);
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
BI.TextItem.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_item", BI.TextItem);