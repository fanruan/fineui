/**
 * 没有html标签的纯文本
 */
!(function () {
    BI.PureText = BI.inherit(BI.Widget, {

        props: {
            tagName: null
        },

        render: function () {
            var self = this, o = this.options;
            var text = BI.isFunction(o.text) ? this.__watch(o.text, function (context, newValue) {
                self.setText(newValue);
            }) : o.text;
            if (BI.isKey(text)) {
                this.setText(text);
            } else if (BI.isKey(o.value)) {
                this.setText(o.value);
            }
        },

        _getShowText: function () {
            var o = this.options;
            var text = BI.isFunction(o.text) ? o.text() : o.text;
            text = BI.isKey(text) ? text : o.value;
            if (!BI.isKey(text)) {
                return "";
            }
            return BI.Text.formatText(text + "");
        },

        setValue: function (value) {
            this.options.value = value;
            this.setText(value);
        },

        setText: function (text) {
            this.options.text = BI.isNotNull(text) ? text : "";
            this.element.__textKeywordMarked__(this._getShowText());
        }
    });
    BI.shortcut("bi.pure_text", BI.PureText);
}());

