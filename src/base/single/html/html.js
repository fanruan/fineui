/**
 * guy 表示一行数据，通过position来定位位置的数据
 * @class BI.Html
 * @extends BI.Single
 */
BI.Html = BI.inherit(BI.Single, {

    props: {
        baseCls: "bi-html",
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
        highLight: false,
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
        if (BI.isNumber(o.height)) {
            this.element.css({lineHeight: o.height / BI.pixRatio + BI.pixUnit});
        }
        if (BI.isNumber(o.lineHeight)) {
            this.element.css({lineHeight: o.lineHeight / BI.pixRatio + BI.pixUnit});
        }
        if (BI.isWidthOrHeight(o.maxWidth)) {
            this.element.css({maxWidth: o.maxWidth});
        }
        this.element.css({
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textOverflow: o.whiteSpace === 'nowrap' ? "ellipsis" : "",
            overflow: o.whiteSpace === "nowrap" ? "" : "auto"
        });
        if (o.handler) {
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

        if (BI.isKey(o.text)) {
            this.setText(o.text);
        } else if (BI.isKey(o.value)) {
            this.setText(o.value);
        }
        if (o.highLight) {
            this.doHighLight();
        }
    },

    doHighLight: function () {
        this.text.element.addClass("bi-high-light");
    },

    unHighLight: function () {
        this.text.element.removeClass("bi-high-light");
    },

    setValue: function (text) {
        BI.Html.superclass.setValue.apply(this, arguments);
        if (!this.isReadOnly()) {
            this.setText(text);
        }
    },

    setStyle: function (css) {
        this.text.element.css(css);
    },

    setText: function (text) {
        BI.Html.superclass.setText.apply(this, arguments);
        this.options.text = text;
        this.text.element.html(text);
    }
});

BI.shortcut("bi.html", BI.Html);
