/**
 * guy 表示一行数据，通过position来定位位置的数据
 * @class BI.Text
 * @extends BI.Single
 */
BI.Text = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Text.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text",
            textAlign: "left",
            whiteSpace: "normal",
            lineHeight: null,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            text: "",
            py: ""
        })
    },

    _init: function () {
        BI.Text.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.layout",
            cls: "bi-text"
        });
        this.text.element.appendTo(this.element);
        if (BI.isKey(o.text)) {
            this.text.element.text(o.text);
        } else if (BI.isKey(o.value)) {
            this.text.element.text(o.value);
        }
        if (o.hgap + o.lgap > 0) {
            this.text.element.css({
                "margin-left": o.hgap + o.lgap + "px"
            })
        }
        if (o.hgap + o.rgap > 0) {
            this.text.element.css({
                "margin-right": o.hgap + o.rgap + "px"
            })
        }
        if (o.vgap + o.tgap > 0) {
            this.text.element.css({
                "margin-top": o.vgap + o.tgap + "px"
            })
        }
        if (o.vgap + o.bgap > 0) {
            this.text.element.css({
                "margin-bottom": o.vgap + o.bgap + "px"
            })
        }
        if (BI.isNumber(o.height)) {
            this.element.css({"lineHeight": o.height + "px"});
        }
        if (BI.isNumber(o.lineHeight)) {
            this.element.css({"lineHeight": o.lineHeight + "px"});
        }
        this.text.element.css({
            "textAlign": o.textAlign,
            "whiteSpace": o.whiteSpace
        });
        this.element.css({
            "textAlign": o.textAlign,
            "whiteSpace": o.whiteSpace
        });
        if (BI.isKey(o.keyword)) {
            this.text.element.__textKeywordMarked__(o.text, o.keyword, o.py);
        }
    },

    doRedMark: function (keyword) {
        var o = this.options;
        this.text.element.__textKeywordMarked__(o.text || o.value, keyword, o.py);
    },

    unRedMark: function () {
        var o = this.options;
        this.text.element.__textKeywordMarked__(o.text || o.value, "", o.py);
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
            this.text.element.text(text);
        }
    },

    setText: function (text) {
        BI.Text.superclass.setText.apply(this, arguments);
        this.options.text = text;
        this.text.element.text(text);
    }
});

$.shortcut("bi.text", BI.Text);