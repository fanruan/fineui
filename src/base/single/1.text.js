/**
 * guy 表示一行数据，通过position来定位位置的数据
 * @class BI.Text
 * @extends BI.Single
 */
!(function () {
    BI.Text = BI.inherit(BI.Single, {

        props: {
            baseCls: "bi-text",
            textAlign: "left",
            whiteSpace: "normal",
            lineHeight: null,
            handler: null, // 如果传入handler,表示处理文字的点击事件，不是区域的
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            py: "",
            highLight: false
        },

        render: function () {
            var self = this, o = this.options;
            if (o.hgap + o.lgap > 0) {
                this.element.css({
                    "padding-left": (o.hgap + o.lgap) / BI.pixRatio + BI.pixUnit
                });
            }
            if (o.hgap + o.rgap > 0) {
                this.element.css({
                    "padding-right": (o.hgap + o.rgap) / BI.pixRatio + BI.pixUnit
                });
            }
            if (o.vgap + o.tgap > 0) {
                this.element.css({
                    "padding-top": (o.vgap + o.tgap) / BI.pixRatio + BI.pixUnit
                });
            }
            if (o.vgap + o.bgap > 0) {
                this.element.css({
                    "padding-bottom": (o.vgap + o.bgap) / BI.pixRatio + BI.pixUnit
                });
            }
            if (BI.isWidthOrHeight(o.height)) {
                this.element.css({lineHeight: BI.isNumber(o.height) ? (o.height / BI.pixRatio + BI.pixUnit) : o.height});
            }
            if (BI.isWidthOrHeight(o.lineHeight)) {
                this.element.css({lineHeight: BI.isNumber(o.lineHeight) ? (o.lineHeight / BI.pixRatio + BI.pixUnit) : o.lineHeight});
            }
            if (BI.isWidthOrHeight(o.maxWidth)) {
                this.element.css({maxWidth: BI.isNumber(o.maxWidth) ? (o.maxWidth / BI.pixRatio + BI.pixUnit) : o.maxWidth});
            }
            this.element.css({
                textAlign: o.textAlign,
                whiteSpace: this._getTextWrap(),
                textOverflow: o.whiteSpace === "nowrap" ? "ellipsis" : "",
                overflow: o.whiteSpace === "nowrap" ? "" : (BI.isWidthOrHeight(o.height) ? "auto" : "")
            });
            if (o.handler && o.handler !== BI.emptyFn) {
                this.text = BI.createWidget({
                    type: "bi.layout",
                    tagName: "span"
                });
                this.text.element.click(function (e) {
                    o.handler.call(self, self.getValue(), self, e);
                });
                BI.createWidget({
                    type: "bi.default",
                    element: this,
                    items: [this.text]
                });
            } else {
                this.text = this;
            }

            var text = BI.isFunction(o.text) ? this.__watch(o.text, function (context, newValue) {
                self.setText(newValue);
            }) : o.text;
            // 只要不是undefined就可以显示text值，否则显示value
            if (!BI.isUndefined(text)) {
                this.setText(text);
            } else if (BI.isKey(o.value)) {
                this.setText(o.value);
            }
            if (BI.isKey(o.keyword)) {
                this.doRedMark(o.keyword);
            }
            if (o.highLight) {
                this.doHighLight();
            }
        },

        _getTextWrap: function () {
            var o = this.options;
            switch (o.whiteSpace) {
                case "nowrap":
                    return "pre";
                case "normal":
                    return "pre-wrap";
                default:
                    return o.whiteSpace;
            }
        },

        _getShowText: function () {
            var o = this.options;
            var text = BI.isFunction(o.text) ? o.text() : o.text;
            return BI.isKey(text) ? BI.Text.formatText(text + "") : text;
        },

        _doRedMark: function (keyword) {
            var o = this.options;
            // render之后做的doRedMark,这个时候虽然标红了，但是之后text mounted执行的时候并没有keyword
            o.keyword = keyword;
            this.text.element.__textKeywordMarked__(this._getShowText(), keyword, o.py);
        },

        doRedMark: function (keyword) {
            if (BI.isKey(keyword)) {
                this._doRedMark(keyword);
            }
        },

        unRedMark: function () {
            var o = this.options;
            o.keyword = "";
            this.text.element.__textKeywordMarked__(this._getShowText(), "", o.py);
        },

        doHighLight: function () {
            this.text.element.addClass("bi-high-light");
        },

        unHighLight: function () {
            this.text.element.removeClass("bi-high-light");
        },

        setValue: function (text) {
            BI.Text.superclass.setValue.apply(this, arguments);
            if (!this.isReadOnly()) {
                this.setText(text);
            }
        },

        setStyle: function (css) {
            this.text.element.css(css);
        },

        setText: function (text) {
            BI.Text.superclass.setText.apply(this, arguments);
            this.options.text = text;
            this._doRedMark(this.options.keyword);
        }
    });
    var formatters = [];
    BI.Text.addTextFormatter = function (formatter) {
        formatters.push(formatter);
    };
    BI.Text.formatText = function (text) {
        if (formatters.length > 0) {
            for (var i = 0, len = formatters.length; i < len; i++) {
                text = formatters[i](text);
            }
        }
        return text;
    };
    BI.shortcut("bi.text", BI.Text);
}());

