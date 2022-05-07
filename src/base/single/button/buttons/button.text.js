/**
 * guy
 * 可以点击的一行文字
 * @class BI.TextButton
 * @extends BI.BasicButton
 * 文字button
 */
BI.TextButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.TextButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-button",
            textAlign: "center",
            whiteSpace: "nowrap",
            textWidth: null,
            textHeight: null,
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            py: ""
        });
    },

    render: function () {
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textWidth: o.textWidth,
            textHeight: o.textHeight,
            width: o.width,
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
    },

    doClick: function () {
        BI.TextButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TextButton.EVENT_CHANGE, this.getValue(), this);
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

    setText: function (text) {
        BI.TextButton.superclass.setText.apply(this, arguments);
        text = BI.isArray(text) ? text.join(",") : text;
        this.text.setText(text);
    },

    setStyle: function (style) {
        this.text.setStyle(style);
    },

    setValue: function (text) {
        BI.TextButton.superclass.setValue.apply(this, arguments);
        if (!this.isReadOnly()) {
            text = BI.isArray(text) ? text.join(",") : text;
            this.text.setValue(text);
        }
    }
});
BI.TextButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_button", BI.TextButton);
