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
            text: "",
            py: "",
            highLight: false
        },

        render: function () {
            var self = this, o = this.options;
            if (o.hgap + o.lgap > 0) {
                this.element.css({
                    "padding-left": o.hgap + o.lgap + "px"
                });
            }
            if (o.hgap + o.rgap > 0) {
                this.element.css({
                    "padding-right": o.hgap + o.rgap + "px"
                });
            }
            if (o.vgap + o.tgap > 0) {
                this.element.css({
                    "padding-top": o.vgap + o.tgap + "px"
                });
            }
            if (o.vgap + o.bgap > 0) {
                this.element.css({
                    "padding-bottom": o.vgap + o.bgap + "px"
                });
            }
            if (BI.isNumber(o.height)) {
                this.element.css({lineHeight: o.height + "px"});
            }
            if (BI.isNumber(o.lineHeight)) {
                this.element.css({lineHeight: o.lineHeight + "px"});
            }
            if (BI.isWidthOrHeight(o.maxWidth)) {
                this.element.css({maxWidth: o.maxWidth});
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
                this.text.element.click(function () {
                    o.handler(self.getValue());
                });
                BI.createWidget({
                    type: "bi.default",
                    element: this,
                    items: [this.text]
                });
            } else {
                this.text = this;
            }

            var text = this._getShowText();
            if (BI.isKey(text)) {
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
                default:
                    return "pre-wrap";
            }
        },

        _getShowText: function () {
            var o = this.options;
            return BI.isFunction(o.text) ? o.text() : o.text;
        },


        doRedMark: function (keyword) {
            var o = this.options;
            // render之后做的doredmark,这个时候虽然标红了，但是之后text mounted执行的时候并没有keyword
            o.keyword = keyword;
            this.text.element.__textKeywordMarked__(this._getShowText() || o.value, keyword, o.py);
        },

        unRedMark: function () {
            var o = this.options;
            o.keyword = "";
            this.text.element.__textKeywordMarked__(this._getShowText() || o.value, "", o.py);
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
            //  为textContext赋值为undefined时在ie和edge下会真的显示undefined
            this.options.text = BI.isNotNull(text) ? text : "";
            if (BI.isIE9Below()) {
                this.text.element.html(BI.htmlEncode(BI.Text.formatText(this._getShowText())));
                return;
            }
            //  textContent性能更好,并且原生防xss
            this.text.element[0].textContent = BI.Text.formatText(this._getShowText());
            BI.isKey(this.options.keyword) && this.doRedMark(this.options.keyword);
        }
    });
    var formatters = [];
    BI.Text.addTextFormatter = function (formatter) {
        formatters.push(formatter);
    };
    BI.Text.formatText = function (text) {
        for (var i = 0, len = formatters.length; i < len; i++) {
            text = formatters[i](text);
        }
        return text;
    };
    BI.shortcut("bi.text", BI.Text);
}());

